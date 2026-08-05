from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.permissions import require_roles

from app.models.enums import (
    UserRole,
    SubscriptionPlan,
)
from app.models.user import User

from app.services.subscription_service import (
    change_subscription_plan_service,
)

router = APIRouter(
    prefix="/subscriptions",
    tags=["Subscriptions"],
)


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