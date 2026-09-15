import {
  FiPlus,
  FiList,
  FiCalendar,
  FiArchive,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

function AppointmentHeader({
  onAddAppointment,
  viewMode,
  onViewModeChange,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

      <div>
        <h1 className="text-4xl font-bold text-[#173B32]">
          Appointments
        </h1>

        <p className="mt-2 text-[#6F7D74]">
          Manage clinic appointments and schedules.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

        <div
          className="
            flex items-center
            rounded-xl
            border border-[#DDE5DB]
            bg-[#FFFDF8]
            p-1
            shadow-sm
          "
        >
          <button
            type="button"
            onClick={() =>
              onViewModeChange("table")
            }
            className={`
              flex items-center
              justify-center
              gap-2
              rounded-lg
              px-4
              py-2.5
              text-sm
              font-semibold
              transition-all
              duration-200
              ${
                viewMode === "table"
                  ? "bg-[#173B32] text-white shadow-sm"
                  : "text-[#6B756D] hover:bg-[#EEF3EC] hover:text-[#173B32]"
              }
            `}
          >
            <FiList size={17} />
            Table
          </button>

          <button
            type="button"
            onClick={() =>
              onViewModeChange("calendar")
            }
            className={`
              flex items-center
              justify-center
              gap-2
              rounded-lg
              px-4
              py-2.5
              text-sm
              font-semibold
              transition-all
              duration-200
              ${
                viewMode === "calendar"
                  ? "bg-[#173B32] text-white shadow-sm"
                  : "text-[#6B756D] hover:bg-[#EEF3EC] hover:text-[#173B32]"
              }
            `}
          >
            <FiCalendar size={17} />
            Calendar
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/appointments/archive")
          }
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-[#B4935A]
            bg-[#FFFDF8]
            px-5
            py-3
            text-[#173B32]
            shadow-sm
            transition-all
            duration-300
            hover:bg-[#F8F1E4]
            hover:shadow-md
          "
        >
          <FiArchive size={17} />
          Archive
        </button>

        <button
          type="button"
          onClick={onAddAppointment}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#173B32]
            px-5
            py-3
            text-white
            shadow-sm
            transition-all
            duration-300
            hover:bg-[#102D26]
            hover:shadow-md
          "
        >
          <FiPlus size={18} />
          New Appointment
        </button>

      </div>
    </div>
  );
}

export default AppointmentHeader;