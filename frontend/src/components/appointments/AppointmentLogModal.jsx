import { useMemo } from "react";
import {
  FiCalendar,
  FiDownload,
  FiFileText,
  FiX,
} from "react-icons/fi";
import * as XLSX from "xlsx";

export default function AppointmentLogModal({
  appointments = [],
  onClose,
}) {
  // =========================================================
  // HELPERS
  // =========================================================

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    if (!value) {
      return "-";
    }

    const raw = String(value);

    const match = raw.match(
      /^(\d{1,2}):(\d{2})/
    );

    if (!match) {
      return raw;
    }

    let hours = Number(match[1]);
    const minutes = match[2];

    const suffix =
      hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${suffix}`;
  };

  const formatStatus = (status) => {
    const normalized =
      String(status || "")
        .trim()
        .toLowerCase();

    if (
      normalized === "pending" ||
      normalized === "scheduled"
    ) {
      return "Scheduled";
    }

    if (normalized === "completed") {
      return "Completed";
    }

    if (
      normalized === "cancelled" ||
      normalized === "canceled"
    ) {
      return "Cancelled";
    }

    if (
      normalized === "no_show" ||
      normalized === "no-show" ||
      normalized === "noshow"
    ) {
      return "No Show";
    }

    if (!normalized) {
      return "-";
    }

    return normalized
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const getPatientName = (appointment) => {
    return (
      appointment?.patient_name ||
      appointment?.patient?.full_name ||
      appointment?.patient?.name ||
      "-"
    );
  };

  const getMRN = (appointment) => {
    return (
      appointment?.medical_record_number ||
      appointment?.patient?.medical_record_number ||
      "-"
    );
  };

  const getStaffName = (appointment) => {
    return (
      appointment?.doctor_name ||
      appointment?.doctor?.full_name ||
      appointment?.doctor?.name ||
      appointment?.staff_name ||
      appointment?.staff?.full_name ||
      appointment?.staff?.name ||
      "-"
    );
  };

  // =========================================================
  // LOG ROWS
  // =========================================================

  const logRows = useMemo(() => {
    return appointments.map(
      (appointment, index) => ({
        number: index + 1,
        id: appointment?.id ?? "",
        patientName:
          getPatientName(appointment),
        mrn: getMRN(appointment),
        date: formatDate(
          appointment?.appointment_date
        ),
        time: formatTime(
          appointment?.appointment_time ||
            appointment?.time
        ),
        duration:
          appointment?.duration_minutes
            ? `${appointment.duration_minutes} min`
            : "-",
        staff:
          getStaffName(appointment),
        reason:
          appointment?.reason ||
          "-",
        status:
          formatStatus(
            appointment?.status
          ),
        followUp:
          appointment?.is_follow_up
            ? "Yes"
            : "No",
        notes:
          appointment?.notes || "-",
      })
    );
  }, [appointments]);

  // =========================================================
  // STATS
  // =========================================================

  const stats = useMemo(() => {
    let scheduled = 0;
    let completed = 0;
    let cancelled = 0;
    let noShow = 0;

    appointments.forEach(
      (appointment) => {
        const status =
          String(
            appointment?.status || ""
          )
            .trim()
            .toLowerCase();

        if (
          status === "scheduled" ||
          status === "pending"
        ) {
          scheduled += 1;
        } else if (
          status === "completed"
        ) {
          completed += 1;
        } else if (
          status === "cancelled" ||
          status === "canceled"
        ) {
          cancelled += 1;
        } else if (
          status === "no_show" ||
          status === "no-show" ||
          status === "noshow"
        ) {
          noShow += 1;
        }
      }
    );

    return {
      total: appointments.length,
      scheduled,
      completed,
      cancelled,
      noShow,
    };
  }, [appointments]);

  // =========================================================
  // EXPORT EXCEL
  // =========================================================

  const handleExportExcel = () => {
    if (!appointments.length) {
      return;
    }

    const excelData =
      appointments.map(
        (appointment, index) => ({
          "#":
            index + 1,

          "Appointment ID":
            appointment?.id ?? "",

          "Patient Name":
            getPatientName(appointment),

          "Medical Record Number":
            getMRN(appointment),

          "Appointment Date":
            appointment?.appointment_date ||
            "",

          "Appointment Time":
            appointment?.appointment_time ||
            appointment?.time ||
            "",

          "Duration (Minutes)":
            appointment?.duration_minutes ??
            "",

          "Doctor / Staff":
            getStaffName(appointment),

          "Reason":
            appointment?.reason ||
            "",

          "Status":
            formatStatus(
              appointment?.status
            ),

          "Follow-up":
            appointment?.is_follow_up
              ? "Yes"
              : "No",

          "Notes":
            appointment?.notes ||
            "",
        })
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        excelData
      );

    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 16 },
      { wch: 25 },
      { wch: 24 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 25 },
      { wch: 30 },
      { wch: 16 },
      { wch: 14 },
      { wch: 45 },
    ];

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Appointments"
    );

    const today =
      new Date()
        .toISOString()
        .slice(0, 10);

    XLSX.writeFile(
      workbook,
      `appointment-log-${today}.xlsx`
    );
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-[#173C32]/55 px-3 py-4 backdrop-blur-sm sm:px-5"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[94vh] w-full max-w-375 flex-col overflow-hidden rounded-3xl border border-[#E4DED1] bg-[#FFFDF8] shadow-[0_25px_80px_rgba(23,59,50,0.24)]">

        {/* ================================================= */}
        {/* GOLD TOP LINE */}
        {/* ================================================= */}

        <div className="h-1.5 w-full bg-[#B4935A]" />

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex shrink-0 flex-col gap-4 border-b border-[#E7E1D5] bg-[#173C32] px-5 py-5 sm:px-7 sm:py-6 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#D8C08C]">
              <FiCalendar
                size={22}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Appointment Log
              </h2>

              <p className="mt-1 text-xs text-[#D9E4DE] sm:text-sm">
                Complete appointment records from the clinic.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white lg:static"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* ================================================= */}
        {/* SUMMARY */}
        {/* ================================================= */}

        <div className="shrink-0 border-b border-[#E7E1D5] bg-[#F8F5ED] px-5 py-4 sm:px-7">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">

            <div className="rounded-xl border border-[#E4DED1] bg-[#FFFDF8] px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A958E]">
                Total
              </p>
              <p className="mt-1 text-xl font-bold text-[#173C32]">
                {stats.total}
              </p>
            </div>

            <div className="rounded-xl border border-[#E4DED1] bg-[#FFFDF8] px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A958E]">
                Scheduled
              </p>
              <p className="mt-1 text-xl font-bold text-[#496C59]">
                {stats.scheduled}
              </p>
            </div>

            <div className="rounded-xl border border-[#E4DED1] bg-[#FFFDF8] px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A958E]">
                Completed
              </p>
              <p className="mt-1 text-xl font-bold text-[#557867]">
                {stats.completed}
              </p>
            </div>

            <div className="rounded-xl border border-[#E4DED1] bg-[#FFFDF8] px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A958E]">
                Cancelled
              </p>
              <p className="mt-1 text-xl font-bold text-[#9A6258]">
                {stats.cancelled}
              </p>
            </div>

            <div className="rounded-xl border border-[#E4DED1] bg-[#FFFDF8] px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A958E]">
                No Show
              </p>
              <p className="mt-1 text-xl font-bold text-[#8A6E3D]">
                {stats.noShow}
              </p>
            </div>

          </div>
        </div>

        {/* ================================================= */}
        {/* TABLE */}
        {/* ================================================= */}

        <div className="min-h-0 flex-1 overflow-auto">
          {logRows.length === 0 ? (
            <div className="flex min-h-75 items-center justify-center px-6">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3F0E8] text-[#718078]">
                  <FiFileText size={24} />
                </div>

                <h3 className="mt-4 text-base font-bold text-[#173C32]">
                  No appointments found
                </h3>

                <p className="mt-1 text-sm text-[#718078]">
                  There are no appointment records to show.
                </p>
              </div>
            </div>
          ) : (
            <div className="min-w-375">
              <table className="w-full border-collapse text-left">

                <thead className="sticky top-0 z-10 bg-[#F3F0E8]">
                  <tr className="border-b border-[#DED8CA]">

                    <th className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#68766E]">
                      #
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#68766E]">
                      Patient
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#68766E]">
                      MRN
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#68766E]">
                      Date
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#68766E]">
                      Time
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#68766E]">
                      Duration
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#68766E]">
                      Doctor / Staff
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#68766E]">
                      Reason
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#68766E]">
                      Status
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#68766E]">
                      Follow-up
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#68766E]">
                      Notes
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {logRows.map(
                    (row) => (
                      <tr
                        key={`${row.id}-${row.number}`}
                        className="border-b border-[#ECE7DC] transition-colors hover:bg-[#FAF7F0]"
                      >

                        <td className="px-4 py-4 text-sm font-medium text-[#8A958E]">
                          {row.number}
                        </td>

                        <td className="px-4 py-4">
                          <p className="whitespace-nowrap text-sm font-semibold text-[#173C32]">
                            {row.patientName}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <span className="whitespace-nowrap rounded-lg bg-[#F1EEE5] px-2.5 py-1 text-xs font-semibold text-[#5F7068]">
                            {row.mrn}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-[#53635B]">
                          {row.date}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-[#173C32]">
                          {row.time}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-[#53635B]">
                          {row.duration}
                        </td>

                        <td className="px-4 py-4 text-sm text-[#53635B]">
                          {row.staff}
                        </td>

                        <td className="max-w-65 px-4 py-4 text-sm text-[#53635B]">
                          <span className="line-clamp-2">
                            {row.reason}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`
                              inline-flex
                              whitespace-nowrap
                              rounded-full
                              px-3
                              py-1.5
                              text-xs
                              font-semibold
                              ${
                                row.status ===
                                "Completed"
                                  ? "bg-[#E7F0EA] text-[#3E6650]"
                                  : row.status ===
                                      "Scheduled"
                                    ? "bg-[#EEF3EF] text-[#496C59]"
                                    : row.status ===
                                        "Cancelled"
                                      ? "bg-[#F8EAE7] text-[#98564C]"
                                      : row.status ===
                                          "No Show"
                                        ? "bg-[#F6EEE0] text-[#876B3F]"
                                        : "bg-[#F1EEE5] text-[#66736D]"
                              }
                            `}
                          >
                            {row.status}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-sm font-medium text-[#53635B]">
                          {row.followUp}
                        </td>

                        <td className="max-w-90 px-4 py-4 text-sm text-[#68766E]">
                          <span className="line-clamp-2">
                            {row.notes}
                          </span>
                        </td>

                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>
          )}
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#E7E1D5] bg-[#FFFDF8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">

          <p className="text-xs text-[#8A958E]">
            {appointments.length} appointment
            {appointments.length === 1
              ? ""
              : "s"} in this log
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#D8DED9] bg-[#F5F7F5] px-5 text-sm font-semibold text-[#36564A] transition hover:border-[#B8C8BF] hover:bg-[#EAF0EC] sm:w-auto"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={!appointments.length}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#173C32] px-5 text-sm font-semibold text-white shadow-[0_5px_14px_rgba(23,60,50,0.16)] transition hover:bg-[#245346] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <FiDownload size={16} />

              Export Excel
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}