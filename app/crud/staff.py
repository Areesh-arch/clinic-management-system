from sqlalchemy.orm import Session

from app.models.staff import Staff
from app.schemas.staff import (
    StaffCreate,
    StaffUpdate,
)


def create_staff(
    db: Session,
    staff_data: StaffCreate,
    tenant_id: int,
    employee_code: str,
) -> Staff:

    staff = Staff(
        tenant_id=tenant_id,
        user_id=staff_data.user_id,
        employee_code=employee_code,
        designation=staff_data.designation,
        phone=staff_data.phone,
        salary=staff_data.salary,
        hire_date=staff_data.hire_date,
        is_active=staff_data.is_active,
    )

    db.add(staff)
    db.commit()
    db.refresh(staff)

    return staff


def get_staff_by_id(
    db: Session,
    staff_id: int,
    tenant_id: int,
) -> Staff | None:

    return (
        db.query(Staff)
        .filter(
            Staff.id == staff_id,
            Staff.tenant_id == tenant_id,
        )
        .first()
    )


def get_staff_list(
    db: Session,
    tenant_id: int,
) -> list[Staff]:

    return (
        db.query(Staff)
        .filter(
            Staff.tenant_id == tenant_id,
        )
        .order_by(Staff.id)
        .all()
    )


def update_staff(
    db: Session,
    staff: Staff,
    staff_data: StaffUpdate,
) -> Staff:

    update_data = staff_data.model_dump(
        exclude_unset=True,
    )

    for key, value in update_data.items():
        setattr(
            staff,
            key,
            value,
        )

    db.commit()
    db.refresh(staff)

    return staff


def delete_staff(
    db: Session,
    staff: Staff,
) -> None:

    db.delete(staff)
    db.commit()