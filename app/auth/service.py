from sqlalchemy.orm import Session

from app.core.security import (
    verify_password,
    create_access_token,
)
from app.models.user import User


def authenticate_user(
    db: Session,
    email: str,
    password: str,
):
    """
    Authenticate a user using email and password.
    """

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        return None

    if not verify_password(
        password,
        user.password_hash,
    ):
        return None

    return user


def login_user(
    db: Session,
    email: str,
    password: str,
):
    """
    Authenticate user and generate JWT token.
    """

    user = authenticate_user(
        db,
        email,
        password,
    )

    if not user:
        return None

    access_token = create_access_token(
        subject=user.id,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }