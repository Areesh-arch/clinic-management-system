from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.permissions import require_roles
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


router = APIRouter(
    prefix="",
    tags=["Settings / Website"],
)


@router.get(
    "/",
    response_model=SiteSettingsResponse,
)
def get_settings(
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
        tenant_id=current_user.tenant_id,
    )

    if not settings:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site settings not found",
        )

    return settings


@router.post(
    "/",
    response_model=SiteSettingsResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_settings(
    settings_data: SiteSettingsCreate,
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
        tenant_id=current_user.tenant_id,
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Site settings already exist",
        )

    return create_site_settings_service(
        db=db,
        settings_data=settings_data,
        tenant_id=current_user.tenant_id,
    )


@router.put(
    "/",
    response_model=SiteSettingsResponse,
)
def update_settings(
    settings_data: SiteSettingsUpdate,
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
        tenant_id=current_user.tenant_id,
    )

    if not settings:
        settings = create_site_settings_service(
            db=db,
            settings_data=SiteSettingsCreate(
                **settings_data.model_dump()
            ),
            tenant_id=current_user.tenant_id,
        )

        return settings

    return update_site_settings_service(
        db=db,
        db_settings=settings,
        settings_data=settings_data,
    )