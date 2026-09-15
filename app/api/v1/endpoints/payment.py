from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.permissions import require_roles
from app.api.tenant_context import get_effective_tenant_id

from app.models.enums import UserRole
from app.models.user import User

from app.schemas.payment import (
    PaymentCreate,
    PaymentUpdate,
    PaymentResponse,
)

from app.services.payment_service import (
    create_payment_service,
    get_payment_service,
    list_payments_service,
    list_archived_payments_service,
    get_archived_payment_service,
    update_payment_service,
    archive_payment_service,
    restore_payment_service,
    permanently_delete_payment_service,
)


router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


# =========================================================
# CREATE PAYMENT
# SUPER_ADMIN + OWNER + STAFF
# =========================================================

@router.post(
    "/",
    response_model=PaymentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_payment(
    payment_data: PaymentCreate,
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
    try:
        return create_payment_service(
            db=db,
            payment_data=payment_data,
            tenant_id=tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# =========================================================
# LIST ACTIVE PAYMENTS
# SUPER_ADMIN + OWNER + STAFF
# =========================================================

@router.get(
    "/",
    response_model=list[PaymentResponse],
)
def list_payments(
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
    return list_payments_service(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# LIST ARCHIVED PAYMENTS
# =========================================================

@router.get(
    "/archived",
    response_model=list[PaymentResponse],
)
def list_archived_payments(
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
    return list_archived_payments_service(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# GET SINGLE ACTIVE PAYMENT
# =========================================================

@router.get(
    "/{payment_id}",
    response_model=PaymentResponse,
)
def get_payment(
    payment_id: int,
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
    try:
        return get_payment_service(
            db=db,
            payment_id=payment_id,
            tenant_id=tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


# =========================================================
# UPDATE ACTIVE PAYMENT
# =========================================================

@router.put(
    "/{payment_id}",
    response_model=PaymentResponse,
)
def update_payment(
    payment_id: int,
    payment_data: PaymentUpdate,
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
    try:
        payment = get_payment_service(
            db=db,
            payment_id=payment_id,
            tenant_id=tenant_id,
        )

        return update_payment_service(
            db=db,
            payment=payment,
            payment_data=payment_data,
            tenant_id=tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# =========================================================
# ARCHIVE PAYMENT
# =========================================================

@router.post(
    "/{payment_id}/archive",
    response_model=PaymentResponse,
)
def archive_payment(
    payment_id: int,
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
    try:
        payment = get_payment_service(
            db=db,
            payment_id=payment_id,
            tenant_id=tenant_id,
        )

        return archive_payment_service(
            db=db,
            payment=payment,
            tenant_id=tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


# =========================================================
# RESTORE ARCHIVED PAYMENT
# =========================================================

@router.post(
    "/{payment_id}/restore",
    response_model=PaymentResponse,
)
def restore_payment(
    payment_id: int,
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
    try:
        payment = get_archived_payment_service(
            db=db,
            payment_id=payment_id,
            tenant_id=tenant_id,
        )

        return restore_payment_service(
            db=db,
            payment=payment,
            tenant_id=tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# =========================================================
# PERMANENTLY DELETE PAYMENT
# ARCHIVED PAYMENTS ONLY
# =========================================================

@router.delete(
    "/{payment_id}/permanent",
    status_code=status.HTTP_204_NO_CONTENT,
)
def permanently_delete_payment(
    payment_id: int,
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
    try:
        payment = get_archived_payment_service(
            db=db,
            payment_id=payment_id,
            tenant_id=tenant_id,
        )

        permanently_delete_payment_service(
            db=db,
            payment=payment,
            tenant_id=tenant_id,
        )

        return None

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


# =========================================================
# LEGACY DELETE → ARCHIVE
# =========================================================

@router.delete(
    "/{payment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_payment(
    payment_id: int,
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
    """
    Existing DELETE endpoint is intentionally kept
    for frontend compatibility.

    It now ARCHIVES the payment instead of permanently
    deleting it.
    """

    try:
        payment = get_payment_service(
            db=db,
            payment_id=payment_id,
            tenant_id=tenant_id,
        )

        archive_payment_service(
            db=db,
            payment=payment,
            tenant_id=tenant_id,
        )

        return None

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )