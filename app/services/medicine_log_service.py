from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.models.prescription import Prescription
from app.models.prescription_item import PrescriptionItem
from app.models.visit import Visit


def get_medicine_log_service(
    db: Session,
    tenant_id: int,
):
    rows = (
        db.query(
            PrescriptionItem.id.label(
                "prescription_item_id"
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

            PrescriptionItem.quantity.label(
                "quantity"
            ),

            PrescriptionItem.dosage.label(
                "dosage"
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
            Prescription.tenant_id
            == tenant_id,
            Visit.tenant_id
            == tenant_id,
            Patient.tenant_id
            == tenant_id,
        )
        .order_by(
            Visit.visit_time.desc(),
            PrescriptionItem.id.desc(),
        )
        .all()
    )

    result = []

    for row in rows:
        first_name = (
            row.first_name or ""
        ).strip()

        last_name = (
            row.last_name or ""
        ).strip()

        patient_name = " ".join(
            part
            for part in [
                first_name,
                last_name,
            ]
            if part
        )

        result.append(
            {
                "prescription_item_id":
                    row.prescription_item_id,

                "patient_id":
                    row.patient_id,

                "patient_name":
                    patient_name,

                "medical_record_number":
                    row.medical_record_number,

                "date":
                    row.date,

                "medicine_name":
                    row.medicine_name,

                "quantity":
                    row.quantity,

                "dosage":
                    row.dosage,

                "duration":
                    row.duration,

                "amount":
                    row.amount,
            }
        )

    return result