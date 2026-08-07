from sqlalchemy.orm import Session

from app.models.payment import Payment

from app.schemas.payment import (
    PaymentCreate,
    PaymentUpdate,
)


def create_payment(
    db: Session,
    payment_data: PaymentCreate,
    tenant_id: int,
) -> Payment:

    payment = Payment(
        tenant_id=tenant_id,
        patient_id=payment_data.patient_id,
        visit_id=payment_data.visit_id,
        amount=payment_data.amount,
        payment_method=payment_data.payment_method,
        payment_date=payment_data.payment_date,
        notes=payment_data.notes,
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment


def get_payment_by_id(
    db: Session,
    payment_id: int,
):
    return (
        db.query(Payment)
        .filter(Payment.id == payment_id)
        .first()
    )


def get_payments(
    db: Session,
    tenant_id: int,
):
    return (
        db.query(Payment)
        .filter(Payment.tenant_id == tenant_id)
        .all()
    )


def update_payment(
    db: Session,
    payment: Payment,
    payment_data: PaymentUpdate,
):

    update_data = payment_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(payment, key, value)

    db.commit()
    db.refresh(payment)

    return payment


def delete_payment(
    db: Session,
    payment: Payment,
):

    db.delete(payment)
    db.commit()