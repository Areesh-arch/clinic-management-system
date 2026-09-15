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
# PAYMENT DISPLAY DATA
# =========================================================

def attach_patient_display_data(
    db: Session,
    payment: Payment,
):
    """
    Attach patient name and medical record number to a
    Payment ORM object so PaymentResponse can expose them.
    """

    patient = (
        db.query(Patient)
        .filter(
            Patient.id == payment.patient_id,
            Patient.tenant_id == payment.tenant_id,
        )
        .first()
    )

    if patient is None:
        payment.patient_name = None
        payment.medical_record_number = None
        return payment

    first_name = (patient.first_name or "").strip()
    last_name = (patient.last_name or "").strip()

    full_name = " ".join(
        part
        for part in [first_name, last_name]
        if part
    ).strip()

    payment.patient_name = (
        full_name
        or getattr(patient, "name", None)
        or getattr(patient, "full_name", None)
        or None
    )

    payment.medical_record_number = getattr(
        patient,
        "medical_record_number",
        None,
    )

    return payment


def attach_patient_display_data_to_list(
    db: Session,
    payments,
):
    """
    Attach patient display information to a list of payments.
    """

    for payment in payments:
        attach_patient_display_data(
            db=db,
            payment=payment,
        )

    return payments


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
        Active payments fully paid
        =
        Appointment COMPLETED

    Archived payments are ignored.
    """

    if visit.appointment_id is None:
        return

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
    # Only ACTIVE payments count
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
            Payment.is_archived.is_(False),
        )
        .scalar()
    )

    total_paid = float(total_paid or 0)

    visit_charge = float(
        visit.charge or 0
    )

    payment_completed = (
        total_paid >= visit_charge
    )

    if (
        visit.status == VisitStatus.COMPLETED
        and payment_completed
    ):
        appointment.status = (
            AppointmentStatus.COMPLETED
        )
    else:
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
    Create a payment.

    Archived payments are ignored when calculating
    the remaining balance.
    """

    if payment_data.amount <= 0:
        raise ValueError(
            "Payment amount must be greater than zero."
        )

    # -----------------------------------------------------
    # Check patient
    # -----------------------------------------------------

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

    # -----------------------------------------------------
    # Check visit
    # -----------------------------------------------------

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

    # -----------------------------------------------------
    # Make sure visit belongs to patient
    # -----------------------------------------------------

    if visit.patient_id != patient.id:
        raise ValueError(
            "Visit does not belong to this patient."
        )

    # -----------------------------------------------------
    # Calculate ACTIVE payments only
    # -----------------------------------------------------

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
            Payment.is_archived.is_(False),
        )
        .scalar()
    )

    already_paid = float(
        already_paid or 0
    )

    remaining_balance = (
        float(visit.charge)
        - already_paid
    )

    if remaining_balance <= 0:
        raise ValueError(
            "This visit has already been fully paid."
        )

    if payment_data.amount > remaining_balance:
        raise ValueError(
            f"Payment exceeds the remaining balance "
            f"of Rs. {remaining_balance:,.2f}."
        )

    # -----------------------------------------------------
    # Create payment
    # -----------------------------------------------------

    payment = create_payment(
        db=db,
        payment_data=payment_data,
        tenant_id=tenant_id,
    )

    # -----------------------------------------------------
    # Refresh Outstanding
    # -----------------------------------------------------

    refresh_outstanding_for_visit(
        db=db,
        visit_id=payment.visit_id,
        tenant_id=tenant_id,
    )

    # -----------------------------------------------------
    # Appointment status
    # -----------------------------------------------------

    sync_appointment_status_from_visit_and_payment(
        db=db,
        visit=visit,
        tenant_id=tenant_id,
    )

    attach_patient_display_data(
        db=db,
        payment=payment,
    )

    return payment


# =========================================================
# GET ONE ACTIVE PAYMENT
# =========================================================

def get_payment_service(
    db: Session,
    payment_id: int,
    tenant_id: int,
):
    """
    Get one ACTIVE payment.

    Archived payments are intentionally hidden from
    normal payment operations.
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

    if payment.is_archived:
        raise ValueError(
            "Payment not found."
        )

    attach_patient_display_data(
        db=db,
        payment=payment,
    )

    return payment


# =========================================================
# GET ARCHIVED PAYMENT
# =========================================================

def get_archived_payment_service(
    db: Session,
    payment_id: int,
    tenant_id: int,
):
    """
    Get one archived payment.

    Used only by Archive operations.
    """

    payment = (
        db.query(Payment)
        .filter(
            Payment.id == payment_id,
            Payment.tenant_id == tenant_id,
            Payment.is_archived.is_(True),
        )
        .first()
    )

    if payment is None:
        raise ValueError(
            "Archived payment not found."
        )

    attach_patient_display_data(
        db=db,
        payment=payment,
    )

    return payment


# =========================================================
# LIST ACTIVE PAYMENTS
# =========================================================

def list_payments_service(
    db: Session,
    tenant_id: int,
):
    """
    Return only ACTIVE payments.
    """

    payments = (
        db.query(Payment)
        .filter(
            Payment.tenant_id == tenant_id,
            Payment.is_archived.is_(False),
        )
        .all()
    )

    return attach_patient_display_data_to_list(
        db=db,
        payments=payments,
    )


# =========================================================
# LIST ARCHIVED PAYMENTS
# =========================================================

def list_archived_payments_service(
    db: Session,
    tenant_id: int,
):
    """
    Return only archived payments.

    Includes patient name and medical record number
    for Archive UI display.
    """

    payments = (
        db.query(Payment)
        .filter(
            Payment.tenant_id == tenant_id,
            Payment.is_archived.is_(True),
        )
        .order_by(
            Payment.updated_at.desc()
        )
        .all()
    )

    return attach_patient_display_data_to_list(
        db=db,
        payments=payments,
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
    Update an ACTIVE payment.

    Archived payments cannot be edited from normal
    Billing.
    """

    if payment.tenant_id != tenant_id:
        raise ValueError(
            "Payment does not belong to this clinic."
        )

    if payment.is_archived:
        raise ValueError(
            "Archived payments cannot be updated."
        )

    old_visit_id = payment.visit_id

    # -----------------------------------------------------
    # Determine new amount
    # -----------------------------------------------------

    new_amount = (
        payment_data.amount
        if payment_data.amount is not None
        else payment.amount
    )

    if new_amount <= 0:
        raise ValueError(
            "Payment amount must be greater than zero."
        )

    # -----------------------------------------------------
    # Calculate OTHER ACTIVE payments
    # -----------------------------------------------------

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
            Payment.is_archived.is_(False),
        )
        .scalar()
    )

    other_payments = float(
        other_payments or 0
    )

    remaining_balance = (
        float(payment.visit.charge)
        - other_payments
    )

    if new_amount > remaining_balance:
        raise ValueError(
            f"Payment exceeds the remaining balance "
            f"of Rs. {remaining_balance:,.2f}."
        )

    # -----------------------------------------------------
    # Update payment
    # -----------------------------------------------------

    updated_payment = update_payment(
        db=db,
        payment=payment,
        payment_data=payment_data,
    )

    # -----------------------------------------------------
    # Refresh Outstanding
    # -----------------------------------------------------

    refresh_outstanding_for_visit(
        db=db,
        visit_id=old_visit_id,
        tenant_id=tenant_id,
    )

    # -----------------------------------------------------
    # Refresh visit
    # -----------------------------------------------------

    visit = (
        db.query(Visit)
        .filter(
            Visit.id == old_visit_id,
            Visit.tenant_id == tenant_id,
        )
        .first()
    )

    if visit is not None:
        sync_appointment_status_from_visit_and_payment(
            db=db,
            visit=visit,
            tenant_id=tenant_id,
        )

    attach_patient_display_data(
        db=db,
        payment=updated_payment,
    )

    return updated_payment


# =========================================================
# ARCHIVE PAYMENT
# =========================================================

def archive_payment_service(
    db: Session,
    payment: Payment,
    tenant_id: int,
):
    """
    Soft-delete a payment.

    The payment remains in the database and can be
    restored from Archive.

    Archived payments are removed from active payment
    calculations.
    """

    if payment.tenant_id != tenant_id:
        raise ValueError(
            "Payment does not belong to this clinic."
        )

    if payment.is_archived:
        raise ValueError(
            "Payment is already archived."
        )

    visit_id = payment.visit_id

    payment.is_archived = True

    db.commit()
    db.refresh(payment)

    # -----------------------------------------------------
    # Recalculate Outstanding
    # -----------------------------------------------------

    refresh_outstanding_for_visit(
        db=db,
        visit_id=visit_id,
        tenant_id=tenant_id,
    )

    # -----------------------------------------------------
    # Recalculate Appointment
    # -----------------------------------------------------

    visit = (
        db.query(Visit)
        .filter(
            Visit.id == visit_id,
            Visit.tenant_id == tenant_id,
        )
        .first()
    )

    if visit is not None:
        sync_appointment_status_from_visit_and_payment(
            db=db,
            visit=visit,
            tenant_id=tenant_id,
        )

    attach_patient_display_data(
        db=db,
        payment=payment,
    )

    return payment


# =========================================================
# RESTORE PAYMENT
# =========================================================

def restore_payment_service(
    db: Session,
    payment: Payment,
    tenant_id: int,
):
    """
    Restore an archived payment.
    """

    if payment.tenant_id != tenant_id:
        raise ValueError(
            "Payment does not belong to this clinic."
        )

    if not payment.is_archived:
        raise ValueError(
            "Payment is already active."
        )

    # -----------------------------------------------------
    # Make sure restoring will not create overpayment
    # -----------------------------------------------------

    visit = (
        db.query(Visit)
        .filter(
            Visit.id == payment.visit_id,
            Visit.tenant_id == tenant_id,
        )
        .first()
    )

    if visit is None:
        raise ValueError(
            "Visit not found."
        )

    active_paid = (
        db.query(
            func.coalesce(
                func.sum(Payment.amount),
                0,
            )
        )
        .filter(
            Payment.visit_id == payment.visit_id,
            Payment.tenant_id == tenant_id,
            Payment.is_archived.is_(False),
        )
        .scalar()
    )

    active_paid = float(
        active_paid or 0
    )

    visit_charge = float(
        visit.charge or 0
    )

    if active_paid + float(payment.amount) > visit_charge:
        raise ValueError(
            "This payment cannot be restored because "
            "it would exceed the visit's remaining balance."
        )

    # -----------------------------------------------------
    # Restore
    # -----------------------------------------------------

    payment.is_archived = False

    db.commit()
    db.refresh(payment)

    # -----------------------------------------------------
    # Refresh Outstanding
    # -----------------------------------------------------

    refresh_outstanding_for_visit(
        db=db,
        visit_id=payment.visit_id,
        tenant_id=tenant_id,
    )

    # -----------------------------------------------------
    # Recalculate Appointment
    # -----------------------------------------------------

    sync_appointment_status_from_visit_and_payment(
        db=db,
        visit=visit,
        tenant_id=tenant_id,
    )

    attach_patient_display_data(
        db=db,
        payment=payment,
    )

    return payment


# =========================================================
# PERMANENT DELETE PAYMENT
# =========================================================

def permanently_delete_payment_service(
    db: Session,
    payment: Payment,
    tenant_id: int,
):
    """
    Permanently delete an archived payment.

    Permanent deletion is only allowed for archived
    payments.
    """

    if payment.tenant_id != tenant_id:
        raise ValueError(
            "Payment does not belong to this clinic."
        )

    if not payment.is_archived:
        raise ValueError(
            "Only archived payments can be permanently deleted."
        )

    visit_id = payment.visit_id

    # -----------------------------------------------------
    # Permanent database deletion
    # -----------------------------------------------------

    delete_payment(
        db=db,
        payment=payment,
    )

    # -----------------------------------------------------
    # Refresh Outstanding
    # -----------------------------------------------------

    refresh_outstanding_for_visit(
        db=db,
        visit_id=visit_id,
        tenant_id=tenant_id,
    )

    # -----------------------------------------------------
    # Recalculate Appointment
    # -----------------------------------------------------

    visit = (
        db.query(Visit)
        .filter(
            Visit.id == visit_id,
            Visit.tenant_id == tenant_id,
        )
        .first()
    )

    if visit is not None:
        sync_appointment_status_from_visit_and_payment(
            db=db,
            visit=visit,
            tenant_id=tenant_id,
        )

    return None


# =========================================================
# LEGACY DELETE FUNCTION
# =========================================================

def delete_payment_service(
    db: Session,
    payment: Payment,
    tenant_id: int,
):
    """
    Backward-compatible delete function.

    IMPORTANT:
    Existing frontend delete actions now become ARCHIVE
    instead of permanent deletion.

    Permanent deletion must use:
        permanently_delete_payment_service()
    """

    return archive_payment_service(
        db=db,
        payment=payment,
        tenant_id=tenant_id,
    )