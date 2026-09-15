from sqlalchemy.orm import Session

from app.models.appointment import Appointment

from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentUpdate,
)


# =========================================================
# CREATE
# =========================================================

def create_appointment(
    db: Session,
    appointment_data: AppointmentCreate,
    tenant_id: int,
) -> Appointment:

    appointment = Appointment(
        tenant_id=tenant_id,
        is_archived=False,
        **appointment_data.model_dump(),
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return appointment


# =========================================================
# GET ONE ACTIVE
# =========================================================

def get_appointment_by_id(
    db: Session,
    appointment_id: int,
) -> Appointment | None:

    return (
        db.query(Appointment)
        .filter(
            Appointment.id == appointment_id,
            Appointment.is_archived.is_(False),
        )
        .first()
    )


# =========================================================
# GET ALL ACTIVE FOR TENANT
# =========================================================

def get_appointments(
    db: Session,
    tenant_id: int,
) -> list[Appointment]:

    return (
        db.query(Appointment)
        .filter(
            Appointment.tenant_id == tenant_id,
            Appointment.is_archived.is_(False),
        )
        .order_by(
            Appointment.appointment_date,
            Appointment.appointment_time,
        )
        .all()
    )


# =========================================================
# GET ARCHIVED FOR TENANT
# =========================================================

def get_archived_appointments(
    db: Session,
    tenant_id: int,
) -> list[Appointment]:

    return (
        db.query(Appointment)
        .filter(
            Appointment.tenant_id == tenant_id,
            Appointment.is_archived.is_(True),
        )
        .order_by(
            Appointment.appointment_date.desc(),
            Appointment.appointment_time.desc(),
        )
        .all()
    )


# =========================================================
# GET ANY ARCHIVED APPOINTMENT
# =========================================================

def get_archived_appointment_by_id(
    db: Session,
    appointment_id: int,
) -> Appointment | None:

    return (
        db.query(Appointment)
        .filter(
            Appointment.id == appointment_id,
            Appointment.is_archived.is_(True),
        )
        .first()
    )


# =========================================================
# UPDATE
# =========================================================

def update_appointment(
    db: Session,
    appointment: Appointment,
    appointment_data: AppointmentUpdate,
) -> Appointment:

    update_data = appointment_data.model_dump(
        exclude_unset=True,
    )

    for key, value in update_data.items():
        setattr(
            appointment,
            key,
            value,
        )

    db.commit()
    db.refresh(appointment)

    return appointment


# =========================================================
# ARCHIVE
# =========================================================

def archive_appointment(
    db: Session,
    appointment: Appointment,
) -> Appointment:

    appointment.is_archived = True

    db.commit()
    db.refresh(appointment)

    return appointment


# =========================================================
# RESTORE
# =========================================================

def restore_appointment(
    db: Session,
    appointment: Appointment,
) -> Appointment:

    appointment.is_archived = False

    db.commit()
    db.refresh(appointment)

    return appointment


# =========================================================
# PERMANENT DELETE
# =========================================================

def permanently_delete_appointment(
    db: Session,
    appointment: Appointment,
) -> None:

    db.delete(appointment)
    db.commit()


# =========================================================
# LEGACY DELETE
# =========================================================

def delete_appointment(
    db: Session,
    appointment: Appointment,
) -> Appointment:

    """
    Normal delete now means archive.

    Permanent deletion is handled separately from
    the Archive page.
    """

    return archive_appointment(
        db=db,
        appointment=appointment,
    )