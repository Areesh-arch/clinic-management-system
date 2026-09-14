import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  FiAlertTriangle,
  FiTrash2,
  FiX,
} from "react-icons/fi";

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
  const [treatments, setTreatments] = useState([]);
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [showModal, setShowModal] = useState(false);

  const [
    editingTreatment,
    setEditingTreatment,
  ] = useState(null);

  // =====================================================
  // DELETE CONFIRMATION
  // =====================================================

  const [
    treatmentToDelete,
    setTreatmentToDelete,
  ] = useState(null);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

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
      // NORMALIZE VISITS INTO TREATMENT RECORDS
      // =================================================

      const normalized = treatmentList.map((visit) => {
        const patientId =
          visit?.patient_id ??
          visit?.patient?.id ??
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
        // EMBEDDED PATIENT
        // ---------------------------------------------

        const embeddedPatient =
          visit?.patient ||
          visit?.patient_data ||
          visit?.patient_info ||
          null;


        // ---------------------------------------------
        // PATIENT NAME
        // ---------------------------------------------

        const embeddedFirstName =
          embeddedPatient?.first_name ||
          visit?.patient_first_name ||
          "";

        const embeddedLastName =
          embeddedPatient?.last_name ||
          visit?.patient_last_name ||
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
          patient?.first_name || "";

        const patientLastName =
          patient?.last_name || "";

        const patientFullName =
          [
            patientFirstName,
            patientLastName,
          ]
            .filter(Boolean)
            .join(" ")
            .trim();


        const patientName =
          visit?.patient_name ||
          visit?.patient_full_name ||
          embeddedPatient?.name ||
          embeddedPatient?.full_name ||
          embeddedFullName ||
          patientFullName ||
          "Unknown patient";


        // ---------------------------------------------
        // PATIENT MRN
        // ---------------------------------------------

        const patientMrn =
          visit?.medical_record_number ||
          visit?.patient_mrn ||
          visit?.mrn ||
          embeddedPatient?.medical_record_number ||
          embeddedPatient?.mrn ||
          patient?.medical_record_number ||
          patient?.mrn ||
          "";


        // ---------------------------------------------
        // NORMALIZED TREATMENT
        // ---------------------------------------------

        return {
          id: visit?.id,

          tenant_id:
            visit?.tenant_id,

          appointment_id:
            visit?.appointment_id,

          patient_id:
            patientId,

          patient_name:
            patientName,

          medical_record_number:
            patientMrn,

          patient_mrn:
            patientMrn,

          patient,

          treatment:
            visit?.diagnosis ||
            "—",

          diagnosis:
            visit?.diagnosis ||
            "",

          chief_complaint:
            visit?.chief_complaint ||
            "",

          notes:
            visit?.notes ||
            "",

          date:
            visit?.visit_time,

          cost:
            visit?.charge ?? 0,

          charge:
            visit?.charge ?? 0,

          status:
            visit?.status ||
            "IN_PROGRESS",

          appointment_status:
            visit?.appointment_status ||
            "",
        };
      });


      setTreatments(normalized);

    } catch (err) {
      console.error(
        "Failed to load treatments:",
        err
      );

      setError(
        err?.message ||
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
        String(item?.status || "")
          .toUpperCase() ===
        "COMPLETED"
    ).length;

  const inProgress =
    treatments.filter(
      (item) =>
        String(item?.status || "")
          .toUpperCase() ===
        "IN_PROGRESS"
    ).length;

  const cancelled =
    treatments.filter(
      (item) =>
        String(item?.status || "")
          .toUpperCase() ===
        "CANCELLED"
    ).length;


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
    setEditingTreatment(treatment);
    setError("");
    setShowModal(true);
  };


  // =====================================================
  // CREATED / UPDATED
  // =====================================================

  const handleTreatmentSuccess = async () => {
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
  // OPEN DELETE CONFIRMATION
  // =====================================================

  const handleDelete = (treatment) => {
    setError("");

    setTreatmentToDelete(treatment);
  };


  // =====================================================
  // CLOSE DELETE CONFIRMATION
  // =====================================================

  const closeDeleteConfirmation = () => {
    if (deleting) {
      return;
    }

    setTreatmentToDelete(null);
  };


  // =====================================================
  // CONFIRM DELETE
  // =====================================================

  const confirmDelete = async () => {
    if (
      !treatmentToDelete?.id ||
      deleting
    ) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteTreatment(
        treatmentToDelete.id
      );

      setTreatmentToDelete(null);

      await loadTreatments();

    } catch (err) {
      console.error(
        "Failed to delete treatment:",
        err
      );

      setError(
        err?.message ||
        "Failed to delete treatment."
      );

    } finally {
      setDeleting(false);
    }
  };


  // =====================================================
  // STAT CARD
  // =====================================================

  const StatCard = ({
    label,
    value,
    accent,
    icon,
  }) => (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-[#E3DED2]
        bg-[#FFFDF8]
        p-5
        shadow-[0_4px_18px_rgba(23,59,50,0.05)]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_10px_28px_rgba(23,59,50,0.09)]
      "
    >
      <div
        className={`
          absolute
          left-0
          top-0
          h-full
          w-1
          ${accent}
        `}
      />

      <div className="flex items-center justify-between">
        <div>
          <p
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-[#7C887F]
            "
          >
            {label}
          </p>

          <p
            className="
              mt-2
              text-3xl
              font-bold
              tracking-tight
              text-[#173B32]
            "
          >
            {value}
          </p>
        </div>

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-[#F1F5F2]
            text-lg
            text-[#527565]
          "
        >
          {icon}
        </div>
      </div>
    </div>
  );


  // =====================================================
  // UI
  // =====================================================

  return (
    <Layout>
      <div className="space-y-7">

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
            STATS
            ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <StatCard
            label="Total Treatments"
            value={total}
            accent="bg-[#173B32]"
            icon="✦"
          />

          <StatCard
            label="Completed"
            value={completed}
            accent="bg-[#6F8F7D]"
            icon="✓"
          />

          <StatCard
            label="In Progress"
            value={inProgress}
            accent="bg-[#B4935A]"
            icon="◷"
          />

          <StatCard
            label="Cancelled"
            value={cancelled}
            accent="bg-[#A15D50]"
            icon="×"
          />
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
          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-[#E3DED2]
              bg-[#FFFDF8]
              shadow-[0_4px_18px_rgba(23,59,50,0.05)]
            "
          >
            <div
              className="
                flex
                min-h-65
                flex-col
                items-center
                justify-center
                px-6
                text-center
              "
            >
              <div
                className="
                  h-10
                  w-10
                  animate-spin
                  rounded-full
                  border-4
                  border-[#DDE7E1]
                  border-t-[#173B32]
                "
              />

              <p
                className="
                  mt-4
                  text-sm
                  font-semibold
                  text-[#52615A]
                "
              >
                Loading treatments...
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-[#89948E]
                "
              >
                Please wait while your treatment records load.
              </p>
            </div>
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


      {/* =================================================
          PROFESSIONAL DELETE CONFIRMATION
          ================================================= */}

      {treatmentToDelete && (
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
            aria-labelledby="delete-treatment-title"
            aria-describedby="delete-treatment-description"
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
              onClick={closeDeleteConfirmation}
              disabled={deleting}
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

            <div className="px-6 pb-6 pt-7 sm:px-8 sm:pb-8">

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
                id="delete-treatment-title"
                className="
                  mt-5
                  pr-8
                  text-xl
                  font-bold
                  tracking-tight
                  text-[#173B32]
                "
              >
                Delete Treatment?
              </h2>


              {/* DESCRIPTION */}

              <p
                id="delete-treatment-description"
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-[#68766E]
                "
              >
                Are you sure you want to permanently
                delete this treatment record? This
                action cannot be undone.
              </p>


              {/* TREATMENT INFO */}

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
                  Treatment record
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
                  {treatmentToDelete?.patient_name ||
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
                  {treatmentToDelete?.treatment ||
                    treatmentToDelete?.diagnosis ||
                    "Treatment record"}
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
                <button
                  type="button"
                  onClick={closeDeleteConfirmation}
                  disabled={deleting}
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

                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleting}
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
                      Delete Treatment
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


export default Treatments;