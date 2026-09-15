from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.models.prescription import Prescription
from app.models.prescription_item import PrescriptionItem
from app.models.visit import Visit
from app.models.medicine_issue import MedicineIssue

from app.schemas.medicine_log import MedicineLogResponse


def get_medicine_log_service(
    db: Session,
    tenant_id: int,
):
    """
    Return complete medicine issue history for the current clinic.

    Sources:

    1. Prescription medicines
       PrescriptionItem
           -> Prescription
           -> Visit
           -> Patient

    2. Direct medicine issues
       MedicineIssue
           -> InventoryItem
           -> optional Patient

    Direct medicine issues can belong to:
        - an existing patient
        - a walk-in / non-patient customer
    """

    # =========================================================
    # PRESCRIPTION MEDICINES
    # =========================================================

    prescription_rows = (
        db.query(
            PrescriptionItem.id.label(
                "prescription_item_id"
            ),
            Prescription.id.label(
                "prescription_id"
            ),
            Visit.id.label(
                "visit_id"
            ),
            Patient.id.label(
                "patient_id"
            ),
            Patient.first_name.label(
                "first_name"
            ),
            Patient.last_name.label(
                "last_name"
            ),
            Patient.medical_record_number.label(
                "medical_record_number"
            ),
            Visit.visit_time.label(
                "date"
            ),
            PrescriptionItem.medicine_name.label(
                "medicine_name"
            ),
            PrescriptionItem.medicine_unit.label(
                "medicine_unit"
            ),
            PrescriptionItem.quantity.label(
                "quantity"
            ),
            PrescriptionItem.dosage.label(
                "dosage"
            ),
            PrescriptionItem.frequency.label(
                "frequency"
            ),
            PrescriptionItem.duration.label(
                "duration"
            ),
            PrescriptionItem.total_amount.label(
                "amount"
            ),
        )
        .join(
            Prescription,
            Prescription.id
            == PrescriptionItem.prescription_id,
        )
        .join(
            Visit,
            Visit.id
            == Prescription.visit_id,
        )
        .join(
            Patient,
            Patient.id
            == Visit.patient_id,
        )
        .filter(
            Prescription.tenant_id == tenant_id,
            Visit.tenant_id == tenant_id,
            Patient.tenant_id == tenant_id,
        )
        .all()
    )

    # =========================================================
    # DIRECT MEDICINE ISSUES
    # =========================================================

    direct_issue_rows = (
        db.query(
            MedicineIssue.id.label(
                "id"
            ),
            MedicineIssue.patient_id.label(
                "patient_id"
            ),
            MedicineIssue.customer_name.label(
                "customer_name"
            ),
            MedicineIssue.medicine_name.label(
                "medicine_name"
            ),
            MedicineIssue.medicine_unit.label(
                "medicine_unit"
            ),
            MedicineIssue.quantity.label(
                "quantity"
            ),
            MedicineIssue.unit_price.label(
                "unit_price"
            ),
            MedicineIssue.total_amount.label(
                "total_amount"
            ),
            MedicineIssue.issued_at.label(
                "date"
            ),
            Patient.first_name.label(
                "first_name"
            ),
            Patient.last_name.label(
                "last_name"
            ),
            Patient.medical_record_number.label(
                "medical_record_number"
            ),
        )
        .outerjoin(
            Patient,
            Patient.id
            == MedicineIssue.patient_id,
        )
        .filter(
            MedicineIssue.tenant_id == tenant_id,
        )
        .all()
    )

    result = []

    # =========================================================
    # ADD PRESCRIPTION RECORDS
    # =========================================================

    for row in prescription_rows:

        patient_name = (
            f"{row.first_name or ''} "
            f"{row.last_name or ''}"
        ).strip()

        result.append(
            MedicineLogResponse(
                prescription_item_id=(
                    row.prescription_item_id
                ),
                prescription_id=(
                    row.prescription_id
                ),
                visit_id=row.visit_id,

                patient_id=row.patient_id,
                patient_name=patient_name,
                medical_record_number=(
                    row.medical_record_number
                ),
                customer_name=None,

                date=row.date,

                medicine_name=row.medicine_name,
                medicine_unit=(
                    row.medicine_unit
                    or "unit"
                ),
                quantity=row.quantity,

                dosage=row.dosage,
                frequency=row.frequency,
                duration=row.duration,

                amount=row.amount,

                source="prescription",
            )
        )

    # =========================================================
    # ADD DIRECT MEDICINE ISSUE RECORDS
    # =========================================================

    for row in direct_issue_rows:

        patient_name = (
            f"{row.first_name or ''} "
            f"{row.last_name or ''}"
        ).strip()

        # If this is a registered patient,
        # display patient name.
        #
        # If this is a walk-in/non-patient,
        # display customer_name.
        display_name = (
            patient_name
            if patient_name
            else row.customer_name
        )

        result.append(
            MedicineLogResponse(
                prescription_item_id=None,
                prescription_id=None,
                visit_id=None,

                patient_id=row.patient_id,
                patient_name=display_name,
                medical_record_number=(
                    row.medical_record_number
                ),
                customer_name=(
                    row.customer_name
                ),

                date=row.date,

                medicine_name=row.medicine_name,
                medicine_unit=(
                    row.medicine_unit
                    or "unit"
                ),
                quantity=row.quantity,

                dosage=None,
                frequency=None,
                duration=None,

                amount=row.total_amount,

                source="direct_issue",
            )
        )

    # =========================================================
    # SORT EVERYTHING TOGETHER
    # NEWEST FIRST
    # =========================================================

    result.sort(
        key=lambda item: item.date,
        reverse=True,
    )

    return result