#!/usr/bin/env python
import logging
import sys
import os

# Get the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))
# Get the parent directory (project root)
parent_dir = os.path.dirname(current_dir)
# Add parent directory to Python path
sys.path.insert(0, parent_dir)

# Import the RemoteJobsBot class from the bot module
from bot import RemoteJobsBot

# Configure logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
     # Logging ayarları
    logging.basicConfig(
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        level=logging.INFO
    )
    
    # Bot'u başlat
    bot = RemoteJobsBot()
    bot.run()
    
    try:
        # Run the bot
        bot.run()
    except KeyboardInterrupt:
        logger.info("Bot stopping due to keyboard interrupt")
    except Exception as e:
        logger.error(f"Error running bot: {str(e)}")
        raise
    finally:
        logger.info("Bot stopped") 