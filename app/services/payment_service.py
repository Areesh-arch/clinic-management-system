from sqlalchemy.orm import Session

from app.crud.payment import (
    create_payment,
    get_payment_by_id,
    get_payments,
    update_payment,
    delete_payment,
)

from app.models.payment import Payment
from app.models.patient import Patient
from app.models.visit import Visit

from app.schemas.payment import (
    PaymentCreate,
    PaymentUpdate,
)


def create_payment_service(
    db: Session,
    payment_data: PaymentCreate,
    tenant_id: int,
):
    """
    Create a payment after validating:
    - Patient exists
    - Visit exists
    - Both belong to the same tenant
    """

    patient = (
        db.query(Patient)
        .filter(
            Patient.id == payment_data.patient_id,
            Patient.tenant_id == tenant_id,
        )
        .first()
    )

    if patient is None:
        raise ValueError(
            "Patient not found."
        )

    visit = (
        db.query(Visit)
        .filter(
            Visit.id == payment_data.visit_id,
            Visit.tenant_id == tenant_id,
        )
        .first()
    )

    if visit is None:
        raise ValueError(
            "Visit not found."
        )

    if visit.patient_id != patient.id:
        raise ValueError(
            "Visit does not belong to this patient."
        )

    return create_payment(
        db=db,
        payment_data=payment_data,
        tenant_id=tenant_id,
    )


def get_payment_service(
    db: Session,
    payment_id: int,
):
    payment = get_payment_by_id(
        db=db,
        payment_id=payment_id,
    )

    if payment is None:
        raise ValueError(
            "Payment not found."
        )

    return payment


def list_payments_service(
    db: Session,
    tenant_id: int,
):
    return get_payments(
        db=db,
        tenant_id=tenant_id,
    )


def update_payment_service(
    db: Session,
    payment: Payment,
    payment_data: PaymentUpdate,
):
    return update_payment(
        db=db,
        payment=payment,
        payment_data=payment_data,
    )


def delete_payment_service(
    db: Session,
    payment: Payment,
):
    delete_payment(
        db=db,
        payment=payment,
    )