#!/bin/bash

# Load environment variables
set -a
[ -f .env ] && source .env
set +a

# Function to send notification to Telegram
send_telegram_notification() {
    platform=$1
    status=$2
    details=$3
    
    if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ -z "$TELEGRAM_CHAT_ID" ]; then
        echo "Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set"
        return
    fi
    
    echo "Sending Telegram notification: $platform - $status"
    curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
        -d "chat_id=$TELEGRAM_CHAT_ID" \
        -d "parse_mode=HTML" \
        -d "text=🚀 <b>Deployment Update</b>%0A%0APlatform: $platform%0AStatus: $status%0ADetails: $details" \
        > /dev/null
}

echo "Starting deployment process $(date +'%Y-%m-%d %H:%M:%S')"
send_telegram_notification "Deployment" "🔄 Started" "Deployment process initiated at $(date +'%Y-%m-%d %H:%M:%S')"

# GitHub Deployment
echo "==== Deploying to GitHub ===="
git add .
git commit -m "Auto-deploy: $(date +'%Y-%m-%d %H:%M:%S')" || { 
    echo "No changes to commit"; 
    send_telegram_notification "GitHub" "⚠️ Skipped" "No changes to commit"; 
}

if git push origin main; then
    echo "GitHub deployment successful"
    send_telegram_notification "GitHub" "✅ Success" "Code pushed successfully to GitHub"
else
    echo "GitHub deployment failed"
    send_telegram_notification "GitHub" "❌ Failed" "Failed to push code to GitHub"
    exit 1
fi

# Frontend Build
echo "==== Building Frontend ===="
cd frontend
if npm ci && REACT_APP_API_URL=$REACT_APP_API_URL npm run build; then
    echo "Frontend build successful"
    send_telegram_notification "Frontend" "✅ Built" "Frontend built successfully"
else
    echo "Frontend build failed"
    send_telegram_notification "Frontend" "❌ Failed" "Frontend build failed"
    exit 1
fi

# Netlify Deployment
echo "==== Deploying to Netlify ===="
if [ -z "$NETLIFY_AUTH_TOKEN" ] || [ -z "$NETLIFY_SITE_ID" ]; then
    echo "Netlify deployment skipped: NETLIFY_AUTH_TOKEN or NETLIFY_SITE_ID not set"
    send_telegram_notification "Netlify" "⚠️ Skipped" "Environment variables not set"
else
    if npx netlify-cli deploy --prod --auth $NETLIFY_AUTH_TOKEN --site $NETLIFY_SITE_ID --dir build; then
        echo "Netlify deployment successful"
        send_telegram_notification "Netlify" "✅ Success" "Frontend deployed successfully to Netlify"
    else
        echo "Netlify deployment failed"
        send_telegram_notification "Netlify" "❌ Failed" "Frontend deployment failed"
        exit 1
    fi
fi

cd ..

# Render Deployment
echo "==== Deploying to Render ===="
if [ -z "$RENDER_API_KEY" ] || [ -z "$RENDER_SERVICE_ID" ]; then
    if [ ! -z "$RENDER_DEPLOY_HOOK" ]; then
        echo "Using Render deploy hook"
        if curl -X POST "$RENDER_DEPLOY_HOOK"; then
            echo "Render deployment triggered via hook"
            send_telegram_notification "Render" "✅ Triggered" "Backend deployment triggered via webhook"
        else
            echo "Render deployment failed"
            send_telegram_notification "Render" "❌ Failed" "Failed to trigger backend deployment"
            exit 1
        fi
    else
        echo "Render deployment skipped: RENDER_API_KEY, RENDER_SERVICE_ID, or RENDER_DEPLOY_HOOK not set"
        send_telegram_notification "Render" "⚠️ Skipped" "Environment variables not set"
    fi
else
    if curl -X POST "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys" \
         -H "Authorization: Bearer $RENDER_API_KEY" \
         -H "Content-Type: application/json"; then
        echo "Render deployment triggered via API"
        send_telegram_notification "Render" "✅ Triggered" "Backend deployment triggered via API"
    else
        echo "Render deployment failed"
        send_telegram_notification "Render" "❌ Failed" "Failed to trigger backend deployment"
        exit 1
    fi
fi

echo "Deployment process completed! $(date +'%Y-%m-%d %H:%M:%S')"
send_telegram_notification "Deployment" "✅ Complete" "All deployments finished successfully at $(date +'%Y-%m-%d %H:%M:%S')" 