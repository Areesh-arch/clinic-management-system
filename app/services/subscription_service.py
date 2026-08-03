from sqlalchemy.orm import Session

from app.crud.subscription import (
    create_subscription,
    delete_subscription,
    get_all_subscriptions,
    get_subscription,
    update_subscription,
)
from app.models.subscription import Subscription
from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionUpdate,
)


def create_new_subscription(
    db: Session,
    subscription: SubscriptionCreate,
) -> Subscription:
    """
    Business logic for creating a subscription.
    """

    return create_subscription(
        db=db,
        subscription=subscription,
    )


def get_subscription_by_id(
    db: Session,
    subscription_id: int,
) -> Subscription | None:
    """
    Return subscription by ID.
    """

    return get_subscription(
        db=db,
        subscription_id=subscription_id,
    )


def get_subscriptions(
    db: Session,
) -> list[Subscription]:
    """
    Return all subscriptions.
    """

    return get_all_subscriptions(db)


def update_existing_subscription(
    db: Session,
    db_subscription: Subscription,
    subscription: SubscriptionUpdate,
) -> Subscription:
    """
    Update subscription.
    """

    return update_subscription(
        db=db,
        db_subscription=db_subscription,
        subscription=subscription,
    )


def remove_subscription(
    db: Session,
    db_subscription: Subscription,
) -> None:
    """
    Delete subscription.
    """

    delete_subscription(
        db=db,
        db_subscription=db_subscription,
    )