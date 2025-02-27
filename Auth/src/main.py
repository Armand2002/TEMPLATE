from fastapi import FastAPI
from src.routes.auth_routes import router as auth_router
from src.db.session import Base, engine
app = FastAPI()

# Inclusione del router per le rotte di autenticazione
app.include_router(auth_router)

# Creazione delle tabelle del database
Base.metadata.create_all(bind=engine)

# Definizione di endpoint specifici per il servizio
@app.get("/status")
def status():
    return {"status": "Authentication service is running"}
