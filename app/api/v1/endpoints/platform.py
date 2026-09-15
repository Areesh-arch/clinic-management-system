from __future__ import annotations

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.permissions import require_roles
from app.core.security import hash_password

from app.models.user import User
from app.models.enums import (
    UserRole,
    SubscriptionStatus,
)
from app.models.tenant import Tenant
from app.models.subscription import Subscription
from app.models.patient import Patient
from app.models.outstanding import Outstanding

from app.schemas.platform_admin import (
    PlatformAdminCreate,
    PlatformAdminUpdate,
    PlatformAdminResponse,
)


router = APIRouter(
    prefix="",
    tags=["Platform"],
)


# =========================================================
# PLATFORM OVERVIEW
# =========================================================

@router.get("/overview")
def get_platform_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    # ---------------------------------------------------------
    # PLATFORM COUNTS
    # ---------------------------------------------------------

    total_clinics = (
        db.query(func.count(Tenant.id))
        .scalar()
        or 0
    )

    active_subscriptions = (
        db.query(func.count(Subscription.id))
        .filter(
            Subscription.status
            == SubscriptionStatus.ACTIVE
        )
        .scalar()
        or 0
    )

    total_patients = (
        db.query(func.count(Patient.id))
        .scalar()
        or 0
    )

    # ---------------------------------------------------------
    # SUBSCRIPTION PLAN BREAKDOWN
    # ---------------------------------------------------------

    plan_rows = (
        db.query(
            Subscription.plan,
            func.count(Subscription.id),
        )
        .group_by(Subscription.plan)
        .all()
    )

    subscription_breakdown = {
        plan.value: count
        for plan, count in plan_rows
    }

    # ---------------------------------------------------------
    # SUBSCRIPTION STATUS BREAKDOWN
    # ---------------------------------------------------------

    status_rows = (
        db.query(
            Subscription.status,
            func.count(Subscription.id),
        )
        .group_by(Subscription.status)
        .all()
    )

    subscription_status_breakdown = {
        status.value: count
        for status, count in status_rows
    }

    # ---------------------------------------------------------
    # RECENT CLINICS
    # ---------------------------------------------------------

    recent_tenants = (
        db.query(Tenant)
        .order_by(Tenant.created_at.desc())
        .limit(5)
        .all()
    )

    recent_clinics = []

    for tenant in recent_tenants:
        owner = next(
            (
                user
                for user in tenant.users
                if user.role == UserRole.OWNER
            ),
            None,
        )

        subscription = (
            sorted(
                tenant.subscriptions,
                key=lambda item: item.created_at,
                reverse=True,
            )[0]
            if tenant.subscriptions
            else None
        )

        recent_clinics.append(
            {
                "id": tenant.id,
                "business_name": tenant.business_name,
                "subdomain": tenant.subdomain,
                "status": (
                    tenant.status.value
                    if tenant.status
                    else None
                ),
                "owner_name": (
                    owner.full_name
                    if owner
                    else None
                ),
                "owner_email": (
                    owner.email
                    if owner
                    else None
                ),
                "plan": (
                    subscription.plan.value
                    if subscription
                    else None
                ),
                "subscription_status": (
                    subscription.status.value
                    if subscription
                    else None
                ),
                "created_at": tenant.created_at,
            }
        )

    # ---------------------------------------------------------
    # PLATFORM-WIDE OUTSTANDING
    # ---------------------------------------------------------

    outstanding_rows = (
        db.query(Outstanding)
        .filter(
            Outstanding.outstanding_amount > 0
        )
        .order_by(
            Outstanding.outstanding_amount.desc()
        )
        .limit(50)
        .all()
    )

    platform_outstanding = []

    for outstanding in outstanding_rows:

        tenant = (
            db.query(Tenant)
            .filter(
                Tenant.id == outstanding.tenant_id
            )
            .first()
        )

        patient = (
            db.query(Patient)
            .filter(
                Patient.id == outstanding.patient_id,
                Patient.tenant_id
                == outstanding.tenant_id,
            )
            .first()
        )

        # -----------------------------------------------------
        # PATIENT DETAILS
        # -----------------------------------------------------

        if patient:
            first_name = (
                getattr(
                    patient,
                    "first_name",
                    "",
                )
                or ""
            ).strip()

            last_name = (
                getattr(
                    patient,
                    "last_name",
                    "",
                )
                or ""
            ).strip()

            patient_name = " ".join(
                part
                for part in [
                    first_name,
                    last_name,
                ]
                if part
            ).strip()

            if not patient_name:
                patient_name = (
                    getattr(
                        patient,
                        "name",
                        None,
                    )
                    or getattr(
                        patient,
                        "full_name",
                        None,
                    )
                    or "Unknown Patient"
                )

            medical_record_number = getattr(
                patient,
                "medical_record_number",
                None,
            )

        else:
            patient_name = "Unknown Patient"
            medical_record_number = None

        # -----------------------------------------------------
        # BUILD PLATFORM OUTSTANDING RESPONSE
        # -----------------------------------------------------

        platform_outstanding.append(
            {
                "id": outstanding.id,
                "tenant_id": outstanding.tenant_id,

                "clinic_name": (
                    tenant.business_name
                    if tenant
                    else "Unknown Clinic"
                ),

                "patient_id": outstanding.patient_id,
                "patient_name": patient_name,
                "medical_record_number": (
                    medical_record_number
                ),

                "visit_id": outstanding.visit_id,

                "total_charge": float(
                    outstanding.total_charge
                ),

                "total_paid": float(
                    outstanding.total_paid
                ),

                "outstanding_amount": float(
                    outstanding.outstanding_amount
                ),

                "created_at": outstanding.created_at,
                "updated_at": outstanding.updated_at,
            }
        )

    # ---------------------------------------------------------
    # PLATFORM REVENUE
    # ---------------------------------------------------------

    platform_revenue = None

    # ---------------------------------------------------------
    # RESPONSE
    # ---------------------------------------------------------

    return {
        "stats": {
            "total_clinics": total_clinics,
            "active_subscriptions": active_subscriptions,
            "total_patients": total_patients,
            "platform_revenue": platform_revenue,
        },

        "subscription_breakdown": (
            subscription_breakdown
        ),

        "subscription_status_breakdown": (
            subscription_status_breakdown
        ),

        "recent_clinics": recent_clinics,

        "outstanding": platform_outstanding,
    }


# =========================================================
# SUPER ADMIN MANAGEMENT
# =========================================================

@router.get(
    "/admins",
    response_model=list[PlatformAdminResponse],
)
def list_platform_admins(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    return (
        db.query(User)
        .filter(
            User.role == UserRole.SUPER_ADMIN
        )
        .order_by(User.id.asc())
        .all()
    )


# =========================================================
# CREATE SUPER ADMIN
# =========================================================

@router.post(
    "/admins",
    response_model=PlatformAdminResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_platform_admin(
    admin_data: PlatformAdminCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    existing_user = (
        db.query(User)
        .filter(
            User.email == admin_data.email
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists.",
        )

    admin = User(
        tenant_id=None,
        full_name=admin_data.full_name,
        email=admin_data.email,
        password_hash=hash_password(
            admin_data.password
        ),
        role=UserRole.SUPER_ADMIN,
        is_active=admin_data.is_active,
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)

    return admin


# =========================================================
# UPDATE SUPER ADMIN
# =========================================================

@router.put(
    "/admins/{user_id}",
    response_model=PlatformAdminResponse,
)
def update_platform_admin(
    user_id: int,
    admin_data: PlatformAdminUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    admin = (
        db.query(User)
        .filter(
            User.id == user_id,
            User.role == UserRole.SUPER_ADMIN,
        )
        .first()
    )

    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Super Admin not found.",
        )

    update_data = admin_data.model_dump(
        exclude_unset=True
    )

    if "email" in update_data:
        existing_user = (
            db.query(User)
            .filter(
                User.email
                == update_data["email"],
                User.id != admin.id,
            )
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists.",
            )

    if "password" in update_data:
        password = update_data.pop(
            "password"
        )

        if password:
            admin.password_hash = hash_password(
                password
            )

    for key, value in update_data.items():
        setattr(admin, key, value)

    db.commit()
    db.refresh(admin)

    return admin


# =========================================================
# DELETE / DEACTIVATE SUPER ADMIN
# =========================================================

@router.delete(
    "/admins/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_platform_admin(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    admin = (
        db.query(User)
        .filter(
            User.id == user_id,
            User.role == UserRole.SUPER_ADMIN,
        )
        .first()
    )

    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Super Admin not found.",
        )

    active_admin_count = (
        db.query(func.count(User.id))
        .filter(
            User.role == UserRole.SUPER_ADMIN,
            User.is_active.is_(True),
        )
        .scalar()
        or 0
    )

    if (
        admin.is_active
        and active_admin_count <= 1
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "At least one active Super Admin "
                "must remain."
            ),
        )

    if admin.id == current_user.id:
        admin.is_active = False
    else:
        db.delete(admin)

    db.commit()

    return None