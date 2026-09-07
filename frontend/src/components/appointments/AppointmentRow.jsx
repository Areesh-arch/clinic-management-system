
import {
  FiEye,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

import AppointmentStatusBadge from "./AppointmentStatusBadge";

function AppointmentRow({
  appointment,
  statusLabel,
  onView,
  onEdit,
  onDelete,
}) {
  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // TIME
  // ==========================================

  const formatTime = (value) => {
    if (!value) {
      return "-";
    }

    const [hours, minutes] = String(value).split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // ==========================================
  // PATIENT
  // ==========================================

  const patientName =
    appointment?.patient_name ||
    appointment?.patient?.full_name ||
    appointment?.patient?.name ||
    "";

  const patientMrn =
    appointment?.medical_record_number ||
    appointment?.patient?.medical_record_number ||
    "";

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <tr
      className="
        border-b
        border-slate-100
        hover:bg-[#FAFCF9]
        transition-all
        duration-200
        group
      "
    >
      {/* ====================================
          PATIENT
      ==================================== */}

      <td
        className="
          px-7
          py-6
          whitespace-nowrap
        "
      >
        {patientName ? (
          <div>
            <div
              className="
                font-semibold
                text-[#193B63]
              "
            >
              {patientName}
            </div>

            {patientMrn && (
              <div
                className="
                  text-xs
                  text-slate-500
                  mt-1
                "
              >
                {patientMrn}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div
              className="
                font-semibold
                text-[#193B63]
              "
            >
              Patient #{appointment?.patient_id}
            </div>

            <div
              className="
                text-xs
                text-slate-400
                mt-1
              "
            >
              Patient details loading
            </div>
          </div>
        )}
      </td>

      {/* ====================================
          DATE
      ==================================== */}

      <td
        className="
          px-5
          py-6
          text-slate-600
          whitespace-nowrap
        "
      >
        {formatDate(
          appointment?.appointment_date
        )}
      </td>

      {/* ====================================
          TIME
      ==================================== */}

      <td
        className="
          px-5
          py-6
          text-slate-600
          font-medium
          whitespace-nowrap
        "
      >
        {formatTime(
          appointment?.appointment_time
        )}
      </td>

      {/* ====================================
          REASON
      ==================================== */}

      <td
        className="
          px-5
          py-6
          text-slate-600
          max-w-65
        "
      >
        <span
          className="
            block
            truncate
          "
          title={
            appointment?.reason || "-"
          }
        >
          {appointment?.reason || "-"}
        </span>

        {appointment?.is_follow_up === true && (
          <span
            className="
              inline-flex
              mt-2
              px-2.5
              py-1
              rounded-full
              bg-[#EEF4EA]
              text-[#556B55]
              text-xs
              font-medium
            "
          >
            Follow-up
          </span>
        )}
      </td>

      {/* ====================================
          STATUS
      ==================================== */}

      <td
        className="
          px-5
          py-6
        "
      >
        <AppointmentStatusBadge
          status={statusLabel}
        />
      </td>

      {/* ====================================
          ACTIONS
      ==================================== */}

      <td
        className="
          px-7
          py-6
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          {/* VIEW */}

          <button
            type="button"
            onClick={() => {
              if (onView) {
                onView(appointment);
              }
            }}
            title="View appointment"
            className="
              w-11
              h-11
              rounded-xl
              bg-[#F5F8F5]
              text-[#5B7898]
              flex
              items-center
              justify-center
              hover:bg-[#EAF1E8]
              hover:text-[#556B55]
              hover:-translate-y-0.5
              transition-all
              duration-200
            "
          >
            <FiEye size={19} />
          </button>

          {/* EDIT */}

          <button
            type="button"
            onClick={() => {
              if (onEdit) {
                onEdit(appointment);
              }
            }}
            title="Edit appointment"
            className="
              w-11
              h-11
              rounded-xl
              bg-[#F5F8F5]
              text-[#5B7898]
              flex
              items-center
              justify-center
              hover:bg-blue-50
              hover:text-blue-600
              hover:-translate-y-0.5
              transition-all
              duration-200
            "
          >
            <FiEdit size={19} />
          </button>

          {/* DELETE */}

          <button
            type="button"
            onClick={() => {
              if (onDelete) {
                onDelete(appointment);
              }
            }}
            title="Delete appointment"
            className="
              w-11
              h-11
              rounded-xl
              bg-[#FBF6F6]
              text-[#7D8795]
              flex
              items-center
              justify-center
              hover:bg-red-50
              hover:text-red-600
              hover:-translate-y-0.5
              transition-all
              duration-200
            "
          >
            <FiTrash2 size={19} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default AppointmentRow;
