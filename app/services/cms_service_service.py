from sqlalchemy.orm import Session

from app.crud.cms_service import (
    create_cms_service,
    delete_cms_service,
    get_all_cms_services,
    get_cms_service,
    update_cms_service,
)
from app.models.cms_service import CMSService
from app.schemas.cms_service import (
    CMSServiceCreate,
    CMSServiceUpdate,
)


# =========================================================
# CREATE
# =========================================================

def create_cms_service_service(
    db: Session,
    service_data: CMSServiceCreate,
    tenant_id: int,
) -> CMSService:

    return create_cms_service(
        db=db,
        service_data=service_data,
        tenant_id=tenant_id,
    )


# =========================================================
# GET ONE
# =========================================================

def get_cms_service_service(
    db: Session,
    service_id: int,
    tenant_id: int,
) -> CMSService | None:

    return get_cms_service(
        db=db,
        service_id=service_id,
        tenant_id=tenant_id,
    )


# =========================================================
# GET ALL
# =========================================================

def get_cms_services_service(
    db: Session,
    tenant_id: int,
) -> list[CMSService]:

    return get_all_cms_services(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# UPDATE
# =========================================================

def update_cms_service_service(
    db: Session,
    db_service: CMSService,
    service_data: CMSServiceUpdate,
) -> CMSService:

    return update_cms_service(
        db=db,
        db_service=db_service,
        service_data=service_data,
    )


# =========================================================
# DELETE
# =========================================================

def delete_cms_service_service(
    db: Session,
    db_service: CMSService,
) -> None:

    delete_cms_service(
        db=db,
        db_service=db_service,
    )