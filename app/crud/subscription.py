from sqlalchemy.orm import Session

from app.models.subscription import Subscription
from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionUpdate,
)


def create_subscription(
    db: Session,
    subscription_data: SubscriptionCreate,
) -> Subscription:
    subscription = Subscription(
        **subscription_data.model_dump()
    )

    db.add(subscription)
    db.commit()
    db.refresh(subscription)

    return subscription


def get_subscription_by_id(
    db: Session,
    subscription_id: int,
) -> Subscription | None:
    return (
        db.query(Subscription)
        .filter(Subscription.id == subscription_id)
        .first()
    )


def get_subscriptions(
    db: Session,
) -> list[Subscription]:
    return db.query(Subscription).all()


def get_subscription_by_tenant(
    db: Session,
    tenant_id: int,
) -> Subscription | None:
    return (
        db.query(Subscription)
        .filter(
            Subscription.tenant_id == tenant_id
        )
        .first()
    )


def update_subscription(
    db: Session,
    subscription: Subscription,
    subscription_data: SubscriptionUpdate,
) -> Subscription:

    update_data = subscription_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(subscription, key, value)

    db.commit()
    db.refresh(subscription)

    return subscription


def delete_subscription(
    db: Session,
    subscription: Subscription,
) -> None:

    db.delete(subscription)
    db.commit()