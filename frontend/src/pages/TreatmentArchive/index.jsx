import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiArchive,
  FiArrowLeft,
  FiCheckCircle,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/layout/Layout";

import {
  getArchivedTreatments,
  restoreTreatment,
  permanentlyDeleteTreatment,
} from "../../services/treatmentService";

import { getPatients } from "../../services/patientService";


function TreatmentArchive() {
  const navigate = useNavigate();

  const [treatments, setTreatments] = useState([]);
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [actionLoading, setActionLoading] = useState(null);

  const [recordToDelete, setRecordToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);


  // ============================================================
  // LOAD ARCHIVED TREATMENTS
  // ============================================================

  const loadArchivedTreatments = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        treatmentData,
        patientData,
      ] = await Promise.all([
        getArchivedTreatments(),
        getPatients(),
      ]);

      const treatmentList = Array.isArray(treatmentData)
        ? treatmentData
        : [];

      const patientList = Array.isArray(patientData)
        ? patientData
        : [];

      setPatients(patientList);

      const normalized = treatmentList.map((visit) => {
        const patientId =
          visit?.patient_id ??
          visit?.patient?.id ??
          null;

        const patient =
          patientList.find(
            (item) =>
              String(item.id) === String(patientId)
          ) ||
          visit?.patient ||
          null;

        const firstName =
          patient?.first_name ||
          visit?.patient_first_name ||
          "";

        const lastName =
          patient?.last_name ||
          visit?.patient_last_name ||
          "";

        const patientName =
          visit?.patient_name ||
          visit?.patient_full_name ||
          [firstName, lastName]
            .filter(Boolean)
            .join(" ")
            .trim() ||
          "Unknown patient";

        const patientMrn =
          visit?.medical_record_number ||
          visit?.patient_mrn ||
          visit?.mrn ||
          patient?.medical_record_number ||
          patient?.mrn ||
          "";

        return {
          id: visit?.id,
          patient_id: patientId,
          patient_name: patientName,
          medical_record_number: patientMrn,
          patient_mrn: patientMrn,

          treatment:
            visit?.diagnosis ||
            "Treatment record",

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

          appointment_id:
            visit?.appointment_id,

          is_archived:
            visit?.is_archived ?? true,
        };
      });

      setTreatments(normalized);

    } catch (err) {
      console.error(
        "Failed to load archived treatments:",
        err
      );

      setError(
        err?.message ||
        "Failed to load archived treatments."
      );
    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadArchivedTreatments();
  }, []);


  // ============================================================
  // SEARCH
  // ============================================================

  const filteredTreatments = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return treatments;
    }

    return treatments.filter((item) => {
      return (
        String(item?.patient_name || "")
          .toLowerCase()
          .includes(query) ||

        String(item?.medical_record_number || "")
          .toLowerCase()
          .includes(query) ||

        String(item?.diagnosis || "")
          .toLowerCase()
          .includes(query) ||

        String(item?.treatment || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [treatments, search]);


  // ============================================================
  // RESTORE
  // ============================================================

  const handleRestore = async (treatment) => {
    if (!treatment?.id || actionLoading) {
      return;
    }

    try {
      setActionLoading(treatment.id);
      setError("");

      await restoreTreatment(treatment.id);

      await loadArchivedTreatments();

    } catch (err) {
      console.error(
        "Failed to restore treatment:",
        err
      );

      setError(
        err?.message ||
        "Failed to restore treatment."
      );
    } finally {
      setActionLoading(null);
    }
  };


  // ============================================================
  // OPEN PERMANENT DELETE
  // ============================================================

  const handlePermanentDelete = (treatment) => {
    setError("");
    setRecordToDelete(treatment);
  };


  // ============================================================
  // CLOSE DELETE MODAL
  // ============================================================

  const closeDeleteModal = () => {
    if (deleting) {
      return;
    }

    setRecordToDelete(null);
  };


  // ============================================================
  // PERMANENT DELETE
  // ============================================================

  const confirmPermanentDelete = async () => {
    if (
      !recordToDelete?.id ||
      deleting
    ) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await permanentlyDeleteTreatment(
        recordToDelete.id
      );

      setRecordToDelete(null);

      await loadArchivedTreatments();

    } catch (err) {
      console.error(
        "Failed to permanently delete treatment:",
        err
      );

      setError(
        err?.message ||
        "Failed to permanently delete treatment."
      );
    } finally {
      setDeleting(false);
    }
  };


  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString(
      undefined,
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ============================================================
  // FORMAT STATUS
  // ============================================================

  const formatStatus = (value) => {
    const normalized =
      String(value || "")
        .toLowerCase()
        .replace(/_/g, " ");

    return normalized
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };


  // ============================================================
  // UI
  // ============================================================

  return (
    <Layout>
      <div className="space-y-7">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
        ">

          <div>
            <button
              type="button"
              onClick={() => navigate("/treatments")}
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-[#527565]
                transition
                hover:text-[#173B32]
              "
            >
              <FiArrowLeft size={16} />
              Back to Treatments
            </button>

            <div className="flex items-center gap-3">

              <div className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-[#EAF0EC]
                text-[#173B32]
              ">
                <FiArchive size={22} />
              </div>

              <div>
                <h1 className="
                  text-3xl
                  font-bold
                  tracking-tight
                  text-[#173B32]
                  sm:text-4xl
                ">
                  Treatment Archive
                </h1>

                <p className="
                  mt-1
                  text-sm
                  text-[#7E867F]
                ">
                  View, restore, or permanently remove archived treatment records.
                </p>
              </div>

            </div>
          </div>


          {/* REFRESH */}

          <button
            type="button"
            onClick={loadArchivedTreatments}
            disabled={loading}
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-[#B4935A]
              bg-[#FFFDF8]
              px-5
              text-sm
              font-semibold
              text-[#173B32]
              transition
              hover:bg-[#F8F4E9]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <FiRefreshCw
              size={16}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

        </div>


        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="
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
          ">
            <span className="
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
            ">
              !
            </span>

            <span>{error}</span>
          </div>
        )}


        {/* ======================================================
            SUMMARY
        ====================================================== */}

        <div className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
        ">

          <div className="
            rounded-2xl
            border
            border-[#E3DED2]
            bg-[#FFFDF8]
            p-5
            shadow-[0_4px_18px_rgba(23,59,50,0.05)]
          ">
            <p className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-[#7C887F]
            ">
              Archived Treatments
            </p>

            <p className="
              mt-2
              text-3xl
              font-bold
              text-[#173B32]
            ">
              {treatments.length}
            </p>
          </div>


          <div className="
            rounded-2xl
            border
            border-[#E3DED2]
            bg-[#FFFDF8]
            p-5
            shadow-[0_4px_18px_rgba(23,59,50,0.05)]
          ">
            <p className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-[#7C887F]
            ">
              Showing
            </p>

            <p className="
              mt-2
              text-3xl
              font-bold
              text-[#B4935A]
            ">
              {filteredTreatments.length}
            </p>
          </div>

        </div>


        {/* ======================================================
            SEARCH
        ====================================================== */}

        <div className="
          relative
          rounded-2xl
          border
          border-[#E3DED2]
          bg-[#FFFDF8]
          p-4
          shadow-[0_4px_18px_rgba(23,59,50,0.05)]
        ">

          <FiSearch
            className="
              absolute
              left-7
              top-1/2
              -translate-y-1/2
              text-[#8A958E]
            "
            size={18}
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by patient, MRN, diagnosis..."
            className="
              h-11
              w-full
              rounded-xl
              border
              border-[#DCE2DD]
              bg-[#F9F8F3]
              pl-11
              pr-4
              text-sm
              text-[#173B32]
              outline-none
              transition
              placeholder:text-[#9AA39D]
              focus:border-[#6F8F7D]
              focus:ring-2
              focus:ring-[#6F8F7D]/15
            "
          />

        </div>


        {/* ======================================================
            TABLE
        ====================================================== */}

        <div className="
          overflow-hidden
          rounded-2xl
          border
          border-[#E3DED2]
          bg-[#FFFDF8]
          shadow-[0_4px_18px_rgba(23,59,50,0.05)]
        ">

          {loading ? (
            <div className="
              flex
              min-h-75
              flex-col
              items-center
              justify-center
              px-6
              text-center
            ">
              <div className="
                h-10
                w-10
                animate-spin
                rounded-full
                border-4
                border-[#DDE7E1]
                border-t-[#173B32]
              " />

              <p className="
                mt-4
                text-sm
                font-semibold
                text-[#52615A]
              ">
                Loading archive...
              </p>
            </div>
          ) : filteredTreatments.length === 0 ? (

            <div className="
              flex
              min-h-75
              flex-col
              items-center
              justify-center
              px-6
              text-center
            ">

              <div className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-[#EAF0EC]
                text-[#527565]
              ">
                <FiArchive size={26} />
              </div>

              <h2 className="
                mt-5
                text-lg
                font-bold
                text-[#173B32]
              ">
                {search
                  ? "No matching records"
                  : "Archive is empty"}
              </h2>

              <p className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-[#7E867F]
              ">
                {search
                  ? "Try a different patient name, MRN, or diagnosis."
                  : "Archived treatment records will appear here."}
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="min-w-262.5 w-full">

                <thead>
                  <tr className="
                    border-b
                    border-[#E3DED2]
                    bg-[#F7F3E9]
                  ">

                    <th className="
                      px-5
                      py-4
                      text-left
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-[#6D7A73]
                    ">
                      Patient
                    </th>

                    <th className="
                      px-5
                      py-4
                      text-left
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-[#6D7A73]
                    ">
                      Treatment
                    </th>

                    <th className="
                      px-5
                      py-4
                      text-left
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-[#6D7A73]
                    ">
                      Date
                    </th>

                    <th className="
                      px-5
                      py-4
                      text-left
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-[#6D7A73]
                    ">
                      Status
                    </th>

                    <th className="
                      px-5
                      py-4
                      text-right
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-[#6D7A73]
                    ">
                      Actions
                    </th>

                  </tr>
                </thead>


                <tbody className="divide-y divide-[#EEE9DF]">

                  {filteredTreatments.map((treatment) => {

                    const restoring =
                      actionLoading === treatment.id;

                    return (
                      <tr
                        key={treatment.id}
                        className="
                          transition
                          hover:bg-[#FAF8F2]
                        "
                      >

                        {/* PATIENT */}

                        <td className="px-5 py-5">

                          <p className="
                            font-semibold
                            text-[#173B32]
                          ">
                            {treatment.patient_name}
                          </p>

                          <p className="
                            mt-1
                            text-xs
                            text-[#7E867F]
                          ">
                            MRN:{" "}
                            {treatment.medical_record_number ||
                              "—"}
                          </p>

                        </td>


                        {/* TREATMENT */}

                        <td className="px-5 py-5">

                          <p className="
                            max-w-75
                            truncate
                            font-medium
                            text-[#36564A]
                          ">
                            {treatment.treatment}
                          </p>

                          {treatment.chief_complaint && (
                            <p className="
                              mt-1
                              max-w-75
                              truncate
                              text-xs
                              text-[#89948E]
                            ">
                              {treatment.chief_complaint}
                            </p>
                          )}

                        </td>


                        {/* DATE */}

                        <td className="
                          whitespace-nowrap
                          px-5
                          py-5
                          text-sm
                          text-[#65736C]
                        ">
                          {formatDate(
                            treatment.date
                          )}
                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-5">

                          <span className="
                            inline-flex
                            items-center
                            rounded-full
                            border
                            border-[#DDD5C5]
                            bg-[#F8F4E9]
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-[#806B43]
                          ">
                            {formatStatus(
                              treatment.status
                            )}
                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td className="px-5 py-5">

                          <div className="
                            flex
                            justify-end
                            gap-2
                          ">

                            {/* RESTORE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleRestore(
                                  treatment
                                )
                              }
                              disabled={restoring}
                              className="
                                inline-flex
                                h-10
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-[#173B32]
                                px-4
                                text-xs
                                font-semibold
                                text-white
                                transition
                                hover:bg-[#214B40]
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                              "
                            >
                              {restoring ? (
                                <span className="
                                  h-3.5
                                  w-3.5
                                  animate-spin
                                  rounded-full
                                  border-2
                                  border-white/40
                                  border-t-white
                                " />
                              ) : (
                                <FiRefreshCw size={14} />
                              )}

                              Restore
                            </button>


                            {/* PERMANENT DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handlePermanentDelete(
                                  treatment
                                )
                              }
                              className="
                                inline-flex
                                h-10
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-[#E5C8C2]
                                bg-[#FFF7F5]
                                px-4
                                text-xs
                                font-semibold
                                text-[#9A4E43]
                                transition
                                hover:bg-[#FCEDEA]
                              "
                            >
                              <FiTrash2 size={14} />

                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>


      {/* ========================================================
          PERMANENT DELETE CONFIRMATION
      ======================================================== */}

      {recordToDelete && (
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
              closeDeleteModal();
            }
          }}
        >

          <div
            role="dialog"
            aria-modal="true"
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

            <div className="
              h-1.5
              w-full
              bg-[#A15D50]
            " />


            <button
              type="button"
              onClick={closeDeleteModal}
              disabled={deleting}
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
                disabled:opacity-50
              "
            >
              <FiX size={18} />
            </button>


            <div className="
              px-6
              pb-7
              pt-8
              sm:px-8
            ">

              <div className="
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
              ">
                <FiAlertTriangle
                  size={25}
                  strokeWidth={1.8}
                />
              </div>


              <h2 className="
                mt-5
                pr-8
                text-xl
                font-bold
                tracking-tight
                text-[#173B32]
              ">
                Permanently Delete Treatment?
              </h2>


              <p className="
                mt-2
                text-sm
                leading-6
                text-[#68766E]
              ">
                This will permanently remove this archived
                treatment record. This action cannot be undone.
              </p>


              <div className="
                mt-5
                rounded-2xl
                border
                border-[#E4DED1]
                bg-[#F8F5ED]
                px-4
                py-3.5
              ">

                <p className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-[#8A958E]
                ">
                  Archived record
                </p>

                <p className="
                  mt-1.5
                  truncate
                  text-sm
                  font-semibold
                  text-[#173B32]
                ">
                  {recordToDelete.patient_name}
                </p>

                <p className="
                  mt-0.5
                  truncate
                  text-xs
                  text-[#77847D]
                ">
                  {recordToDelete.treatment}
                </p>

              </div>


              <div className="
                mt-7
                flex
                flex-col-reverse
                gap-3
                sm:flex-row
                sm:justify-end
              ">

                <button
                  type="button"
                  onClick={closeDeleteModal}
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
                    hover:bg-[#EAF0EC]
                    disabled:opacity-60
                  "
                >
                  Cancel
                </button>


                <button
                  type="button"
                  onClick={confirmPermanentDelete}
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
                    transition
                    hover:bg-[#863F35]
                    disabled:opacity-60
                  "
                >
                  {deleting ? (
                    <>
                      <span className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/40
                        border-t-white
                      " />

                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 size={15} />
                      Permanently Delete
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

export default TreatmentArchive;