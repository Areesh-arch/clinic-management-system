from sqlalchemy.orm import Session

from app.models.appointment import Appointment
from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentUpdate,
)


def create_appointment(
    db: Session,
    appointment_data: AppointmentCreate,
    tenant_id: int,
) -> Appointment:
    appointment = Appointment(
        tenant_id=tenant_id,
        **appointment_data.model_dump(),
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return appointment


def get_appointment_by_id(
    db: Session,
    appointment_id: int,
) -> Appointment | None:
    return (
        db.query(Appointment)
        .filter(
            Appointment.id == appointment_id
        )
        .first()
    )


def get_appointments(
    db: Session,
    tenant_id: int,
) -> list[Appointment]:
    return (
        db.query(Appointment)
        .filter(
            Appointment.tenant_id == tenant_id
        )
        .all()
    )


def update_appointment(
    db: Session,
    appointment: Appointment,
    appointment_data: AppointmentUpdate,
) -> Appointment:

    update_data = appointment_data.model_dump(
        exclude_unset=True
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


def delete_appointment(
    db: Session,
    appointment: Appointment,
) -> None:

    db.delete(appointment)
    db.commit()