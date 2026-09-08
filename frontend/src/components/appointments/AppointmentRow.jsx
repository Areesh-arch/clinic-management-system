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
  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(
      `${value}T00:00:00`
    );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (value) => {
    if (!value) return "-";

    const [hours, minutes] =
      String(value).split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  const patientName =
    appointment?.patient_name ||
    appointment?.patient?.full_name ||
    appointment?.patient?.name ||
    "";

  const patientMrn =
    appointment?.medical_record_number ||
    appointment?.patient?.medical_record_number ||
    "";

  return (
    <tr className="border-b border-[#E8ECE6] hover:bg-[#FAFCF9] transition-all duration-200 group">

      <td className="px-7 py-6 whitespace-nowrap">
        {patientName ? (
          <div>
            <div className="font-semibold text-[#294936]">
              {patientName}
            </div>

            {patientMrn && (
              <div className="text-xs text-[#7A827C] mt-1">
                {patientMrn}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="font-semibold text-[#294936]">
              Patient #{appointment?.patient_id}
            </div>

            <div className="text-xs text-[#9AA19B] mt-1">
              Patient details loading
            </div>
          </div>
        )}
      </td>

      <td className="px-5 py-6 text-[#69736B] whitespace-nowrap">
        {formatDate(
          appointment?.appointment_date
        )}
      </td>

      <td className="px-5 py-6 text-[#69736B] font-medium whitespace-nowrap">
        {formatTime(
          appointment?.appointment_time
        )}
      </td>

      <td className="px-5 py-6 text-[#69736B] max-w-65">
        <span
          className="block truncate"
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
              px-2.5 py-1
              rounded-full
              bg-[#EEF3EC]
              text-[#647760]
              text-xs
              font-medium
            "
          >
            Follow-up
          </span>
        )}
      </td>

      <td className="px-5 py-6">
        <AppointmentStatusBadge
          status={statusLabel}
        />
      </td>

      <td className="px-7 py-6">
        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() => {
              if (onView) {
                onView(
                  appointment
                );
              }
            }}
            title="View appointment"
            className="
              w-11 h-11
              rounded-xl
              bg-[#F1F5EF]
              text-[#647760]
              flex
              items-center
              justify-center
              hover:bg-[#E5EEE2]
              hover:text-[#294936]
              hover:-translate-y-0.5
              transition-all
              duration-200
            "
          >
            <FiEye size={19} />
          </button>

          <button
            type="button"
            onClick={() => {
              if (onEdit) {
                onEdit(
                  appointment
                );
              }
            }}
            title="Edit appointment"
            className="
              w-11 h-11
              rounded-xl
              bg-[#F1F5EF]
              text-[#647760]
              flex
              items-center
              justify-center
              hover:bg-[#E5EEE2]
              hover:text-[#294936]
              hover:-translate-y-0.5
              transition-all
              duration-200
            "
          >
            <FiEdit size={19} />
          </button>

          <button
            type="button"
            onClick={() => {
              if (onDelete) {
                onDelete(
                  appointment
                );
              }
            }}
            title="Delete appointment"
            className="
              w-11 h-11
              rounded-xl
              bg-[#FAF1F1]
              text-[#8B6868]
              flex
              items-center
              justify-center
              hover:bg-[#F8E6E6]
              hover:text-[#9A5555]
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
