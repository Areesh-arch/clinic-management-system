import { useEffect, useMemo, useState } from "react";

import { useSearchParams } from "react-router-dom";

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
  // DELETE APPOINTMENT
  // ======================================================

  const handleDeleteAppointment = async (
    appointment
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete appointment #${appointment.id}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      console.log(
        "Deleting appointment:",
        appointment
      );

      await deleteAppointment(
        appointment.id
      );

      setAppointments(
        (currentAppointments) =>
          currentAppointments.filter(
            (item) =>
              item.id !== appointment.id
          )
      );

    } catch (error) {
      console.error(
        "Failed to delete appointment:",
        error
      );

      alert(
        error?.message ||
          "Failed to delete appointment."
      );
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
  //
  // AppointmentTable already receives the filters
  // directly.
  //
  // Calendar needs its own filtered list because
  // Calendar does not know about search/status/date
  // state.
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
  //
  // Examples:
  //
  // /appointments?new=true
  //
  // /appointments?patient_id=20
  //
  // /appointments?new=true&patient_id=20
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
          MODAL
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

    </Layout>
  );
}


export default Appointments;