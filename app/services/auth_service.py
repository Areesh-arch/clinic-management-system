from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    create_refresh_token,
    verify_password,
)
from app.models.user import User


# =========================================================
# AUTHENTICATE USER
# =========================================================

def authenticate_user(
    db: Session,
    email: str,
    password: str,
):
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        return None

    if not user.is_active:
        return None

    if not verify_password(
        password,
        user.password_hash,
    ):
        return None

    return user


# =========================================================
# LOGIN
# =========================================================

def login_user(
    db: Session,
    email: str,
    password: str,
):
    user = authenticate_user(
        db=db,
        email=email,
        password=password,
    )

    if not user:
        return None

    access_token = create_access_token(
        subject=user.id,
    )

    refresh_token = create_refresh_token(
        subject=user.id,
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


# =========================================================
# REFRESH ACCESS TOKEN
# =========================================================

def refresh_access_token(
    db: Session,
    user_id: int,
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        return None

    if not user.is_active:
        return None

    access_token = create_access_token(
        subject=user.id,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }