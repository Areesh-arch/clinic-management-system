from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import PhotoType


class TreatmentPhotoBase(BaseModel):
    visit_id: int
    photo_type: PhotoType
    image_url: str
    caption: str | None = None


class TreatmentPhotoCreate(TreatmentPhotoBase):
    pass


class TreatmentPhotoUpdate(BaseModel):
    photo_type: PhotoType | None = None
    image_url: str | None = None
    caption: str | None = None


class TreatmentPhotoResponse(TreatmentPhotoBase):
    id: int
    tenant_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )