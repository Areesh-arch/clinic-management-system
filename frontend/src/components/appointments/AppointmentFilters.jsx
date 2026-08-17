function AppointmentFilters({
  doctor,
  setDoctor,

  status,
  setStatus,

  date,
  setDate,

  doctors = [],
  statuses = [],
}) {


  // ==========================================
  // STATUS LABEL
  // ==========================================

  const getStatusLabel = (value) => {

    const normalized =
      String(value || "")
        .toUpperCase();


    if (
      normalized === "SCHEDULED" ||
      normalized === "PENDING"
    ) {

      return "Pending";

    }


    if (
      normalized === "COMPLETED"
    ) {

      return "Completed";

    }


    if (
      normalized === "CANCELLED" ||
      normalized === "CANCELED"
    ) {

      return "Cancelled";

    }


    return value;

  };


  return (

    <div className="
      flex
      flex-wrap
      gap-4
    ">


      {/* ====================================
          DOCTOR
      ==================================== */}

      <select
        value={doctor}
        onChange={(e) =>
          setDoctor(e.target.value)
        }
        className="
          min-w-[190px]
          px-5
          py-3
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
          text-slate-700
          focus:outline-none
          focus:ring-2
          focus:ring-[#A3B18A]
          transition-all
        "
      >

        <option value="All">
          All Doctors
        </option>


        {doctors.map(
          (doctorId) => (

            <option
              key={doctorId}
              value={doctorId}
            >

              Doctor #{doctorId}

            </option>

          )
        )}

      </select>


      {/* ====================================
          STATUS
      ==================================== */}

      <select
        value={status}
        onChange={(e) =>
          setStatus(e.target.value)
        }
        className="
          min-w-[180px]
          px-5
          py-3
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
          text-slate-700
          focus:outline-none
          focus:ring-2
          focus:ring-[#A3B18A]
          transition-all
        "
      >

        <option value="All">
          All Status
        </option>


        {statuses.map(
          (statusValue) => (

            <option
              key={statusValue}
              value={statusValue}
            >

              {getStatusLabel(
                statusValue
              )}

            </option>

          )
        )}

      </select>


      {/* ====================================
          DATE
      ==================================== */}

      <select
        value={date}
        onChange={(e) =>
          setDate(e.target.value)
        }
        className="
          min-w-[180px]
          px-5
          py-3
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
          text-slate-700
          focus:outline-none
          focus:ring-2
          focus:ring-[#A3B18A]
          transition-all
        "
      >

        <option value="All">
          All Dates
        </option>

        <option value="Today">
          Today
        </option>

        <option value="Tomorrow">
          Tomorrow
        </option>

      </select>


    </div>

  );

}


export default AppointmentFilters;