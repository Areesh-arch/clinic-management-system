from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.enums import UserRole
from app.models.patient import Patient
from app.models.user import User


def _validate_password(password: str, confirm_password: str) -> None:
    """
    Validate a patient portal password before it is hashed.
    """

    if len(password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long.",
        )

    if password != confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match.",
        )


def get_patient_portal_account_service(
    db: Session,
    patient: Patient,
):
    """
    Return the PATIENT portal account linked to this patient.

    The patient_id and tenant_id are both checked so a portal account
    can never be resolved from another clinic tenant.
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


def create_patient_portal_account_service(
    db: Session,
    patient: Patient,
    email: str,
    password: str,
    confirm_password: str,
):
    """
    Create a PATIENT portal account for an existing patient.

    The patient and the user account are always linked to the same tenant.
    """

    _validate_password(password, confirm_password)

    existing_patient_user = (
        db.query(User)
        .filter(
            User.patient_id == patient.id,
            User.tenant_id == patient.tenant_id,
        )
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


def reset_patient_portal_password_service(
    db: Session,
    patient: Patient,
    password: str,
    confirm_password: str,
):
    """
    Replace the password hash for an existing patient portal account.
    The plaintext password is never stored or returned.
    """

    _validate_password(password, confirm_password)

    user = get_patient_portal_account_service(
        db=db,
        patient=patient,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This patient does not have a portal account.",
        )

    user.password_hash = hash_password(password)

    db.commit()
    db.refresh(user)

    return user
