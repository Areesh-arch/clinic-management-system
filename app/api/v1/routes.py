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
from app.api.v1.endpoints.payment import router as payment_router
from app.api.v1.endpoints.expense import router as expense_router
from app.api.v1.endpoints.inventory import router as inventory_router
from app.api.v1.endpoints.medicine_log import (
    router as medicine_log_router
)
from app.api.v1.endpoints.outstanding import router as outstanding_router
from app.api.v1.endpoints.dashboard import router as dashboard_router
from app.api.v1.endpoints.lead import router as lead_router
from app.api.v1.endpoints.cms_service import router as cms_service_router
from app.api.v1.endpoints.cms_result import router as cms_result_router
from app.api.v1.endpoints.cms_blog import router as cms_blog_router
from app.api.v1.endpoints.cms_quiz import router as cms_quiz_router
from app.api.v1.endpoints.cms_testimonial import router as cms_testimonial_router
from app.api.v1.endpoints.site_settings import router as site_settings_router
from app.api.v1.endpoints.platform import router as platform_router
from app.api.v1.endpoints.cms_image import router as cms_image_router


api_router = APIRouter(
    prefix="/api/v1"
)


# =========================================================
# AUTHENTICATION
# =========================================================

api_router.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"],
)


# =========================================================
# TENANTS
# =========================================================

api_router.include_router(
    tenant_router,
    prefix="/tenants",
    tags=["Tenants"],
)


# =========================================================
# PATIENTS
# =========================================================

api_router.include_router(
    patient_router,
    prefix="/patients",
    tags=["Patients"],
)


# =========================================================
# USERS
# =========================================================

api_router.include_router(
    user_router,
    prefix="/users",
    tags=["Users"],
)


# =========================================================
# STAFF / DOCTORS
# =========================================================

api_router.include_router(
    staff_router,
    prefix="/staff",
    tags=["Staff"],
)


# =========================================================
# SUBSCRIPTIONS
# =========================================================

api_router.include_router(
    subscription_router,
    prefix="/subscriptions",
    tags=["Subscriptions"],
)


# =========================================================
# APPOINTMENTS
# =========================================================

api_router.include_router(
    appointment_router,
    prefix="/appointments",
    tags=["Appointments"],
)


# =========================================================
# VISITS / TREATMENTS
# =========================================================

api_router.include_router(
    visit_router,
    prefix="/visits",
    tags=["Visits / Treatments"],
)


# =========================================================
# PRESCRIPTIONS
# =========================================================

api_router.include_router(
    prescription_router,
    prefix="/prescriptions",
    tags=["Prescriptions"],
)


# =========================================================
# TREATMENT PHOTOS
# =========================================================

api_router.include_router(
    treatment_photo_router,
    prefix="/treatment-photos",
    tags=["Treatment Photos"],
)


# =========================================================
# INVENTORY
# =========================================================

api_router.include_router(
    inventory_router,
    prefix="/inventory",
    tags=["Inventory"],
)

# =========================================================
# MEDICINE LOG
# =========================================================

api_router.include_router(
    medicine_log_router,
    prefix="/inventory",
    tags=["Medicine Log"],
)

# =========================================================
# PAYMENTS
# =========================================================

api_router.include_router(
    payment_router,
    prefix="/payments",
    tags=["Payments"],
)


# =========================================================
# EXPENSES
# =========================================================

api_router.include_router(
    expense_router,
    prefix="/expenses",
    tags=["Expenses"],
)


# =========================================================
# OUTSTANDING
# =========================================================

api_router.include_router(
    outstanding_router,
    prefix="/outstanding",
    tags=["Outstanding"],
)

# =========================================================
# CRM / LEADS
# =========================================================

api_router.include_router(
    lead_router,
    prefix="/crm/leads",
    tags=["CRM / Leads"],
)

# =========================================================
# CMS / SERVICES
# =========================================================

api_router.include_router(
    cms_service_router,
    prefix="/cms/services",
    tags=["CMS / Services"],
)

# =========================================================
# CMS / RESULTS
# =========================================================

api_router.include_router(
    cms_result_router,
    prefix="/cms/results",
    tags=["CMS / Results"],
)


# =========================================================
# CMS / NEWS & BLOGS
# =========================================================

api_router.include_router(
    cms_blog_router,
    prefix="/cms/blogs",
    tags=["CMS / News & Blogs"],
)


# =========================================================
# CMS / SKIN QUIZ
# =========================================================

api_router.include_router(
    cms_quiz_router,
    prefix="/cms/quiz",
    tags=["CMS / Skin Quiz"],
)

# =========================================================
# CMS / PATIENT FEEDBACK
# =========================================================

api_router.include_router(
    cms_testimonial_router,
    prefix="/cms/testimonials",
    tags=["CMS / Patient Feedback"],
)

# =========================================================
# SETTINGS / WEBSITE
# =========================================================

api_router.include_router(
    site_settings_router,
    prefix="/settings/site",
    tags=["Settings / Website"],
)

# =========================================================
# DASHBOARD
# =========================================================

api_router.include_router(
    dashboard_router,
    prefix="/dashboard",
    tags=["Dashboard"],
)

api_router.include_router(
    cms_image_router,
    prefix="/cms/images",
    tags=["CMS / Images"],
)

api_router.include_router(
    platform_router,
    prefix="/platform",
    tags=["Platform"],
)