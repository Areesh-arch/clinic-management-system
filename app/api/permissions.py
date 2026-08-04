from fastapi import Depends, HTTPException, status

from app.api.dependencies import get_current_user
from app.models.enums import UserRole
from app.models.user import User


def require_roles(*allowed_roles: UserRole):
    """
    Allow access only to the specified roles.
    """

    def role_checker(
        current_user: User = Depends(get_current_user),
    ) -> User:

        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action.",
            )

        return current_user

    return role_checker