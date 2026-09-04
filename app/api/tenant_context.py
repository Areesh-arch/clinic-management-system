from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.dependencies import get_current_user

from app.models.enums import UserRole
from app.models.tenant import Tenant
from app.models.user import User


def get_effective_tenant_id(
    x_tenant_id: int | None = Header(
        default=None,
        alias="X-Tenant-ID",
    ),
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
) -> int:
    """
    Resolve the tenant that the current request
    should operate against.

    OWNER / STAFF:
        Always use their own tenant_id.

    SUPER_ADMIN:
        Must explicitly select a tenant using
        the X-Tenant-ID request header.
    """

    # =====================================================
    # SUPER ADMIN
    # =====================================================

    if current_user.role == UserRole.SUPER_ADMIN:

        if x_tenant_id is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Please select a clinic before "
                    "accessing clinic data."
                ),
            )

        tenant = (
            db.query(Tenant)
            .filter(
                Tenant.id == x_tenant_id
            )
            .first()
        )

        if tenant is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Selected clinic not found.",
            )

        return tenant.id


    # =====================================================
    # OWNER / STAFF
    # =====================================================

    if current_user.tenant_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "User is not associated with a clinic."
            ),
        )

    return current_user.tenant_id