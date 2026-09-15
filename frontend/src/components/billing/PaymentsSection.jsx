import React from "react";

import {
  formatDate,
  formatPaymentMethod,
  getPatientInitial,
} from "./billingUtils";

function PaymentsSection({
  payments = [],
  patients = [],
  onAdd,
  onDelete,
  deletingPaymentId = null,
}) {
  // =========================================================
  // PATIENT DISPLAY HELPERS
  // =========================================================

  const getPatientName = (payment) => {
    // Prefer patient data returned directly by backend
    if (payment?.patient_name) {
      return payment.patient_name;
    }

    // Fallback to patients array if older API data is returned
    if (payment?.patient_id) {
      const nameFromList = patients.find(
        (patient) => patient.id === payment.patient_id
      );

      if (nameFromList) {
        const fullName = [
          nameFromList.first_name,
          nameFromList.last_name,
        ]
          .filter(Boolean)
          .join(" ")
          .trim();

        return (
          fullName ||
          nameFromList.name ||
          nameFromList.full_name ||
          "Unknown Patient"
        );
      }
    }

    return "Unknown Patient";
  };

  const getPatientMrn = (payment) => {
    // Backend response field
    if (payment?.medical_record_number) {
      return payment.medical_record_number;
    }

    // Fallback if patient object is included
    if (payment?.patient?.medical_record_number) {
      return payment.patient.medical_record_number;
    }

    // Fallback to patients array
    if (payment?.patient_id) {
      const patient = patients.find(
        (item) => item.id === payment.patient_id
      );

      if (patient?.medical_record_number) {
        return patient.medical_record_number;
      }
    }

    return "—";
  };

  return (
    <section
      className="mb-6 overflow-hidden rounded-2xl border bg-[#fffdf8] shadow-sm"
      style={{
        borderColor: "rgba(23, 59, 50, 0.10)",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div
        className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        style={{
          borderColor: "rgba(23, 59, 50, 0.08)",
        }}
      >
        <div>
          <h2
            className="text-lg font-bold"
            style={{ color: "#173B32" }}
          >
            Recent Payments
          </h2>

          <p
            className="mt-1 text-xs"
            style={{ color: "#6f8f7d" }}
          >
            Payments received from patients.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex min-h-10 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5"
          style={{
            backgroundColor: "#173B32",
            color: "#f7f3e9",
          }}
        >
          <span className="mr-2 text-lg leading-none">+</span>
          Add Payment
        </button>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}
      {payments.length === 0 ? (
        <EmptyPaymentsState onAdd={onAdd} />
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-237.5 border-collapse">
            <thead>
              <tr
                style={{
                  backgroundColor: "#f7f3e9",
                  color: "#173B32",
                }}
              >
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide">
                  Patient
                </th>

                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide">
                  Amount
                </th>

                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide">
                  Payment Method
                </th>

                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide">
                  Payment Date
                </th>

                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide">
                  Notes
                </th>

                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => {
                const patientName = getPatientName(payment);
                const patientMrn = getPatientMrn(payment);
                const initial = getPatientInitial(patientName);

                return (
                  <tr
                    key={payment.id}
                    className="border-t transition hover:bg-[#f7f3e9]/50"
                    style={{
                      borderColor: "rgba(23, 59, 50, 0.08)",
                    }}
                  >
                    {/* =================================================
                        PATIENT
                    ================================================= */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                          style={{
                            backgroundColor: "#173B32",
                            color: "#f7f3e9",
                          }}
                        >
                          {initial}
                        </div>

                        {/* Name + MRN */}
                        <div className="min-w-0">
                          <p
                            className="truncate text-sm font-semibold"
                            style={{
                              color: "#173B32",
                            }}
                          >
                            {patientName}
                          </p>

                          <p
                            className="mt-0.5 text-xs"
                            style={{
                              color: "#8a9a91",
                            }}
                          >
                            MRN: {patientMrn}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* =================================================
                        AMOUNT
                    ================================================= */}
                    <td className="px-5 py-4">
                      <span
                        className="text-sm font-bold"
                        style={{
                          color: "#173B32",
                        }}
                      >
                        Rs.{" "}
                        {Number(payment.amount || 0).toLocaleString(
                          "en-PK",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </span>
                    </td>

                    {/* =================================================
                        PAYMENT METHOD
                    ================================================= */}
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor:
                            "rgba(111, 143, 125, 0.14)",
                          color: "#173B32",
                        }}
                      >
                        {formatPaymentMethod(
                          payment.payment_method
                        )}
                      </span>
                    </td>

                    {/* =================================================
                        DATE
                    ================================================= */}
                    <td className="px-5 py-4">
                      <span
                        className="text-sm"
                        style={{
                          color: "#40584f",
                        }}
                      >
                        {formatDate(payment.payment_date)}
                      </span>
                    </td>

                    {/* =================================================
                        NOTES
                    ================================================= */}
                    <td className="max-w-60 px-5 py-4">
                      <span
                        className="block truncate text-sm"
                        title={payment.notes || ""}
                        style={{
                          color: "#6f8f7d",
                        }}
                      >
                        {payment.notes || "—"}
                      </span>
                    </td>

                    {/* =================================================
                        ACTION
                    ================================================= */}
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onDelete(payment)}
                        disabled={
                          deletingPaymentId === payment.id
                        }
                        className="inline-flex h-9 min-w-18 items-center justify-center rounded-lg border px-3 text-xs font-semibold transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        style={{
                          borderColor:
                            "rgba(180, 80, 70, 0.25)",
                          color: "#a3483e",
                        }}
                      >
                        {deletingPaymentId === payment.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* =====================================================
          FOOTER
      ===================================================== */}
      {payments.length > 0 && (
        <div
          className="border-t px-5 py-3"
          style={{
            borderColor: "rgba(23, 59, 50, 0.08)",
            backgroundColor: "#f7f3e9",
          }}
        >
          <p
            className="text-xs"
            style={{
              color: "#6f8f7d",
            }}
          >
            Showing {payments.length} payment
            {payments.length === 1 ? "" : "s"}.
          </p>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyPaymentsState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold"
        style={{
          backgroundColor: "rgba(23, 59, 50, 0.08)",
          color: "#173B32",
        }}
      >
        ₨
      </div>

      <h3
        className="text-sm font-bold"
        style={{
          color: "#173B32",
        }}
      >
        No payments yet
      </h3>

      <p
        className="mt-1 max-w-sm text-sm"
        style={{
          color: "#6f8f7d",
        }}
      >
        Payments received from patients will appear here.
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="mt-5 rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
        style={{
          backgroundColor: "#173B32",
          color: "#f7f3e9",
        }}
      >
        Add First Payment
      </button>
    </div>
  );
}

export default PaymentsSection;