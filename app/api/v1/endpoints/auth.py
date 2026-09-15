from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.permissions import require_roles
from app.database.session import get_db
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.auth import Token, ChangePasswordRequest
from app.services.auth_service import authenticate_user
from app.services.profile_image_upload_service import (
    save_profile_image,
)
from app.core.security import hash_password, verify_password


router = APIRouter()


# ============================================================
# LOGIN
# ============================================================

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


# ============================================================
# CURRENT USER
# OWNER + SUPER_ADMIN + STAFF
# ============================================================

@router.get("/me")
def me(
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.SUPER_ADMIN,
            UserRole.STAFF,
        )
    ),
):
    return {
        "id": current_user.id,
        "name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role.value,
        "tenant_id": current_user.tenant_id,
        "profile_image_url": current_user.profile_image_url,
    }


# ============================================================
# PERSONAL PROFILE IMAGE
# OWNER + SUPER_ADMIN + STAFF
#
# This is the USER profile image.
# It is separate from the clinic/tenant profile image.
# ============================================================

@router.post("/profile-image")
async def upload_profile_image(
    image: UploadFile = File(...),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.SUPER_ADMIN,
            UserRole.STAFF,
        )
    ),
    db: Session = Depends(get_db),
):
    try:
        image_url = await save_profile_image(
            upload_file=image,
            user_id=current_user.id,
        )

        current_user.profile_image_url = image_url

        db.commit()
        db.refresh(current_user)

        return {
            "message": "Profile picture updated successfully.",
            "profile_image_url": current_user.profile_image_url,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


# ============================================================
# OWNER TEST
# OWNER + SUPER_ADMIN
# ============================================================

@router.get("/owner-test")
def owner_test(
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    return {
        "message": "Access Granted!",
        "user": current_user.full_name,
        "role": current_user.role.value,
    }


# ============================================================
# CHANGE PASSWORD
# ALL AUTHENTICATED ROLES
# ============================================================

@router.post("/change-password")
def change_password(
    password_data: ChangePasswordRequest,
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.SUPER_ADMIN,
            UserRole.STAFF,
        )
    ),
    db: Session = Depends(get_db),
):
    # 1. Verify current password
    if not verify_password(
        password_data.current_password,
        current_user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect.",
        )

    # 2. Prevent same password
    if (
        password_data.current_password
        == password_data.new_password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from the current password.",
        )

    # 3. Hash new password
    current_user.password_hash = hash_password(
        password_data.new_password,
    )

    # 4. Save to database
    db.commit()

    return {
        "message": "Password changed successfully."
    }