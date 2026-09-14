from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.api.permissions import require_roles
from app.api.tenant_context import (
    get_effective_tenant_id,
)

from app.models.enums import UserRole
from app.models.user import User

from app.schemas.medicine_log import (
    MedicineLogResponse,
)

from app.services.medicine_log_service import (
    get_medicine_log_service,
)


router = APIRouter(
    prefix="/medicine-log",
    tags=["Medicine Log"],
)


# =========================================================
# MEDICINE LOG
# OWNER + STAFF + SUPER_ADMIN
# =========================================================

@router.get(
    "/",
    response_model=list[MedicineLogResponse],
)
def get_medicine_log(
    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),

    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    return get_medicine_log_service(
        db=db,
        tenant_id=tenant_id,
    )