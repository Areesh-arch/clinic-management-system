from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.permissions import require_roles
from app.models.enums import UserRole
from app.models.user import User

from app.schemas.prescription import (
    PrescriptionCreate,
    PrescriptionUpdate,
    PrescriptionResponse,
    PrescriptionItemUpdate,
    PrescriptionItemResponse,
)

from app.services.prescription_service import (
    create_prescription_service,
    get_prescription_service,
    list_prescriptions_service,
    update_prescription_service,
    delete_prescription_service,
    update_prescription_item_service,
    delete_prescription_item_service,
)


router = APIRouter(
    tags=["Prescriptions"]
)


# =========================================================
# CREATE
# =========================================================

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
            UserRole.OWNER,
            UserRole.STAFF,
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
            status_code=400,
            detail=str(e),
        )


# =========================================================
# LIST
# =========================================================

@router.get(
    "/",
    response_model=list[PrescriptionResponse],
)
def list_prescriptions(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
        )
    ),
):
    return list_prescriptions_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


# =========================================================
# GET SINGLE
# =========================================================

@router.get(
    "/{prescription_id}",
    response_model=PrescriptionResponse,
)
def get_prescription(
    prescription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
        )
    ),
):
    try:
        return get_prescription_service(
            db=db,
            prescription_id=prescription_id,
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


# =========================================================
# UPDATE PRESCRIPTION INSTRUCTIONS
# =========================================================

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
            UserRole.OWNER,
            UserRole.STAFF,
        )
    ),
):
    try:
        return update_prescription_service(
            db=db,
            prescription_id=prescription_id,
            prescription_data=prescription_data,
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


# =========================================================
# DELETE WHOLE PRESCRIPTION
# =========================================================

@router.delete(
    "/{prescription_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_prescription(
    prescription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
        )
    ),
):
    try:
        delete_prescription_service(
            db=db,
            prescription_id=prescription_id,
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    return None


# =========================================================
# EDIT ONE MEDICINE
# =========================================================

@router.put(
    "/items/{item_id}",
    response_model=PrescriptionItemResponse,
)
def update_prescription_item(
    item_id: int,
    item_data: PrescriptionItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
        )
    ),
):
    try:
        return update_prescription_item_service(
            db=db,
            item_id=item_id,
            item_data=item_data,
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# =========================================================
# DELETE ONE MEDICINE
# =========================================================

@router.delete(
    "/items/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_prescription_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
        )
    ),
):
    try:
        delete_prescription_item_service(
            db=db,
            item_id=item_id,
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    return None