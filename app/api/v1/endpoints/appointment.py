from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.dependencies import get_current_user

from app.models.user import User
from app.models.appointment import Appointment

from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentResponse,
)

from app.services.appointment_service import (
    create_appointment_service,
    get_appointment_service,
    list_appointments_service,
    update_appointment_service,
    delete_appointment_service,
)

# Set prefix="" because prefix="/appointments" is applied in api_router.py
router = APIRouter(
    prefix="",
    tags=["Appointments"],
)


@router.post(
    "/",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_appointment_service(
            db=db,
            appointment_data=appointment,
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get("", response_model=list[AppointmentResponse])
@router.get(
    "/",
    response_model=list[AppointmentResponse],
    include_in_schema=False,
)
def list_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_appointments_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


@router.get(
    "/{appointment_id}",
    response_model=AppointmentResponse,
)
def get_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return get_appointment_service(
            db=db,
            appointment_id=appointment_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.put(
    "/{appointment_id}",
    response_model=AppointmentResponse,
)
def update_appointment(
    appointment_id: int,
    appointment_data: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    appointment = get_appointment_service(
        db=db,
        appointment_id=appointment_id,
    )

    return update_appointment_service(
        db=db,
        appointment=appointment,
        appointment_data=appointment_data,
    )


@router.delete(
    "/{appointment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    appointment = get_appointment_service(
        db=db,
        appointment_id=appointment_id,
    )

    delete_appointment_service(
        db=db,
        appointment=appointment,
    )

    return None