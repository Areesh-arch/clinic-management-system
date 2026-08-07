from sqlalchemy.orm import Session

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from app.database.session import get_db

from app.api.permissions import require_roles

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
    update_payment_service,
    delete_payment_service,
)

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


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
            "owner",
            "staff",
        )
    ),
):
    try:
        return create_payment_service(
            db=db,
            payment_data=payment_data,
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[PaymentResponse],
)
def list_payments(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    return list_payments_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


@router.get(
    "/{payment_id}",
    response_model=PaymentResponse,
)
def get_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    try:
        return get_payment_service(
            db=db,
            payment_id=payment_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


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
            "owner",
            "staff",
        )
    ),
):
    payment = get_payment_service(
        db=db,
        payment_id=payment_id,
    )

    return update_payment_service(
        db=db,
        payment=payment,
        payment_data=payment_data,
    )


@router.delete(
    "/{payment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    payment = get_payment_service(
        db=db,
        payment_id=payment_id,
    )

    delete_payment_service(
        db=db,
        payment=payment,
    )