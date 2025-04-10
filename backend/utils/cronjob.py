import requests
import os
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

def wake_up_render():
    """
    Sends a request to the Render URL to prevent the service from sleeping.
    This function should be called by a cron job every 10 minutes.
    """
    try:
        render_url = os.getenv('RENDER_URL')
        if not render_url:
            logger.error("RENDER_URL environment variable is not set")
            return
            
        response = requests.get(render_url)
        if response.status_code == 200:
            logger.info(f"Successfully woke up Render instance at {datetime.now()}")
        else:
            logger.error(f"Failed to wake up Render instance. Status code: {response.status_code}")
            
    except Exception as e:
        logger.error(f"Error waking up Render instance: {str(e)}") 