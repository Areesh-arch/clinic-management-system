from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.feature_permissions import (
    FEATURE_PLANS,
    PLAN_LEVEL,
    require_feature,
)

from app.database.session import get_db
from app.api.dependencies import get_current_user
from app.api.permissions import require_roles

from app.models.enums import (
    UserRole,
    SubscriptionPlan,
)

from app.models.user import User

from app.crud.subscription import (
    get_subscription_by_tenant,
)

from app.services.subscription_service import (
    change_subscription_plan_service,
)


router = APIRouter(
    prefix="/subscriptions",
    tags=["Subscriptions"],
)


# =========================================================
# CURRENT TENANT SUBSCRIPTION
# =========================================================

@router.get("/me")
def get_my_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):

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

    current_level = PLAN_LEVEL[
        subscription.plan
    ]

    features = {
        feature: current_level >= PLAN_LEVEL[required_plan]
        for feature, required_plan
        in FEATURE_PLANS.items()
    }

    return {
        "plan": subscription.plan.value,
        "status": subscription.status.value,
        "starts_at": subscription.starts_at,
        "ends_at": subscription.ends_at,
        "trial_ends_at": subscription.trial_ends_at,
        "features": features,
    }


# =========================================================
# FEATURE CHECK
# =========================================================

@router.get("/check/{feature}")
def check_feature(
    feature: str,
    current_user: User = Depends(
        require_feature("dashboard")
    ),
):

    return {
        "feature": feature,
        "message": "Subscription system is reachable.",
    }


# =========================================================
# SUPER ADMIN PLAN CHANGE
# =========================================================

@router.put("/upgrade/{tenant_id}")
def upgrade_subscription(
    tenant_id: int,
    plan: SubscriptionPlan,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):

    try:

        return change_subscription_plan_service(
            db=db,
            tenant_id=tenant_id,
            new_plan=plan,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )