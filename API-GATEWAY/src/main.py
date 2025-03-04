from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.gateway_routes import router as api_router

app = FastAPI(
    title="HealthMatch API Gateway",
    description="API Gateway per HealthMatch",
    version="1.0.0"
)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In produzione, limita alle origini specifiche
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registra il router principale
app.include_router(api_router, prefix="/api/v1")

@app.get("/status")
async def status():
    return {"status": "API Gateway is running"}