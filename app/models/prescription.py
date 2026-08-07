from typing import TYPE_CHECKING
from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    Text,
)

from sqlalchemy.orm import relationship

from app.models.mixins import (
    IDMixin,
    TimestampMixin,
)

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.visit import Visit
    from app.models.tenant import Tenant

class Prescription(Base, IDMixin, TimestampMixin):
    __tablename__ = "prescriptions"

    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id"),
        nullable=False,
        index=True,
    )

    visit_id = Column(
        Integer,
        ForeignKey("visits.id"),
        nullable=False,
        unique=True,
    )

    instructions = Column(
        Text,
        nullable=True,
    )

    visit = relationship(
        "Visit",
        back_populates="prescription",
    )

    items = relationship(
        "PrescriptionItem",
        back_populates="prescription",
        cascade="all, delete-orphan",
    )
    
    tenant = relationship(
    "Tenant",
    back_populates="prescriptions",
)