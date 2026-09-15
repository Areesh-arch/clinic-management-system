from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.permissions import require_roles

from app.models.enums import UserRole
from app.models.user import User

from app.schemas.tenant import (
    TenantCreate,
    TenantResponse,
    TenantUpdate,
)

from app.services.tenant_service import (
    create_new_tenant,
    get_tenant_by_id,
    get_tenants,
    remove_tenant,
    update_existing_tenant,
)

from app.services.profile_image_upload_service import (
    save_clinic_image,
)


router = APIRouter(
    prefix="",
    tags=["Tenants"],
)


# ============================================================
# CREATE TENANT
# SUPER_ADMIN ONLY
# ============================================================

@router.post(
    "/",
    response_model=TenantResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_tenant(
    tenant: TenantCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    return create_new_tenant(
        db=db,
        tenant=tenant,
    )


# ============================================================
# LIST TENANTS
# SUPER_ADMIN ONLY
# ============================================================

@router.get(
    "/",
    response_model=list[TenantResponse],
)
def list_tenants(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    return get_tenants(db)


# ============================================================
# GET SINGLE TENANT
# SUPER_ADMIN ONLY
# ============================================================

@router.get(
    "/{tenant_id}",
    response_model=TenantResponse,
)
def get_tenant(
    tenant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    tenant = get_tenant_by_id(
        db=db,
        tenant_id=tenant_id,
    )

    if tenant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )

    return tenant


# ============================================================
# UPDATE TENANT
# SUPER_ADMIN ONLY
# ============================================================

@router.put(
    "/{tenant_id}",
    response_model=TenantResponse,
)
def update_tenant(
    tenant_id: int,
    tenant: TenantUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    db_tenant = get_tenant_by_id(
        db=db,
        tenant_id=tenant_id,
    )

    if db_tenant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )

    return update_existing_tenant(
        db=db,
        db_tenant=db_tenant,
        tenant=tenant,
    )


# ============================================================
# UPLOAD CLINIC PROFILE IMAGE
# SUPER_ADMIN ONLY
#
# IMPORTANT:
# This updates the SELECTED CLINIC/TENANT image.
# It does NOT update the SUPER_ADMIN personal image.
# ============================================================

@router.post(
    "/{tenant_id}/profile-image",
)
async def upload_tenant_profile_image(
    tenant_id: int,
    image: UploadFile = File(...),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
    db: Session = Depends(get_db),
):
    db_tenant = get_tenant_by_id(
        db=db,
        tenant_id=tenant_id,
    )

    if db_tenant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )

    try:
        image_url = await save_clinic_image(
            upload_file=image,
            tenant_id=tenant_id,
        )

        db_tenant.profile_image_url = image_url

        db.commit()
        db.refresh(db_tenant)

        return {
            "message": "Clinic profile picture updated successfully.",
            "profile_image_url": db_tenant.profile_image_url,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


# ============================================================
# DELETE TENANT
# SUPER_ADMIN ONLY
# ============================================================

@router.delete(
    "/{tenant_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_tenant(
    tenant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    db_tenant = get_tenant_by_id(
        db=db,
        tenant_id=tenant_id,
    )

    if db_tenant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )

    remove_tenant(
        db=db,
        db_tenant=db_tenant,
    )

    return None