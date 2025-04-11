from fastapi import APIRouter, Depends, HTTPException
from typing import Dict
from datetime import datetime
from ..services.notification_service import NotificationService

router = APIRouter()

@router.post("/deployment")
async def send_deployment_notification(
    deployment_info: Dict,
    notification_service: NotificationService = Depends()
):
    """
    Send deployment notification to subscribed users
    
    Args:
        deployment_info (dict): Dictionary containing deployment information
            - environment: str (e.g. 'production', 'staging')
            - status: str (e.g. 'success', 'failed')
            - commit: str (commit hash)
            - message: str (deployment message)
            - timestamp: datetime
    """
    try:
        await notification_service.send_deployment_notification(deployment_info)
        return {"status": "success", "message": "Deployment notification sent successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send deployment notification: {str(e)}"
        )