#!/bin/bash

# Load environment variables
source .env

# Function to send Telegram notification
send_telegram_notification() {
    local message="$1"
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d "chat_id=${TELEGRAM_CHAT_ID}" \
        -d "text=${message}" \
        -d "parse_mode=HTML" > /dev/null
}

# Function to handle deployment errors
handle_error() {
    local service="$1"
    local error="$2"
    local message="❌ ${service} deployment failed: ${error}"
    echo "$message"
    send_telegram_notification "$message"
    exit 1
}

# GitHub deployment
echo "🚀 Starting GitHub deployment..."
git add .
git commit -m "Auto-deploy: $(date '+%Y-%m-%d %H:%M:%S')"
if ! git push origin main; then
    handle_error "GitHub" "Failed to push to repository"
fi

# Netlify deployment
echo "🌐 Starting Netlify deployment..."
if ! netlify deploy --prod; then
    handle_error "Netlify" "Failed to deploy to Netlify"
fi

# Render deployment
echo "⚡ Starting Render deployment..."
if ! curl -X POST "https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys" \
    -H "Authorization: Bearer ${RENDER_API_KEY}"; then
    handle_error "Render" "Failed to trigger Render deployment"
fi

# Success notification
success_message="✅ All deployments completed successfully!"
echo "$success_message"
send_telegram_notification "$success_message" 