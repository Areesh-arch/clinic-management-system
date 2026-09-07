import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Layout from "../../components/layout/Layout";

import AppointmentHeader from "../../components/appointments/AppointmentHeader";
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

import {
  getPatients,
} from "../../services/patientService";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [date, setDate] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
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

      // --------------------------------------------------
      // Build patient map from CURRENT TENANT ONLY.
      //
      // We intentionally do NOT call getPatient()
      // for missing IDs here.
      //
      // This prevents the appointment page from trying
      // to resolve a patient outside the current tenant.
      // --------------------------------------------------

      const patientMap = new Map();

      patientList.forEach((patient) => {
        if (
          patient?.id !== null &&
          patient?.id !== undefined
        ) {
          patientMap.set(
            Number(patient.id),
            patient
          );
        }
      });

      setPatients(patientList);

      // --------------------------------------------------
      // Enrich appointments with patient information.
      // --------------------------------------------------

      const enrichedAppointments =
        appointmentList.map(
          (appointment) => {
            const patient =
              patientMap.get(
                Number(
                  appointment?.patient_id
                )
              );

            if (!patient) {
              return {
                ...appointment,
                patient_name: "",
                medical_record_number: "",
              };
            }

            const patientName = [
              patient?.first_name,
              patient?.last_name,
            ]
              .filter(Boolean)
              .join(" ")
              .trim();

            return {
              ...appointment,

              patient_name:
                patientName ||
                "Unknown Patient",

              medical_record_number:
                patient?.medical_record_number ||
                "",
            };
          }
        );

      console.log(
        "Enriched appointments:",
        enrichedAppointments
      );

      setAppointments(
        enrichedAppointments
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
  // VIEW
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
  // EDIT
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
  // DELETE
  // ======================================================

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

      // Remove the parameters after reading them.
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

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <Layout>
      <div className="space-y-8">

        <AppointmentHeader
          onAddAppointment={
            handleAddAppointment
          }
        />

        <AppointmentSearch
          search={search}
          setSearch={setSearch}
        />

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

        <AppointmentTable
          appointments={appointments}
          loading={loading}
          error={error}
          search={search}
          status={status}
          date={date}
          onView={handleViewAppointment}
          onEdit={handleEditAppointment}
          onDelete={handleDeleteAppointment}
          onRetry={loadAppointments}
        />
      </div>

      {showModal && (
        <AppointmentModal
          open={showModal}
          onClose={handleCloseModal}
        >
          {/* VIEW */}

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

          {/* CREATE / EDIT */}

          {(modalMode === "create" ||
            modalMode === "edit") && (
            <AppointmentForm
              mode={modalMode}
              appointment={
                selectedAppointment
              }

              patients={patients}

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