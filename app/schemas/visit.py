from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import VisitStatus


# =========================================================
# CREATE
# =========================================================

class VisitCreate(BaseModel):
    appointment_id: int

    chief_complaint: str | None = None
    diagnosis: str | None = None
    notes: str | None = None

    charge: float = 0


# =========================================================
# UPDATE
# =========================================================

class VisitUpdate(BaseModel):
    status: VisitStatus | None = None

    chief_complaint: str | None = None
    diagnosis: str | None = None
    notes: str | None = None

    charge: float | None = None


# =========================================================
# RESPONSE
# =========================================================

class VisitResponse(BaseModel):
    id: int
    tenant_id: int

    appointment_id: int
    patient_id: int

    visit_time: datetime
    status: VisitStatus

    chief_complaint: str | None = None
    diagnosis: str | None = None
    notes: str | None = None

    charge: float

    model_config = ConfigDict(
        from_attributes=True,
    )