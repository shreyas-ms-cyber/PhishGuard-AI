from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import UserCreate, UserLogin, UserResponse, RefreshRequest
from app.services.auth_service import AuthService
from app.security import set_auth_cookies, clear_auth_cookies, get_token_from_request, decode_token, create_access_token
from app.dependencies import get_current_user
from app.models.user import User
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    user = AuthService.register(db, user_data)
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        created_at=user.created_at.isoformat() if user.created_at else None
    )

@router.post("/login")
def login(response: Response, login_data: UserLogin, db: Session = Depends(get_db)):
    user = AuthService.login(db, login_data)
    tokens = AuthService.generate_tokens(user)
    set_auth_cookies(response, tokens.access_token, tokens.refresh_token)
    return {
        "message": "Login successful",
        "user": UserResponse(
            id=user.id,
            username=user.username,
            email=user.email
        ),
        "access_token": tokens.access_token  # <-- SEND TOKEN IN RESPONSE
    }

@router.post("/refresh")
def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):
    refresh_token = get_token_from_request(request, "refresh")
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token missing")
    payload = decode_token(refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    # Issue new access token
    new_access = create_access_token(data={"sub": str(user.id)})
    # Update the access token cookie (optional, but good for consistency)
    response.set_cookie(
        key="access_token",
        value=new_access,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        domain=settings.COOKIE_DOMAIN,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    # Return the new token in the response body
    return {"message": "Access token refreshed", "access_token": new_access}

@router.post("/logout")
def logout(response: Response, current_user: User = Depends(get_current_user)):
    clear_auth_cookies(response)
    return {"message": "Logged out successfully"}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email
    )
