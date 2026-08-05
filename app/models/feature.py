from enum import Enum


class Feature(str, Enum):
    PATIENTS = "patients"
    APPOINTMENTS = "appointments"
    VISITS = "visits"

    PRESCRIPTIONS = "prescriptions"
    BEFORE_AFTER_PHOTOS = "before_after_photos"
    STAFF = "staff"

    ACCOUNTS = "accounts"
    REPORTS = "reports"
    PRIORITY_SUPPORT = "priority_support"