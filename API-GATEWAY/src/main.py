from fastapi import FastAPI
from src.routes.gateway_routes import router as gateway_router

app = FastAPI()

# Inclusione del router per le rotte del gateway
app.include_router(gateway_router)
# Definizione di endpoint specifici per il servizio
@app.get("/status")
def status():
    return {"status": "ok"}
