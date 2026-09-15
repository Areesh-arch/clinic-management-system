from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.api.permissions import require_roles
from app.api.tenant_context import get_effective_tenant_id

from app.crud.subscription import (
    create_subscription,
    delete_subscription,
    get_subscription_by_id,
    get_subscription_by_tenant,
    get_subscriptions,
    update_subscription,
    update_subscription_plan,
)

from app.crud.subscription_plan_config import (
    get_plan_config,
    get_plan_configs,
    update_plan_config,
)

from app.models.enums import (
    SubscriptionPlan,
    UserRole,
)

from app.models.subscription import Subscription

from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionResponse,
    SubscriptionUpdate,
)

from app.schemas.subscription_plan_config import (
    SubscriptionPlanConfigResponse,
    SubscriptionPlanConfigUpdate,
)

from app.models.user import User


router = APIRouter(
    
)


# ============================================================
# GET ALL CLINIC SUBSCRIPTIONS
# SUPER_ADMIN ONLY
# ============================================================

@router.get(
    "/",
    response_model=list[SubscriptionResponse],
)
def get_all_subscriptions_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    return get_subscriptions(db)


# ============================================================
# GET CURRENT CLINIC SUBSCRIPTION
# OWNER / STAFF / SUPER_ADMIN
# ============================================================

@router.get(
    "/me",
    response_model=SubscriptionResponse,
)
def get_my_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    tenant_id = get_effective_tenant_id(
        current_user=current_user,
    )

    if not tenant_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Please select a clinic before "
                "accessing subscription data."
            ),
        )

    subscription = get_subscription_by_tenant(
        db,
        tenant_id,
    )

    if subscription is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "Subscription not found for this clinic."
            ),
        )

    return subscription


# ============================================================
# GET ALL PLAN CONFIGURATIONS
# SUPER_ADMIN ONLY
#
# Used by the Subscription Management page to display:
# - plan name
# - price
# - currency
# - billing interval
# - description
# - features
# - active/inactive state
# ============================================================

@router.get(
    "/plans",
    response_model=list[SubscriptionPlanConfigResponse],
)
def get_subscription_plan_configs(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    return get_plan_configs(db)


# ============================================================
# GET ONE PLAN CONFIGURATION
# SUPER_ADMIN ONLY
# ============================================================

@router.get(
    "/plans/{plan}",
    response_model=SubscriptionPlanConfigResponse,
)
def get_subscription_plan_config(
    plan: SubscriptionPlan,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    config = get_plan_config(
        db,
        plan,
    )

    if config is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription plan configuration not found.",
        )

    return config


# ============================================================
# UPDATE PLAN CONFIGURATION
# SUPER_ADMIN ONLY
#
# This controls the global pricing/configuration of a plan.
# ============================================================

@router.put(
    "/plans/{plan}",
    response_model=SubscriptionPlanConfigResponse,
)
def update_subscription_plan_config(
    plan: SubscriptionPlan,
    config_data: SubscriptionPlanConfigUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    config = get_plan_config(
        db,
        plan,
    )

    if config is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription plan configuration not found.",
        )

    return update_plan_config(
        db,
        config,
        config_data,
    )


# ============================================================
# GET SUBSCRIPTION BY ID
# SUPER_ADMIN ONLY
# ============================================================

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
    subscription = get_subscription_by_id(
        db,
        subscription_id,
    )

    if subscription is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found.",
        )

    return subscription


# ============================================================
# CREATE SUBSCRIPTION
# SUPER_ADMIN ONLY
# ============================================================

@router.post(
    "/",
    response_model=SubscriptionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_subscription(
    subscription_data: SubscriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    existing_subscription = get_subscription_by_tenant(
        db,
        subscription_data.tenant_id,
    )

    if existing_subscription is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "A subscription already exists "
                "for this clinic."
            ),
        )

    return create_subscription(
        db,
        subscription_data,
    )


# ============================================================
# UPDATE SUBSCRIPTION
# SUPER_ADMIN ONLY
# ============================================================

@router.put(
    "/{subscription_id}",
    response_model=SubscriptionResponse,
)
def update_existing_subscription(
    subscription_id: int,
    subscription_data: SubscriptionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    subscription = get_subscription_by_id(
        db,
        subscription_id,
    )

    if subscription is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found.",
        )

    return update_subscription(
        db,
        subscription,
        subscription_data,
    )


# ============================================================
# CHANGE CLINIC PLAN
# SUPER_ADMIN ONLY
#
# Example:
# PUT /subscriptions/upgrade/14?plan=STANDARD
# ============================================================

@router.put(
    "/upgrade/{tenant_id}",
    response_model=SubscriptionResponse,
)
def change_plan(
    tenant_id: int,
    plan: SubscriptionPlan,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    subscription = get_subscription_by_tenant(
        db,
        tenant_id,
    )

    if subscription is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "Subscription not found for this clinic."
            ),
        )

    updated_subscription = update_subscription_plan(
        db,
        tenant_id,
        plan,
    )

    if updated_subscription is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "Subscription could not be updated."
            ),
        )

    return updated_subscription


# ============================================================
# DELETE SUBSCRIPTION
# SUPER_ADMIN ONLY
# ============================================================

@router.delete(
    "/{subscription_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    subscription = get_subscription_by_id(
        db,
        subscription_id,
    )

    if subscription is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found.",
        )

    delete_subscription(
        db,
        subscription,
    )

    return None