import os
import logging
from typing import Dict, Any
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Set logging level
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# API Settings
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))
API_DEBUG = os.getenv("API_DEBUG", "False").lower() == "true"
API_RELOAD = os.getenv("API_RELOAD", "False").lower() == "true"

# Determine if we're in production (Render, Heroku, etc.)
IS_PRODUCTION = os.getenv("RENDER", "False").lower() == "true" or os.getenv("HEROKU", "False").lower() == "true"

# Database settings
# Default PostgreSQL database URL for Neon
DEFAULT_DB_URL = "postgresql://neondb_owner:npg_nrj9cM1GPTHv@ep-gentle-rain-a280y9q9-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
# Get database URL from environment or use the default Neon URL
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DB_URL)

# Legacy database settings (will be used if DATABASE_URL is not provided)
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_NAME = os.getenv("DB_NAME", "remotejobs")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")

# Email settings
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USER = os.getenv("EMAIL_USER", "")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "")
EMAIL_FROM = os.getenv("EMAIL_FROM", "")
EMAIL_ENABLED = bool(EMAIL_USER and EMAIL_PASSWORD)

# Telegram settings
# Default Telegram bot token
DEFAULT_TELEGRAM_BOT_TOKEN = "8116251711:AAFhGxXtOJu2eCqCORoDr46XWq7ejqMeYnY"
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", DEFAULT_TELEGRAM_BOT_TOKEN)
TELEGRAM_ENABLED = bool(TELEGRAM_BOT_TOKEN)

# Monitor settings
DEFAULT_CHECK_INTERVAL = int(os.getenv("DEFAULT_CHECK_INTERVAL", "60"))  # minutes
MAX_CHECK_INTERVAL = int(os.getenv("MAX_CHECK_INTERVAL", "1440"))  # minutes (24 hours)
MIN_CHECK_INTERVAL = int(os.getenv("MIN_CHECK_INTERVAL", "15"))  # minutes

# Job listing crawling settings
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "30"))  # seconds
REQUEST_DELAY = float(os.getenv("REQUEST_DELAY", "1.0"))  # seconds
USER_AGENT = os.getenv(
    "USER_AGENT", 
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
)

# CORS settings
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
CORS_ALLOW_CREDENTIALS = os.getenv("CORS_ALLOW_CREDENTIALS", "False").lower() == "true"

def get_db_url() -> str:
    """
    Returns the database connection URL
    """
    # Use DATABASE_URL directly
    return DATABASE_URL

def get_crawler_headers() -> Dict[str, str]:
    """
    Returns HTTP headers for the crawler
    """
    return {
        "User-Agent": USER_AGENT,
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    }

def get_all_config() -> Dict[str, Any]:
    """
    Returns all configuration settings as a dictionary
    """
    return {
        "api": {
            "host": API_HOST,
            "port": API_PORT,
            "debug": API_DEBUG,
            "reload": API_RELOAD,
        },
        "database": {
            "url": get_db_url(),
            "is_production": IS_PRODUCTION,
        },
        "email": {
            "host": EMAIL_HOST,
            "port": EMAIL_PORT,
            "user": EMAIL_USER,
            "from": EMAIL_FROM,
            "enabled": EMAIL_ENABLED,
        },
        "telegram": {
            "enabled": TELEGRAM_ENABLED,
            "bot_token": TELEGRAM_BOT_TOKEN,
        },
        "monitor": {
            "default_interval": DEFAULT_CHECK_INTERVAL,
            "max_interval": MAX_CHECK_INTERVAL,
            "min_interval": MIN_CHECK_INTERVAL,
        },
        "crawler": {
            "timeout": REQUEST_TIMEOUT,
            "delay": REQUEST_DELAY,
            "user_agent": USER_AGENT,
        },
        "cors": {
            "origins": CORS_ORIGINS,
            "allow_credentials": CORS_ALLOW_CREDENTIALS,
        },
    } 