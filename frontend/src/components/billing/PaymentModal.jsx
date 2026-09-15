import React, { useEffect, useMemo, useState } from "react";
import BillingModal from "./BillingModal";
import { getToday, getVisitLabel } from "./billingUtils";

function PaymentModal({
  open,
  onClose,
  onSubmit,
  patients = [],
  visits = [],
  saving = false,
}) {
  const [formData, setFormData] = useState({
    patient_id: "",
    visit_id: "",
    amount: "",
    payment_method: "cash",
    payment_date: getToday(),
    notes: "",
  });

  const [error, setError] = useState("");

  /* =========================================================
     RESET
  ========================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormData({
      patient_id: "",
      visit_id: "",
      amount: "",
      payment_method: "cash",
      payment_date: getToday(),
      notes: "",
    });

    setError("");
  }, [open]);

  /* =========================================================
     FILTER VISITS BY PATIENT
  ========================================================= */

  const filteredVisits = useMemo(() => {
    if (!formData.patient_id) {
      return [];
    }

    return visits.filter(
      (visit) =>
        Number(
          visit.patient_id ??
            visit.patient?.id ??
            visit.patientId
        ) === Number(formData.patient_id)
    );
  }, [visits, formData.patient_id]);

  /* =========================================================
     CHANGE HANDLER
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => {
      const next = {
        ...previous,
        [name]: value,
      };

      if (name === "patient_id") {
        next.visit_id = "";
      }

      return next;
    });

    if (error) {
      setError("");
    }
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.patient_id) {
      setError("Please select a patient.");
      return;
    }

    if (!formData.visit_id) {
      setError("Please select a visit.");
      return;
    }

    if (
      formData.amount === "" ||
      Number(formData.amount) <= 0
    ) {
      setError("Please enter a valid payment amount.");
      return;
    }

    if (!formData.payment_date) {
      setError("Please select a payment date.");
      return;
    }

    try {
      await onSubmit({
        patient_id: Number(formData.patient_id),
        visit_id: Number(formData.visit_id),
        amount: Number(formData.amount),
        payment_method: formData.payment_method,
        payment_date: formData.payment_date,
        notes: formData.notes.trim() || null,
      });
    } catch (submitError) {
      setError(
        submitError?.message ||
          "Unable to save payment. Please try again."
      );
    }
  };

  return (
    <BillingModal
      open={open}
      onClose={onClose}
      title="Add Payment"
      subtitle="Record a payment received from a patient."
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 p-5 sm:p-6">
          {/* Error */}
          {error && (
            <div
              className="rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: "rgba(180, 80, 70, 0.22)",
                backgroundColor: "rgba(180, 80, 70, 0.06)",
                color: "#a3483e",
              }}
            >
              {error}
            </div>
          )}

          {/* Patient */}
          <FormField
            label="Patient"
            required
            hint="Select the patient who made the payment."
          >
            <select
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select patient</option>

              {patients.map((patient) => (
                <option
                  key={patient.id}
                  value={patient.id}
                >
                  {getPatientOptionLabel(patient)}
                </option>
              ))}
            </select>
          </FormField>

          {/* Visit */}
          <FormField
            label="Visit"
            required
            hint={
              formData.patient_id
                ? "Select the visit related to this payment."
                : "Select a patient first."
            }
          >
            <select
              name="visit_id"
              value={formData.visit_id}
              onChange={handleChange}
              disabled={!formData.patient_id}
              className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60`}
            >
              <option value="">
                {formData.patient_id
                  ? filteredVisits.length
                    ? "Select visit"
                    : "No visits found"
                  : "Select patient first"}
              </option>

              {filteredVisits.map((visit) => (
                <option
                  key={visit.id}
                  value={visit.id}
                >
                  {getVisitOptionLabel(visit)}
                </option>
              ))}
            </select>
          </FormField>

          {/* Amount + Method */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              label="Amount"
              required
            >
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold"
                  style={{ color: "#6f8f7d" }}
                >
                  Rs.
                </span>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </FormField>

            <FormField
              label="Payment Method"
              required
            >
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank_transfer">
                  Bank Transfer
                </option>
                <option value="mobile_wallet">
                  Mobile Wallet
                </option>
              </select>
            </FormField>
          </div>

          {/* Date */}
          <FormField
            label="Payment Date"
            required
          >
            <input
              type="date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>

          {/* Notes */}
          <FormField
            label="Notes"
            hint="Optional"
          >
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Add any payment notes..."
              className={`${inputClass} resize-none`}
            />
          </FormField>
        </div>

        {/* Actions */}
        <div
          className="flex flex-col-reverse gap-3 border-t px-5 py-4 sm:flex-row sm:justify-end sm:px-6"
          style={{
            borderColor: "rgba(23, 59, 50, 0.10)",
            backgroundColor: "#f7f3e9",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="min-h-10.5 rounded-xl border px-5 py-2.5 text-sm font-semibold transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              borderColor: "rgba(23, 59, 50, 0.16)",
              color: "#173B32",
              backgroundColor: "#fffdf8",
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="min-h-10.5 rounded-xl px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              backgroundColor: "#173B32",
              color: "#f7f3e9",
            }}
          >
            {saving ? "Saving..." : "Save Payment"}
          </button>
        </div>
      </form>
    </BillingModal>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  required = false,
  hint,
  children,
}) {
  return (
    <div>
      <label
        className="mb-1.5 block text-sm font-semibold"
        style={{ color: "#173B32" }}
      >
        {label}

        {required && (
          <span
            className="ml-1"
            style={{ color: "#b4935a" }}
          >
            *
          </span>
        )}
      </label>

      {children}

      {hint && (
        <p
          className="mt-1.5 text-xs"
          style={{ color: "#8a9a91" }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   PATIENT LABEL
========================================================= */

function getPatientOptionLabel(patient) {
  const name =
    patient.full_name ||
    patient.name ||
    [patient.first_name, patient.last_name]
      .filter(Boolean)
      .join(" ") ||
    "Unknown Patient";

  const mrn =
    patient.medical_record_number ||
    patient.mrn ||
    patient.record_number;

  return mrn ? `${name} — ${mrn}` : name;
}

/* =========================================================
   VISIT LABEL
========================================================= */

function getVisitOptionLabel(visit) {
  const label = getVisitLabel(visit);

  const date =
    visit.visit_date ||
    visit.date ||
    visit.created_at;

  if (date) {
    const formattedDate = formatShortDate(date);

    return `#${visit.id} — ${label} — ${formattedDate}`;
  }

  return `#${visit.id} — ${label}`;
}

function formatShortDate(value) {
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
   SHARED INPUT STYLE
========================================================= */

const inputClass =
  "w-full rounded-xl border bg-[#fffdf8] px-3.5 py-2.5 text-sm text-[#173B32] outline-none transition placeholder:text-[#9aaa9f] focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#6f8f7d]/15";

export default PaymentModal;