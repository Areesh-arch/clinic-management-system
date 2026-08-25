from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app.core.security import hash_password

from app.crud.user import (
    create_user,
    get_user_by_email,
)

from app.models.staff import Staff
from app.models.user import User
from app.models.enums import UserRole

from app.schemas.staff import (
    StaffCreate,
    StaffUpdate,
)

from app.schemas.user import UserCreate


# ============================================================
# EMPLOYEE CODE GENERATOR
# ============================================================

def generate_employee_code(
    db: Session,
) -> str:
    """
    Generates employee codes like:

    EMP-000001
    EMP-000002
    EMP-000003
    """

    count = db.scalar(
        select(func.count()).select_from(Staff)
    )

    return f"EMP-{count + 1:06d}"


# ============================================================
# CREATE STAFF
# ============================================================

def create_staff_service(
    db: Session,
    staff_data: StaffCreate,
    tenant_id: int,
) -> Staff:
    """
    Creates:

        1. User account
        2. Staff profile

    The User stores:
        - name
        - email
        - password
        - role
        - active status

    The Staff record stores:
        - employee code
        - designation
        - phone
        - salary
        - hire date
        - active status
    """

    # --------------------------------------------------------
    # Check whether email already exists
    # --------------------------------------------------------

    existing_user = get_user_by_email(
        db,
        staff_data.email,
    )

    if existing_user:
        raise ValueError(
            "Email already exists."
        )

    # --------------------------------------------------------
    # Create User account
    # --------------------------------------------------------

    user_data = UserCreate(
        full_name=staff_data.full_name,
        email=staff_data.email,
        role=UserRole.STAFF,
        is_active=staff_data.is_active,
        password=staff_data.password,
    )

    password_hash = hash_password(
        staff_data.password,
    )

    user = create_user(
        db=db,
        user_data=user_data,
        tenant_id=tenant_id,
        password_hash=password_hash,
    )

    # --------------------------------------------------------
    # Generate Employee Code
    # --------------------------------------------------------

    employee_code = generate_employee_code(db)

    # --------------------------------------------------------
    # Create Staff Profile
    # --------------------------------------------------------

    staff = Staff(
        tenant_id=tenant_id,
        user_id=user.id,
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

    # --------------------------------------------------------
    # Load User relationship
    #
    # This allows StaffResponse to return:
    #
    # "name": "Ali"
    #
    # instead of forcing the frontend to make another request.
    # --------------------------------------------------------

    return (
        db.query(Staff)
        .options(
            joinedload(Staff.user)
        )
        .filter(
            Staff.id == staff.id,
            Staff.tenant_id == tenant_id,
        )
        .first()
    )


# ============================================================
# GET ONE STAFF MEMBER
# ============================================================

def get_staff_service(
    db: Session,
    staff_id: int,
    tenant_id: int,
) -> Staff | None:
    """
    Get one staff member belonging to the current clinic.
    """

    return (
        db.query(Staff)
        .options(
            joinedload(Staff.user)
        )
        .filter(
            Staff.id == staff_id,
            Staff.tenant_id == tenant_id,
        )
        .first()
    )


# ============================================================
# LIST STAFF
# ============================================================

def list_staff_service(
    db: Session,
    tenant_id: int,
) -> list[Staff]:
    """
    Return all staff belonging to the current clinic.

    User information is loaded at the same time so the
    response can contain the staff member's name.
    """

    return (
        db.query(Staff)
        .options(
            joinedload(Staff.user)
        )
        .filter(
            Staff.tenant_id == tenant_id,
        )
        .order_by(Staff.id)
        .all()
    )


# ============================================================
# UPDATE STAFF
# ============================================================

def update_staff_service(
    db: Session,
    staff: Staff,
    staff_data: StaffUpdate,
) -> Staff:
    """
    Update both:

        User information:
            - full_name
            - email

        Staff information:
            - designation
            - phone
            - salary
            - hire_date
            - is_active
    """

    update_data = staff_data.model_dump(
        exclude_unset=True,
    )

    # --------------------------------------------------------
    # User information
    # --------------------------------------------------------

    user = staff.user

    if user is None:
        raise ValueError(
            "Staff user account was not found."
        )

    # Update name
    if "full_name" in update_data:
        user.full_name = update_data.pop(
            "full_name"
        )

    # Update email
    if "email" in update_data:

        existing_user = (
            db.query(User)
            .filter(
                User.email == update_data["email"],
                User.id != user.id,
            )
            .first()
        )

        if existing_user:
            raise ValueError(
                "Email already exists."
            )

        user.email = update_data.pop(
            "email"
        )

    # --------------------------------------------------------
    # Staff information
    # --------------------------------------------------------

    for key, value in update_data.items():
        setattr(
            staff,
            key,
            value,
        )

    db.commit()
    db.refresh(staff)

    # --------------------------------------------------------
    # Return Staff with User loaded
    # --------------------------------------------------------

    return (
        db.query(Staff)
        .options(
            joinedload(Staff.user)
        )
        .filter(
            Staff.id == staff.id,
            Staff.tenant_id == staff.tenant_id,
        )
        .first()
    )


# ============================================================
# DELETE STAFF
# ============================================================

def delete_staff_service(
    db: Session,
    staff: Staff,
) -> None:
    """
    Delete:

        Staff profile
             +
        Associated User account
    """

    user = staff.user

    # --------------------------------------------------------
    # Delete Staff profile first
    # --------------------------------------------------------

    db.delete(staff)
    db.flush()

    # --------------------------------------------------------
    # Delete associated User account
    # --------------------------------------------------------

    if user is not None:
        db.delete(user)

    db.commit()