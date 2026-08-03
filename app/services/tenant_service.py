from datetime import datetime, timedelta

from app.models.enums import (
    SubscriptionPlan,
    SubscriptionStatus,
)
from app.schemas.subscription import SubscriptionCreate
from app.crud.subscription import create_subscription

from sqlalchemy.orm import Session

from app.crud.tenant import (
    create_tenant,
    delete_tenant,
    get_all_tenants,
    get_tenant,
    update_tenant,
)
from app.models.tenant import Tenant
from app.schemas.tenant import (
    TenantCreate,
    TenantUpdate,
)


def create_new_tenant(
    db: Session,
    tenant: TenantCreate,
) -> Tenant:
    """
    Create a tenant and its default trial subscription.
    """

    try:
        # Create tenant (no commit yet)
        db_tenant = create_tenant(
            db=db,
            tenant=tenant,
        )

        now = datetime.utcnow()

        subscription = SubscriptionCreate(
            tenant_id=db_tenant.id,
            plan=SubscriptionPlan.BASIC,
            status=SubscriptionStatus.TRIAL,
            starts_at=now,
            trial_ends_at=now + timedelta(days=14),
            ends_at=None,
        )

        create_subscription(
            db=db,
            subscription=subscription,
        )

        # Commit both together
        db.commit()

        db.refresh(db_tenant)

        return db_tenant

    except Exception:
        db.rollback()
        raise


def get_tenant_by_id(
    db: Session,
    tenant_id: int,
) -> Tenant | None:
    """
    Return tenant by ID.
    """

    return get_tenant(
        db=db,
        tenant_id=tenant_id,
    )


def get_tenants(
    db: Session,
) -> list[Tenant]:
    """
    Return all tenants.
    """

    return get_all_tenants(db)


def update_existing_tenant(
    db: Session,
    db_tenant: Tenant,
    tenant: TenantUpdate,
) -> Tenant:
    """
    Update tenant.
    """

    return update_tenant(
        db=db,
        db_tenant=db_tenant,
        tenant=tenant,
    )


def remove_tenant(
    db: Session,
    db_tenant: Tenant,
) -> None:
    """
    Delete tenant.
    """

    delete_tenant(
        db=db,
        db_tenant=db_tenant,
    )