import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Layout from "../../components/layout/Layout";

import AppointmentHeader from "../../components/appointments/AppointmentHeader";
import AppointmentStats from "../../components/appointments/AppointmentStats";
import AppointmentSearch from "../../components/appointments/AppointmentSearch";
import AppointmentFilters from "../../components/appointments/AppointmentFilters";
import AppointmentTable from "../../components/appointments/AppointmentTable";
import AppointmentModal from "../../components/appointments/AppointmentModal";
import AppointmentForm from "../../components/appointments/AppointmentForm";
import AppointmentDetails from "../../components/appointments/AppointmentDetails";

import {
  getAppointments,
  deleteAppointment,
} from "../../services/appointmentService";


function Appointments() {

  // ==========================================
  // APPOINTMENT DATA
  // ==========================================

  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================
  // FILTERS
  // ==========================================

  const [search, setSearch] = useState("");

  const [doctor, setDoctor] = useState("All");

  const [status, setStatus] = useState("All");

  const [date, setDate] = useState("All");


  // ==========================================
  // MODAL
  // ==========================================

  const [showModal, setShowModal] = useState(false);

  const [modalMode, setModalMode] = useState("create");

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);


  // ==========================================
  // URL PARAMETERS
  // ==========================================

  const [searchParams, setSearchParams] =
    useSearchParams();


  // ==========================================
  // LOAD APPOINTMENTS
  // ==========================================

  const loadAppointments = async () => {

    try {

      setLoading(true);

      setError("");

      const data = await getAppointments();

      console.log(
        "Appointments received from backend:",
        data
      );

      setAppointments(data);

    } catch (error) {

      console.error(
        "Failed to load appointments:",
        error
      );

      setError(
        error.message ||
          "Failed to load appointments."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    loadAppointments();

  }, []);


  // ==========================================
  // OPEN NEW APPOINTMENT
  // ==========================================

  const handleAddAppointment = () => {

    setSelectedAppointment(null);

    setModalMode("create");

    setShowModal(true);

  };


  // ==========================================
  // OPEN VIEW MODAL
  // ==========================================

  const handleViewAppointment = (appointment) => {

    console.log(
      "Viewing appointment:",
      appointment
    );

    setSelectedAppointment(appointment);

    setModalMode("view");

    setShowModal(true);

  };


  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleEditAppointment = (appointment) => {

    console.log(
      "Editing appointment:",
      appointment
    );

    setSelectedAppointment(appointment);

    setModalMode("edit");

    setShowModal(true);

  };


  // ==========================================
  // DELETE APPOINTMENT
  // ==========================================

  const handleDeleteAppointment = async (
    appointment
  ) => {

    const confirmed = window.confirm(
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

      // Remove deleted appointment
      // from the current UI.

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
        error.message ||
          "Failed to delete appointment."
      );

    }

  };


  // ==========================================
  // AFTER CREATE / UPDATE
  // ==========================================

  const handleAppointmentSaved = async (
    savedAppointment
  ) => {

    try {

      console.log(
        "Appointment saved successfully:",
        savedAppointment
      );

      // IMPORTANT:
      // Reload the appointments from the backend.
      //
      // This guarantees that the table displays
      // the actual database record returned by
      // GET /api/v1/appointments/

      await loadAppointments();

      // Close modal

      setShowModal(false);

      setSelectedAppointment(null);

    } catch (error) {

      console.error(
        "Failed to refresh appointments after save:",
        error
      );

      setError(
        error.message ||
          "Appointment was saved, but appointments could not be refreshed."
      );

    }

  };


  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const handleCloseModal = () => {

    setShowModal(false);

    setSelectedAppointment(null);

  };


  // ==========================================
  // DOCTOR OPTIONS
  // ==========================================

  const doctorOptions = useMemo(() => {

    const uniqueDoctors = [
      ...new Set(
        appointments.map(
          (appointment) =>
            appointment.doctor_id
        )
      ),
    ];

    return uniqueDoctors
      .filter(
        (doctorId) =>
          doctorId !== null &&
          doctorId !== undefined
      )
      .sort(
        (a, b) => a - b
      );

  }, [appointments]);


  // ==========================================
  // STATUS OPTIONS
  // ==========================================

  const statusOptions = useMemo(() => {

    const uniqueStatuses = [
      ...new Set(
        appointments.map(
          (appointment) =>
            appointment.status
        )
      ),
    ];

    return uniqueStatuses.filter(
      (status) =>
        status !== null &&
        status !== undefined &&
        status !== ""
    );

  }, [appointments]);


  // ==========================================
  // ?new=true
  // ==========================================

  useEffect(() => {

    if (
      searchParams.get("new") === "true"
    ) {

      handleAddAppointment();

      setSearchParams(
        {},
        {
          replace: true,
        }
      );

    }

  }, [
    searchParams,
    setSearchParams,
  ]);


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <Layout>

      <div className="space-y-8">

        {/* ====================================
            HEADER
        ==================================== */}

        <AppointmentHeader
          onAddAppointment={
            handleAddAppointment
          }
        />


        {/* ====================================
            SEARCH
        ==================================== */}

        <AppointmentSearch
          search={search}
          setSearch={setSearch}
        />


        {/* ====================================
            FILTERS
        ==================================== */}

        <div
          className="
            flex
            flex-col
            lg:flex-row
            justify-between
            gap-4
          "
        >

          <AppointmentFilters

            doctor={doctor}
            setDoctor={setDoctor}

            status={status}
            setStatus={setStatus}

            date={date}
            setDate={setDate}

            doctors={doctorOptions}
            statuses={statusOptions}

          />

        </div>


        {/* ====================================
            TABLE
        ==================================== */}

        <AppointmentTable

          appointments={appointments}

          loading={loading}

          error={error}

          search={search}

          doctor={doctor}

          status={status}

          date={date}

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

      </div>


      {/* ======================================
          MODAL
      ====================================== */}

      {showModal && (

        <AppointmentModal

          open={showModal}

          onClose={
            handleCloseModal
          }

        >

          {/* ================================
              VIEW
          ================================= */}

          {modalMode === "view" && (

            <AppointmentDetails

              appointment={
                selectedAppointment
              }

              onClose={
                handleCloseModal
              }

              onEdit={() => {

                setModalMode("edit");

              }}

            />

          )}


          {/* ================================
              CREATE / EDIT
          ================================= */}

          {(modalMode === "create" ||
            modalMode === "edit") && (

            <AppointmentForm

              mode={modalMode}

              appointment={
                selectedAppointment
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