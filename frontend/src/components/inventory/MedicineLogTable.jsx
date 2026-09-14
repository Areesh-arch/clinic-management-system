
import {
  FiEdit2,
  FiFileText,
  FiTrash2,
} from "react-icons/fi";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(value) {
  const amount = Number(value || 0);

  return `Rs. ${amount.toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function MedicineLogTable({
  records = [],
  loading = false,
  onSlip,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] shadow-[0_4px_20px_rgba(23,60,50,0.04)]">
        <div className="border-b border-[#E7E1D5] px-6 py-5">
          <div className="h-5 w-40 animate-pulse rounded bg-[#EEEAE1]" />
          <div className="mt-2 h-3 w-64 animate-pulse rounded bg-[#F1EEE7]" />
        </div>

        <div className="space-y-4 p-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-12 animate-pulse rounded-lg bg-[#F1EEE7]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] px-6 py-16 text-center shadow-[0_4px_20px_rgba(23,60,50,0.04)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E3EEE6] text-[#496C59]">
          <FiFileText size={22} />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-[#173C32]">
          No medicine history yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-[#7D8882]">
          Medicines issued to patients will automatically appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] shadow-[0_4px_20px_rgba(23,60,50,0.04)]">
      {/* HEADER */}
      <div className="flex flex-col gap-3 border-b border-[#E7E1D5] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#173C32]">
            Medicine Log
          </h2>

          <p className="mt-1 text-sm text-[#818B85]">
            Patient medicine issuance history
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#718078]">
          <span className="h-2 w-2 rounded-full bg-[#8FAF9A]" />

          {records.length}{" "}
          {records.length === 1 ? "record" : "records"}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-262.5">
          <thead>
            <tr className="border-b border-[#E7E1D5] bg-[#F6F3EB]">
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
                Patient
              </th>

              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
                Date
              </th>

              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
                Medicine
              </th>

              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
                Qty
              </th>

              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
                Dosage
              </th>

              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
                Duration
              </th>

              <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
                Amount
              </th>

              <th className="px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#ECE7DD]">
            {records.map((record, index) => (
              <tr
                key={
                  record.prescription_item_id ||
                  `${record.patient_id}-${record.medicine_name}-${record.date}-${index}`
                }
                className="group transition-colors hover:bg-[#F9F7F1]"
              >
                {/* PATIENT */}
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-[#173C32]">
                      {record.patient_name || "Unknown Patient"}
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-[#8A938E]">
                      {record.medical_record_number || "No MRN"}
                    </p>
                  </div>
                </td>

                {/* DATE */}
                <td className="px-6 py-4 text-sm text-[#52645B]">
                  {formatDate(record.date)}
                </td>

                {/* MEDICINE */}
                <td className="px-6 py-4">
                  <div>
                    <span className="font-semibold text-[#29483D]">
                      {record.medicine_name || "—"}
                    </span>

                    {record.medicine_unit && (
                      <p className="mt-0.5 text-xs text-[#8A938E]">
                        Per {record.medicine_unit}
                      </p>
                    )}
                  </div>
                </td>

                {/* QTY */}
                <td className="px-6 py-4">
                  <span className="inline-flex min-w-9 items-center justify-center rounded-lg bg-[#E8EFEA] px-2.5 py-1 text-sm font-semibold text-[#416B51]">
                    {record.quantity || 0}
                  </span>
                </td>

                {/* DOSAGE */}
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm text-[#52645B]">
                      {record.dosage || "—"}
                    </p>

                    {record.frequency && (
                      <p className="mt-0.5 text-xs text-[#8A938E]">
                        {record.frequency}
                      </p>
                    )}
                  </div>
                </td>

                {/* DURATION */}
                <td className="px-6 py-4 text-sm text-[#52645B]">
                  {record.duration || "—"}
                </td>

                {/* AMOUNT */}
                <td className="px-6 py-4 text-right">
                  <span className="font-semibold text-[#29483D]">
                    {formatAmount(record.amount)}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* INVOICE */}
                    <button
                      type="button"
                      onClick={() => onSlip?.(record)}
                      title="View invoice"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D8C69F] bg-[#FBF7EA] text-[#9A7A3F] transition-all hover:border-[#B4935A] hover:bg-[#F4EEDB] hover:text-[#7D622E]"
                    >
                      <FiFileText size={16} />
                    </button>

                    {/* EDIT */}
                    <button
                      type="button"
                      onClick={() => onEdit?.(record)}
                      title="Edit medicine"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#C9D9CE] bg-[#F1F6F2] text-[#416B51] transition-all hover:border-[#8FAF9A] hover:bg-[#E4EEE7] hover:text-[#29483D]"
                    >
                      <FiEdit2 size={15} />
                    </button>

                    {/* DELETE */}
                    <button
                      type="button"
                      onClick={() => onDelete?.(record)}
                      title="Delete medicine"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E6D0CC] bg-[#FCF3F1] text-[#A45E54] transition-all hover:border-[#C98A82] hover:bg-[#F7E7E4] hover:text-[#8E4B42]"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="border-t border-[#E7E1D5] bg-[#FAF8F2] px-6 py-3">
        <p className="text-xs text-[#8A938E]">
          Medicine records are generated automatically when medicines are
          issued from clinic inventory.
        </p>
      </div>
    </div>
  );
}
