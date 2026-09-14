import { useState } from "react";
import {
  FiEdit2,
  FiFileText,
  FiTrash2,
} from "react-icons/fi";

import TreatmentStatusBadge from "./TreatmentStatusBadge";
import TreatmentInvoiceModal from "./TreatmentInvoiceModal";

function TreatmentRow({
  treatment,
  onEdit,
  onDelete,
}) {
  const [showInvoice, setShowInvoice] =
    useState(false);

  const rawDate =
    treatment?.date ||
    treatment?.visit_time;

  const formattedDate = rawDate
    ? (() => {
        const date = new Date(rawDate);

        if (Number.isNaN(date.getTime())) {
          return "—";
        }

        return new Intl.DateTimeFormat(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        ).format(date);
      })()
    : "—";

  const patientName =
    treatment?.patient_name ||
    treatment?.patient?.name ||
    "Unknown Patient";

  const patientMrn =
    treatment?.medical_record_number ||
    treatment?.patient_mrn ||
    treatment?.patient
      ?.medical_record_number ||
    "";

  const treatmentName =
    treatment?.treatment ||
    treatment?.diagnosis ||
    "—";

  const cost = Number(
    treatment?.cost ??
      treatment?.charge ??
      0
  );

  const normalizedStatus =
    String(
      treatment?.status || "IN_PROGRESS"
    )
      .toUpperCase()
      .replace(/-/g, "_")
      .replace(/\s+/g, "_");

  return (
    <>
      <tr className="border-b border-[#E9E4DA] bg-[#FFFDF8] transition hover:bg-[#FBF9F3]">
        {/* PATIENT */}
        <td className="whitespace-nowrap px-5 py-4">
          <div>
            <p className="font-semibold text-[#263B33]">
              {patientName}
            </p>

            {patientMrn && (
              <p className="mt-0.5 text-xs text-[#7D8881]">
                MRN: {patientMrn}
              </p>
            )}
          </div>
        </td>

        {/* TREATMENT */}
        <td className="max-w-65 px-5 py-4">
          <p className="truncate font-medium text-[#45524A]">
            {treatmentName}
          </p>

          {treatment?.chief_complaint && (
            <p className="mt-0.5 truncate text-xs text-[#8A938D]">
              {treatment.chief_complaint}
            </p>
          )}
        </td>

        {/* DATE */}
        <td className="whitespace-nowrap px-5 py-4 text-sm text-[#66736B]">
          {formattedDate}
        </td>

        {/* COST */}
        <td className="whitespace-nowrap px-5 py-4">
          <span className="font-semibold text-[#173B32]">
            PKR{" "}
            {cost.toLocaleString("en-PK", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </span>
        </td>

        {/* STATUS */}
        <td className="whitespace-nowrap px-5 py-4">
          <TreatmentStatusBadge
            status={normalizedStatus}
          />
        </td>

        {/* ACTIONS */}
        <td className="whitespace-nowrap px-5 py-4">
          <div className="flex items-center gap-2">
            {/* INVOICE */}
            <button
              type="button"
              onClick={() =>
                setShowInvoice(true)
              }
              title="View / download invoice"
              aria-label="View / download invoice"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D9C79E] bg-[#FCF8EE] text-[#8A6B32] transition hover:border-[#B4935A] hover:bg-[#F8F2E5]"
            >
              <FiFileText size={15} />
            </button>

            {/* EDIT */}
            <button
              type="button"
              onClick={() => {
                if (typeof onEdit === "function") {
                  onEdit(treatment);
                }
              }}
              title="Edit treatment"
              aria-label="Edit treatment"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D5DFDA] bg-[#F1F5F2] text-[#315D4B] transition hover:border-[#AFC5B9] hover:bg-[#E8F1EB]"
            >
              <FiEdit2 size={15} />
            </button>

            {/* DELETE */}
            <button
              type="button"
              onClick={() => {
                if (
                  typeof onDelete ===
                  "function"
                ) {
                  onDelete(treatment);
                }
              }}
              title="Delete treatment"
              aria-label="Delete treatment"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E7CFCB] bg-[#FBF1EF] text-[#9A4E43] transition hover:border-[#D9ADA6] hover:bg-[#F8E9E6]"
            >
              <FiTrash2 size={15} />
            </button>
          </div>
        </td>
      </tr>

      <TreatmentInvoiceModal
        open={showInvoice}
        treatment={treatment}
        onClose={() =>
          setShowInvoice(false)
        }
      />
    </>
  );
}

export default TreatmentRow;