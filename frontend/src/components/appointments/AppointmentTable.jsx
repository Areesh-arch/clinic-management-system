
import AppointmentRow from "./AppointmentRow";

function AppointmentTable({
  appointments,
  loading,
  error,
  search,
  status,
  date,
  onView,
  onEdit,
  onDelete,
  onRetry,
}) {
  // ==========================================
  // NORMALIZE STATUS
  // ==========================================

  const normalizeStatus = (value) => {
    if (!value) {
      return "";
    }

    return String(value).trim().toUpperCase();
  };

  // ==========================================
  // STATUS DISPLAY
  // ==========================================

  const getStatusLabel = (value) => {
    const normalized = normalizeStatus(value);

    switch (normalized) {
      case "SCHEDULED":
      case "PENDING":
        return "Pending";

      case "COMPLETED":
        return "Completed";

      case "CANCELLED":
      case "CANCELED":
        return "Cancelled";

      case "NO_SHOW":
      case "NO-SHOW":
      case "NOSHOW":
        return "No Show";

      default:
        return value || "-";
    }
  };

  // ==========================================
  // SOURCE DISPLAY
  // ==========================================

  const getSourceLabel = (value) => {
    const normalized = String(value || "")
      .trim()
      .toLowerCase();

    switch (normalized) {
      case "website":
        return "Website";

      case "walk_in":
      case "walk-in":
        return "Walk-in";

      case "clinic":
      default:
        return "Clinic";
    }
  };

  // ==========================================
  // SOURCE BADGE
  // ==========================================

  const getSourceBadgeClass = (value) => {
    const normalized = String(value || "")
      .trim()
      .toLowerCase();

    switch (normalized) {
      case "website":
        return "border-[#C9DDD2] bg-[#EDF5F0] text-[#365C4F]";

      case "walk_in":
      case "walk-in":
        return "border-[#E5D6B9] bg-[#F8F2E5] text-[#8A6B32]";

      case "clinic":
      default:
        return "border-[#D5DFDA] bg-[#F1F5F2] text-[#173B32]";
    }
  };

  // ==========================================
  // FILTER APPOINTMENTS
  // ==========================================

  const filteredAppointments = appointments.filter(
    (appointment) => {
      const searchValue = String(search || "")
        .toLowerCase()
        .trim();

      const patientText = `patient #${
        appointment?.patient_id ?? ""
      }`.toLowerCase();

      const patientNameText = String(
        appointment?.patient_name || ""
      )
        .toLowerCase()
        .trim();

      const patientMrnText = String(
        appointment?.medical_record_number || ""
      )
        .toLowerCase()
        .trim();

      const reasonText = String(
        appointment?.reason || ""
      )
        .toLowerCase()
        .trim();

      const matchesSearch =
        !searchValue ||
        patientText.includes(searchValue) ||
        patientNameText.includes(searchValue) ||
        patientMrnText.includes(searchValue) ||
        reasonText.includes(searchValue);

      // --------------------------------------
      // STATUS
      // --------------------------------------

      const matchesStatus =
        status === "All" ||
        normalizeStatus(appointment?.status) ===
          normalizeStatus(status);

      // --------------------------------------
      // DATE
      // --------------------------------------

      let matchesDate = true;

      if (date !== "All") {
        const appointmentDate = new Date(
          `${appointment?.appointment_date}T00:00:00`
        );

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (date === "Today") {
          matchesDate =
            appointmentDate.getTime() ===
            today.getTime();
        }

        if (date === "Tomorrow") {
          const tomorrow = new Date(today);

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
        matchesStatus &&
        matchesDate
      );
    }
  );

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div
        className="
          overflow-hidden
          rounded-[28px]
          border
          border-[#E5DED0]
          bg-[#FFFDF8]
          shadow-[0_10px_35px_rgba(23,59,50,0.07)]
        "
      >
        <div className="flex min-h-70 items-center justify-center px-6 py-12">
          <div className="text-center">
            <div
              className="
                mx-auto
                mb-4
                h-9
                w-9
                animate-spin
                rounded-full
                border-4
                border-[#DCE6DF]
                border-t-[#173B32]
              "
            />

            <p className="text-sm font-medium text-[#687770]">
              Loading appointments...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div
        className="
          overflow-hidden
          rounded-[28px]
          border
          border-[#E6D5CF]
          bg-[#FFFDF8]
          shadow-[0_10px_35px_rgba(23,59,50,0.07)]
        "
      >
        <div className="px-6 py-14 text-center">
          <p className="font-medium text-[#9B5145]">
            {error}
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="
              mt-5
              rounded-xl
              bg-[#173B32]
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition-all
              duration-200
              hover:bg-[#245044]
              active:scale-[0.98]
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
    <div
      className="
        overflow-hidden
        rounded-[28px]
        border
        border-[#E5DED0]
        bg-[#FFFDF8]
        shadow-[0_10px_35px_rgba(23,59,50,0.07)]
      "
    >
      {/* ======================================
          HEADER / TITLE AREA
      ====================================== */}

      <div
        className="
          relative
          overflow-hidden
          border-b
          border-[#E8E1D5]
          bg-[#FFFDF8]
        "
      >
        {/* Subtle background pattern */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.045]
          "
          style={{
            backgroundImage: `
              radial-gradient(
                circle at 15px 15px,
                #6F8F7D 1.2px,
                transparent 1.5px
              ),
              radial-gradient(
                circle at 45px 45px,
                #B4935A 1px,
                transparent 1.4px
              )
            `,
            backgroundSize: "60px 60px",
          }}
        />

        <div
          className="
            relative
            flex
            flex-col
            gap-5
            px-7
            py-7
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* TITLE */}

          <div>
            <h2
              className="
                text-2xl
                font-bold
                tracking-tight
                text-[#173B32]
              "
            >
              Appointment Schedule
            </h2>

            {/* Gold accent line */}

            <div
              className="
                mt-3
                h-0.75
                w-24
                rounded-full
                bg-[#B4935A]
              "
            />

            <p
              className="
                mt-2
                text-sm
                font-medium
                text-[#7A8580]
              "
            >
              {filteredAppointments.length} appointments found
            </p>
          </div>

          {/* RECORD COUNT */}

          <div
            className="
              inline-flex
              w-fit
              shrink-0
              items-center
              gap-2
              rounded-full
              border
              border-[#D7E2DB]
              bg-[#EEF4EF]
              px-4
              py-2
              text-sm
              font-semibold
              text-[#365C4F]
            "
          >
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-[#6F8F7D]
              "
            />

            {filteredAppointments.length} Records
          </div>
        </div>
      </div>

      {/* ======================================
          TABLE
      ====================================== */}

      <div className="overflow-x-auto">
        <table className="w-full min-w-237.5">
          <thead>
            <tr
              className="
                bg-[#173B32]
                text-white
              "
            >
              <th
                className="
                  px-7
                  py-4
                  text-left
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.08em]
                "
              >
                Patient
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-left
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.08em]
                "
              >
                Date
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-left
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.08em]
                "
              >
                Time
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-left
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.08em]
                "
              >
                Reason
              </th>

              {/* SOURCE */}

              <th
                className="
                  px-5
                  py-4
                  text-left
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.08em]
                "
              >
                Source
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-left
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.08em]
                "
              >
                Status
              </th>

              <th
                className="
                  px-7
                  py-4
                  text-left
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.08em]
                "
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E5DED0]">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map(
                (appointment) => (
                  <AppointmentRow
                    key={appointment.id}
                    appointment={appointment}
                    statusLabel={getStatusLabel(
                      appointment.status
                    )}
                    sourceLabel={getSourceLabel(
                      appointment.source
                    )}
                    sourceBadgeClass={getSourceBadgeClass(
                      appointment.source
                    )}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
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
                    bg-[#FFFDF8]
                  "
                >
                  <div className="text-[#87918C]">
                    <p
                      className="
                        text-lg
                        font-semibold
                        text-[#173B32]
                      "
                    >
                      No appointments found
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                      "
                    >
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
