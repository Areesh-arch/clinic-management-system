from __future__ import annotations
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.enums import UserRole
from app.models.mixins import IDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.tenant import Tenant

class User(Base, IDMixin, TimestampMixin):
    """
    Represents a user belonging to a tenant (clinic).
    """

    __tablename__ = "users"

    tenant_id: Mapped[int | None] = mapped_column(
    ForeignKey(
        "tenants.id",
        ondelete="CASCADE",
    ),
    nullable=True,
    index=True,
)

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

    # Relationship
    tenant: Mapped["Tenant"] = relationship(
    "Tenant",
    back_populates="users",
    lazy="selectin",
)