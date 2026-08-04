from fastapi import APIRouter

from app.api.v1.endpoints.patient import router as patient_router
from app.api.v1.endpoints.tenant import router as tenant_router
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.subscription import router as subscription_router

api_router = APIRouter()

api_router.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"],
)

api_router.include_router(
    tenant_router,
    prefix="/tenants",
    tags=["Tenants"],
)

api_router.include_router(
    patient_router,
    prefix="/patients",
    tags=["Patients"],
)

api_router.include_router(subscription_router)