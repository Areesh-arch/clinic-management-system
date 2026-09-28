from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.enums import UserRole
from app.models.patient import Patient
from app.models.user import User


def create_patient_portal_account_service(
    db: Session,
    patient: Patient,
    email: str,
    password: str,
):
    """
    Create a PATIENT portal account for an existing patient.

    The patient and the user account must belong to the same tenant.
    """

    existing_patient_user = (
        db.query(User)
        .filter(User.patient_id == patient.id)
        .first()
    )

    if existing_patient_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This patient already has a portal account.",
        )

    existing_email_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_email_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This email address is already associated with a user account.",
        )

    user = User(
        tenant_id=patient.tenant_id,
        patient_id=patient.id,
        full_name=f"{patient.first_name} {patient.last_name}".strip(),
        email=email,
        password_hash=hash_password(password),
        role=UserRole.PATIENT,
        is_active=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def get_patient_portal_account_service(
    db: Session,
    patient: Patient,
):
    """
    Return the portal account linked to a patient, if one exists.
    """

    return (
        db.query(User)
        .filter(
            User.patient_id == patient.id,
            User.tenant_id == patient.tenant_id,
            User.role == UserRole.PATIENT,
        )
        .first()
    )


def set_patient_portal_account_status_service(
    db: Session,
    patient: Patient,
    is_active: bool,
):
    """
    Activate or deactivate an existing patient portal account.
    """

    user = get_patient_portal_account_service(
        db=db,
        patient=patient,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This patient does not have a portal account.",
        )

    user.is_active = is_active

    db.commit()
    db.refresh(user)

    return user