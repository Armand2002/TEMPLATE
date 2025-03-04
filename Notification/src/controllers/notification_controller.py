from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..models.notification_model import Notification, SessionLocal
import datetime

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/notifications", response_model=Dict[str, Any])
async def create_notification(notification_data: Dict[str, Any], db: Session = Depends(get_db)):
    """Crea una nuova notifica."""
    notification = Notification(
        recipient_id=notification_data["recipient_id"],
        title=notification_data["title"],
        message=notification_data["message"],
        type=notification_data["type"]
    )
    
    db.add(notification)
    db.commit()
    db.refresh(notification)
    
    return {
        "id": notification.id,
        "status": "success",
        "message": "Notification created successfully"
    }

@router.get("/notifications/user/{user_id}", response_model=List[Dict[str, Any]])
async def get_user_notifications(user_id: int, db: Session = Depends(get_db)):
    """Ottiene tutte le notifiche di un utente."""
    notifications = db.query(Notification).filter(
        Notification.recipient_id == user_id
    ).order_by(Notification.created_at.desc()).all()
    
    return [
        {
            "id": notification.id,
            "title": notification.title,
            "message": notification.message,
            "type": notification.type,
            "created_at": notification.created_at,
            "read": notification.read
        }
        for notification in notifications
    ]

@router.patch("/notifications/{notification_id}/read", response_model=Dict[str, Any])
async def mark_as_read(notification_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    """Segna una notifica come letta."""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.recipient_id == data["user_id"]
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.read = True
    db.commit()
    
    return {"status": "success", "message": "Notification marked as read"}