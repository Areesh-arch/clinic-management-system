from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.dependencies import get_current_user
from app.services.dashboard_services import get_dashboard_data


router = APIRouter(
    prefix="",
    tags=["Dashboard"],
)


@router.get(
    "",
    response_model=dict,
)
@router.get(
    "/",
    response_model=dict,
    include_in_schema=False,
)
def dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Return dashboard data for the current tenant.
    """

    return get_dashboard_data(
        db=db,
        tenant_id=current_user.tenant_id,
    )