from sqlalchemy.orm import Session

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from app.database.session import get_db

from app.api.dependencies import (
    get_current_user,
)

from app.api.permissions import (
    require_roles,
)

from app.models.user import User
from app.models.prescription import Prescription

from app.schemas.prescription import (
    PrescriptionCreate,
    PrescriptionUpdate,
    PrescriptionResponse,
)

from app.services.prescription_service import (
    create_prescription_service,
    get_prescription_service,
    list_prescriptions_service,
    update_prescription_service,
    delete_prescription_service,
)

router = APIRouter(
    prefix="/prescriptions",
    tags=["Prescriptions"],
)


@router.post(
    "/",
    response_model=PrescriptionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_prescription(
    prescription_data: PrescriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    try:
        return create_prescription_service(
            db=db,
            prescription_data=prescription_data,
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[PrescriptionResponse],
)
def list_prescriptions(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    return list_prescriptions_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


@router.get(
    "/{prescription_id}",
    response_model=PrescriptionResponse,
)
def get_prescription(
    prescription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    try:
        return get_prescription_service(
            db=db,
            prescription_id=prescription_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.put(
    "/{prescription_id}",
    response_model=PrescriptionResponse,
)
def update_prescription(
    prescription_id: int,
    prescription_data: PrescriptionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    prescription = get_prescription_service(
        db=db,
        prescription_id=prescription_id,
    )

    return update_prescription_service(
        db=db,
        prescription=prescription,
        prescription_data=prescription_data,
    )


@router.delete(
    "/{prescription_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_prescription(
    prescription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("owner", "staff")
    ),
):
    try:
        prescription = get_prescription_service(
            db=db,
            prescription_id=prescription_id,
        )

        delete_prescription_service(
            db=db,
            prescription=prescription,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )