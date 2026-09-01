from sqlalchemy.orm import Session

from app.models.cms_service import CMSService
from app.schemas.cms_service import (
    CMSServiceCreate,
    CMSServiceUpdate,
)


# =========================================================
# CREATE
# =========================================================

def create_cms_service(
    db: Session,
    service_data: CMSServiceCreate,
    tenant_id: int,
) -> CMSService:

    db_service = CMSService(
        tenant_id=tenant_id,
        name=service_data.name,
        slug=service_data.slug,
        short_description=service_data.short_description,
        description=service_data.description,
        image_url=service_data.image_url,
        display_order=service_data.display_order,
        is_active=service_data.is_active,
    )

    db.add(db_service)
    db.commit()
    db.refresh(db_service)

    return db_service


# =========================================================
# GET ONE
# =========================================================

def get_cms_service(
    db: Session,
    service_id: int,
    tenant_id: int,
) -> CMSService | None:

    return (
        db.query(CMSService)
        .filter(
            CMSService.id == service_id,
            CMSService.tenant_id == tenant_id,
        )
        .first()
    )


# =========================================================
# GET ALL
# =========================================================

def get_all_cms_services(
    db: Session,
    tenant_id: int,
) -> list[CMSService]:

    return (
        db.query(CMSService)
        .filter(
            CMSService.tenant_id == tenant_id,
        )
        .order_by(
            CMSService.display_order.asc(),
            CMSService.id.asc(),
        )
        .all()
    )


# =========================================================
# UPDATE
# =========================================================

def update_cms_service(
    db: Session,
    db_service: CMSService,
    service_data: CMSServiceUpdate,
) -> CMSService:

    update_data = service_data.model_dump(
        exclude_unset=True,
    )

    for field, value in update_data.items():
        setattr(
            db_service,
            field,
            value,
        )

    db.commit()
    db.refresh(db_service)

    return db_service


# =========================================================
# DELETE
# =========================================================

def delete_cms_service(
    db: Session,
    db_service: CMSService,
) -> None:

    db.delete(db_service)
    db.commit()