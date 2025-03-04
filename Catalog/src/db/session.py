from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Configurazione del database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./catalog.db")

# Creazione del motore di connessione al database
engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# Creazione della sessione del database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base per la dichiarazione delle tabelle
Base = declarative_base()

# Funzione per ottenere una sessione del database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()