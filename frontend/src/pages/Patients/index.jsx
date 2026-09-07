import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Layout from "../../components/layout/Layout";

import PatientForm from "../../components/patients/PatientForm";
import PatientHeader from "../../components/patients/PatientHeader";
import PatientSearch from "../../components/patients/PatientSearch";
import PatientFilters from "../../components/patients/PatientFilters";
import PatientTable from "../../components/patients/PatientTable";

import { getPatients } from "../../services/patientService";
import { apiRequest } from "../../services/api";

function Patients() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [gender, setGender] = useState("All");

  const [modalType, setModalType] = useState(null);

  const [selectedPatient, setSelectedPatient] =
    useState(null);

  const [patients, setPatients] =
    useState([]);

  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchParams, setSearchParams] =
    useSearchParams();

  /*
   * ============================================================
   * LOAD PATIENTS
   * ============================================================
   */

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPatients();

      let patientList = [];

      if (Array.isArray(data)) {
        patientList = data;
      } else if (Array.isArray(data?.items)) {
        patientList = data.items;
      } else if (Array.isArray(data?.results)) {
        patientList = data.results;
      }

      console.log(
  "PATIENT DATA:",
  JSON.stringify(patientList, null, 2)
);

setPatients(patientList);

      setPatients(patientList);
    } catch (err) {
      console.error(
        "Failed to load patients:",
        err
      );

      setError(
        err.message ||
          "Failed to load patients."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ============================================================
   * LOAD APPOINTMENTS
   *
   * Used for the Follow-ups card.
   * ============================================================
   */

  const loadAppointments = async () => {
    try {
      const data = await apiRequest(
        "/appointments/"
      );

      let appointmentList = [];

      if (Array.isArray(data)) {
        appointmentList = data;
      } else if (Array.isArray(data?.items)) {
        appointmentList = data.items;
      } else if (Array.isArray(data?.results)) {
        appointmentList = data.results;
      }

      console.log(
  "APPOINTMENT DATA:",
  JSON.stringify(appointmentList, null, 2)
);

setAppointments(appointmentList);

      setAppointments(appointmentList);
    } catch (err) {
      console.error(
        "Failed to load appointments for patient statistics:",
        err
      );

      /*
       * Do not break the Patient page if appointments
       * cannot be loaded.
       */
      setAppointments([]);
    }
  };

  /*
   * ============================================================
   * INITIAL LOAD
   * ============================================================
   */

  useEffect(() => {
    loadPatients();
    loadAppointments();
  }, []);

  /*
   * ============================================================
   * ADD PATIENT
   * ============================================================
   */

  const handleAddPatient = () => {
    console.log(
      "Opening Add Patient form"
    );

    setSelectedPatient(null);
    setModalType("create");
  };

  /*
   * ============================================================
   * VIEW PATIENT PROFILE
   * ============================================================
   */

  const handleViewPatient = (patient) => {
    console.log(
      "Opening patient profile:",
      patient
    );

    if (!patient?.id) {
      console.error(
        "Cannot open patient profile because patient ID is missing.",
        patient
      );

      setError(
        "Unable to open patient profile because the patient ID is missing."
      );

      return;
    }

    navigate(
      `/patients/${patient.id}`
    );
  };

  /*
   * ============================================================
   * PATIENT CREATED
   * ============================================================
   */

  const handlePatientCreated = async (
    createdPatient
  ) => {
    console.log(
      "Patient created successfully:",
      createdPatient
    );

    setModalType(null);
    setSelectedPatient(null);

    await loadPatients();
  };

  /*
   * ============================================================
   * EDIT PATIENT
   * ============================================================
   */

  const handleEditPatient = (patient) => {
    console.log(
      "Opening patient for edit:",
      patient
    );

    setSelectedPatient(patient);
    setModalType("edit");
  };

  /*
   * ============================================================
   * PATIENT UPDATED
   * ============================================================
   */

  const handlePatientUpdated = async (
    updatedPatient
  ) => {
    console.log(
      "Patient updated successfully:",
      updatedPatient
    );

    setModalType(null);
    setSelectedPatient(null);

    await loadPatients();
  };

  /*
   * ============================================================
   * CLOSE MODAL
   * ============================================================
   */

  const handleCloseModal = () => {
    console.log(
      "Closing patient modal"
    );

    setModalType(null);
    setSelectedPatient(null);
  };

  /*
   * ============================================================
   * HANDLE ?new=true
   * ============================================================
   */

  useEffect(() => {
    if (
      searchParams.get("new") ===
      "true"
    ) {
      handleAddPatient();

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

  /*
   * ============================================================
   * PATIENT STATISTICS
   * ============================================================
   */

  const totalPatients =
    patients.length;

  /*
   * ACTIVE PATIENTS
   */

  const activePatients =
    patients.filter(
      (patient) =>
        patient?.is_active === true ||
        patient?.status === "active" ||
        patient?.status === "Active"
    ).length;

  /*
   * CURRENT MONTH / YEAR
   */

  const now = new Date();

  const currentMonth =
    now.getMonth();

  const currentYear =
    now.getFullYear();

  /*
   * ============================================================
   * NEW THIS MONTH
   *
   * Different backend versions may use different field names.
   * We support the common possibilities.
   * ============================================================
   */

  const newThisMonth =
    patients.filter((patient) => {
      const registrationDate =
        patient?.created_at ||
        patient?.createdAt ||
        patient?.created_on ||
        patient?.registration_date ||
        patient?.registered_at;

      if (!registrationDate) {
        return false;
      }

      const createdDate =
        new Date(registrationDate);

      if (
        Number.isNaN(
          createdDate.getTime()
        )
      ) {
        return false;
      }

      return (
        createdDate.getMonth() ===
          currentMonth &&
        createdDate.getFullYear() ===
          currentYear
      );
    }).length;

  /*
   * ============================================================
   * FOLLOW-UPS
   *
   * Appointment schema currently has no dedicated
   * "is_follow_up" field.
   *
   * Therefore, for now we identify follow-up appointments
   * from the appointment reason.
   *
   * Supports:
   * Follow-up
   * Follow up
   * Followup
   * follow-UP
   * etc.
   * ============================================================
   */

  const followUps =
    appointments.filter(
      (appointment) => {
        const reason =
          String(
            appointment?.reason || ""
          )
            .trim()
            .toLowerCase();

        return (
          reason.includes("follow-up") ||
          reason.includes("follow up") ||
          reason.includes("followup")
        );
      }
    ).length;

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <Layout>
      <div className="space-y-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <PatientHeader
          onAddPatient={
            handleAddPatient
          }
        />

        {/* =====================================================
            PATIENT STATISTICS
        ===================================================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-6
          "
        >

          {/* TOTAL PATIENTS */}

          <div
            className="
              bg-white
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              p-6
            "
          >
            <p
              className="
                text-sm
                text-slate-500
              "
            >
              Total Patients
            </p>

            <p
              className="
                text-4xl
                font-bold
                text-slate-800
                mt-2
              "
            >
              {loading
                ? "..."
                : totalPatients}
            </p>
          </div>

          {/* ACTIVE PATIENTS */}

          <div
            className="
              bg-white
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              p-6
            "
          >
            <p
              className="
                text-sm
                text-slate-500
              "
            >
              Active Patients
            </p>

            <p
              className="
                text-4xl
                font-bold
                text-slate-800
                mt-2
              "
            >
              {loading
                ? "..."
                : activePatients}
            </p>
          </div>

          {/* NEW THIS MONTH */}

          <div
            className="
              bg-white
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              p-6
            "
          >
            <p
              className="
                text-sm
                text-slate-500
              "
            >
              New This Month
            </p>

            <p
              className="
                text-4xl
                font-bold
                text-slate-800
                mt-2
              "
            >
              {loading
                ? "..."
                : newThisMonth}
            </p>
          </div>

          {/* FOLLOW-UPS */}

          <div
            className="
              bg-white
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              p-6
            "
          >
            <p
              className="
                text-sm
                text-slate-500
              "
            >
              Follow-ups
            </p>

            <p
              className="
                text-4xl
                font-bold
                text-slate-800
                mt-2
              "
            >
              {loading
                ? "..."
                : followUps}
            </p>
          </div>

        </div>

        {/* =====================================================
            SEARCH + FILTERS
        ===================================================== */}

        <div
          className="
            flex
            flex-col
            lg:flex-row
            justify-between
            gap-4
          "
        >
          <PatientSearch
            search={search}
            setSearch={setSearch}
          />

          <PatientFilters
            status={status}
            setStatus={setStatus}
            gender={gender}
            setGender={setGender}
          />
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div
            className="
              bg-red-50
              border
              border-red-200
              rounded-xl
              p-5
            "
          >
            <p
              className="
                text-red-700
              "
            >
              {error}
            </p>

            <button
              type="button"
              onClick={loadPatients}
              className="
                mt-4
                px-4
                py-2
                rounded-lg
                bg-[#5F7A63]
                text-white
                hover:bg-[#4F6853]
                transition
              "
            >
              Try Again
            </button>
          </div>
        )}

        {/* =====================================================
            PATIENT TABLE
        ===================================================== */}

        <PatientTable
          search={search}
          status={status}
          gender={gender}
          refreshKey={patients.length}
          onView={handleViewPatient}
          onEdit={handleEditPatient}
          onDelete={loadPatients}
        />

      </div>

      {/* =======================================================
          CREATE / EDIT PATIENT MODAL
      ======================================================= */}

      {(modalType === "create" ||
        modalType === "edit") && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            backdrop-blur-sm
            p-4
          "
        >
          <div
            className="
              relative
              w-full
              max-w-4xl
              max-h-[90vh]
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >

            {/* MODAL HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-200
                px-6
                py-5
              "
            >
              <div>
                <h2
                  className="
                    text-2xl
                    font-semibold
                    text-slate-800
                  "
                >
                  {modalType === "create"
                    ? "Add New Patient"
                    : "Edit Patient"}
                </h2>

                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-1
                  "
                >
                  {modalType === "create"
                    ? "Create a new patient record."
                    : "Update patient information."}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleCloseModal
                }
                className="
                  w-10
                  h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-slate-500
                  hover:bg-slate-100
                  hover:text-slate-800
                  transition
                "
                aria-label="Close"
              >
                <span
                  className="
                    text-3xl
                    leading-none
                  "
                >
                  ×
                </span>
              </button>
            </div>

            {/* FORM */}

            <div
              className="
                max-h-[calc(90vh-90px)]
                overflow-y-auto
                p-6
              "
            >
              <PatientForm
                initialData={
                  modalType === "edit"
                    ? selectedPatient
                    : null
                }
                isEditing={
                  modalType === "edit"
                }
                onCancel={
                  handleCloseModal
                }
                onSuccess={
                  modalType === "create"
                    ? handlePatientCreated
                    : handlePatientUpdated
                }
              />
            </div>

          </div>
        </div>
      )}

    </Layout>
  );
}

export default Patients;