#!/bin/bash

# Load environment variables
set -a
[ -f .env ] && source .env
set +a

# Function to send Telegram notifications
send_telegram_notification() {
  local deployment_type="$1"
  local status="$2"
  local message="$3"
  
  if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
    curl -s -X POST \
      "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
      -d "chat_id=$TELEGRAM_CHAT_ID" \
      -d "text=🤖 *Remote Jobs Deployment*%0A%0A*$deployment_type:* $status%0A%0A$message" \
      -d "parse_mode=Markdown" > /dev/null
    
    echo "Telegram notification sent: $deployment_type - $status"
  else
    echo "Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set"
  fi
}

echo "Starting deployment process $(date +'%Y-%m-%d %H:%M:%S')"
send_telegram_notification "Deployment" "🔄 Started" "Deployment process initiated at $(date +'%Y-%m-%d %H:%M:%S')"

# Get current date for commit message
CURRENT_DATE=$(date "+%Y-%m-%d %H:%M:%S")

# Change to project root directory
cd "$(dirname "$0")/.."

# Send initial notification
send_telegram_notification "Deployment" "🔄 Started" "Deployment process initiated at $(date +'%Y-%m-%d %H:%M:%S')"

# Git operations
echo "Starting GitHub deployment..."
git add .
if git commit -m "Auto-deploy: $CURRENT_DATE"; then
  if git push origin main; then
    echo "GitHub deployment successful"
    send_telegram_notification "GitHub" "✅ Success" "Code pushed successfully to GitHub"
  else
    echo "GitHub deployment failed"
    send_telegram_notification "GitHub" "❌ Failed" "Failed to push code to GitHub"
    exit 1
  fi
else
  echo "No changes to commit"
  send_telegram_notification "GitHub" "⚠️ Skipped" "No changes to commit"
fi

# Netlify deployment (frontend)
if [ -d "frontend/build" ] || [ -d "frontend/src" ]; then
  echo "Starting Netlify deployment..."
  
  # Check if netlify-cli is installed
  if ! command -v netlify &> /dev/null; then
    echo "netlify-cli not found, installing..."
    npm install -g netlify-cli
  fi
  
  # Deploy to Netlify
  cd frontend
  
  # Build if needed
  if [ ! -d "build" ]; then
    echo "Building frontend..."
    npm ci && npm run build
    
    if [ $? -ne 0 ]; then
      echo "Frontend build failed"
      send_telegram_notification "Frontend" "❌ Failed" "Frontend build failed"
      exit 1
    fi
    
    echo "Frontend build successful"
    send_telegram_notification "Frontend" "✅ Built" "Frontend built successfully"
  fi
  
  # Deploy to Netlify
  if netlify deploy --prod --dir=build --site=$NETLIFY_SITE_ID; then
    echo "Netlify deployment successful"
    send_telegram_notification "Netlify" "✅ Success" "Frontend deployed successfully to Netlify"
  else
    echo "Netlify deployment failed"
    send_telegram_notification "Netlify" "❌ Failed" "Frontend deployment failed"
    exit 1
  fi
  
  cd ..
else
  echo "Frontend directory not found, skipping Netlify deployment"
  send_telegram_notification "Netlify" "⚠️ Skipped" "Frontend directory not found"
fi

# Render deployment (backend)
echo "Starting Render deployment..."
# Since Render deploys automatically from GitHub, we just need to trigger a webhook if available
if [ -n "$RENDER_DEPLOY_HOOK_URL" ]; then
  if curl -X POST $RENDER_DEPLOY_HOOK_URL; then
    echo "Render deployment triggered via webhook"
    send_telegram_notification "Render" "✅ Triggered" "Backend deployment triggered via webhook"
  else
    echo "Failed to trigger Render deployment"
    send_telegram_notification "Render" "❌ Failed" "Failed to trigger backend deployment"
    exit 1
  fi
else
  echo "Render deploy hook URL not set, deployment will happen automatically via GitHub integration"
  send_telegram_notification "Render" "ℹ️ Info" "Deployment will happen automatically via GitHub integration"
fi

echo "All deployments completed successfully"
send_telegram_notification "Deployment" "✅ Complete" "All deployments finished successfully at $(date +'%Y-%m-%d %H:%M:%S')" 