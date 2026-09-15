/* =========================================================
   DATE
========================================================= */

export function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDate(value) {
  if (!value) {
    return "—";
  }

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(value);
  }
}

/* =========================================================
   PATIENT
========================================================= */

export function getPatientName(patient) {
  if (!patient) {
    return "Unknown Patient";
  }

  const fullName =
    patient.full_name ||
    patient.name ||
    [patient.first_name, patient.last_name]
      .filter(Boolean)
      .join(" ");

  return fullName || "Unknown Patient";
}

export function getPatientNameById(patients = [], patientId) {
  if (!patientId) {
    return "Unknown Patient";
  }

  const patient = patients.find(
    (item) => Number(item.id) === Number(patientId)
  );

  return getPatientName(patient);
}

export function getPatientInitial(name) {
  if (!name) {
    return "?";
  }

  return String(name)
    .trim()
    .charAt(0)
    .toUpperCase();
}

/* =========================================================
   PAYMENT
========================================================= */

export function formatPaymentMethod(method) {
  if (!method) {
    return "—";
  }

  const normalized = String(method)
    .trim()
    .toLowerCase();

  const labels = {
    cash: "Cash",
    card: "Card",
    bank_transfer: "Bank Transfer",
    mobile_wallet: "Mobile Wallet",
    mobilewallet: "Mobile Wallet",
    online: "Online",
  };

  if (labels[normalized]) {
    return labels[normalized];
  }

  return String(method)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/* =========================================================
   VISIT / TREATMENT
========================================================= */

export function getVisitLabel(visit) {
  if (!visit) {
    return "—";
  }

  if (visit.treatment_name) {
    return visit.treatment_name;
  }

  if (visit.treatment) {
    if (typeof visit.treatment === "string") {
      return visit.treatment;
    }

    if (visit.treatment.name) {
      return visit.treatment.name;
    }

    if (visit.treatment.treatment_name) {
      return visit.treatment.treatment_name;
    }
  }

  if (visit.visit_name) {
    return visit.visit_name;
  }

  if (visit.description) {
    return visit.description;
  }

  if (visit.visit_type) {
    return visit.visit_type;
  }

  if (visit.id) {
    return `Visit #${visit.id}`;
  }

  return "Visit";
}

/* =========================================================
   ERROR HANDLING
========================================================= */

export function getErrorMessage(error, fallback = "Something went wrong.") {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.detail) {
    if (typeof error.detail === "string") {
      return error.detail;
    }

    if (Array.isArray(error.detail)) {
      return error.detail
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          return item?.msg || item?.message || "Validation error";
        })
        .join(", ");
    }

    if (typeof error.detail === "object") {
      return (
        error.detail.message ||
        error.detail.msg ||
        JSON.stringify(error.detail)
      );
    }
  }

  if (error.message) {
    return error.message;
  }

  if (error.response?.data?.detail) {
    const detail = error.response.data.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      return detail
        .map((item) => item?.msg || String(item))
        .join(", ");
    }
  }

  return fallback;
}

/* =========================================================
   MONEY
========================================================= */

export function formatCurrency(value) {
  return Number(value || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* =========================================================
   NUMBER
========================================================= */

export function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}