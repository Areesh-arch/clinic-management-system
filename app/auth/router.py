from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.service import login_user
from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    CurrentUserResponse,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    """
    Authenticate user and return JWT access token.
    """

    token = login_user(
        db=db,
        email=request.email,
        password=request.password,
    )

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return token


@router.get(
    "/me",
    response_model=CurrentUserResponse,
)
def get_me(
    current_user=Depends(get_current_user),
):
    """
    Return the currently authenticated user.
    """

    return {
        "id": current_user.id,
        "tenant_id": current_user.tenant_id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role.value
        if hasattr(current_user.role, "value")
        else str(current_user.role),
        "is_active": current_user.is_active,
    }