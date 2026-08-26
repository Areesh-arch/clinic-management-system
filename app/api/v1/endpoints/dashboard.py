from fastapi import APIRouter, Depends

from app.database.session import get_db
from app.api.feature_permissions import require_feature
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
    db=Depends(get_db),
    current_user=Depends(
        require_feature("dashboard")
    ),
):
    """
    Return dashboard data for the current tenant.
    """

    return get_dashboard_data(
        db=db,
        tenant_id=current_user.tenant_id,
    )