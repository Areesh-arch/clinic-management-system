from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.enums import (
    BloodGroup,
    Gender,
    MaritalStatus,
)


class PatientBase(BaseModel):
    first_name: str
    last_name: str
    gender: Gender
    date_of_birth: date

    phone: Optional[str] = None
    email: Optional[EmailStr] = None

    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None

    cnic: Optional[str] = None
    occupation: Optional[str] = None

    marital_status: Optional[MaritalStatus] = None
    blood_group: Optional[BloodGroup] = None

    allergies: Optional[str] = None
    medical_history: Optional[str] = None
    notes: Optional[str] = None

    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

    profile_photo: Optional[str] = None


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[Gender] = None
    date_of_birth: Optional[date] = None

    phone: Optional[str] = None
    email: Optional[EmailStr] = None

    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None

    cnic: Optional[str] = None
    occupation: Optional[str] = None

    marital_status: Optional[MaritalStatus] = None
    blood_group: Optional[BloodGroup] = None

    allergies: Optional[str] = None
    medical_history: Optional[str] = None
    notes: Optional[str] = None

    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

    profile_photo: Optional[str] = None

    is_active: Optional[bool] = None


class PatientResponse(PatientBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tenant_id: int
    medical_record_number: str
    is_active: bool

    # Timestamp information
    created_at: datetime
    updated_at: datetime