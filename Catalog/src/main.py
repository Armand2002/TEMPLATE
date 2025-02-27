from fastapi import FastAPI
app = FastAPI()

# Definizione di endpoint specifici per il servizio
@app.get("/status")
def status():
    return {"status": "ok"}
