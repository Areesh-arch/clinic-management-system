
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.permissions import require_patient
from app.database.session import get_db
from app.models.patient import Patient
from app.models.user import User


router = APIRouter()


# =========================================================
# PATIENT PORTAL - MY PROFILE
# =========================================================

@router.get("/me")
def get_my_profile(
    current_user: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    """
    Return the profile of the currently authenticated patient.

    The patient is identified from current_user.patient_id.
    No patient_id is accepted from the client.
    """

    patient = (
        db.query(Patient)
        .filter(
            Patient.id == current_user.patient_id,
            Patient.tenant_id == current_user.tenant_id,
        )
        .first()
    )

    if patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found.",
        )

    return {
        "id": patient.id,
        "tenant_id": patient.tenant_id,
        "medical_record_number": patient.medical_record_number,
        "first_name": patient.first_name,
        "last_name": patient.last_name,
        "full_name": f"{patient.first_name} {patient.last_name}".strip(),
        "gender": patient.gender.value if patient.gender else None,
        "date_of_birth": patient.date_of_birth,
        "phone": patient.phone,
        "email": patient.email,
        "address": patient.address,
        "city": patient.city,
        "country": patient.country,
        "cnic": patient.cnic,
        "occupation": patient.occupation,
        "marital_status": (
            patient.marital_status.value
            if patient.marital_status
            else None
        ),
        "blood_group": (
            patient.blood_group.value
            if patient.blood_group
            else None
        ),
        "allergies": patient.allergies,
        "medical_history": patient.medical_history,
        "notes": patient.notes,
        "emergency_contact_name": patient.emergency_contact_name,
        "emergency_contact_phone": patient.emergency_contact_phone,
        "profile_photo": patient.profile_photo,
        "is_active": patient.is_active,
    }
