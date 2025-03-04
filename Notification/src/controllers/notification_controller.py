from fastapi import APIRouter, HTTPException, Depends, Path, Query, Body
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from ..models.notification_model import Notification, NotificationCreate, NotificationResponse
from ..db.session import get_db
from ..services.notification_service import (
    create_notification, 
    get_user_notifications, 
    mark_notification_as_read,
    get_notification_by_id,
    delete_notification,
    get_unread_count
)
import datetime

router = APIRouter()

@router.post("/", response_model=Dict[str, Any])
async def create_notification_endpoint(notification_data: NotificationCreate, db: Session = Depends(get_db)):
    """Crea una nuova notifica."""
    result = create_notification(db, notification_data)
    return {
        "status": "success",
        "message": "Notification created successfully",
        "data": result
    }

@router.get("/user/{user_id}", response_model=List[NotificationResponse])
async def get_user_notifications_endpoint(
    user_id: int = Path(..., description="ID dell'utente"),
    skip: int = Query(0, description="Numero di record da saltare"),
    limit: int = Query(100, description="Numero massimo di record da restituire"),
    unread_only: bool = Query(False, description="Filtra solo notifiche non lette"),
    db: Session = Depends(get_db)
):
    """Ottiene tutte le notifiche di un utente."""
    notifications = get_user_notifications(db, user_id, skip, limit, unread_only)
    return notifications

@router.get("/user/{user_id}/count", response_model=Dict[str, int])
async def get_unread_count_endpoint(
    user_id: int = Path(..., description="ID dell'utente"),
    db: Session = Depends(get_db)
):
    """Ottiene il conteggio delle notifiche non lette di un utente."""
    count = get_unread_count(db, user_id)
    return {"unread_count": count}

@router.get("/{notification_id}", response_model=NotificationResponse)
async def get_notification_endpoint(
    notification_id: int = Path(..., description="ID della notifica"),
    db: Session = Depends(get_db)
):
    """Ottiene una notifica specifica per ID."""
    notification = get_notification_by_id(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification

@router.patch("/{notification_id}/read", response_model=Dict[str, Any])
async def mark_as_read_endpoint(
    notification_id: int = Path(..., description="ID della notifica"),
    data: Dict[str, Any] = Body(..., description="Dati per aggiornare lo stato di lettura"),
    db: Session = Depends(get_db)
):
    """Segna una notifica come letta."""
    if "user_id" not in data:
        raise HTTPException(status_code=400, detail="user_id is required")
    
    result = mark_notification_as_read(db, notification_id, data["user_id"])
    if not result:
        raise HTTPException(status_code=404, detail="Notification not found or not authorized")
    
    return {
        "status": "success", 
        "message": "Notification marked as read", 
        "read_at": datetime.datetime.utcnow().isoformat()
    }

@router.delete("/{notification_id}", response_model=Dict[str, Any])
async def delete_notification_endpoint(
    notification_id: int = Path(..., description="ID della notifica"),
    user_id: int = Query(..., description="ID dell'utente"),
    db: Session = Depends(get_db)
):
    """Elimina una notifica."""
    result = delete_notification(db, notification_id, user_id)
    if not result:
        raise HTTPException(status_code=404, detail="Notification not found or not authorized")
    
    return {"status": "success", "message": "Notification deleted successfully"}