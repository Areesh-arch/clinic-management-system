from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy import Enum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.enums import TenantStatus
from app.models.mixins import IDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.subscription import Subscription
    from app.models.user import User
    from app.models.patient import Patient
    from app.models.staff import Staff
    from app.models.appointment import Appointment
    from app.models.visit import Visit
    from app.models.prescription import Prescription
    from app.models.treatment_photo import TreatmentPhoto
    from app.models.inventory_item import InventoryItem
    from app.models.payment import Payment
    from app.models.expense import Expense
    from app.models.outstanding import Outstanding
    
class Tenant(Base, IDMixin, TimestampMixin):
    """
    Represents a dermatology clinic (tenant) in the SaaS platform.
    """

    __tablename__ = "tenants"

    business_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    subdomain: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    status: Mapped[TenantStatus] = mapped_column(
        Enum(TenantStatus),
        default=TenantStatus.ACTIVE,
        nullable=False,
    )

        # Relationships
    users: Mapped[list["User"]] = relationship(
        "User",
        back_populates="tenant",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    subscriptions: Mapped[list["Subscription"]] = relationship(
        "Subscription",
        back_populates="tenant",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    patients: Mapped[list["Patient"]] = relationship(
        "Patient",
        back_populates="tenant",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    
    staff: Mapped[list["Staff"]] = relationship(
    "Staff",
    back_populates="tenant",
    cascade="all, delete-orphan",
    lazy="selectin",
)
    appointments: Mapped[list["Appointment"]] = relationship(
    "Appointment",
    back_populates="tenant",
    cascade="all, delete-orphan",
)
    visits: Mapped[list["Visit"]] = relationship(
    "Visit",
    back_populates="tenant",
    cascade="all, delete-orphan",
)
    
    prescriptions: Mapped[list["Prescription"]] = relationship(
    "Prescription",
    back_populates="tenant",
    cascade="all, delete-orphan",
)
    
    photos: Mapped[list["TreatmentPhoto"]] = relationship(
    "TreatmentPhoto",
    back_populates="tenant",
    cascade="all, delete-orphan",
)
    
    inventory_items: Mapped[list["InventoryItem"]] = relationship(
    "InventoryItem",
    back_populates="tenant",
    cascade="all, delete-orphan",
)
    
    payments: Mapped[list["Payment"]] = relationship(
    "Payment",
    back_populates="tenant",
    cascade="all, delete-orphan",
)
    expenses: Mapped[list["Expense"]] = relationship(
    "Expense",
    back_populates="tenant",
    cascade="all, delete-orphan",
)
    outstandings: Mapped[list["Outstanding"]] = relationship(
    "Outstanding",
    back_populates="tenant",
    cascade="all, delete-orphan",
)