from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from ..controllers.auth_controller import login_user, register_user, verify_token_validity, refresh_access_token

router = APIRouter()

@router.post("/login")
async def login(user_data: Dict[str, Any]):
    """Effettua il login di un utente."""
    result = login_user(user_data.get("email"), user_data.get("password"))
    if "error" in result:
        raise HTTPException(status_code=401, detail=result["error"])
    return result

@router.post("/register")
async def register(user_data: Dict[str, Any]):
    """Registra un nuovo utente."""
    result = register_user(
        name=user_data.get("name"), 
        email=user_data.get("email"), 
        password=user_data.get("password"), 
        role=user_data.get("role", "patient")
    )
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.post("/verify")
async def verify_token(token_data: Dict[str, Any]):
    """Verifica un token JWT."""
    result = verify_token_validity(token_data.get("token"))
    if result["status"] == "invalid":
        raise HTTPException(status_code=401, detail=result["message"])
    return result

@router.post("/refresh")
async def refresh_token(token_data: Dict[str, Any]):
    """Rinnova un token JWT."""
    result = refresh_access_token(token_data.get("token"))
    if "error" in result:
        raise HTTPException(status_code=401, detail=result["error"])
    return result