from sqlalchemy.orm import Session
from src.models.booking_model import Booking, BookingSchema, BookingUpdateSchema
import httpx
from typing import Dict, Any

class BookingService:
    def __init__(self, db_session):
        self.db_session = db_session
        self.notification_service_url = "http://notification-service:8004/api/v1"
    
    async def create_booking(self, booking_data: Dict[str, Any]) -> Dict[str, Any]:
        """Crea una nuova prenotazione e notifica gli interessati"""
        # Salva la prenotazione nel database
        booking = self._save_booking_to_db(booking_data)
        
        # Invia notifica utilizzando il servizio di notifica
        try:
            await self._send_booking_notifications(booking)
        except Exception as e:
            # Log dell'errore ma non blocca la creazione
            print(f"Error sending notification: {str(e)}")
        
        return booking
    
    def _save_booking_to_db(self, booking_data):
        # Implementazione salvataggio nel database
        # ...
        return {"id": 123, **booking_data}
    
    async def _send_booking_notifications(self, booking):
        """Invia notifiche tramite il servizio di notifica"""
        async with httpx.AsyncClient() as client:
            # Notifica al cliente
            await client.post(
                f"{self.notification_service_url}/notifications",
                json={
                    "recipient_id": booking["client_id"],
                    "type": "booking_confirmation",
                    "title": "Prenotazione confermata",
                    "message": f"La tua prenotazione per il {booking['date']} è stata confermata."
                }
            )

# Funzione per creare una nuova prenotazione
def create_booking(booking: BookingSchema, db: Session):
    new_booking = Booking(**booking.dict())
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking.id

# Funzione per ottenere una prenotazione esistente
def get_booking(booking_id: int, db: Session):
    return db.query(Booking).filter(Booking.id == booking_id).first()

# Funzione per ottenere le prenotazioni di un utente
def get_user_bookings(user_id: int, db: Session):
    return db.query(Booking).filter((Booking.client_id == user_id) | (Booking.professional_id == user_id)).all()

# Funzione per aggiornare una prenotazione esistente
def update_booking(booking_id: int, booking_update: BookingUpdateSchema, db: Session):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking:
        for key, value in booking_update.dict().items():
            setattr(booking, key, value)
        db.commit()
        db.refresh(booking)
        return True
    return False

# Funzione per eliminare una prenotazione esistente
def delete_booking(booking_id: int, db: Session):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking:
        db.delete(booking)
        db.commit()
        return True
    return False