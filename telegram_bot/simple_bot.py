cat > simple_bot.py << 'EOF'
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# Telegram token'ı
TOKEN = "8116251711:AAFhGxXtOJu2eCqCORoDr46XWq7ejqMeYnY"

# Logging ayarları
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    print("Start command received!")
    await update.message.reply_text('Merhaba! Ben test botuyum.')

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    print("Help command received!")
    await update.message.reply_text('Yardım metnini görüntülüyorsunuz.')

async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    print(f"Received message: {update.message.text}")
    await update.message.reply_text(update.message.text)

def main() -> None:
    print("Bot başlatılıyor...")
    application = Application.builder().token(TOKEN).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))

    print("Polling başlatılıyor...")
    application.run_polling()
    print("Bot çalışıyor!")

if __name__ == '__main__':
    main()
EOF