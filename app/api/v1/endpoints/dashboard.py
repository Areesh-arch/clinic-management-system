from fastapi import APIRouter, Depends

from app.database.session import get_db
from app.api.feature_permissions import require_feature
from app.api.tenant_context import get_effective_tenant_id
from app.services.dashboard_services import get_dashboard_data


router = APIRouter(
    tags=["Dashboard"],
)


@router.get(
    "/",
    response_model=dict,
)
def dashboard(
    db=Depends(get_db),
    current_user=Depends(
        require_feature("dashboard")
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    """
    Return dashboard data for the effective tenant.

    OWNER / STAFF:
        Uses their own clinic tenant.

    SUPER_ADMIN:
        Uses the clinic selected through
        the X-Tenant-ID request header.
    """

    return get_dashboard_data(
        db=db,
        tenant_id=tenant_id,
    )