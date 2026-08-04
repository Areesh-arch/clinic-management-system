from enum import Enum


class Feature(str, Enum):
    PATIENTS = "patients"
    APPOINTMENTS = "appointments"
    BILLING = "billing"
    PRESCRIPTIONS = "prescriptions"
    LABS = "labs"
    INVENTORY = "inventory"
    REPORTS = "reports"
    STAFF = "staff"