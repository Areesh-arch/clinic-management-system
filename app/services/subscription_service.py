from sqlalchemy.orm import Session

from app.crud.subscription import (
    create_subscription,
    delete_subscription,
    get_subscription_by_id,
    get_subscriptions,
    get_subscription_by_tenant,
    update_subscription,
    update_subscription_plan,
)

from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionUpdate,
)


def create_subscription_service(
    db: Session,
    subscription_data: SubscriptionCreate,
):
    existing = get_subscription_by_tenant(
        db,
        subscription_data.tenant_id,
    )

    if existing:
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
):
    return get_subscription_by_id(
        db,
        subscription_id,
    )


def list_subscriptions_service(
    db: Session,
):
    return get_subscriptions(db)


def update_subscription_service(
    db: Session,
    subscription,
    subscription_data: SubscriptionUpdate,
):
    return update_subscription(
        db,
        subscription,
        subscription_data,
    )


def delete_subscription_service(
    db: Session,
    subscription,
):
    delete_subscription(
        db,
        subscription,
    )


def change_subscription_plan_service(
    db: Session,
    tenant_id: int,
    new_plan,
):
    subscription = update_subscription_plan(
        db=db,
        tenant_id=tenant_id,
        plan=new_plan,
    )

    if subscription is None:
        raise ValueError(
            "Subscription not found."
        )

    return subscription