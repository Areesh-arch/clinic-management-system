import {
  useEffect,
  useMemo,
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


function Treatments() {

  const [treatments, setTreatments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [doctor, setDoctor] =
    useState("All");

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
  // LOAD TREATMENTS
  // =====================================================

  const loadTreatments = async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await getTreatments();

      console.log(
        "Treatments received from backend:",
        data
      );

      const normalized =
        Array.isArray(data)
          ? data.map((visit) => ({
              id: visit.id,

              tenant_id:
                visit.tenant_id,

              appointment_id:
                visit.appointment_id,

              patient_id:
                visit.patient_id,

              doctor_id:
                visit.doctor_id,

              patient_name:
                visit.patient_name ||
                `Patient #${visit.patient_id}`,

              doctor_name:
                visit.doctor_name ||
                `Doctor #${visit.doctor_id}`,

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
            }))
          : [];

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
  // DOCTORS
  // =====================================================

  const doctors =
    useMemo(() => {

      return [
        ...new Set(
          treatments
            .map(
              (item) =>
                item.doctor_name
            )
            .filter(Boolean)
        ),
      ];

    }, [treatments]);


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

  const scheduled =
    treatments.filter(
      (item) =>
        item.status ===
        "SCHEDULED"
    ).length;

  const inProgress =
    treatments.filter(
      (item) =>
        item.status ===
        "IN_PROGRESS"
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
              Scheduled
            </h3>

            <p className="text-3xl font-bold mt-3">
              {scheduled}
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
          doctor={doctor}
          setDoctor={setDoctor}
          status={status}
          setStatus={setStatus}
          doctors={doctors}
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
            doctor={doctor}
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