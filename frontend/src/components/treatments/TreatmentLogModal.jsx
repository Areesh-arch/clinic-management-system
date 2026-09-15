import { useMemo, useState } from "react";
import {
  FiDownload,
  FiFileText,
  FiX,
  FiSearch,
} from "react-icons/fi";
import * as XLSX from "xlsx";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(status) {
  const normalized = String(status || "")
    .trim()
    .toUpperCase();

  switch (normalized) {
    case "COMPLETED":
      return "Completed";

    case "IN_PROGRESS":
    case "IN-PROGRESS":
    case "IN PROGRESS":
      return "In Progress";

    case "CANCELLED":
    case "CANCELED":
      return "Cancelled";

    case "PENDING":
      return "Pending";

    default:
      return normalized
        ? normalized
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (letter) =>
              letter.toUpperCase()
            )
        : "—";
  }
}

function getStatusClass(status) {
  const normalized = String(status || "")
    .trim()
    .toUpperCase();

  if (normalized === "COMPLETED") {
    return "border-[#C8DED1] bg-[#EDF6F0] text-[#35654D]";
  }

  if (
    normalized === "IN_PROGRESS" ||
    normalized === "IN-PROGRESS" ||
    normalized === "IN PROGRESS"
  ) {
    return "border-[#E5D5B7] bg-[#FBF6EA] text-[#8A6B32]";
  }

  if (
    normalized === "CANCELLED" ||
    normalized === "CANCELED"
  ) {
    return "border-[#E7C9C3] bg-[#FBF0EE] text-[#984E42]";
  }

  return "border-[#D9E1DC] bg-[#F2F5F3] text-[#52655C]";
}

export default function TreatmentLogModal({
  treatments = [],
  onClose,
}) {
  const [search, setSearch] = useState("");

  const filteredTreatments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return treatments;
    }

    return treatments.filter((item) => {
      const values = [
        item?.patient_name,
        item?.medical_record_number,
        item?.patient_mrn,
        item?.treatment,
        item?.diagnosis,
        item?.chief_complaint,
        item?.notes,
        item?.status,
      ];

      return values.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [treatments, search]);

  const total = treatments.length;

  const completed = treatments.filter(
    (item) =>
      String(item?.status || "").toUpperCase() ===
      "COMPLETED"
  ).length;

  const inProgress = treatments.filter((item) => {
    const status = String(
      item?.status || ""
    ).toUpperCase();

    return (
      status === "IN_PROGRESS" ||
      status === "IN-PROGRESS" ||
      status === "IN PROGRESS"
    );
  }).length;

  const cancelled = treatments.filter((item) => {
    const status = String(
      item?.status || ""
    ).toUpperCase();

    return (
      status === "CANCELLED" ||
      status === "CANCELED"
    );
  }).length;

  const exportExcel = () => {
    const rows = treatments.map((item, index) => ({
      "#": index + 1,
      "Patient Name":
        item?.patient_name || "Unknown patient",
      "Medical Record Number":
        item?.medical_record_number ||
        item?.patient_mrn ||
        "",
      "Treatment":
        item?.treatment ||
        item?.diagnosis ||
        "",
      "Date": formatDate(item?.date),
      "Status": formatStatus(item?.status),
      "Charge": Number(item?.charge ?? item?.cost ?? 0),
      "Chief Complaint":
        item?.chief_complaint || "",
      "Notes":
        item?.notes || "",
    }));

    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 28 },
      { wch: 20 },
      { wch: 30 },
      { wch: 16 },
      { wch: 16 },
      { wch: 14 },
      { wch: 32 },
      { wch: 45 },
    ];

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Treatment Log"
    );

    const today =
      new Date().toISOString().split("T")[0];

    XLSX.writeFile(
      workbook,
      `treatment-log-${today}.xlsx`
    );
  };

  return (
    <div
      className="
        fixed inset-0 z-110
        flex items-center justify-center
        bg-[#173B32]/60
        px-3 py-4 sm:px-5 sm:py-6
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="treatment-log-title"
        className="
          flex
          max-h-[94vh]
          w-full
          max-w-7xl
          flex-col
          overflow-hidden
          rounded-3xl
          border border-[#E3DED2]
          bg-[#FFFDF8]
          shadow-[0_25px_80px_rgba(23,59,50,0.28)]
        "
      >
        {/* GOLD TOP LINE */}
        <div className="h-1.5 w-full bg-[#B4935A]" />

        {/* HEADER */}
        <div
          className="
            flex shrink-0
            flex-col gap-4
            border-b border-[#E3DED2]
            bg-[#173B32]
            px-5 py-5
            sm:flex-row sm:items-center
            sm:justify-between
            sm:px-7
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-xl
                bg-white/10
                text-[#E5D0A3]
              "
            >
              <FiFileText size={20} />
            </div>

            <div>
              <h2
                id="treatment-log-title"
                className="
                  text-lg font-bold
                  tracking-tight text-white
                  sm:text-xl
                "
              >
                Treatment Log
              </h2>

              <p className="mt-0.5 text-xs text-white/65">
                Complete treatment records and export
                them to Excel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportExcel}
              disabled={!treatments.length}
              className="
                inline-flex h-10
                items-center justify-center
                gap-2 rounded-xl
                border border-[#C7A96B]
                bg-[#B4935A]
                px-4
                text-sm font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-[#A3834D]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <FiDownload size={16} />
              <span>Export Excel</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close treatment log"
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                border border-white/10
                bg-white/10
                text-white/80
                transition
                hover:bg-white/15
                hover:text-white
              "
            >
              <FiX size={19} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* SUMMARY */}
          <div
            className="
              grid grid-cols-2
              gap-3
              border-b border-[#E3DED2]
              bg-[#FAF8F2]
              p-4
              sm:grid-cols-4
              sm:p-5
            "
          >
            <SummaryCard
              label="Total"
              value={total}
            />

            <SummaryCard
              label="Completed"
              value={completed}
            />

            <SummaryCard
              label="In Progress"
              value={inProgress}
            />

            <SummaryCard
              label="Cancelled"
              value={cancelled}
            />
          </div>

          {/* SEARCH */}
          <div className="border-b border-[#E8E3D8] px-4 py-4 sm:px-5">
            <div className="relative max-w-md">
              <FiSearch
                size={17}
                className="
                  pointer-events-none
                  absolute left-3.5 top-1/2
                  -translate-y-1/2
                  text-[#89948E]
                "
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search patient, MRN, treatment..."
                className="
                  h-11 w-full
                  rounded-xl
                  border border-[#DCD8CE]
                  bg-white
                  pl-10 pr-4
                  text-sm
                  text-[#173B32]
                  outline-none
                  transition
                  placeholder:text-[#9AA39E]
                  focus:border-[#6F8F7D]
                  focus:ring-2
                  focus:ring-[#6F8F7D]/15
                "
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-262.5 w-full border-collapse">
              <thead>
                <tr
                  className="
                    border-b border-[#DDD8CC]
                    bg-[#F5F2EA]
                    text-left
                  "
                >
                  <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7A867F]">
                    #
                  </th>

                  <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7A867F]">
                    Patient
                  </th>

                  <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7A867F]">
                    MRN
                  </th>

                  <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7A867F]">
                    Treatment
                  </th>

                  <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7A867F]">
                    Date
                  </th>

                  <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7A867F]">
                    Status
                  </th>

                  <th className="px-4 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-[#7A867F]">
                    Charge
                  </th>

                  <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7A867F]">
                    Notes
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTreatments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0F4F1] text-[#6F8F7D]">
                        <FiFileText size={20} />
                      </div>

                      <p className="mt-4 text-sm font-semibold text-[#173B32]">
                        No treatment records found
                      </p>

                      <p className="mt-1 text-xs text-[#89948E]">
                        Try another search term.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredTreatments.map(
                    (item, index) => (
                      <tr
                        key={
                          item?.id ??
                          `treatment-${index}`
                        }
                        className="
                          border-b border-[#EEEAE1]
                          transition
                          hover:bg-[#FAF8F2]
                        "
                      >
                        <td className="px-5 py-4 text-xs font-semibold text-[#7D8982]">
                          {index + 1}
                        </td>

                        <td className="px-4 py-4">
                          <p className="max-w-47.5 truncate text-sm font-semibold text-[#173B32]">
                            {item?.patient_name ||
                              "Unknown patient"}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <span className="font-mono text-xs font-medium text-[#68766E]">
                            {item?.medical_record_number ||
                              item?.patient_mrn ||
                              "—"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <p className="max-w-47.5 truncate text-sm font-medium text-[#36564A]">
                            {item?.treatment ||
                              item?.diagnosis ||
                              "—"}
                          </p>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#68766E]">
                          {formatDate(item?.date)}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`
                              inline-flex
                              rounded-full
                              border
                              px-2.5 py-1
                              text-[10px]
                              font-bold
                              uppercase
                              tracking-wide
                              ${getStatusClass(
                                item?.status
                              )}
                            `}
                          >
                            {formatStatus(
                              item?.status
                            )}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-right whitespace-nowrap">
                          <span className="text-sm font-bold text-[#173B32]">
                            Rs.{" "}
                            {Number(
                              item?.charge ??
                                item?.cost ??
                                0
                            ).toLocaleString()}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <p className="max-w-65 truncate text-xs text-[#77847D]">
                            {item?.notes || "—"}
                          </p>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div
            className="
              flex flex-col gap-2
              border-t border-[#E3DED2]
              bg-[#FAF8F2]
              px-5 py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <p className="text-xs text-[#7D8982]">
              Showing{" "}
              <span className="font-bold text-[#173B32]">
                {filteredTreatments.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#173B32]">
                {treatments.length}
              </span>{" "}
              treatment records
            </p>

            <p className="text-[11px] text-[#9AA39E]">
              Excel export includes all treatment records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div
      className="
        rounded-2xl
        border border-[#E4DED1]
        bg-[#FFFDF8]
        px-4 py-3
      "
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A958E]">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-[#173B32]">
        {value}
      </p>
    </div>
  );
}