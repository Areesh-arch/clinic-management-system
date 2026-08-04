from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.permissions import require_roles
from app.models.enums import UserRole
from app.models.user import User

from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionUpdate,
    SubscriptionResponse,
)

from app.services.subscription_service import (
    create_subscription_service,
    get_subscription_service,
    list_subscriptions_service,
    update_subscription_service,
    delete_subscription_service,
)

router = APIRouter(
    prefix="/subscriptions",
    tags=["Subscriptions"],
)


@router.post(
    "/",
    response_model=SubscriptionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_subscription(
    subscription: SubscriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    try:
        return create_subscription_service(
            db,
            subscription,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[SubscriptionResponse],
)
def list_subscriptions(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    return list_subscriptions_service(db)


@router.get(
    "/{subscription_id}",
    response_model=SubscriptionResponse,
)
def get_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    subscription = get_subscription_service(
        db,
        subscription_id,
    )

    if subscription is None:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found",
        )

    return subscription


@router.put(
    "/{subscription_id}",
    response_model=SubscriptionResponse,
)
def update_subscription(
    subscription_id: int,
    subscription_data: SubscriptionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    subscription = get_subscription_service(
        db,
        subscription_id,
    )

    if subscription is None:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found",
        )

    return update_subscription_service(
        db,
        subscription,
        subscription_data,
    )


@router.delete(
    "/{subscription_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    subscription = get_subscription_service(
        db,
        subscription_id,
    )

    if subscription is None:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found",
        )

    delete_subscription_service(
        db,
        subscription,
    )