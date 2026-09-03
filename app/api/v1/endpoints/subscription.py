from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.api.feature_permissions import (
    FEATURE_PLANS,
    PLAN_LEVEL,
    require_feature,
)
from app.api.dependencies import get_current_user
from app.api.permissions import require_roles
from app.database.session import get_db

from app.models.enums import (
    UserRole,
    SubscriptionPlan,
)
from app.models.user import User
from app.models.subscription import Subscription

from app.crud.subscription import (
    get_subscription_by_tenant,
)

from app.services.subscription_service import (
    change_subscription_plan_service,
)


router = APIRouter(
    prefix="",
    tags=["Subscriptions"],
)


# ============================================================
# SUPER ADMIN - GET ALL SUBSCRIPTIONS
# ============================================================

@router.get("/")
def get_all_subscriptions(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    """
    Return all clinic subscriptions for Super Admin.

    Super Admin users are not attached to a tenant, so this
    endpoint intentionally returns subscriptions across all
    tenants.
    """

    subscriptions = (
        db.query(Subscription)
        .options(joinedload(Subscription.tenant))
        .order_by(Subscription.id.desc())
        .all()
    )

    return [
        {
            "id": subscription.id,
            "tenant_id": subscription.tenant_id,
            "clinic_name": (
                subscription.tenant.business_name
                if subscription.tenant
                else f"Clinic #{subscription.tenant_id}"
            ),
            "plan": subscription.plan.value,
            "status": subscription.status.value,
            "starts_at": subscription.starts_at,
            "ends_at": subscription.ends_at,
            "trial_ends_at": subscription.trial_ends_at,
        }
        for subscription in subscriptions
    ]


# ============================================================
# CURRENT USER - GET MY SUBSCRIPTION
# ============================================================

@router.get("/me")
def get_my_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return the subscription belonging to the current user's tenant.
    """

    if current_user.tenant_id is None:
        raise HTTPException(
            status_code=403,
            detail="User is not associated with a tenant.",
        )

    subscription = get_subscription_by_tenant(
        db,
        current_user.tenant_id,
    )

    if subscription is None:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found.",
        )

    current_level = PLAN_LEVEL[subscription.plan]

    features = {
        feature: current_level >= PLAN_LEVEL[required_plan]
        for feature, required_plan in FEATURE_PLANS.items()
    }

    return {
        "id": subscription.id,
        "tenant_id": subscription.tenant_id,
        "plan": subscription.plan.value,
        "status": subscription.status.value,
        "starts_at": subscription.starts_at,
        "ends_at": subscription.ends_at,
        "trial_ends_at": subscription.trial_ends_at,
        "features": features,
    }


# ============================================================
# FEATURE CHECK
# ============================================================

@router.get("/check/{feature}")
def check_feature(
    feature: str,
    current_user: User = Depends(
        require_feature("dashboard")
    ),
):
    """
    Check whether the subscription system is reachable
    for the current user.
    """

    return {
        "feature": feature,
        "message": "Subscription system is reachable.",
    }


# ============================================================
# SUPER ADMIN - CHANGE SUBSCRIPTION PLAN
# ============================================================

@router.put("/upgrade/{tenant_id}")
def upgrade_subscription(
    tenant_id: int,
    plan: SubscriptionPlan,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    """
    Change the subscription plan for a clinic.

    Only Super Admin can perform this operation.
    """

    try:
        subscription = change_subscription_plan_service(
            db=db,
            tenant_id=tenant_id,
            new_plan=plan,
        )

        return {
            "id": subscription.id,
            "tenant_id": subscription.tenant_id,
            "plan": subscription.plan.value,
            "status": subscription.status.value,
            "starts_at": subscription.starts_at,
            "ends_at": subscription.ends_at,
            "trial_ends_at": subscription.trial_ends_at,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )