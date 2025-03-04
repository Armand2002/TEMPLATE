from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import datetime
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional

# Carica variabili d'ambiente
load_dotenv()

# Configurazione database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./notifications.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    recipient_id = Column(Integer, nullable=False, index=True)
    sender_id = Column(Integer, nullable=True)  # Può essere null per notifiche di sistema
    title = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), nullable=False)  # booking_confirmation, reminder, system, etc.
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    read = Column(Boolean, default=False)
    read_at = Column(DateTime, nullable=True)
    metadata = Column(Text, nullable=True)  # JSON serializzato per dati aggiuntivi
    
# Schemi Pydantic per la validazione e la documentazione API
class NotificationBase(BaseModel):
    recipient_id: int
    title: str
    message: str
    type: str
    sender_id: Optional[int] = None
    metadata: Optional[str] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationResponse(NotificationBase):
    id: int
    created_at: datetime.datetime
    read: bool
    read_at: Optional[datetime.datetime] = None
    
    class Config:
        orm_mode = True

# Crea le tabelle nel database
Base.metadata.create_all(bind=engine)