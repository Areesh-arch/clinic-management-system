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
from app.models.appointment import Appointment

from app.models.enums import (
    AppointmentStatus,
    VisitStatus,
)

from app.schemas.payment import (
    PaymentCreate,
    PaymentUpdate,
)

from app.services.outstanding_service import (
    refresh_outstanding_for_visit,
)


# =========================================================
# APPOINTMENT STATUS SYNCHRONIZATION
# =========================================================

def sync_appointment_status_from_visit_and_payment(
    db: Session,
    visit: Visit,
    tenant_id: int,
):
    """
    Automatically synchronize appointment status.

    Business rule:

        Visit COMPLETED
        +
        Payment fully paid
        =
        Appointment COMPLETED

    Otherwise:

        Appointment remains SCHEDULED.

    This makes the workflow easy for clinic staff.
    They do not need to manually change appointment status.
    """

    # -----------------------------------------------------
    # Visit must have an appointment
    # -----------------------------------------------------

    if visit.appointment_id is None:
        return

    # -----------------------------------------------------
    # Find appointment
    # -----------------------------------------------------

    appointment = (
        db.query(Appointment)
        .filter(
            Appointment.id == visit.appointment_id,
            Appointment.tenant_id == tenant_id,
        )
        .first()
    )

    if appointment is None:
        return

    # -----------------------------------------------------
    # Calculate total paid for this visit
    # -----------------------------------------------------

    total_paid = (
        db.query(
            func.coalesce(
                func.sum(Payment.amount),
                0,
            )
        )
        .filter(
            Payment.visit_id == visit.id,
            Payment.tenant_id == tenant_id,
        )
        .scalar()
    )

    total_paid = float(total_paid or 0)

    # -----------------------------------------------------
    # Calculate visit charge
    # -----------------------------------------------------

    visit_charge = float(
        visit.charge or 0
    )

    # -----------------------------------------------------
    # Determine whether payment is complete
    # -----------------------------------------------------

    payment_completed = (
        total_paid >= visit_charge
    )

    # -----------------------------------------------------
    # FINAL BUSINESS RULE
    # -----------------------------------------------------

    if (
        visit.status == VisitStatus.COMPLETED
        and payment_completed
    ):
        appointment.status = (
            AppointmentStatus.COMPLETED
        )

    else:
        # If treatment is not complete OR payment is
        # not fully paid, appointment remains pending.
        appointment.status = (
            AppointmentStatus.SCHEDULED
        )

    db.commit()
    db.refresh(appointment)


# =========================================================
# CREATE PAYMENT
# =========================================================

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

    After creating the payment:

        Outstanding is refreshed.

    Then:

        If Visit is COMPLETED
        AND payment is fully paid
        Appointment becomes COMPLETED automatically.
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
        db.query(
            func.coalesce(
                func.sum(Payment.amount),
                0,
            )
        )
        .filter(
            Payment.visit_id == visit.id,
            Payment.tenant_id == tenant_id,
        )
        .scalar()
    )

    already_paid = float(
        already_paid or 0
    )

    # ----------------------------------
    # Calculate remaining balance
    # ----------------------------------

    remaining_balance = (
        float(visit.charge)
        - already_paid
    )

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

    # ----------------------------------
    # AUTOMATIC APPOINTMENT COMPLETION
    # ----------------------------------

    sync_appointment_status_from_visit_and_payment(
        db=db,
        visit=visit,
        tenant_id=tenant_id,
    )

    return payment


# =========================================================
# GET ONE PAYMENT
# =========================================================

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


# =========================================================
# LIST PAYMENTS
# =========================================================

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


# =========================================================
# UPDATE PAYMENT
# =========================================================

def update_payment_service(
    db: Session,
    payment: Payment,
    payment_data: PaymentUpdate,
    tenant_id: int,
):
    """
    Update a payment while preventing overpayment.

    After updating:

        Outstanding is refreshed.

        Appointment status is recalculated automatically.
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
    # excluding current payment
    # ----------------------------------

    other_payments = (
        db.query(
            func.coalesce(
                func.sum(Payment.amount),
                0,
            )
        )
        .filter(
            Payment.visit_id == payment.visit_id,
            Payment.tenant_id == tenant_id,
            Payment.id != payment.id,
        )
        .scalar()
    )

    other_payments = float(
        other_payments or 0
    )

    # ----------------------------------
    # Calculate remaining balance
    # ----------------------------------

    remaining_balance = (
        float(payment.visit.charge)
        - other_payments
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

    # ----------------------------------
    # Refresh visit object
    # ----------------------------------

    visit = (
        db.query(Visit)
        .filter(
            Visit.id == old_visit_id,
            Visit.tenant_id == tenant_id,
        )
        .first()
    )

    # ----------------------------------
    # AUTOMATIC APPOINTMENT STATUS
    # ----------------------------------

    if visit is not None:
        sync_appointment_status_from_visit_and_payment(
            db=db,
            visit=visit,
            tenant_id=tenant_id,
        )

    return updated_payment


# =========================================================
# DELETE PAYMENT
# =========================================================

def delete_payment_service(
    db: Session,
    payment: Payment,
    tenant_id: int,
):
    """
    Delete payment.

    After deleting:

        Outstanding is recalculated.

        Appointment status is recalculated automatically.

    Therefore, if a fully-paid appointment becomes unpaid,
    it will automatically return to Pending.
    """

    # ----------------------------------
    # Tenant validation
    # ----------------------------------

    if payment.tenant_id != tenant_id:
        raise ValueError(
            "Payment does not belong to this clinic."
        )

    # Save visit ID before deleting
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

    # ----------------------------------
    # Get visit
    # ----------------------------------

    visit = (
        db.query(Visit)
        .filter(
            Visit.id == visit_id,
            Visit.tenant_id == tenant_id,
        )
        .first()
    )

    # ----------------------------------
    # AUTOMATIC APPOINTMENT STATUS
    # ----------------------------------

    if visit is not None:
        sync_appointment_status_from_visit_and_payment(
            db=db,
            visit=visit,
            tenant_id=tenant_id,
        )

    return None