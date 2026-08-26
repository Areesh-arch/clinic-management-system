from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.api.permissions import require_roles
from app.database.session import get_db

from app.models.enums import UserRole
from app.models.user import User

from app.schemas.outstanding import OutstandingResponse

from app.services.outstanding_service import (
    get_outstanding_service,
    get_outstanding_by_visit_service,
    list_outstanding_service,
    list_all_outstanding_service,
)


router = APIRouter(
    prefix="/outstanding",
    tags=["Outstanding"],
)


# =========================================================
# LIST OUTSTANDING
# =========================================================

@router.get(
    "/",
    response_model=list[OutstandingResponse],
)
def list_outstanding(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.OWNER)
    ),
):
    return list_outstanding_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


# =========================================================
# LIST ALL OUTSTANDING
# =========================================================

@router.get(
    "/all",
    response_model=list[OutstandingResponse],
)
def list_all_outstanding(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.OWNER)
    ),
):
    return list_all_outstanding_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


# =========================================================
# GET OUTSTANDING BY ID
# =========================================================

@router.get(
    "/{outstanding_id}",
    response_model=OutstandingResponse,
)
def get_outstanding(
    outstanding_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.OWNER)
    ),
):
    try:
        return get_outstanding_service(
            db=db,
            outstanding_id=outstanding_id,
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


# =========================================================
# GET OUTSTANDING FOR VISIT
# =========================================================

@router.get(
    "/visit/{visit_id}",
    response_model=OutstandingResponse,
)
def get_visit_outstanding(
    visit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.OWNER)
    ),
):
    try:
        return get_outstanding_by_visit_service(
            db=db,
            visit_id=visit_id,
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )