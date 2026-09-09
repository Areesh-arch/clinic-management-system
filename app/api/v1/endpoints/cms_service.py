from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.permissions import require_roles
from app.api.tenant_context import get_effective_tenant_id
from app.database.session import get_db
from app.models.enums import UserRole
from app.models.user import User

from app.schemas.cms_service import (
    CMSServiceCreate,
    CMSServiceResponse,
    CMSServiceUpdate,
)

from app.services.cms_service_service import (
    create_cms_service_service,
    delete_cms_service_service,
    get_cms_service_service,
    get_cms_services_service,
    update_cms_service_service,
)

from app.api.v1.endpoints.lead import resolve_public_tenant


router = APIRouter(
    prefix="",
    tags=["CMS / Services"],
)


# =========================================================
# PUBLIC SERVICES
# =========================================================

@router.get(
    "/public",
    response_model=list[CMSServiceResponse],
)
def public_services(
    request: Request,
    db: Session = Depends(get_db),
):
    tenant = resolve_public_tenant(
        request=request,
        db=db,
    )

    return get_cms_services_service(
        db=db,
        tenant_id=tenant.id,
    )


# =========================================================
# CREATE SERVICE
# =========================================================

@router.post(
    "/",
    response_model=CMSServiceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_service(
    service_data: CMSServiceCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_effective_tenant_id),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    return create_cms_service_service(
        db=db,
        service_data=service_data,
        tenant_id=tenant_id,
    )


# =========================================================
# LIST SERVICES
# =========================================================

@router.get(
    "/",
    response_model=list[CMSServiceResponse],
)
def list_services(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_effective_tenant_id),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    return get_cms_services_service(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# GET ONE SERVICE
# =========================================================

@router.get(
    "/{service_id}",
    response_model=CMSServiceResponse,
)
def get_service(
    service_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_effective_tenant_id),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    service = get_cms_service_service(
        db=db,
        service_id=service_id,
        tenant_id=tenant_id,
    )

    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CMS service not found",
        )

    return service


# =========================================================
# UPDATE SERVICE
# =========================================================

@router.put(
    "/{service_id}",
    response_model=CMSServiceResponse,
)
def update_service(
    service_id: int,
    service_data: CMSServiceUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_effective_tenant_id),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    service = get_cms_service_service(
        db=db,
        service_id=service_id,
        tenant_id=tenant_id,
    )

    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CMS service not found",
        )

    return update_cms_service_service(
        db=db,
        db_service=service,
        service_data=service_data,
    )


# =========================================================
# DELETE SERVICE
# =========================================================

@router.delete(
    "/{service_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_effective_tenant_id),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    service = get_cms_service_service(
        db=db,
        service_id=service_id,
        tenant_id=tenant_id,
    )

    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CMS service not found",
        )

    delete_cms_service_service(
        db=db,
        db_service=service,
    )

    return None