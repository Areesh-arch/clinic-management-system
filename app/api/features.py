from fastapi import Depends, HTTPException, status

from app.api.dependencies import get_current_user
from app.core.features import PLAN_FEATURES
from app.models.feature import Feature
from app.models.user import User


def require_feature(feature: Feature):
    def checker(
        current_user: User = Depends(get_current_user),
    ):
        # ---------------------------------------------------------
        # SUPER ADMIN
        # ---------------------------------------------------------
        # Super Admin is a platform-level user and does not belong
        # to a clinic tenant. Therefore, subscription/plan checks
        # do not apply to Super Admin.
        if current_user.role.value.lower() == "super_admin":
            return current_user

        # ---------------------------------------------------------
        # CLINIC USERS
        # ---------------------------------------------------------
        # Owners/Staff must belong to a tenant so that their
        # subscription can be checked.
        if current_user.tenant is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is not associated with a clinic.",
            )

        subscriptions = current_user.tenant.subscriptions

        if not subscriptions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No active subscription.",
            )

        # Get the tenant's current subscription
        subscription = subscriptions[0]

        allowed_features = PLAN_FEATURES.get(
            subscription.plan,
            set(),
        )

        if feature not in allowed_features:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This feature is not available in your subscription plan.",
            )

        return current_user

    return checker