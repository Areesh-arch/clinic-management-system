from fastapi import APIRouter

from app.api.v1.endpoints.patient import router as patient_router
from app.api.v1.endpoints.tenant import router as tenant_router

api_router = APIRouter()

api_router.include_router(patient_router)
api_router.include_router(tenant_router)
