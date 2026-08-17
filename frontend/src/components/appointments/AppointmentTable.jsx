import AppointmentRow from "./AppointmentRow";


function AppointmentTable({
  appointments,
  loading,
  error,

  search,
  doctor,
  status,
  date,

  onView,
  onEdit,
  onDelete,

  onRetry,
}) {


  // ==========================================
  // FORMAT STATUS
  // ==========================================

  const normalizeStatus = (value) => {

    if (!value) {
      return "";
    }

    return String(value)
      .toUpperCase();

  };


  // ==========================================
  // FILTER APPOINTMENTS
  // ==========================================

  const filteredAppointments =
    appointments.filter(
      (appointment) => {


        // ------------------------------------
        // SEARCH
        // ------------------------------------

        const searchValue =
          search.toLowerCase().trim();


        const patientText =
          `patient #${appointment.patient_id}`
            .toLowerCase();


        const doctorText =
          `doctor #${appointment.doctor_id}`
            .toLowerCase();


        const reasonText =
          (
            appointment.reason ||
            ""
          ).toLowerCase();


        const matchesSearch =
          !searchValue ||
          patientText.includes(
            searchValue
          ) ||
          doctorText.includes(
            searchValue
          ) ||
          reasonText.includes(
            searchValue
          );


        // ------------------------------------
        // DOCTOR
        // ------------------------------------

        const matchesDoctor =
          doctor === "All" ||
          String(
            appointment.doctor_id
          ) === String(doctor);


        // ------------------------------------
        // STATUS
        // ------------------------------------

        const matchesStatus =
          status === "All" ||
          normalizeStatus(
            appointment.status
          ) === normalizeStatus(
            status
          );


        // ------------------------------------
        // DATE
        // ------------------------------------

        let matchesDate = true;


        if (date !== "All") {

          const appointmentDate =
            new Date(
              `${appointment.appointment_date}T00:00:00`
            );


          const today =
            new Date();

          today.setHours(
            0,
            0,
            0,
            0
          );


          if (date === "Today") {

            matchesDate =
              appointmentDate.getTime() ===
              today.getTime();

          }


          if (date === "Tomorrow") {

            const tomorrow =
              new Date(today);

            tomorrow.setDate(
              tomorrow.getDate() + 1
            );


            matchesDate =
              appointmentDate.getTime() ===
              tomorrow.getTime();

          }

        }


        return (
          matchesSearch &&
          matchesDoctor &&
          matchesStatus &&
          matchesDate
        );

      }
    );


  // ==========================================
  // STATUS DISPLAY
  // ==========================================

  const getStatusLabel = (status) => {

    const normalized =
      normalizeStatus(status);


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


    return status;

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="
        bg-white
        rounded-[28px]
        border
        border-slate-200
        shadow-sm
        overflow-hidden
      ">

        <div className="
          p-12
          text-center
          text-slate-500
        ">

          Loading appointments...

        </div>

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <div className="
        bg-white
        rounded-[28px]
        border
        border-red-200
        shadow-sm
        overflow-hidden
      ">

        <div className="
          p-12
          text-center
        ">

          <p className="
            text-red-600
            font-medium
          ">

            {error}

          </p>


          <button
            type="button"
            onClick={onRetry}
            className="
              mt-5
              px-5
              py-2.5
              rounded-xl
              bg-[#556B55]
              text-white
              font-medium
              hover:bg-[#465946]
              transition-all
            "
          >

            Try Again

          </button>

        </div>

      </div>

    );

  }


  // ==========================================
  // TABLE
  // ==========================================

  return (

    <div className="
      bg-white
      rounded-[28px]
      border
      border-slate-200
      shadow-sm
      overflow-hidden
    ">


      {/* ====================================
          HEADER
      ==================================== */}

      <div className="
        px-7
        py-6
        border-b
        border-slate-200
        flex
        flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-4
      ">

        <div>

          <h2 className="
            text-2xl
            font-bold
            text-[#193B63]
          ">

            Appointment Schedule

          </h2>


          <p className="
            text-slate-500
            mt-1
          ">

            {filteredAppointments.length} appointments found

          </p>

        </div>


        <div className="
          px-5
          py-2.5
          rounded-full
          bg-[#EEF4EA]
          text-[#556B55]
          font-medium
          whitespace-nowrap
        ">

          {filteredAppointments.length} Records

        </div>

      </div>


      {/* ====================================
          TABLE WRAPPER
      ==================================== */}

      <div className="overflow-x-auto">

        <table className="
          w-full
          min-w-[950px]
        ">


          {/* ==================================
              HEAD
          ================================== */}

          <thead>

            <tr className="
              bg-[#F7FAF7]
              border-b
              border-slate-200
              text-[#31577E]
            ">

              <th className="
                px-7
                py-5
                text-left
                font-semibold
              ">

                Date

              </th>


              <th className="
                px-5
                py-5
                text-left
                font-semibold
              ">

                Time

              </th>


              <th className="
                px-5
                py-5
                text-left
                font-semibold
              ">

                Patient

              </th>


              <th className="
                px-5
                py-5
                text-left
                font-semibold
              ">

                Doctor

              </th>


              <th className="
                px-5
                py-5
                text-left
                font-semibold
              ">

                Reason

              </th>


              <th className="
                px-5
                py-5
                text-left
                font-semibold
              ">

                Status

              </th>


              <th className="
                px-7
                py-5
                text-left
                font-semibold
              ">

                Actions

              </th>

            </tr>

          </thead>


          {/* ==================================
              BODY
          ================================== */}

          <tbody>

            {filteredAppointments.length > 0 ? (

              filteredAppointments.map(
                (appointment) => (

                  <AppointmentRow
                    key={
                      appointment.id
                    }

                    appointment={
                      appointment
                    }

                    statusLabel={
                      getStatusLabel(
                        appointment.status
                      )
                    }

                    onView={
                      onView
                    }

                    onEdit={
                      onEdit
                    }

                    onDelete={
                      onDelete
                    }

                  />

                )
              )

            ) : (

              <tr>

                <td
                  colSpan="7"
                  className="
                    px-6
                    py-16
                    text-center
                  "
                >

                  <div className="
                    text-slate-400
                  ">

                    <p className="
                      text-lg
                      font-medium
                    ">

                      No appointments found

                    </p>

                    <p className="
                      text-sm
                      mt-1
                    ">

                      Try changing your search or filters.

                    </p>

                  </div>

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}


export default AppointmentTable;