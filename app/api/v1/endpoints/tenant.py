from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.permissions import require_roles

from app.models.user import User
from app.models.enums import UserRole

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

router = APIRouter(
    prefix="/tenants",
    tags=["Tenants"],
)


@router.post(
    "/",
    response_model=TenantResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_tenant(
    tenant: TenantCreate,
    db: Session = Depends(get_db),
):
    return create_new_tenant(
        db=db,
        tenant=tenant,
    )


@router.get(
    "/",
    response_model=list[TenantResponse],
)
def list_tenants(
    db: Session = Depends(get_db),
):
    return get_tenants(db)


@router.get(
    "/{tenant_id}",
    response_model=TenantResponse,
)
def get_tenant(
    tenant_id: int,
    db: Session = Depends(get_db),
):
    tenant = get_tenant_by_id(
        db,
        tenant_id,
    )

    if tenant is None:
        raise HTTPException(
            status_code=404,
            detail="Tenant not found",
        )

    return tenant


@router.put(
    "/{tenant_id}",
    response_model=TenantResponse,
)
def update_tenant(
    tenant_id: int,
    tenant: TenantUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    db_tenant = get_tenant_by_id(
        db,
        tenant_id,
    )

    if db_tenant is None:
        raise HTTPException(
            status_code=404,
            detail="Tenant not found",
        )

    # SUPER_ADMIN can manage any tenant.
    # OWNER can only manage their own clinic.
    if (
        current_user.role != UserRole.SUPER_ADMIN
        and db_tenant.id != current_user.tenant_id
    ):
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to update this clinic.",
        )

    return update_existing_tenant(
        db=db,
        db_tenant=db_tenant,
        tenant=tenant,
    )


@router.delete(
    "/{tenant_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_tenant(
    tenant_id: int,
    db: Session = Depends(get_db),
):
    db_tenant = get_tenant_by_id(
        db,
        tenant_id,
    )

    if db_tenant is None:
        raise HTTPException(
            status_code=404,
            detail="Tenant not found",
        )

    remove_tenant(
        db=db,
        db_tenant=db_tenant,
    )