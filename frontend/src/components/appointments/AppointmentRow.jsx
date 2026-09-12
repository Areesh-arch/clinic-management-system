
import { FiEye, FiEdit, FiTrash2, FiUser } from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import AppointmentStatusBadge from "./AppointmentStatusBadge";

function AppointmentRow({
  appointment,
  onView,
  onEdit,
  onDelete,
  sourceLabel,
  sourceBadgeClass,
}) {
  const navigate = useNavigate();

  // =====================================================
  // PATIENT DATA
  // =====================================================

  const patientId =
    appointment?.patient_id ??
    appointment?.patient?.id;

  const patientName =
    appointment?.patient_name ||
    appointment?.patient?.full_name ||
    appointment?.patient?.name ||
    "Unknown Patient";

  const medicalRecordNumber =
    appointment?.medical_record_number ||
    appointment?.patient?.medical_record_number ||
    "—";

  // =====================================================
  // DATE
  // =====================================================

  const formattedDate = appointment?.appointment_date
    ? new Date(
        `${appointment.appointment_date}T00:00:00`
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  // =====================================================
  // TIME
  // =====================================================

  const formattedTime = appointment?.appointment_time
    ? new Date(
        `1970-01-01T${appointment.appointment_time}`
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  // =====================================================
  // STATUS
  // =====================================================

  const normalizedStatus = String(
    appointment?.status || "scheduled"
  )
    .toLowerCase()
    .replace(/-/g, "_");

  // =====================================================
  // SOURCE
  // =====================================================

  const normalizedSource = String(
    appointment?.source || "clinic"
  )
    .trim()
    .toLowerCase();

  const displaySource =
    sourceLabel ||
    (() => {
      switch (normalizedSource) {
        case "website":
          return "Website";

        case "walk_in":
        case "walk-in":
          return "Walk-in";

        case "clinic":
        default:
          return "Clinic";
      }
    })();

  const displaySourceBadgeClass =
    sourceBadgeClass ||
    (() => {
      switch (normalizedSource) {
        case "website":
          return "border-[#C9DDD2] bg-[#EDF5F0] text-[#365C4F]";

        case "walk_in":
        case "walk-in":
          return "border-[#E5D6B9] bg-[#F8F2E5] text-[#8A6B32]";

        case "clinic":
        default:
          return "border-[#D5DFDA] bg-[#F1F5F2] text-[#173B32]";
      }
    })();

  // =====================================================
  // PROFILE
  // =====================================================

  const handleProfile = () => {
    if (!patientId) {
      return;
    }

    navigate(`/patients/${patientId}`, {
      state: {
        from: "/appointments",
      },
    });
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <tr
      className="
        border-b
        border-[#E5DED0]
        last:border-b-0
        odd:bg-[#F1F5F2]
        even:bg-[#FFFDF8]
        hover:bg-[#E5EEE8]
        transition-colors
        duration-200
      "
    >
      {/* =================================================
          PATIENT
      ================================================= */}

      <td className="px-7 py-4">
        <div className="flex flex-col">
          <span
            className="
              font-semibold
              text-[#173B32]
            "
          >
            {patientName}
          </span>

          <span
            className="
              mt-1
              text-xs
              font-medium
              text-[#7A8780]
            "
          >
            {medicalRecordNumber}
          </span>
        </div>
      </td>

      {/* =================================================
          DATE
      ================================================= */}

      <td
        className="
          whitespace-nowrap
          px-5
          py-4
          text-sm
          font-medium
          text-[#4D5B54]
        "
      >
        {formattedDate}
      </td>

      {/* =================================================
          TIME
      ================================================= */}

      <td
        className="
          whitespace-nowrap
          px-5
          py-4
          text-sm
          font-medium
          text-[#4D5B54]
        "
      >
        {formattedTime}
      </td>

      {/* =================================================
          REASON
      ================================================= */}

      <td className="px-5 py-4">
        <div className="flex flex-col gap-1.5">
          <span
            className="
              text-sm
              font-medium
              text-[#4D5B54]
            "
          >
            {appointment?.reason || "—"}
          </span>

          {appointment?.is_follow_up && (
            <span
              className="
                inline-flex
                w-fit
                items-center
                rounded-full
                border
                border-[#D5E1D9]
                bg-[#E7EFEA]
                px-2.5
                py-0.5
                text-[11px]
                font-semibold
                text-[#496A5A]
              "
            >
              Follow-up
            </span>
          )}
        </div>
      </td>

      {/* =================================================
          SOURCE
      ================================================= */}

      <td className="px-5 py-4">
        <span
          className={`
            inline-flex
            items-center
            rounded-full
            border
            px-3
            py-1
            text-[11px]
            font-bold
            tracking-wide
            ${displaySourceBadgeClass}
          `}
        >
          {displaySource}
        </span>
      </td>

      {/* =================================================
          STATUS
      ================================================= */}

      <td className="px-5 py-4">
        <AppointmentStatusBadge
          status={normalizedStatus}
        />
      </td>

      {/* =================================================
          ACTIONS
      ================================================= */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">

          {/* PROFILE */}

          <button
            type="button"
            onClick={handleProfile}
            disabled={!patientId}
            title="Patient Profile"
            className={`
              inline-flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              transition-all
              duration-200
              ${
                patientId
                  ? "border-[#C9D8CF] bg-[#F7FAF8] text-[#527565] hover:border-[#6F8F7D] hover:bg-[#E5EEE8] hover:text-[#173B32]"
                  : "cursor-not-allowed border-[#E8E8E8] bg-[#F7F7F7] text-[#B5B5B5]"
              }
            `}
          >
            <FiUser size={15} />
          </button>

          {/* VIEW */}

          <button
            type="button"
            onClick={() => onView(appointment)}
            title="View Appointment"
            className="
              inline-flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-[#C9D8CF]
              bg-[#F7FAF8]
              text-[#527565]
              transition-all
              duration-200
              hover:border-[#6F8F7D]
              hover:bg-[#E5EEE8]
              hover:text-[#173B32]
            "
          >
            <FiEye size={15} />
          </button>

          {/* EDIT */}

          <button
            type="button"
            onClick={() => onEdit(appointment)}
            title="Edit Appointment"
            className="
              inline-flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-[#DCCBA8]
              bg-[#FBF8EF]
              text-[#947844]
              transition-all
              duration-200
              hover:border-[#B4935A]
              hover:bg-[#F3EBDD]
              hover:text-[#765E32]
            "
          >
            <FiEdit size={15} />
          </button>

          {/* DELETE */}

          <button
            type="button"
            onClick={() => onDelete(appointment)}
            title="Delete Appointment"
            className="
              inline-flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-[#E5CEC8]
              bg-[#FCF7F5]
              text-[#A15D50]
              transition-all
              duration-200
              hover:border-[#C98A7D]
              hover:bg-[#F7EAE6]
              hover:text-[#8D4337]
            "
          >
            <FiTrash2 size={15} />
          </button>

        </div>
      </td>
    </tr>
  );
}

export default AppointmentRow;
