from datetime import datetime, timezone

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.database.session import get_db

from app.models.user import User
from app.models.enums import (
    SubscriptionPlan,
    SubscriptionStatus,
    TenantStatus,
)

from app.crud.subscription import get_subscription_by_tenant


# =========================================================
# FEATURE -> REQUIRED PLAN
# =========================================================

FEATURE_PLANS = {
    # BASIC
    "dashboard": SubscriptionPlan.BASIC,
    "patients": SubscriptionPlan.BASIC,
    "appointments": SubscriptionPlan.BASIC,
    "billing": SubscriptionPlan.BASIC,

    # STANDARD
    "inventory": SubscriptionPlan.STANDARD,
    "staff": SubscriptionPlan.STANDARD,

    # PREMIUM
    "crm": SubscriptionPlan.PREMIUM,
    "cms": SubscriptionPlan.PREMIUM,
    "public_website": SubscriptionPlan.PREMIUM,
}


# =========================================================
# PLAN LEVEL
# =========================================================

PLAN_LEVEL = {
    SubscriptionPlan.BASIC: 1,
    SubscriptionPlan.STANDARD: 2,
    SubscriptionPlan.PREMIUM: 3,
}


# =========================================================
# FEATURE PERMISSION
# =========================================================

def require_feature(feature: str):

    def feature_checker(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
    ) -> User:

        # -------------------------------------------------
        # SUPER ADMIN
        # -------------------------------------------------

        if current_user.role.value == "super_admin":
            return current_user

        # -------------------------------------------------
        # FEATURE EXISTS
        # -------------------------------------------------

        required_plan = FEATURE_PLANS.get(feature)

        if required_plan is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Unknown feature: {feature}",
            )

        # -------------------------------------------------
        # TENANT
        # -------------------------------------------------

        if current_user.tenant_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is not associated with a tenant.",
            )

        tenant = current_user.tenant

        if tenant is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Tenant not found.",
            )

        # -------------------------------------------------
        # TENANT STATUS
        # -------------------------------------------------

        if tenant.status != TenantStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Tenant is not active.",
            )

        # -------------------------------------------------
        # SUBSCRIPTION
        # -------------------------------------------------

        subscription = get_subscription_by_tenant(
            db,
            current_user.tenant_id,
        )

        if subscription is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No subscription found.",
            )

        # -------------------------------------------------
        # SUBSCRIPTION STATUS
        # -------------------------------------------------

        if subscription.status not in (
            SubscriptionStatus.TRIAL,
            SubscriptionStatus.ACTIVE,
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Subscription is not active.",
            )

        # -------------------------------------------------
        # CURRENT TIME
        # -------------------------------------------------

        now = datetime.now(timezone.utc)

        # -------------------------------------------------
        # TRIAL EXPIRATION
        # -------------------------------------------------

        if subscription.status == SubscriptionStatus.TRIAL:

            trial_ends_at = subscription.trial_ends_at

            if trial_ends_at.tzinfo is None:
                trial_ends_at = trial_ends_at.replace(
                    tzinfo=timezone.utc
                )

            if now >= trial_ends_at:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Trial subscription has expired.",
                )

        # -------------------------------------------------
        # ACTIVE SUBSCRIPTION EXPIRATION
        # -------------------------------------------------

        if (
            subscription.status == SubscriptionStatus.ACTIVE
            and subscription.ends_at is not None
        ):

            ends_at = subscription.ends_at

            if ends_at.tzinfo is None:
                ends_at = ends_at.replace(
                    tzinfo=timezone.utc
                )

            if now >= ends_at:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Subscription has expired.",
                )

        # -------------------------------------------------
        # PLAN CHECK
        # -------------------------------------------------

        current_level = PLAN_LEVEL[
            subscription.plan
        ]

        required_level = PLAN_LEVEL[
            required_plan
        ]

        if current_level < required_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"The '{feature}' feature requires "
                    f"{required_plan.value} plan."
                ),
            )

        return current_user

    return feature_checker