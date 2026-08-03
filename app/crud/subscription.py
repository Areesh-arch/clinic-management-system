from sqlalchemy.orm import Session

from app.models.subscription import Subscription
from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionUpdate,
)


def create_subscription(
    db: Session,
    subscription: SubscriptionCreate,
) -> Subscription:
    """
    Create a new subscription.
    """

    db_subscription = Subscription(
        tenant_id=subscription.tenant_id,
        plan=subscription.plan,
        status=subscription.status,
        starts_at=subscription.starts_at,
        ends_at=subscription.ends_at,
        trial_ends_at=subscription.trial_ends_at,
    )

    db.add(db_subscription)

    db.flush()
    db.refresh(db_subscription)

    return db_subscription


def get_subscription(
    db: Session,
    subscription_id: int,
) -> Subscription | None:
    """
    Get subscription by ID.
    """

    return (
        db.query(Subscription)
        .filter(Subscription.id == subscription_id)
        .first()
    )


def get_all_subscriptions(
    db: Session,
) -> list[Subscription]:
    """
    Get all subscriptions.
    """

    return db.query(Subscription).all()


def update_subscription(
    db: Session,
    db_subscription: Subscription,
    subscription: SubscriptionUpdate,
) -> Subscription:
    """
    Update subscription.
    """

    update_data = subscription.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(db_subscription, key, value)

    db.commit()
    db.refresh(db_subscription)

    return db_subscription


def delete_subscription(
    db: Session,
    db_subscription: Subscription,
) -> None:
    """
    Delete subscription.
    """

    db.delete(db_subscription)
    db.commit()