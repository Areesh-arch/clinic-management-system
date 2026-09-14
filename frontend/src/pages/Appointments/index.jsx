import { useEffect, useMemo, useState } from "react";

import { useSearchParams } from "react-router-dom";

import {
  FiAlertTriangle,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import Layout from "../../components/layout/Layout";

import AppointmentHeader from "../../components/appointments/AppointmentHeader";
import AppointmentSearch from "../../components/appointments/AppointmentSearch";
import AppointmentFilters from "../../components/appointments/AppointmentFilters";
import AppointmentTable from "../../components/appointments/AppointmentTable";
import AppointmentCalendar from "../../components/appointments/AppointmentCalendar";
import AppointmentModal from "../../components/appointments/AppointmentModal";
import AppointmentForm from "../../components/appointments/AppointmentForm";
import AppointmentDetails from "../../components/appointments/AppointmentDetails";

import {
  getAppointments,
  deleteAppointment,
} from "../../services/appointmentService";

import {
  getPatients,
} from "../../services/patientService";


function Appointments() {
  const [appointments, setAppointments] =
    useState([]);

  /*
   * Patients are still loaded because AppointmentForm
   * needs them for patient selection.
   *
   * IMPORTANT:
   * We do NOT use patients to resolve patient names
   * for appointments.
   *
   * Backend AppointmentResponse already provides:
   * patient_name
   * medical_record_number
   */
  const [patients, setPatients] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [date, setDate] =
    useState("All");

  /*
   * TABLE / CALENDAR
   */
  const [viewMode, setViewMode] =
    useState("table");

  /*
   * MODAL
   */
  const [showModal, setShowModal] =
    useState(false);

  const [modalMode, setModalMode] =
    useState("create");

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  /*
   * DELETE CONFIRMATION
   */
  const [appointmentToDelete, setAppointmentToDelete] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  const [searchParams, setSearchParams] =
    useSearchParams();


  // ======================================================
  // NORMALIZE API LIST
  // ======================================================

  const normalizeList = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.items)) {
      return data.items;
    }

    if (Array.isArray(data?.results)) {
      return data.results;
    }

    return [];
  };


  // ======================================================
  // LOAD APPOINTMENTS + PATIENTS
  // ======================================================

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * We still load patients because AppointmentForm
       * requires the patient list.
       *
       * We do NOT use patients to enrich appointments.
       *
       * Backend already returns:
       *
       * patient_name
       * medical_record_number
       */

      const [
        appointmentsResult,
        patientsResult,
      ] = await Promise.all([
        getAppointments(),
        getPatients(),
      ]);

      const appointmentList =
        normalizeList(
          appointmentsResult
        );

      const patientList =
        normalizeList(
          patientsResult
        );

      console.log(
        "Appointments received from backend:",
        appointmentList
      );

      console.log(
        "Patients received from backend:",
        patientList
      );

      /*
       * Patients are only needed by AppointmentForm.
       */
      setPatients(
        patientList
      );

      /*
       * Do NOT build a patientMap here.
       *
       * AppointmentResponse already contains
       * patient_name and medical_record_number.
       */
      setAppointments(
        appointmentList
      );

      console.log(
        "Appointments with backend patient data:",
        appointmentList
      );

    } catch (error) {
      console.error(
        "Failed to load appointments:",
        error
      );

      setError(
        error?.message ||
          "Failed to load appointments."
      );

    } finally {
      setLoading(false);
    }
  };


  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    loadAppointments();
  }, []);


  // ======================================================
  // ADD APPOINTMENT
  // ======================================================

  const handleAddAppointment = () => {
    setSelectedAppointment(null);
    setModalMode("create");
    setShowModal(true);
  };


  // ======================================================
  // VIEW APPOINTMENT
  // ======================================================

  const handleViewAppointment = (
    appointment
  ) => {
    console.log(
      "Viewing appointment:",
      appointment
    );

    setSelectedAppointment(
      appointment
    );

    setModalMode("view");
    setShowModal(true);
  };


  // ======================================================
  // EDIT APPOINTMENT
  // ======================================================

  const handleEditAppointment = (
    appointment
  ) => {
    console.log(
      "Editing appointment:",
      appointment
    );

    setSelectedAppointment(
      appointment
    );

    setModalMode("edit");
    setShowModal(true);
  };


  // ======================================================
  // OPEN DELETE CONFIRMATION
  // ======================================================

  const handleDeleteAppointment = (
    appointment
  ) => {
    setError("");

    setAppointmentToDelete(
      appointment
    );
  };


  // ======================================================
  // CLOSE DELETE CONFIRMATION
  // ======================================================

  const closeDeleteConfirmation = () => {
    if (deleting) {
      return;
    }

    setAppointmentToDelete(null);
  };


  // ======================================================
  // CONFIRM DELETE APPOINTMENT
  // ======================================================

  const confirmDeleteAppointment = async () => {
    if (
      !appointmentToDelete?.id ||
      deleting
    ) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      console.log(
        "Deleting appointment:",
        appointmentToDelete
      );

      await deleteAppointment(
        appointmentToDelete.id
      );

      setAppointments(
        (currentAppointments) =>
          currentAppointments.filter(
            (item) =>
              item.id !==
              appointmentToDelete.id
          )
      );

      setAppointmentToDelete(null);

    } catch (error) {
      console.error(
        "Failed to delete appointment:",
        error
      );

      setError(
        error?.message ||
          "Failed to delete appointment."
      );

    } finally {
      setDeleting(false);
    }
  };


  // ======================================================
  // AFTER SAVE
  // ======================================================

  const handleAppointmentSaved = async (
    savedAppointment
  ) => {
    try {
      console.log(
        "Appointment saved successfully:",
        savedAppointment
      );

      await loadAppointments();

      setShowModal(false);
      setSelectedAppointment(null);

    } catch (error) {
      console.error(
        "Failed to refresh appointments after save:",
        error
      );

      setError(
        error?.message ||
          "Appointment was saved, but appointments could not be refreshed."
      );
    }
  };


  // ======================================================
  // CLOSE MODAL
  // ======================================================

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);

    /*
     * If appointment creation was opened from:
     *
     * /appointments?patient_id=20
     *
     * remove the URL parameters when the modal closes.
     *
     * This prevents the form from automatically opening
     * again after the user closes it.
     */
    if (
      searchParams.has("patient_id") ||
      searchParams.has("new")
    ) {
      setSearchParams({});
    }
  };


  // ======================================================
  // STATUS OPTIONS
  // ======================================================

  const statusOptions = useMemo(() => {
    const uniqueStatuses = [
      ...new Set(
        appointments.map(
          (appointment) =>
            appointment?.status
        )
      ),
    ];

    return uniqueStatuses.filter(
      (statusValue) =>
        statusValue !== null &&
        statusValue !== undefined &&
        statusValue !== ""
    );
  }, [appointments]);


  // ======================================================
  // FILTER APPOINTMENTS FOR CALENDAR
  // ======================================================

  const filteredAppointments = useMemo(() => {
    const normalizedSearch =
      String(search || "")
        .trim()
        .toLowerCase();

    const normalizedStatus =
      String(status || "")
        .trim()
        .toLowerCase();

    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    return appointments.filter(
      (appointment) => {

        // ----------------------------------------------
        // SEARCH
        // ----------------------------------------------

        if (normalizedSearch) {
          const patientName =
            String(
              appointment?.patient_name ||
                appointment?.patient?.full_name ||
                appointment?.patient?.name ||
                ""
            ).toLowerCase();

          const mrn =
            String(
              appointment?.medical_record_number ||
                appointment?.patient?.medical_record_number ||
                ""
            ).toLowerCase();

          const reason =
            String(
              appointment?.reason || ""
            ).toLowerCase();

          const matchesSearch =
            patientName.includes(
              normalizedSearch
            ) ||
            mrn.includes(
              normalizedSearch
            ) ||
            reason.includes(
              normalizedSearch
            );

          if (!matchesSearch) {
            return false;
          }
        }


        // ----------------------------------------------
        // STATUS
        // ----------------------------------------------

        if (
          status &&
          status !== "All"
        ) {
          const appointmentStatus =
            String(
              appointment?.status || ""
            )
              .trim()
              .toLowerCase();

          const selectedStatus =
            normalizedStatus;

          const normalizedAppointmentStatus =
            appointmentStatus === "pending"
              ? "scheduled"
              : appointmentStatus;

          const normalizedSelectedStatus =
            selectedStatus === "pending"
              ? "scheduled"
              : selectedStatus;

          if (
            normalizedAppointmentStatus !==
            normalizedSelectedStatus
          ) {
            return false;
          }
        }


        // ----------------------------------------------
        // DATE
        // ----------------------------------------------

        if (
          date &&
          date !== "All"
        ) {
          const appointmentDate =
            appointment?.appointment_date;

          if (!appointmentDate) {
            return false;
          }

          const appointmentDateObject =
            new Date(
              `${appointmentDate}T00:00:00`
            );

          if (
            Number.isNaN(
              appointmentDateObject.getTime()
            )
          ) {
            return false;
          }

          appointmentDateObject.setHours(
            0,
            0,
            0,
            0
          );


          const normalizedDate =
            String(date)
              .trim()
              .toLowerCase();


          // Today
          if (
            normalizedDate ===
              "today"
          ) {
            if (
              appointmentDateObject.getTime() !==
              today.getTime()
            ) {
              return false;
            }
          }


          // Upcoming
          else if (
            normalizedDate ===
              "upcoming"
          ) {
            if (
              appointmentDateObject.getTime() <
              today.getTime()
            ) {
              return false;
            }
          }


          // Past
          else if (
            normalizedDate ===
              "past"
          ) {
            if (
              appointmentDateObject.getTime() >=
              today.getTime()
            ) {
              return false;
            }
          }


          // Specific date value
          else if (
            /^\d{4}-\d{2}-\d{2}$/.test(
              normalizedDate
            )
          ) {
            if (
              appointmentDate !==
              normalizedDate
            ) {
              return false;
            }
          }
        }

        return true;
      }
    );
  }, [
    appointments,
    search,
    status,
    date,
  ]);


  // ======================================================
  // HANDLE URL PARAMETERS
  // ======================================================

  useEffect(() => {
    const newAppointment =
      searchParams.get("new") === "true";

    const patientId =
      searchParams.get("patient_id");

    if (
      newAppointment ||
      patientId
    ) {
      setSelectedAppointment(null);
      setModalMode("create");
      setShowModal(true);
    }
  }, [
    searchParams,
  ]);


  // ======================================================
  // RENDER
  // ======================================================

  return (
    <Layout>

      <div className="space-y-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <AppointmentHeader
          onAddAppointment={
            handleAddAppointment
          }
          viewMode={
            viewMode
          }
          onViewModeChange={
            setViewMode
          }
        />


        {/* =================================================
            SEARCH
        ================================================= */}

        <AppointmentSearch
          search={search}
          setSearch={setSearch}
        />


        {/* =================================================
            FILTERS
        ================================================= */}

        <div
          className="
            flex flex-col
            lg:flex-row
            justify-between
            gap-4
          "
        >
          <AppointmentFilters
            status={status}
            setStatus={setStatus}
            date={date}
            setDate={setDate}
            statuses={statusOptions}
          />
        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-[#E7C7C0]
              bg-[#FFF7F5]
              px-5
              py-4
              text-sm
              font-medium
              text-[#984E42]
              shadow-sm
            "
          >
            <span
              className="
                mt-0.5
                flex
                h-5
                w-5
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#F4DED9]
                text-xs
                font-bold
              "
            >
              !
            </span>

            <span>{error}</span>
          </div>
        )}


        {/* =================================================
            TABLE / CALENDAR
        ================================================= */}

        {viewMode === "table" ? (

          <AppointmentTable
            appointments={
              appointments
            }
            loading={
              loading
            }
            error={
              error
            }
            search={
              search
            }
            status={
              status
            }
            date={
              date
            }
            onView={
              handleViewAppointment
            }
            onEdit={
              handleEditAppointment
            }
            onDelete={
              handleDeleteAppointment
            }
            onRetry={
              loadAppointments
            }
          />

        ) : (

          <AppointmentCalendar
            appointments={
              filteredAppointments
            }
            onView={
              handleViewAppointment
            }
          />

        )}

      </div>


      {/* ===================================================
          APPOINTMENT MODAL
      =================================================== */}

      {showModal && (

        <AppointmentModal
          open={
            showModal
          }
          onClose={
            handleCloseModal
          }
        >

          {/* =================================================
              VIEW
          ================================================= */}

          {modalMode === "view" && (

            <AppointmentDetails
              appointment={
                selectedAppointment
              }
              onClose={
                handleCloseModal
              }
              onEdit={() => {
                setModalMode(
                  "edit"
                );
              }}
            />

          )}


          {/* =================================================
              CREATE / EDIT
          ================================================= */}

          {(modalMode === "create" ||
            modalMode === "edit") && (

            <AppointmentForm
              mode={
                modalMode
              }

              appointment={
                selectedAppointment
              }

              patients={
                patients
              }

              appointments={
                appointments
              }

              initialPatientId={
                searchParams.get(
                  "patient_id"
                ) || ""
              }

              onSuccess={
                handleAppointmentSaved
              }

              onCancel={
                handleCloseModal
              }
            />

          )}

        </AppointmentModal>

      )}


      {/* ===================================================
          PROFESSIONAL DELETE CONFIRMATION
      =================================================== */}

      {appointmentToDelete && (
        <div
          className="
            fixed
            inset-0
            z-100
            flex
            items-center
            justify-center
            bg-[#173B32]/55
            px-4
            py-6
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deleting
            ) {
              closeDeleteConfirmation();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-appointment-title"
            aria-describedby="delete-appointment-description"
            className="
              relative
              w-full
              max-w-md
              overflow-hidden
              rounded-3xl
              border
              border-[#E3DED2]
              bg-[#FFFDF8]
              shadow-[0_25px_70px_rgba(23,59,50,0.24)]
            "
          >

            {/* GOLD TOP LINE */}

            <div
              className="
                h-1.5
                w-full
                bg-[#B4935A]
              "
            />


            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={
                closeDeleteConfirmation
              }
              disabled={
                deleting
              }
              aria-label="Close confirmation"
              className="
                absolute
                right-5
                top-5
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-[#78857E]
                transition
                hover:bg-[#F2EFE7]
                hover:text-[#173B32]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <FiX size={18} />
            </button>


            {/* CONTENT */}

            <div
              className="
                px-6
                pb-6
                pt-7
                sm:px-8
                sm:pb-8
              "
            >

              {/* WARNING ICON */}

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[#E7CFC9]
                  bg-[#FBF1EF]
                  text-[#A15D50]
                "
              >
                <FiAlertTriangle
                  size={25}
                  strokeWidth={1.8}
                />
              </div>


              {/* TITLE */}

              <h2
                id="delete-appointment-title"
                className="
                  mt-5
                  pr-8
                  text-xl
                  font-bold
                  tracking-tight
                  text-[#173B32]
                "
              >
                Delete Appointment?
              </h2>


              {/* DESCRIPTION */}

              <p
                id="delete-appointment-description"
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-[#68766E]
                "
              >
                Are you sure you want to permanently
                delete this appointment? This action
                cannot be undone.
              </p>


              {/* APPOINTMENT INFO */}

              <div
                className="
                  mt-5
                  rounded-2xl
                  border
                  border-[#E4DED1]
                  bg-[#F8F5ED]
                  px-4
                  py-3.5
                "
              >
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-[#8A958E]
                  "
                >
                  Appointment record
                </p>

                <p
                  className="
                    mt-1.5
                    truncate
                    text-sm
                    font-semibold
                    text-[#173B32]
                  "
                >
                  {appointmentToDelete?.patient_name ||
                    appointmentToDelete?.patient?.full_name ||
                    appointmentToDelete?.patient?.name ||
                    "Unknown patient"}
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-xs
                    text-[#77847D]
                  "
                >
                  Appointment #
                  {appointmentToDelete?.id}
                  {appointmentToDelete?.reason
                    ? ` • ${appointmentToDelete.reason}`
                    : ""}
                </p>
              </div>


              {/* ACTIONS */}

              <div
                className="
                  mt-7
                  flex
                  flex-col-reverse
                  gap-3
                  sm:flex-row
                  sm:justify-end
                "
              >

                {/* CANCEL */}

                <button
                  type="button"
                  onClick={
                    closeDeleteConfirmation
                  }
                  disabled={
                    deleting
                  }
                  className="
                    inline-flex
                    h-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#D8DED9]
                    bg-[#F5F7F5]
                    px-5
                    text-sm
                    font-semibold
                    text-[#36564A]
                    transition
                    hover:border-[#B8C8BF]
                    hover:bg-[#EAF0EC]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  Cancel
                </button>


                {/* DELETE */}

                <button
                  type="button"
                  onClick={
                    confirmDeleteAppointment
                  }
                  disabled={
                    deleting
                  }
                  className="
                    inline-flex
                    h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#9A4E43]
                    px-5
                    text-sm
                    font-semibold
                    text-white
                    shadow-[0_5px_14px_rgba(154,78,67,0.18)]
                    transition
                    hover:bg-[#863F35]
                    hover:shadow-[0_7px_18px_rgba(154,78,67,0.24)]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {deleting ? (
                    <>
                      <span
                        className="
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-white/40
                          border-t-white
                        "
                      />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 size={15} />
                      Delete Appointment
                    </>
                  )}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}


export default Appointments;