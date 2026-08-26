from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.subscription import Subscription
from app.models.enums import (
    SubscriptionPlan,
    SubscriptionStatus,
)


# ============================================================
# FEATURE REQUIREMENTS
# ============================================================

FEATURE_MINIMUM_PLAN = {

    # BASIC
    "dashboard": SubscriptionPlan.BASIC,
    "patients": SubscriptionPlan.BASIC,
    "appointments": SubscriptionPlan.BASIC,
    "billing": SubscriptionPlan.BASIC,

    # STANDARD
    "staff": SubscriptionPlan.STANDARD,
    "inventory": SubscriptionPlan.STANDARD,

    # PREMIUM
    "crm": SubscriptionPlan.PREMIUM,
    "cms": SubscriptionPlan.PREMIUM,
    "public_website": SubscriptionPlan.PREMIUM,
}


# ============================================================
# PLAN LEVELS
# ============================================================

PLAN_LEVEL = {
    SubscriptionPlan.BASIC: 1,
    SubscriptionPlan.STANDARD: 2,
    SubscriptionPlan.PREMIUM: 3,
}


# ============================================================
# GET TENANT SUBSCRIPTION
# ============================================================

def get_tenant_subscription(
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


# ============================================================
# CHECK SUBSCRIPTION ACTIVE
# ============================================================

def is_subscription_active(
    subscription: Subscription,
) -> bool:

    now = datetime.now(timezone.utc)

    # --------------------------------------------------------
    # Cancelled
    # --------------------------------------------------------

    if subscription.status == SubscriptionStatus.CANCELLED:
        return False

    # --------------------------------------------------------
    # Explicitly expired
    # --------------------------------------------------------

    if subscription.status == SubscriptionStatus.EXPIRED:
        return False

    # --------------------------------------------------------
    # Trial
    # --------------------------------------------------------

    if subscription.status == SubscriptionStatus.TRIAL:

        if subscription.trial_ends_at is None:
            return False

        return subscription.trial_ends_at > now

    # --------------------------------------------------------
    # Active subscription
    # --------------------------------------------------------

    if subscription.status == SubscriptionStatus.ACTIVE:

        if subscription.ends_at is None:
            return True

        return subscription.ends_at > now

    return False


# ============================================================
# CHECK FEATURE ACCESS
# ============================================================

def has_feature(
    db: Session,
    tenant_id: int,
    feature: str,
) -> bool:

    required_plan = FEATURE_MINIMUM_PLAN.get(feature)

    if required_plan is None:
        return False

    subscription = get_tenant_subscription(
        db,
        tenant_id,
    )

    if subscription is None:
        return False

    # Subscription must be active
    if not is_subscription_active(subscription):
        return False

    current_level = PLAN_LEVEL[
        subscription.plan
    ]

    required_level = PLAN_LEVEL[
        required_plan
    ]

    return current_level >= required_level