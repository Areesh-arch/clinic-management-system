from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.enums import UserRole
from app.models.mixins import IDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.tenant import Tenant
    from app.models.staff import Staff
    from app.models.patient import Patient


class User(Base, IDMixin, TimestampMixin):
    """
    Represents a user belonging to a tenant (clinic).

    User is the authentication/account layer.

    Depending on the role, a User may be linked to:
    - Staff
    - Patient
    """

    __tablename__ = "users"

    # =========================================================
    # TENANT
    # =========================================================

    tenant_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "tenants.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )

    # =========================================================
    # PATIENT LINK
    # =========================================================
    #
    # Only PATIENT users should have this field populated.
    #
    # unique=True ensures one portal account per patient.
    # Multiple NULL values are allowed by PostgreSQL, so existing
    # OWNER / STAFF / SUPER_ADMIN users are unaffected.
    #

    patient_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "patients.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        unique=True,
        index=True,
    )

    # =========================================================
    # BASIC ACCOUNT INFORMATION
    # =========================================================

    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role: Mapped[UserRole] = mapped_column(
        Enum(
            UserRole,
            native_enum=False,
        ),
        default=UserRole.STAFF,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # =========================================================
    # PROFILE IMAGE
    # =========================================================

    profile_image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    # =========================================================
    # RELATIONSHIPS
    # =========================================================

    tenant: Mapped["Tenant"] = relationship(
        "Tenant",
        back_populates="users",
        lazy="selectin",
    )

    staff: Mapped["Staff"] = relationship(
        "Staff",
        back_populates="user",
        uselist=False,
        lazy="selectin",
    )

    patient: Mapped["Patient"] = relationship(
        "Patient",
        back_populates="portal_user",
        uselist=False,
        lazy="selectin",
    )