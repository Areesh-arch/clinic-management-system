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
import TreatmentForm from "../../components/treatments/TreatmentForm";

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


  // ==========================================
  // LOAD TREATMENTS
  // ==========================================

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
          ? data.map(
              (visit) => ({
                id: visit.id,

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

                date:
                  visit.visit_time,

                cost:
                  visit.charge,

                status:
                  visit.status,
              })
            )
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


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    loadTreatments();

  }, []);


  // ==========================================
  // OPEN ?new=true
  // ==========================================

  useEffect(() => {

    if (
      searchParams.get("new") === "true"
    ) {

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


  // ==========================================
  // DOCTORS FOR FILTER
  // ==========================================

  const doctors = useMemo(() => {

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


  // ==========================================
  // STATS
  // ==========================================

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


  // ==========================================
  // CREATED
  // ==========================================

  const handleTreatmentCreated =
    async () => {

      setShowModal(false);

      await loadTreatments();

    };


  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit =
    (treatment) => {

      setEditingTreatment(
        treatment
      );

      setShowModal(true);

    };


  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete =
    async (treatment) => {

      const confirmed =
        window.confirm(
          `Are you sure you want to delete this treatment?`
        );


      if (!confirmed) {
        return;
      }


      try {

        await deleteTreatment(
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


  return (
    <Layout>

      <div className="space-y-8">

        {/* ====================================
            HEADER
        ==================================== */}

        <TreatmentHeader
          onAddTreatment={() => {

            setEditingTreatment(
              null
            );

            setShowModal(true);

          }}
        />


        {/* ====================================
            ERROR
        ==================================== */}

        {error && (

          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">
            {error}
          </div>

        )}


        {/* ====================================
            STATS
        ==================================== */}

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


        {/* ====================================
            SEARCH
        ==================================== */}

        <TreatmentSearch
          search={search}
          setSearch={setSearch}
        />


        {/* ====================================
            FILTERS
        ==================================== */}

        <TreatmentFilters
          doctor={doctor}
          setDoctor={setDoctor}
          status={status}
          setStatus={setStatus}
          doctors={doctors}
        />


        {/* ====================================
            LOADING
        ==================================== */}

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


      {/* ======================================
          MODAL
      ====================================== */}

      {showModal && (

        <TreatmentModal
          open={showModal}
          onClose={() => {

            setShowModal(false);

            setEditingTreatment(
              null
            );

          }}
        >

          <TreatmentForm
            treatment={
              editingTreatment
            }

            onSuccess={
              handleTreatmentCreated
            }

            onClose={() => {

              setShowModal(false);

              setEditingTreatment(
                null
              );

            }}
          />

        </TreatmentModal>

      )}

    </Layout>
  );
}


export default Treatments;