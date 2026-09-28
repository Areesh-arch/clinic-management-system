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


def require_patient(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Allow access only to authenticated patient portal users.

    The patient must have:
    - PATIENT role
    - a linked patient_id
    """

    if current_user.role != UserRole.PATIENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Patient portal access is restricted to patient accounts.",
        )

    if current_user.patient_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Patient account is not linked to a patient profile.",
        )

    return current_user