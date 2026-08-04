from app.models.enums import SubscriptionPlan
from app.models.feature import Feature


PLAN_FEATURES = {
    SubscriptionPlan.BASIC: {
        Feature.PATIENTS,
        Feature.APPOINTMENTS,
    },

    SubscriptionPlan.STANDARD: {
        Feature.PATIENTS,
        Feature.APPOINTMENTS,
        Feature.BILLING,
        Feature.PRESCRIPTIONS,
    },

    SubscriptionPlan.PREMIUM: {
        Feature.PATIENTS,
        Feature.APPOINTMENTS,
        Feature.BILLING,
        Feature.PRESCRIPTIONS,
        Feature.LABS,
        Feature.INVENTORY,
        Feature.REPORTS,
        Feature.STAFF,
    },
}