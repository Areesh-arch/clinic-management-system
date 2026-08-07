from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.tenant import router as tenant_router
from app.api.v1.endpoints.patient import router as patient_router
from app.api.v1.endpoints.user import router as user_router
from app.api.v1.endpoints.staff import router as staff_router
from app.api.v1.endpoints.subscription import router as subscription_router
from app.api.v1.endpoints.appointment import router as appointment_router
from app.api.v1.endpoints.visit import router as visit_router
from app.api.v1.endpoints.prescription import router as prescription_router
from app.api.v1.endpoints.treatment_photo import router as treatment_photo_router
from app.api.v1.endpoints.inventory import router as inventory_router
from app.api.v1.endpoints.payment import router as payment_router
from app.api.v1.endpoints.expense import router as expense_router


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
)


api_router.include_router(
    user_router,
)


api_router.include_router(
    staff_router,
)


api_router.include_router(
    subscription_router,
)


api_router.include_router(
    appointment_router,
)


api_router.include_router(
    visit_router,
)


api_router.include_router(
    prescription_router,
)


api_router.include_router(
    treatment_photo_router,
)


api_router.include_router(
    inventory_router,
)


api_router.include_router(
    payment_router,
)


api_router.include_router(
    expense_router,
)