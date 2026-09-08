import {
  FiPlus,
  FiList,
  FiCalendar,
} from "react-icons/fi";

function AppointmentHeader({
  onAddAppointment,
  viewMode,
  onViewModeChange,
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

      <div>
        <h1 className="text-4xl font-bold text-[#2F3A32]">
          Appointments
        </h1>

        <p className="mt-2 text-[#7A827C]">
          Manage clinic appointments and schedules.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

        <div
          className="
            flex items-center
            rounded-xl
            border border-[#DDE5DB]
            bg-white
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
                  ? "bg-[#294936] text-white shadow-sm"
                  : "text-[#6B756D] hover:bg-[#EEF3EC] hover:text-[#294936]"
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
                  ? "bg-[#294936] text-white shadow-sm"
                  : "text-[#6B756D] hover:bg-[#EEF3EC] hover:text-[#294936]"
              }
            `}
          >
            <FiCalendar size={17} />
            Calendar
          </button>
        </div>

        <button
          type="button"
          onClick={onAddAppointment}
          className="
            flex
            items-center
            justify-center
            gap-2
            bg-[#294936]
            text-white
            px-5
            py-3
            rounded-xl
            shadow-sm
            hover:bg-[#203A2B]
            hover:shadow-md
            transition-all
            duration-300
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
