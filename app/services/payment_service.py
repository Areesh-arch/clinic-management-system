from sqlalchemy import func
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

from app.services.outstanding_service import (
    refresh_outstanding_for_visit,
)


def create_payment_service(
    db: Session,
    payment_data: PaymentCreate,
    tenant_id: int,
):
    """
    Create a payment after validating:

    1. Patient exists
    2. Visit exists
    3. Patient belongs to tenant
    4. Visit belongs to tenant
    5. Visit belongs to patient
    6. Payment amount is positive
    7. Payment does not exceed remaining balance

    After creating the payment, Outstanding is refreshed.
    """

    # ----------------------------------
    # Validate payment amount
    # ----------------------------------

    if payment_data.amount <= 0:
        raise ValueError(
            "Payment amount must be greater than zero."
        )

    # ----------------------------------
    # Check patient
    # ----------------------------------

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

    # ----------------------------------
    # Check visit
    # ----------------------------------

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

    # ----------------------------------
    # Make sure visit belongs to patient
    # ----------------------------------

    if visit.patient_id != patient.id:
        raise ValueError(
            "Visit does not belong to this patient."
        )

    # ----------------------------------
    # Calculate already-paid amount
    # ----------------------------------

    already_paid = (
        db.query(func.coalesce(func.sum(Payment.amount), 0))
        .filter(
            Payment.visit_id == visit.id,
            Payment.tenant_id == tenant_id,
        )
        .scalar()
    )

    already_paid = float(already_paid or 0)

    # ----------------------------------
    # Calculate remaining balance
    # ----------------------------------

    remaining_balance = float(visit.charge) - already_paid

    # ----------------------------------
    # Prevent overpayment
    # ----------------------------------

    if remaining_balance <= 0:
        raise ValueError(
            "This visit has already been fully paid."
        )

    if payment_data.amount > remaining_balance:
        raise ValueError(
            f"Payment exceeds the remaining balance "
            f"of Rs. {remaining_balance:,.2f}."
        )

    # ----------------------------------
    # Create payment
    # ----------------------------------

    payment = create_payment(
        db=db,
        payment_data=payment_data,
        tenant_id=tenant_id,
    )

    # ----------------------------------
    # Refresh Outstanding
    # ----------------------------------

    refresh_outstanding_for_visit(
        db=db,
        visit_id=payment.visit_id,
        tenant_id=tenant_id,
    )

    return payment


def get_payment_service(
    db: Session,
    payment_id: int,
    tenant_id: int,
):
    """
    Get one payment belonging to the current tenant.
    """

    payment = get_payment_by_id(
        db=db,
        payment_id=payment_id,
    )

    if payment is None:
        raise ValueError(
            "Payment not found."
        )

    if payment.tenant_id != tenant_id:
        raise ValueError(
            "Payment does not belong to this clinic."
        )

    return payment


def list_payments_service(
    db: Session,
    tenant_id: int,
):
    """
    Return all payments for the current tenant.
    """

    return get_payments(
        db=db,
        tenant_id=tenant_id,
    )


def update_payment_service(
    db: Session,
    payment: Payment,
    payment_data: PaymentUpdate,
    tenant_id: int,
):
    """
    Update a payment while preventing overpayment.
    """

    # ----------------------------------
    # Tenant validation
    # ----------------------------------

    if payment.tenant_id != tenant_id:
        raise ValueError(
            "Payment does not belong to this clinic."
        )

    old_visit_id = payment.visit_id

    # ----------------------------------
    # Determine new amount
    # ----------------------------------

    new_amount = (
        payment_data.amount
        if payment_data.amount is not None
        else payment.amount
    )

    if new_amount <= 0:
        raise ValueError(
            "Payment amount must be greater than zero."
        )

    # ----------------------------------
    # Calculate other payments
    # excluding the payment being edited
    # ----------------------------------

    other_payments = (
        db.query(func.coalesce(func.sum(Payment.amount), 0))
        .filter(
            Payment.visit_id == payment.visit_id,
            Payment.tenant_id == tenant_id,
            Payment.id != payment.id,
        )
        .scalar()
    )

    other_payments = float(other_payments or 0)

    # ----------------------------------
    # Calculate remaining balance
    # ----------------------------------

    remaining_balance = (
        float(payment.visit.charge) - other_payments
    )

    # ----------------------------------
    # Prevent overpayment
    # ----------------------------------

    if new_amount > remaining_balance:
        raise ValueError(
            f"Payment exceeds the remaining balance "
            f"of Rs. {remaining_balance:,.2f}."
        )

    # ----------------------------------
    # Update payment
    # ----------------------------------

    updated_payment = update_payment(
        db=db,
        payment=payment,
        payment_data=payment_data,
    )

    # ----------------------------------
    # Refresh Outstanding
    # ----------------------------------

    refresh_outstanding_for_visit(
        db=db,
        visit_id=old_visit_id,
        tenant_id=tenant_id,
    )

    return updated_payment


def delete_payment_service(
    db: Session,
    payment: Payment,
    tenant_id: int,
):
    """
    Delete payment and automatically recalculate
    the Outstanding amount for the related visit.
    """

    # ----------------------------------
    # Tenant validation
    # ----------------------------------

    if payment.tenant_id != tenant_id:
        raise ValueError(
            "Payment does not belong to this clinic."
        )

    # Save visit ID before deleting payment
    visit_id = payment.visit_id

    # ----------------------------------
    # Delete payment
    # ----------------------------------

    delete_payment(
        db=db,
        payment=payment,
    )

    # ----------------------------------
    # Refresh Outstanding
    # ----------------------------------

    refresh_outstanding_for_visit(
        db=db,
        visit_id=visit_id,
        tenant_id=tenant_id,
    )

    return None