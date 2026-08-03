from sqlalchemy.orm import Session

from app.models.tenant import Tenant
from app.schemas.tenant import TenantCreate, TenantUpdate


def create_tenant(
    db: Session,
    tenant: TenantCreate,
) -> Tenant:
    """
    Create a new tenant.
    """

    db_tenant = Tenant(
        business_name=tenant.business_name,
        subdomain=tenant.subdomain,
    )

    db.add(db_tenant)

    # Flush sends the INSERT to PostgreSQL
    # without committing the transaction.
    db.flush()

    # Refresh loads generated values like ID.
    db.refresh(db_tenant)

    return db_tenant


def get_tenant(
    db: Session,
    tenant_id: int,
) -> Tenant | None:
    """
    Get tenant by ID.
    """

    return (
        db.query(Tenant)
        .filter(Tenant.id == tenant_id)
        .first()
    )


def get_all_tenants(
    db: Session,
) -> list[Tenant]:
    """
    Get all tenants.
    """

    return db.query(Tenant).all()


def update_tenant(
    db: Session,
    db_tenant: Tenant,
    tenant: TenantUpdate,
) -> Tenant:
    """
    Update tenant.
    """

    update_data = tenant.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(db_tenant, key, value)

    db.commit()
    db.refresh(db_tenant)

    return db_tenant


def delete_tenant(
    db: Session,
    db_tenant: Tenant,
) -> None:
    """
    Delete tenant.
    """

    db.delete(db_tenant)
    db.commit()