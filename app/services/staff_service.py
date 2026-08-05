from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.crud.staff import (
    create_staff,
    delete_staff,
    get_staff_by_id,
    get_staff_list,
    update_staff,
)

from app.models.staff import Staff
from app.models.user import User

from app.schemas.staff import (
    StaffCreate,
    StaffUpdate,
)


def generate_employee_code(db: Session) -> str:
    """
    Generates employee codes like:
    EMP-000001
    EMP-000002
    """

    count = db.scalar(
        select(func.count()).select_from(Staff)
    )

    return f"EMP-{count + 1:06d}"


def create_staff_service(
    db: Session,
    staff_data: StaffCreate,
    tenant_id: int,
):
    """
    Business logic for creating staff.
    """

    user = (
        db.query(User)
        .filter(User.id == staff_data.user_id)
        .first()
    )

    if user is None:
        raise ValueError("User does not exist.")

    existing = (
        db.query(Staff)
        .filter(Staff.user_id == staff_data.user_id)
        .first()
    )

    if existing:
        raise ValueError(
            "This user is already assigned as staff."
        )

    employee_code = generate_employee_code(db)

    return create_staff(
        db=db,
        staff_data=staff_data,
        tenant_id=tenant_id,
        employee_code=employee_code,
    )


def get_staff_service(
    db: Session,
    staff_id: int,
):
    return get_staff_by_id(
        db,
        staff_id,
    )


def list_staff_service(
    db: Session,
):
    return get_staff_list(db)


def update_staff_service(
    db: Session,
    staff: Staff,
    staff_data: StaffUpdate,
):
    return update_staff(
        db,
        staff,
        staff_data,
    )


def delete_staff_service(
    db: Session,
    staff: Staff,
):
    delete_staff(
        db,
        staff,
    )