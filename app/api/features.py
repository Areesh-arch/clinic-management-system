from fastapi import Depends, HTTPException, status

from app.api.dependencies import get_current_user
from app.core.features import PLAN_FEATURES
from app.models.feature import Feature
from app.models.user import User


def require_feature(feature: Feature):
    def checker(
        current_user: User = Depends(get_current_user),
    ):
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