from sqlalchemy.orm import Session

from app.models.site_settings import SiteSettings
from app.schemas.site_settings import (
    SiteSettingsCreate,
    SiteSettingsUpdate,
)


def get_site_settings(
    db: Session,
    tenant_id: int,
) -> SiteSettings | None:

    return (
        db.query(SiteSettings)
        .filter(
            SiteSettings.tenant_id == tenant_id,
        )
        .first()
    )


def create_site_settings(
    db: Session,
    settings_data: SiteSettingsCreate,
    tenant_id: int,
) -> SiteSettings:

    db_settings = SiteSettings(
        tenant_id=tenant_id,
        **settings_data.model_dump(),
    )

    db.add(db_settings)
    db.commit()
    db.refresh(db_settings)

    return db_settings


def update_site_settings(
    db: Session,
    db_settings: SiteSettings,
    settings_data: SiteSettingsUpdate,
) -> SiteSettings:

    update_data = settings_data.model_dump(
        exclude_unset=True,
    )

    for field, value in update_data.items():
        setattr(db_settings, field, value)

    db.commit()
    db.refresh(db_settings)

    return db_settings