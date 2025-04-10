import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
# Telegram token'ı
TOKEN = "8116251711:AAFhGxXtOJu2eCqCORoDr46XWq7ejqMeYnY"

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

class RemoteJobsBot:
    """
    Telegram bot implementation for Remote Jobs Monitor
    """
    
    def __init__(self):
        """Initialize the bot with token"""
        self.token = TELEGRAM_BOT_TOKEN
        self.application = Application.builder().token(self.token).build()
        self.setup_handlers()
        
    def setup_handlers(self):
        """Setup all command and message handlers"""
        # Command handlers
        self.application.add_handler(CommandHandler("start", self.start))
        self.application.add_handler(CommandHandler("help", self.help))
        
        # Default handler for non-command messages
        self.application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self.handle_message))
        
    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        print("Start command received!")
        await update.message.reply_text(
            'Merhaba! Ben Remote Jobs botuyum. Size uzaktan iş fırsatlarını bulmakta yardımcı olacağım.\n\n'
            'Kullanılabilir komutlar:\n'
            '/start - Botu başlat\n'
            '/help - Yardım menüsünü göster'
        )
        
    async def help(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Send help message when command /help is issued."""
        await update.message.reply_text(
            "Here are the commands you can use:\n\n"
            "/start - Start the bot\n"
            "/help - Show this help message"
        )
    
async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        print("Help command received!")
        await update.message.reply_text(
            'Remote Jobs Bot - Yardım Menüsü\n\n'
            'Komutlar:\n'
            '/start - Botu başlat\n'
            '/help - Bu yardım menüsünü göster\n\n'
            'Özellikler:\n'
            '• Uzaktan iş fırsatlarını listele\n'
            '• İş ilanlarını filtrele\n'
            '• Profil oluştur ve güncelle\n'
            '• Otomatik iş başvuruları'
        )

async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle non-command messages."""
        await update.message.reply_text(
            "I'm not sure how to respond to that. Use /help to see available commands."
        )

async def echo(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        print(f"Received message: {update.message.text}")
        await update.message.reply_text(
            'Anladım. Lütfen komutları kullanın:\n'
            '/start - Botu başlat\n'
            '/help - Yardım menüsünü göster'
        )
    
def run(self):
        """Run the bot until the user sends a signal to stop."""
        # Start the Bot
        self.application.run_polling(allowed_updates=Update.ALL_TYPES)
    
async def run_async(self):
        """Run the bot asynchronously."""
        await self.application.initialize()
        await self.application.start()
        await self.application.updater.start_polling()
    
async def stop(self):
        """Stop the bot gracefully."""
        if self.application.updater.running:
            await self.application.updater.stop()
        if self.application.running:
            await self.application.stop()
            await self.application.shutdown()

# Run the bot if this file is executed directly
if __name__ == "__main__":
    bot = RemoteJobsBot()
    bot.run() 