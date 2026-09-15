from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.api.permissions import require_roles
from app.core.config import settings
from app.core.security import (
    hash_password,
    verify_password,
)
from app.database.session import get_db
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.auth import (
    CurrentUserResponse,
    RefreshTokenRequest,
    TokenResponse,
    ChangePasswordRequest,
)
from app.services.auth_service import (
    authenticate_user,
    refresh_access_token,
)
from app.services.profile_image_upload_service import (
    save_profile_image,
    delete_profile_image,
)


router = APIRouter()


# =========================================================
# LOGIN
# =========================================================

@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = authenticate_user(
        db=db,
        email=form_data.username,
        password=form_data.password,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    from app.core.security import (
        create_access_token,
        create_refresh_token,
    )

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
# REFRESH TOKEN
# =========================================================

@router.post(
    "/refresh",
    response_model=TokenResponse,
)
def refresh_token(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Refresh token is invalid or expired",
        headers={
            "WWW-Authenticate": "Bearer",
        },
    )

    try:
        payload = jwt.decode(
            request.refresh_token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

        token_type = payload.get("token_type")

        if token_type != "refresh":
            raise credentials_exception

        user_id = payload.get("user_id")

        if user_id is None:
            raise credentials_exception

        try:
            user_id = int(user_id)
        except (TypeError, ValueError):
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    tokens = refresh_access_token(
        db=db,
        user_id=user_id,
    )

    if tokens is None:
        raise credentials_exception

    return {
        "access_token": tokens["access_token"],
        "refresh_token": request.refresh_token,
        "token_type": "bearer",
    }


# =========================================================
# CURRENT USER
# =========================================================

@router.get(
    "/me",
)
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


# =========================================================
# PROFILE IMAGE - UPLOAD / CHANGE
# =========================================================

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
    image_url = await save_profile_image(
        upload_file=image,
        user_id=current_user.id,
    )

    current_user.profile_image_url = image_url

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile image uploaded successfully",
        "profile_image_url": current_user.profile_image_url,
    }


# =========================================================
# PROFILE IMAGE - REMOVE
# =========================================================

@router.delete("/profile-image")
def remove_profile_image(
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.SUPER_ADMIN,
            UserRole.STAFF,
        )
    ),
    db: Session = Depends(get_db),
):
    old_image_url = current_user.profile_image_url

    if not old_image_url:
        return {
            "message": "Profile picture is already removed.",
            "profile_image_url": None,
        }

    # Clear database reference first.
    current_user.profile_image_url = None

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    # Remove physical uploaded file.
    delete_profile_image(
        image_url=old_image_url,
        user_id=current_user.id,
    )

    return {
        "message": "Profile picture removed successfully.",
        "profile_image_url": None,
    }


# =========================================================
# CHANGE PASSWORD
# =========================================================

@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.SUPER_ADMIN,
            UserRole.STAFF,
        )
    ),
    db: Session = Depends(get_db),
):
    current_user.password_hash = hash_password(
        request.new_password
    )

    db.add(current_user)
    db.commit()

    return {
        "message": "Password changed successfully."
    }