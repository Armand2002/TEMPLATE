from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter()

# Definizione degli URL base per i microservizi
AUTH_SERVICE_URL = "http://auth-service:8001"
USERS_SERVICE_URL = "http://users-service:8006"
BOOKING_SERVICE_URL = "http://booking-service:8002"
CATALOG_SERVICE_URL = "http://catalog-service:8003"
PAYMENT_SERVICE_URL = "http://payment-service:8005"
NOTIFICATION_SERVICE_URL = "http://notification-service:8004"

# Include i router specifici per ciascun servizio
from .auth_routes import router as auth_router
from .booking_routes import router as booking_router
from .catalog_routes import router as catalog_router
from .payment_routes import router as payment_router
from .notification_routes import router as notification_router
from .user_routes import router as user_router

# Registrazione dei router
router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
router.include_router(user_router, prefix="/users", tags=["Users"])
router.include_router(booking_router, prefix="/bookings", tags=["Bookings"])
router.include_router(catalog_router, prefix="/catalog", tags=["Catalog"])
router.include_router(payment_router, prefix="/payments", tags=["Payments"])
router.include_router(notification_router, prefix="/notifications", tags=["Notifications"])

# Endpoint di health check per tutti i servizi
@router.get("/health")
async def health_check():
    health_status = {}
    
    async with httpx.AsyncClient() as client:
        # Controlla lo stato di ogni servizio
        for service_name, url in {
            "auth": AUTH_SERVICE_URL,
            "users": USERS_SERVICE_URL,
            "booking": BOOKING_SERVICE_URL, 
            "catalog": CATALOG_SERVICE_URL,
            "payment": PAYMENT_SERVICE_URL,
            "notification": NOTIFICATION_SERVICE_URL
        }.items():
            try:
                response = await client.get(f"{url}/status")
                health_status[service_name] = "online" if response.status_code == 200 else "degraded"
            except:
                health_status[service_name] = "offline"
    
    return health_status
