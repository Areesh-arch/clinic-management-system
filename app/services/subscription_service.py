from sqlalchemy.orm import Session

from app.crud.subscription import (
    create_subscription,
    delete_subscription,
    get_subscription_by_id,
    get_subscription_by_tenant,
    get_subscriptions,
    update_subscription,
)

from app.models.subscription import Subscription
from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionUpdate,
)


def create_subscription_service(
    db: Session,
    subscription_data: SubscriptionCreate,
) -> Subscription:
    """
    Create a subscription for a tenant.

    Prevents creating multiple subscriptions
    for the same tenant.
    """

    existing_subscription = get_subscription_by_tenant(
        db,
        subscription_data.tenant_id,
    )

    if existing_subscription:
        raise ValueError(
            "Tenant already has a subscription."
        )

    return create_subscription(
        db,
        subscription_data,
    )


def get_subscription_service(
    db: Session,
    subscription_id: int,
) -> Subscription | None:
    return get_subscription_by_id(
        db,
        subscription_id,
    )


def list_subscriptions_service(
    db: Session,
) -> list[Subscription]:
    return get_subscriptions(db)


def update_subscription_service(
    db: Session,
    subscription: Subscription,
    subscription_data: SubscriptionUpdate,
) -> Subscription:

    return update_subscription(
        db,
        subscription,
        subscription_data,
    )


def delete_subscription_service(
    db: Session,
    subscription: Subscription,
) -> None:

    delete_subscription(
        db,
        subscription,
    )