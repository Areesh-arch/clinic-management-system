from app.models.enums import SubscriptionPlan
from app.models.feature import Feature

PLAN_FEATURES = {
    SubscriptionPlan.BASIC: {
        Feature.PATIENTS,
        Feature.APPOINTMENTS,
        Feature.VISITS,
        Feature.STAFF,
    },

    SubscriptionPlan.STANDARD: {
        Feature.PATIENTS,
        Feature.APPOINTMENTS,
        Feature.VISITS,
        Feature.PRESCRIPTIONS,
        Feature.BEFORE_AFTER_PHOTOS,
        Feature.STAFF,
    },

    SubscriptionPlan.PREMIUM: {
        Feature.PATIENTS,
        Feature.APPOINTMENTS,
        Feature.VISITS,
        Feature.PRESCRIPTIONS,
        Feature.BEFORE_AFTER_PHOTOS,
        Feature.STAFF,
        Feature.ACCOUNTS,
        Feature.REPORTS,
        Feature.PRIORITY_SUPPORT,
    },
}