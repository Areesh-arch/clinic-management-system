import {
  FiCalendar,
  FiClock,
  FiUser,
  FiBriefcase,
  FiFileText,
  FiEdit,
} from "react-icons/fi";


function AppointmentDetails({
  appointment,
  onClose,
  onEdit,
}) {


  if (!appointment) {
    return null;
  }


  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (value) => {

    if (!value) {
      return "-";
    }


    const date =
      new Date(
        `${value}T00:00:00`
      );


    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // ==========================================
  // TIME
  // ==========================================

  const formatTime = (value) => {

    if (!value) {
      return "-";
    }


    const [
      hours,
      minutes,
    ] = value.split(":");


    const date =
      new Date();


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


  // ==========================================
  // STATUS
  // ==========================================

  const getStatus = (value) => {

    const status =
      String(value || "")
        .toUpperCase();


    if (
      status === "SCHEDULED" ||
      status === "PENDING"
    ) {

      return {
        label: "Pending",
        className:
          "bg-amber-50 text-amber-700",
      };

    }


    if (
      status === "COMPLETED"
    ) {

      return {
        label: "Completed",
        className:
          "bg-emerald-50 text-emerald-700",
      };

    }


    if (
      status === "CANCELLED" ||
      status === "CANCELED"
    ) {

      return {
        label: "Cancelled",
        className:
          "bg-red-50 text-red-700",
      };

    }


    return {
      label: value,
      className:
        "bg-slate-100 text-slate-700",
    };

  };


  const status =
    getStatus(
      appointment.status
    );


  return (

    <div className="space-y-7">


      {/* ====================================
          HEADER
      ==================================== */}

      <div className="
        flex
        items-start
        justify-between
        gap-4
      ">

        <div>

          <p className="
            text-sm
            text-slate-400
            mb-1
          ">

            Appointment #{appointment.id}

          </p>


          <h2 className="
            text-3xl
            font-bold
            text-[#193B63]
          ">

            Appointment Details

          </h2>

        </div>


        <span className={`
          px-4
          py-2
          rounded-full
          text-sm
          font-semibold
          ${status.className}
        `}>

          {status.label}

        </span>

      </div>


      {/* ====================================
          INFORMATION CARD
      ==================================== */}

      <div className="
        rounded-2xl
        border
        border-slate-200
        overflow-hidden
      ">


        {/* DATE */}

        <div className="
          flex
          items-center
          gap-4
          px-5
          py-4
          border-b
          border-slate-100
        ">

          <div className="
            w-10
            h-10
            rounded-xl
            bg-[#EEF4EA]
            text-[#556B55]
            flex
            items-center
            justify-center
          ">

            <FiCalendar />

          </div>


          <div>

            <p className="
              text-xs
              text-slate-400
            ">

              Date

            </p>

            <p className="
              font-medium
              text-slate-700
            ">

              {formatDate(
                appointment.appointment_date
              )}

            </p>

          </div>

        </div>


        {/* TIME */}

        <div className="
          flex
          items-center
          gap-4
          px-5
          py-4
          border-b
          border-slate-100
        ">

          <div className="
            w-10
            h-10
            rounded-xl
            bg-[#EEF4EA]
            text-[#556B55]
            flex
            items-center
            justify-center
          ">

            <FiClock />

          </div>


          <div>

            <p className="
              text-xs
              text-slate-400
            ">

              Time

            </p>

            <p className="
              font-medium
              text-slate-700
            ">

              {formatTime(
                appointment.appointment_time
              )}

            </p>

          </div>

        </div>


        {/* PATIENT */}

        <div className="
          flex
          items-center
          gap-4
          px-5
          py-4
          border-b
          border-slate-100
        ">

          <div className="
            w-10
            h-10
            rounded-xl
            bg-[#EEF4EA]
            text-[#556B55]
            flex
            items-center
            justify-center
          ">

            <FiUser />

          </div>


          <div>

            <p className="
              text-xs
              text-slate-400
            ">

              Patient

            </p>

            <p className="
              font-medium
              text-slate-700
            ">

              Patient #{appointment.patient_id}

            </p>

          </div>

        </div>


        {/* DOCTOR */}

        <div className="
          flex
          items-center
          gap-4
          px-5
          py-4
          border-b
          border-slate-100
        ">

          <div className="
            w-10
            h-10
            rounded-xl
            bg-[#EEF4EA]
            text-[#556B55]
            flex
            items-center
            justify-center
          ">

            <FiBriefcase />

          </div>


          <div>

            <p className="
              text-xs
              text-slate-400
            ">

              Doctor

            </p>

            <p className="
              font-medium
              text-slate-700
            ">

              Doctor #{appointment.doctor_id}

            </p>

          </div>

        </div>


        {/* REASON */}

        <div className="
          flex
          items-start
          gap-4
          px-5
          py-4
          border-b
          border-slate-100
        ">

          <div className="
            w-10
            h-10
            rounded-xl
            bg-[#EEF4EA]
            text-[#556B55]
            flex
            items-center
            justify-center
          ">

            <FiFileText />

          </div>


          <div>

            <p className="
              text-xs
              text-slate-400
            ">

              Reason

            </p>

            <p className="
              font-medium
              text-slate-700
            ">

              {appointment.reason || "-"}

            </p>

          </div>

        </div>


        {/* NOTES */}

        <div className="
          px-5
          py-5
        ">

          <p className="
            text-xs
            text-slate-400
            mb-2
          ">

            Notes

          </p>

          <p className="
            text-slate-700
            leading-6
          ">

            {appointment.notes || "No notes added."}

          </p>

        </div>


      </div>


      {/* ====================================
          ACTIONS
      ==================================== */}

      <div className="
        flex
        justify-end
        gap-3
      ">

        <button
          type="button"
          onClick={onClose}
          className="
            px-5
            py-3
            rounded-xl
            border
            border-slate-200
            text-slate-600
            hover:bg-slate-50
            transition-all
          "
        >

          Close

        </button>


        <button
          type="button"
          onClick={onEdit}
          className="
            flex
            items-center
            gap-2
            px-5
            py-3
            rounded-xl
            bg-[#556B55]
            text-white
            font-medium
            hover:bg-[#465946]
            transition-all
          "
        >

          <FiEdit size={17} />

          Edit Appointment

        </button>

      </div>


    </div>

  );

}


export default AppointmentDetails;