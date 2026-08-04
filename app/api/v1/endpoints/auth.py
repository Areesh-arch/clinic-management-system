from app.api.permissions import require_roles
from app.models.enums import UserRole

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import Token
from app.services.auth_service import authenticate_user

router = APIRouter()


@router.post(
    "/login",
    response_model=Token,
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    token = authenticate_user(
        db=db,
        email=form_data.username,
        password=form_data.password,
    )

    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return {
        "access_token": token,
        "token_type": "bearer",
    }


@router.get("/me")
def me(
    current_user: User = Depends(
        require_roles(UserRole.OWNER),
    ),
):
    return {
        "id": current_user.id,
        "name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role.value,
        "tenant_id": current_user.tenant_id,
    }
    
@router.get("/owner-test")
def owner_test(
    current_user: User = Depends(require_roles(UserRole.OWNER)),
):
    return {
        "message": "Welcome Owner!",
        "user": current_user.full_name,
        "role": current_user.role.value,
    }