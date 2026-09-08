import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import Layout from "../../components/layout/Layout";

import TreatmentHeader from "../../components/treatments/TreatmentHeader";
import TreatmentSearch from "../../components/treatments/TreatmentSearch";
import TreatmentFilters from "../../components/treatments/TreatmentFilters";
import TreatmentTable from "../../components/treatments/TreatmentTable";
import TreatmentModal from "../../components/treatments/TreatmentModal";

import {
  getTreatments,
  deleteTreatment,
} from "../../services/treatmentService";

import {
  getPatients,
} from "../../services/patientService";


function Treatments() {

  const [treatments, setTreatments] =
    useState([]);

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

  const [showModal, setShowModal] =
    useState(false);

  const [
    editingTreatment,
    setEditingTreatment,
  ] = useState(null);

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();


  // =====================================================
  // LOAD TREATMENTS + PATIENTS
  // =====================================================

  const loadTreatments = async () => {

    try {

      setLoading(true);
      setError("");

      const [
        treatmentData,
        patientData,
      ] = await Promise.all([
        getTreatments(),
        getPatients(),
      ]);

      console.log(
        "Treatments received from backend:",
        treatmentData
      );

      console.log(
        "Patients received from backend:",
        patientData
      );

      const treatmentList =
        Array.isArray(treatmentData)
          ? treatmentData
          : [];

      const patientList =
        Array.isArray(patientData)
          ? patientData
          : [];

      setPatients(patientList);


      // =================================================
      // NORMALIZE TREATMENTS / VISITS
      // =================================================

      const normalized =
        treatmentList.map((visit) => {

          const patientId =
            visit.patient_id ??
            visit.patient?.id ??
            null;


          // ---------------------------------------------
          // FIND REAL PATIENT
          // ---------------------------------------------

          const patient =
            patientList.find(
              (item) =>
                String(item.id) ===
                String(patientId)
            ) || null;


          // ---------------------------------------------
          // PATIENT NAME
          // ---------------------------------------------

          const embeddedPatient =
            visit.patient ||
            visit.patient_data ||
            visit.patient_info ||
            null;


          const embeddedFirstName =
            embeddedPatient?.first_name ||
            visit.patient_first_name ||
            "";


          const embeddedLastName =
            embeddedPatient?.last_name ||
            visit.patient_last_name ||
            "";


          const embeddedFullName =
            [
              embeddedFirstName,
              embeddedLastName,
            ]
              .filter(Boolean)
              .join(" ")
              .trim();


          const patientFirstName =
            patient?.first_name ||
            "";


          const patientLastName =
            patient?.last_name ||
            "";


          const patientFullName =
            [
              patientFirstName,
              patientLastName,
            ]
              .filter(Boolean)
              .join(" ")
              .trim();


          const patientName =
            visit.patient_name ||
            visit.patient_full_name ||
            embeddedPatient?.name ||
            embeddedPatient?.full_name ||
            embeddedFullName ||
            patientFullName ||
            "Unknown patient";


          // ---------------------------------------------
          // PATIENT MRN
          // ---------------------------------------------

          const patientMrn =
            visit.medical_record_number ||
            visit.patient_mrn ||
            visit.mrn ||
            embeddedPatient?.medical_record_number ||
            embeddedPatient?.mrn ||
            patient?.medical_record_number ||
            patient?.mrn ||
            "";


          // ---------------------------------------------
          // RETURN NORMALIZED TREATMENT
          // ---------------------------------------------

          return {

            id:
              visit.id,

            tenant_id:
              visit.tenant_id,

            appointment_id:
              visit.appointment_id,

            patient_id:
              patientId,

            patient_name:
              patientName,

            medical_record_number:
              patientMrn,

            patient_mrn:
              patientMrn,

            patient:
              patient,

            treatment:
              visit.diagnosis ||
              "—",

            diagnosis:
              visit.diagnosis ||
              "",

            chief_complaint:
              visit.chief_complaint ||
              "",

            notes:
              visit.notes ||
              "",

            date:
              visit.visit_time,

            cost:
              visit.charge ?? 0,

            charge:
              visit.charge ?? 0,

            status:
              visit.status,

          };

        });


      console.log(
        "Normalized treatments:",
        normalized
      );


      setTreatments(normalized);


    } catch (err) {

      console.error(
        "Failed to load treatments:",
        err
      );

      setError(
        err.message ||
        "Failed to load treatments."
      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    loadTreatments();

  }, []);


  // =====================================================
  // OPEN ?new=true
  // =====================================================

  useEffect(() => {

    if (
      searchParams.get("new") === "true"
    ) {

      setEditingTreatment(null);

      setShowModal(true);

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


  // =====================================================
  // STATISTICS
  // =====================================================

  const total =
    treatments.length;


  const completed =
    treatments.filter(
      (item) =>
        item.status ===
        "COMPLETED"
    ).length;


  const inProgress =
    treatments.filter(
      (item) =>
        item.status ===
        "IN_PROGRESS"
    ).length;


  const cancelled =
    treatments.filter(
      (item) =>
        item.status ===
        "CANCELLED"
    ).length;


  const card =
    "bg-white rounded-2xl shadow-sm p-6 border border-[#E6E1D8]";


  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const handleAddTreatment = () => {

    setEditingTreatment(null);

    setError("");

    setShowModal(true);

  };


  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEdit = (treatment) => {

    console.log(
      "Editing treatment:",
      treatment
    );

    setEditingTreatment(
      treatment
    );

    setError("");

    setShowModal(true);

  };


  // =====================================================
  // CREATED / UPDATED
  // =====================================================

  const handleTreatmentSuccess =
    async () => {

      setShowModal(false);

      setEditingTreatment(null);

      await loadTreatments();

    };


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {

    setShowModal(false);

    setEditingTreatment(null);

  };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete =
    async (treatment) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this treatment?"
        );


      if (!confirmed) {
        return;
      }


      try {

        setError("");

        console.log(
          "Deleting treatment:",
          treatment.id
        );


        await deleteTreatment(
          treatment.id
        );


        console.log(
          "Treatment deleted successfully:",
          treatment.id
        );


        await loadTreatments();


      } catch (err) {

        console.error(
          "Failed to delete treatment:",
          err
        );


        setError(
          err.message ||
          "Failed to delete treatment."
        );

      }

    };


  // =====================================================
  // UI
  // =====================================================

  return (

    <Layout>

      <div className="space-y-8">

        {/* =================================================
            HEADER
            ================================================= */}

        <TreatmentHeader
          onAddTreatment={
            handleAddTreatment
          }
        />


        {/* =================================================
            ERROR
            ================================================= */}

        {error && (

          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">

            {error}

          </div>

        )}


        {/* =================================================
            STATS
            ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <div className={card}>

            <h3>
              Total Treatments
            </h3>

            <p className="text-3xl font-bold mt-3">
              {total}
            </p>

          </div>


          <div className={card}>

            <h3>
              Completed
            </h3>

            <p className="text-3xl font-bold mt-3">
              {completed}
            </p>

          </div>


          <div className={card}>

            <h3>
              In Progress
            </h3>

            <p className="text-3xl font-bold mt-3">
              {inProgress}
            </p>

          </div>


          <div className={card}>

            <h3>
              Cancelled
            </h3>

            <p className="text-3xl font-bold mt-3">
              {cancelled}
            </p>

          </div>

        </div>


        {/* =================================================
            SEARCH
            ================================================= */}

        <TreatmentSearch
          search={search}
          setSearch={setSearch}
        />


        {/* =================================================
            FILTERS
            ================================================= */}

        <TreatmentFilters
          status={status}
          setStatus={setStatus}
        />


        {/* =================================================
            TABLE
            ================================================= */}

        {loading ? (

          <div className="bg-white rounded-2xl border border-[#E6E1D8] p-10 text-center">

            <p className="text-gray-500">
              Loading treatments...
            </p>

          </div>

        ) : (

          <TreatmentTable
            treatments={treatments}
            search={search}
            status={status}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

        )}

      </div>


      {/* =================================================
          TREATMENT MODAL
          ================================================= */}

      <TreatmentModal
        isOpen={showModal}
        onClose={closeModal}
        onSuccess={handleTreatmentSuccess}
        treatment={editingTreatment}
      />

    </Layout>

  );

}


export default Treatments;