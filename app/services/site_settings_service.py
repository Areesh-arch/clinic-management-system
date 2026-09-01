from sqlalchemy.orm import Session

from app.crud.site_settings import (
    create_site_settings,
    get_site_settings,
    update_site_settings,
)
from app.models.site_settings import SiteSettings
from app.schemas.site_settings import (
    SiteSettingsCreate,
    SiteSettingsUpdate,
)


def get_site_settings_service(
    db: Session,
    tenant_id: int,
) -> SiteSettings | None:

    return get_site_settings(
        db=db,
        tenant_id=tenant_id,
    )


def create_site_settings_service(
    db: Session,
    settings_data: SiteSettingsCreate,
    tenant_id: int,
) -> SiteSettings:

    return create_site_settings(
        db=db,
        settings_data=settings_data,
        tenant_id=tenant_id,
    )


def update_site_settings_service(
    db: Session,
    db_settings: SiteSettings,
    settings_data: SiteSettingsUpdate,
) -> SiteSettings:

    return update_site_settings(
        db=db,
        db_settings=db_settings,
        settings_data=settings_data,
    )