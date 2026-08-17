import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Layout from "../../components/layout/Layout";

import PatientForm from "../../components/patients/PatientForm";
import PatientHeader from "../../components/patients/PatientHeader";
import PatientSearch from "../../components/patients/PatientSearch";
import PatientFilters from "../../components/patients/PatientFilters";
import PatientTable from "../../components/patients/PatientTable";

import { getPatients } from "../../services/patientService";

function Patients() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [gender, setGender] = useState("All");

  /*
   * Modal types:
   *
   * null    = no modal
   * create  = add patient
   * view    = view patient
   * edit    = edit patient
   */
  const [modalType, setModalType] = useState(null);

  const [selectedPatient, setSelectedPatient] = useState(null);

  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  /*
   * ============================================================
   * LOAD PATIENTS FROM BACKEND
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
      } else if (Array.isArray(data.items)) {
        patientList = data.items;
      } else if (Array.isArray(data.results)) {
        patientList = data.results;
      }

      console.log(
        "Patients loaded from database:",
        patientList
      );

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
   * Load patients when page opens.
   */

  useEffect(() => {
    loadPatients();
  }, []);

  /*
   * ============================================================
   * OPEN ADD PATIENT
   * ============================================================
   */

  const handleAddPatient = () => {
    console.log("Opening Add Patient form");

    setSelectedPatient(null);
    setModalType("create");
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

    /*
     * Close modal.
     */

    setModalType(null);
    setSelectedPatient(null);

    /*
     * Reload patients from PostgreSQL.
     */

    await loadPatients();
  };

  /*
   * ============================================================
   * VIEW PATIENT
   * ============================================================
   */

  const handleViewPatient = (patient) => {
    console.log(
      "Opening patient:",
      patient
    );

    setSelectedPatient(patient);
    setModalType("view");
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

    /*
     * Close edit modal.
     */

    setModalType(null);
    setSelectedPatient(null);

    /*
     * Reload database data.
     */

    await loadPatients();
  };

  /*
   * ============================================================
   * CLOSE MODAL
   * ============================================================
   */

  const handleCloseModal = () => {
    console.log("Closing patient modal");

    setModalType(null);
    setSelectedPatient(null);
  };

  /*
   * ============================================================
   * HANDLE ?new=true
   * ============================================================
   */

  useEffect(() => {
    if (searchParams.get("new") === "true") {
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
   * REAL PATIENT STATISTICS
   * ============================================================
   */

  const totalPatients =
    patients.length;

  const activePatients =
    patients.filter(
      (patient) =>
        patient.is_active === true ||
        patient.status === "active" ||
        patient.status === "Active"
    ).length;

  const currentMonth =
    new Date().getMonth();

  const currentYear =
    new Date().getFullYear();

  const newThisMonth =
    patients.filter((patient) => {
      if (!patient.created_at) {
        return false;
      }

      const createdDate =
        new Date(patient.created_at);

      return (
        createdDate.getMonth() ===
          currentMonth &&
        createdDate.getFullYear() ===
          currentYear
      );
    }).length;

  /*
   * Follow-ups are not being calculated yet because
   * the patient endpoint does not provide follow-up
   * information.
   *
   * Do NOT use fake data here.
   */

  const followUps = 0;

  return (
    <Layout>
      <div className="space-y-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <PatientHeader
          onAddPatient={handleAddPatient}
        />

        {/* =====================================================
            PATIENT STATISTICS
        ===================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* TOTAL PATIENTS */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-sm text-slate-500">
              Total Patients
            </p>

            <p className="text-4xl font-bold text-slate-800 mt-2">
              {loading
                ? "..."
                : totalPatients}
            </p>
          </div>

          {/* ACTIVE PATIENTS */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-sm text-slate-500">
              Active Patients
            </p>

            <p className="text-4xl font-bold text-slate-800 mt-2">
              {loading
                ? "..."
                : activePatients}
            </p>
          </div>

          {/* NEW THIS MONTH */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-sm text-slate-500">
              New This Month
            </p>

            <p className="text-4xl font-bold text-slate-800 mt-2">
              {loading
                ? "..."
                : newThisMonth}
            </p>
          </div>

          {/* FOLLOW UPS */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-sm text-slate-500">
              Follow-ups
            </p>

            <p className="text-4xl font-bold text-slate-800 mt-2">
              {followUps}
            </p>
          </div>

        </div>

        {/* =====================================================
            SEARCH + FILTERS
        ===================================================== */}

        <div className="flex flex-col lg:flex-row justify-between gap-4">

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
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">

            <p className="text-red-700">
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
          CREATE / EDIT MODAL
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

                <h2 className="text-2xl font-semibold text-slate-800">
                  {modalType === "create"
                    ? "Add New Patient"
                    : "Edit Patient"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {modalType === "create"
                    ? "Create a new patient record."
                    : "Update patient information."}
                </p>

              </div>

              {/* CLOSE BUTTON */}

              <button
                type="button"
                onClick={handleCloseModal}
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
                <span className="text-3xl leading-none">
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

      {/* =======================================================
          VIEW PATIENT MODAL
      ======================================================= */}

      {modalType === "view" &&
        selectedPatient && (

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
              max-w-3xl
              max-h-[90vh]
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >

            {/* VIEW HEADER */}

            <div
              className="
                sticky
                top-0
                z-10
                bg-white
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

                <h2 className="text-2xl font-semibold text-slate-800">
                  Patient Details
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Complete patient information
                </p>

              </div>

              <button
                type="button"
                onClick={handleCloseModal}
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
                <span className="text-3xl leading-none">
                  ×
                </span>
              </button>

            </div>

            {/* VIEW CONTENT */}

            <div className="max-h-[calc(90vh-90px)] overflow-y-auto p-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <Detail
                  label="First Name"
                  value={
                    selectedPatient.first_name
                  }
                />

                <Detail
                  label="Last Name"
                  value={
                    selectedPatient.last_name
                  }
                />

                <Detail
                  label="Gender"
                  value={
                    selectedPatient.gender
                  }
                />

                <Detail
                  label="Date of Birth"
                  value={
                    selectedPatient.date_of_birth
                  }
                />

                <Detail
                  label="Phone"
                  value={
                    selectedPatient.phone
                  }
                />

                <Detail
                  label="Email"
                  value={
                    selectedPatient.email
                  }
                />

                <Detail
                  label="CNIC"
                  value={
                    selectedPatient.cnic
                  }
                />

                <Detail
                  label="Occupation"
                  value={
                    selectedPatient.occupation
                  }
                />

                <Detail
                  label="City"
                  value={
                    selectedPatient.city
                  }
                />

                <Detail
                  label="Country"
                  value={
                    selectedPatient.country
                  }
                />

                <Detail
                  label="Blood Group"
                  value={
                    selectedPatient.blood_group
                  }
                />

                <Detail
                  label="Marital Status"
                  value={
                    selectedPatient.marital_status
                  }
                />

                <Detail
                  label="Emergency Contact"
                  value={
                    selectedPatient.emergency_contact_name
                  }
                />

                <Detail
                  label="Emergency Phone"
                  value={
                    selectedPatient.emergency_contact_phone
                  }
                />

              </div>

              {/* LONG TEXT FIELDS */}

              <div className="mt-6 space-y-5">

                <Detail
                  label="Address"
                  value={
                    selectedPatient.address
                  }
                />

                <Detail
                  label="Allergies"
                  value={
                    selectedPatient.allergies
                  }
                />

                <Detail
                  label="Medical History"
                  value={
                    selectedPatient.medical_history
                  }
                />

                <Detail
                  label="Notes"
                  value={
                    selectedPatient.notes
                  }
                />

              </div>

              {/* VIEW FOOTER */}

              <div
                className="
                  flex
                  justify-end
                  gap-3
                  mt-8
                  pt-5
                  border-t
                  border-slate-200
                "
              >

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    border
                    border-slate-300
                    text-slate-700
                    hover:bg-slate-50
                    transition
                  "
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setModalType("edit");
                  }}
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    bg-[#5F7A63]
                    text-white
                    hover:bg-[#4F6853]
                    transition
                  "
                >
                  Edit Patient
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </Layout>
  );
}

/*
 * ============================================================
 * DETAIL COMPONENT
 * ============================================================
 */

function Detail({
  label,
  value,
}) {
  return (
    <div className="w-full">

      <p className="text-sm font-medium text-slate-500 mb-1">
        {label}
      </p>

      <div
        className="
          rounded-xl
          bg-slate-50
          border
          border-slate-200
          px-4
          py-3
          text-slate-800
          min-h-[46px]
        "
      >
        {value || "—"}
      </div>

    </div>
  );
}

export default Patients;