from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.permissions import require_roles
from app.api.tenant_context import get_effective_tenant_id
from app.database.session import get_db
from app.models.enums import UserRole
from app.models.user import User

from app.schemas.site_settings import (
    SiteSettingsCreate,
    SiteSettingsResponse,
    SiteSettingsUpdate,
)

from app.services.site_settings_service import (
    create_site_settings_service,
    get_site_settings_service,
    update_site_settings_service,
)

from app.api.v1.endpoints.lead import resolve_public_tenant


router = APIRouter(
    prefix="",
    tags=["Settings / Website"],
)


# ============================================================
# PUBLIC SITE SETTINGS
# ============================================================

@router.get(
    "/public",
    response_model=SiteSettingsResponse,
)
def get_public_site_settings(
    request: Request,
    db: Session = Depends(get_db),
):
    tenant = resolve_public_tenant(
        request=request,
        db=db,
    )

    settings = get_site_settings_service(
        db=db,
        tenant_id=tenant.id,
    )

    if not settings:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site settings not found for this clinic.",
        )

    return settings


# ============================================================
# GET SETTINGS
#
# OWNER / STAFF:
#     Uses their own tenant.
#
# SUPER_ADMIN:
#     Uses X-Tenant-ID selected clinic.
# ============================================================

@router.get(
    "/",
    response_model=SiteSettingsResponse,
)
def get_settings(
    tenant_id: int = Depends(get_effective_tenant_id),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    settings = get_site_settings_service(
        db=db,
        tenant_id=tenant_id,
    )

    if not settings:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site settings not found",
        )

    return settings


# ============================================================
# CREATE SETTINGS
#
# OWNER / STAFF:
#     Uses their own tenant.
#
# SUPER_ADMIN:
#     Uses X-Tenant-ID selected clinic.
# ============================================================

@router.post(
    "/",
    response_model=SiteSettingsResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_settings(
    settings_data: SiteSettingsCreate,
    tenant_id: int = Depends(get_effective_tenant_id),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    existing = get_site_settings_service(
        db=db,
        tenant_id=tenant_id,
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Site settings already exist",
        )

    return create_site_settings_service(
        db=db,
        settings_data=settings_data,
        tenant_id=tenant_id,
    )


# ============================================================
# UPDATE SETTINGS
#
# OWNER / STAFF:
#     Uses their own tenant.
#
# SUPER_ADMIN:
#     Uses X-Tenant-ID selected clinic.
# ============================================================

@router.put(
    "/",
    response_model=SiteSettingsResponse,
)
def update_settings(
    settings_data: SiteSettingsUpdate,
    tenant_id: int = Depends(get_effective_tenant_id),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    settings = get_site_settings_service(
        db=db,
        tenant_id=tenant_id,
    )

    if not settings:
        settings = create_site_settings_service(
            db=db,
            settings_data=SiteSettingsCreate(
                **settings_data.model_dump()
            ),
            tenant_id=tenant_id,
        )

        return settings

    return update_site_settings_service(
        db=db,
        db_settings=settings,
        settings_data=settings_data,
    )