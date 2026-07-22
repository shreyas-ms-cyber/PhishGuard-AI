from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.security import hash_password, verify_password, create_access_token, create_refresh_token
from app.schemas.auth import UserCreate, UserLogin, TokenResponse

class AuthService:
    @staticmethod
    def register(db: Session, user_data: UserCreate) -> User:
        # Check if username or email already exists
        existing_user = db.query(User).filter(
            (User.username == user_data.username) | (User.email == user_data.email)
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already registered"
            )
        hashed = hash_password(user_data.password)
        new_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    @staticmethod
    def login(db: Session, login_data: UserLogin) -> User:
        user = db.query(User).filter(User.email == login_data.email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        if not verify_password(login_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        return user

    @staticmethod
    def generate_tokens(user: User) -> TokenResponse:
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        return TokenResponse(access_token=access_token, refresh_token=refresh_token)
