import React, { useEffect, useMemo, useState } from "react";
import BillingModal from "./BillingModal";
import { getToday, getVisitLabel } from "./billingUtils";

function PaymentModal({
  open,
  onClose,
  onSubmit,
  patients = [],
  visits = [],
  payments = [],
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

    return visits.filter((visit) => {
      const patientId =
        visit.patient_id ??
        visit.patient?.id ??
        visit.patientId;

      // Ignore archived visits if the field exists.
      if (visit?.is_archived === true) {
        return false;
      }

      return Number(patientId) === Number(formData.patient_id);
    });
  }, [visits, formData.patient_id]);

  /* =========================================================
     SELECTED VISIT
  ========================================================= */

  const selectedVisit = useMemo(() => {
    if (!formData.visit_id) {
      return null;
    }

    return (
      filteredVisits.find(
        (visit) =>
          Number(visit.id) === Number(formData.visit_id)
      ) || null
    );
  }, [filteredVisits, formData.visit_id]);

  /* =========================================================
     PATIENT FINANCIAL SUMMARY
  ========================================================= */

  const patientFinancialSummary = useMemo(() => {
    if (!formData.patient_id) {
      return {
        totalCharges: 0,
        totalPaid: 0,
        remaining: 0,
      };
    }

    const patientId = Number(formData.patient_id);

    const patientVisits = visits.filter((visit) => {
      if (visit?.is_archived === true) {
        return false;
      }

      const visitPatientId =
        visit.patient_id ??
        visit.patient?.id ??
        visit.patientId;

      return Number(visitPatientId) === patientId;
    });

    const totalCharges = patientVisits.reduce(
      (sum, visit) =>
        sum + Number(visit?.charge || 0),
      0
    );

    const totalPaid = payments
      .filter((payment) => {
        if (payment?.is_archived === true) {
          return false;
        }

        const paymentPatientId =
          payment.patient_id ??
          payment.patient?.id ??
          payment.patientId;

        return Number(paymentPatientId) === patientId;
      })
      .reduce(
        (sum, payment) =>
          sum + Number(payment?.amount || 0),
        0
      );

    const remaining = Math.max(
      totalCharges - totalPaid,
      0
    );

    return {
      totalCharges,
      totalPaid,
      remaining,
    };
  }, [visits, payments, formData.patient_id]);

  /* =========================================================
     SELECTED VISIT FINANCIAL SUMMARY
  ========================================================= */

  const selectedVisitFinancialSummary = useMemo(() => {
    if (!selectedVisit) {
      return {
        totalCharge: 0,
        totalPaid: 0,
        remaining: 0,
      };
    }

    const visitId = Number(selectedVisit.id);

    const totalCharge = Number(
      selectedVisit?.charge || 0
    );

    const totalPaid = payments
      .filter((payment) => {
        if (payment?.is_archived === true) {
          return false;
        }

        const paymentVisitId =
          payment.visit_id ??
          payment.visit?.id ??
          payment.visitId;

        return Number(paymentVisitId) === visitId;
      })
      .reduce(
        (sum, payment) =>
          sum + Number(payment?.amount || 0),
        0
      );

    const remaining = Math.max(
      totalCharge - totalPaid,
      0
    );

    return {
      totalCharge,
      totalPaid,
      remaining,
    };
  }, [selectedVisit, payments]);

  /* =========================================================
     FORMAT CURRENCY
  ========================================================= */

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString("en-PK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

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
        next.amount = "";
      }

      if (name === "visit_id") {
        next.amount = "";
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

    const paymentAmount = Number(formData.amount);

    const remainingBalance =
      selectedVisitFinancialSummary.remaining;

    if (remainingBalance <= 0) {
      setError(
        "This visit has no outstanding balance."
      );
      return;
    }

    if (paymentAmount > remainingBalance) {
      setError(
        `Payment cannot exceed the remaining balance of Rs. ${formatCurrency(
          remainingBalance
        )}.`
      );
      return;
    }

    try {
      await onSubmit({
        patient_id: Number(formData.patient_id),
        visit_id: Number(formData.visit_id),
        amount: paymentAmount,
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

          {/* =====================================================
              ERROR
          ===================================================== */}

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

          {/* =====================================================
              PATIENT
          ===================================================== */}

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
              <option value="">
                Select patient
              </option>

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

          {/* =====================================================
              PATIENT FINANCIAL SUMMARY
          ===================================================== */}

          {formData.patient_id && (
            <div
              className="overflow-hidden rounded-2xl border"
              style={{
                borderColor: "rgba(23, 59, 50, 0.12)",
                backgroundColor: "#fffdf8",
              }}
            >
              <div
                className="border-b px-4 py-3"
                style={{
                  borderColor: "rgba(23, 59, 50, 0.08)",
                  backgroundColor: "#173B32",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.14em]"
                  style={{ color: "#d8c69d" }}
                >
                  Patient Account Summary
                </p>

                <p
                  className="mt-0.5 text-sm"
                  style={{ color: "#f7f3e9" }}
                >
                  Current charges and payment balance
                </p>
              </div>

              <div className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <SummaryItem
                  label="Total Charges"
                  value={patientFinancialSummary.totalCharges}
                />

                <SummaryItem
                  label="Already Paid"
                  value={patientFinancialSummary.totalPaid}
                />

                <SummaryItem
                  label="Remaining"
                  value={patientFinancialSummary.remaining}
                  highlight
                />
              </div>

              {patientFinancialSummary.remaining <= 0 ? (
                <div
                  className="border-t px-4 py-3 text-xs font-medium"
                  style={{
                    borderColor: "rgba(23, 59, 50, 0.08)",
                    backgroundColor: "#f4faf6",
                    color: "#4c7661",
                  }}
                >
                  This patient currently has no outstanding
                  balance.
                </div>
              ) : (
                <div
                  className="border-t px-4 py-3 text-xs"
                  style={{
                    borderColor: "rgba(23, 59, 50, 0.08)",
                    color: "#71837a",
                  }}
                >
                  Select the relevant visit below to record
                  the payment against its outstanding balance.
                </div>
              )}
            </div>
          )}

          {/* =====================================================
              VISIT
          ===================================================== */}

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

              {filteredVisits.map((visit) => {
                const visitId = Number(visit.id);

                const visitPaid = payments
                  .filter((payment) => {
                    if (payment?.is_archived === true) {
                      return false;
                    }

                    const paymentVisitId =
                      payment.visit_id ??
                      payment.visit?.id ??
                      payment.visitId;

                    return (
                      Number(paymentVisitId) ===
                      visitId
                    );
                  })
                  .reduce(
                    (sum, payment) =>
                      sum +
                      Number(payment?.amount || 0),
                    0
                  );

                const visitCharge = Number(
                  visit?.charge || 0
                );

                const visitRemaining = Math.max(
                  visitCharge - visitPaid,
                  0
                );

                return (
                  <option
                    key={visit.id}
                    value={visit.id}
                  >
                    {getVisitOptionLabel(visit)}
                    {" — Remaining Rs. "}
                    {formatCurrency(visitRemaining)}
                  </option>
                );
              })}
            </select>
          </FormField>

          {/* =====================================================
              SELECTED VISIT BALANCE
          ===================================================== */}

          {selectedVisit && (
            <div
              className="rounded-2xl border px-4 py-4"
              style={{
                borderColor:
                  selectedVisitFinancialSummary.remaining > 0
                    ? "rgba(180, 147, 90, 0.28)"
                    : "rgba(23, 59, 50, 0.12)",
                backgroundColor:
                  selectedVisitFinancialSummary.remaining > 0
                    ? "rgba(180, 147, 90, 0.07)"
                    : "#f4faf6",
              }}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.12em]"
                    style={{ color: "#6f8f7d" }}
                  >
                    Selected Visit Balance
                  </p>

                  <p
                    className="mt-1 text-sm font-medium"
                    style={{ color: "#173B32" }}
                  >
                    Charge: Rs.{" "}
                    {formatCurrency(
                      selectedVisitFinancialSummary.totalCharge
                    )}
                    {" · "}
                    Paid: Rs.{" "}
                    {formatCurrency(
                      selectedVisitFinancialSummary.totalPaid
                    )}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p
                    className="text-xs"
                    style={{ color: "#71837a" }}
                  >
                    Remaining
                  </p>

                  <p
                    className="text-xl font-bold"
                    style={{
                      color:
                        selectedVisitFinancialSummary.remaining >
                        0
                          ? "#173B32"
                          : "#4c7661",
                    }}
                  >
                    Rs.{" "}
                    {formatCurrency(
                      selectedVisitFinancialSummary.remaining
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================
              AMOUNT + METHOD
          ===================================================== */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              label="Amount"
              required
              hint={
                selectedVisit
                  ? `Maximum: Rs. ${formatCurrency(
                      selectedVisitFinancialSummary.remaining
                    )}`
                  : "Select a visit first."
              }
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
                  max={
                    selectedVisitFinancialSummary.remaining >
                    0
                      ? selectedVisitFinancialSummary.remaining
                      : undefined
                  }
                  step="0.01"
                  placeholder="0.00"
                  disabled={
                    !selectedVisit ||
                    selectedVisitFinancialSummary.remaining <= 0
                  }
                  className={`${inputClass} pl-11 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60`}
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
                <option value="cash">
                  Cash
                </option>

                <option value="card">
                  Card
                </option>

                <option value="bank_transfer">
                  Bank Transfer
                </option>

                <option value="mobile_wallet">
                  Mobile Wallet
                </option>
              </select>
            </FormField>
          </div>

          {/* =====================================================
              DATE
          ===================================================== */}

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

          {/* =====================================================
              NOTES
          ===================================================== */}

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

        {/* =======================================================
            ACTIONS
        ======================================================= */}

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
            disabled={
              saving ||
              !selectedVisit ||
              selectedVisitFinancialSummary.remaining <= 0
            }
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
   SUMMARY ITEM
========================================================= */

function SummaryItem({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="px-4 py-3.5">
      <p
        className="text-[11px] font-semibold uppercase tracking-widest"
        style={{ color: "#819087" }}
      >
        {label}
      </p>

      <p
        className="mt-1 text-base font-bold"
        style={{
          color: highlight
            ? "#173B32"
            : "#4d6259",
        }}
      >
        Rs. {Number(value || 0).toLocaleString("en-PK", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </div>
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