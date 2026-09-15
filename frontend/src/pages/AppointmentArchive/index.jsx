import { useEffect, useMemo, useState } from "react";

import {
  FiAlertTriangle,
  FiArchive,
  FiArrowLeft,
  FiRefreshCw,
  FiRotateCcw,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import Layout from "../../components/layout/Layout";

import {
  getArchivedAppointments,
  restoreAppointment,
  permanentlyDeleteAppointment,
} from "../../services/appointmentService";


function AppointmentArchive() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [actionId, setActionId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [permanentlyDeleting, setPermanentlyDeleting] =
    useState(false);


  // =====================================================
  // LOAD ARCHIVED APPOINTMENTS
  // =====================================================

  const loadArchivedAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getArchivedAppointments();

      if (Array.isArray(response)) {
        setAppointments(response);
      } else if (Array.isArray(response?.items)) {
        setAppointments(response.items);
      } else if (Array.isArray(response?.results)) {
        setAppointments(response.results);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error(
        "Failed to load archived appointments:",
        err
      );

      setError(
        err?.message ||
          "Failed to load archived appointments."
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadArchivedAppointments();
  }, []);


  // =====================================================
  // FILTER
  // =====================================================

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return appointments;
    }

    return appointments.filter((appointment) => {
      const patientName = String(
        appointment?.patient_name || ""
      ).toLowerCase();

      const mrn = String(
        appointment?.medical_record_number || ""
      ).toLowerCase();

      const reason = String(
        appointment?.reason || ""
      ).toLowerCase();

      const source = String(
        appointment?.source || ""
      ).toLowerCase();

      return (
        patientName.includes(query) ||
        mrn.includes(query) ||
        reason.includes(query) ||
        source.includes(query)
      );
    });
  }, [appointments, search]);


  // =====================================================
  // RESTORE
  // =====================================================

  const handleRestore = async (appointment) => {
    if (!appointment?.id) {
      return;
    }

    try {
      setActionId(appointment.id);
      setError("");

      await restoreAppointment(appointment.id);

      setAppointments((current) =>
        current.filter(
          (item) => item.id !== appointment.id
        )
      );
    } catch (err) {
      console.error(
        "Failed to restore appointment:",
        err
      );

      setError(
        err?.message ||
          "Failed to restore appointment."
      );
    } finally {
      setActionId(null);
    }
  };


  // =====================================================
  // PERMANENT DELETE
  // =====================================================

  const handlePermanentDelete = async () => {
    if (
      !deleteTarget?.id ||
      permanentlyDeleting
    ) {
      return;
    }

    try {
      setPermanentlyDeleting(true);
      setError("");

      await permanentlyDeleteAppointment(
        deleteTarget.id
      );

      setAppointments((current) =>
        current.filter(
          (item) => item.id !== deleteTarget.id
        )
      );

      setDeleteTarget(null);
    } catch (err) {
      console.error(
        "Failed to permanently delete appointment:",
        err
      );

      setError(
        err?.message ||
          "Failed to permanently delete appointment."
      );
    } finally {
      setPermanentlyDeleting(false);
    }
  };


  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "—";
    }

    const date = new Date(
      `${dateValue}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  // =====================================================
  // TIME FORMAT
  // =====================================================

  const formatTime = (timeValue) => {
    if (!timeValue) {
      return "—";
    }

    return String(timeValue).slice(0, 5);
  };


  // =====================================================
  // STATUS LABEL
  // =====================================================

  const formatStatus = (status) => {
    return String(status || "scheduled")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };


  // =====================================================
  // SOURCE LABEL
  // =====================================================

  const formatSource = (source) => {
    return String(source || "clinic")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Layout>
      <div className="space-y-7">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <button
              type="button"
              onClick={() =>
                navigate("/appointments")
              }
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-[#6F7D74]
                transition
                hover:text-[#173B32]
              "
            >
              <FiArrowLeft size={16} />
              Back to Appointments
            </button>

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#173B32]
                  text-[#D8C18E]
                  shadow-[0_8px_24px_rgba(23,59,50,0.16)]
                "
              >
                <FiArchive size={22} />
              </div>

              <div>
                <h1
                  className="
                    text-3xl
                    font-bold
                    tracking-tight
                    text-[#173B32]
                    sm:text-4xl
                  "
                >
                  Appointment Archive
                </h1>

                <p
                  className="
                    mt-1
                    text-sm
                    text-[#718078]
                  "
                >
                  View, restore, or permanently remove archived appointments.
                </p>
              </div>

            </div>
          </div>


          <button
            type="button"
            onClick={loadArchivedAppointments}
            disabled={loading}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-[#D9DED8]
              bg-[#FFFDF8]
              px-4
              py-2.5
              text-sm
              font-semibold
              text-[#36564A]
              transition
              hover:border-[#B9C8BE]
              hover:bg-[#F5F7F3]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <FiRefreshCw
              size={16}
              className={
                loading ? "animate-spin" : ""
              }
            />

            Refresh
          </button>

        </div>


        {/* =================================================
            INFO
        ================================================= */}

        <div
          className="
            rounded-2xl
            border
            border-[#E4DED1]
            bg-[#FFFDF8]
            px-5
            py-4
            shadow-[0_5px_18px_rgba(23,59,50,0.04)]
          "
        >
          <div className="flex items-start gap-3">

            <div
              className="
                mt-0.5
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#F6EEDC]
                text-[#9A7B3F]
              "
            >
              <FiArchive size={17} />
            </div>

            <div>
              <p
                className="
                  text-sm
                  font-semibold
                  text-[#173B32]
                "
              >
                Archived appointments
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-[#77847D]
                "
              >
                Archived appointments are hidden from
                the main appointment list. Restore them
                whenever you need them again.
              </p>
            </div>

          </div>
        </div>


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
            "
          >
            <span
              className="
                flex
                h-5
                w-5
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#F4DED9]
                font-bold
              "
            >
              !
            </span>

            <span>{error}</span>
          </div>
        )}


        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="relative max-w-xl">

          <FiSearch
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-[#87938C]
            "
            size={18}
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search patient, MRN, reason, or source..."
            className="
              w-full
              rounded-xl
              border
              border-[#DDE3DD]
              bg-[#FFFDF8]
              py-3
              pl-11
              pr-4
              text-sm
              text-[#173B32]
              outline-none
              transition
              placeholder:text-[#9AA49E]
              focus:border-[#9E8A5A]
              focus:ring-2
              focus:ring-[#B4935A]/10
            "
          />

        </div>


        {/* =================================================
            TABLE
        ================================================= */}

        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            border-[#E3DED2]
            bg-[#FFFDF8]
            shadow-[0_8px_30px_rgba(23,59,50,0.05)]
          "
        >
          <div className="overflow-x-auto">

            <table className="min-w-262.5 w-full">

              <thead>
                <tr
                  className="
                    border-b
                    border-[#E5E0D5]
                    bg-[#F8F5ED]
                  "
                >

                  <th
                    className="
                      px-5
                      py-4
                      text-left
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-[#7C8981]
                    "
                  >
                    Patient
                  </th>

                  <th
                    className="
                      px-5
                      py-4
                      text-left
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-[#7C8981]
                    "
                  >
                    Date &amp; Time
                  </th>

                  <th
                    className="
                      px-5
                      py-4
                      text-left
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-[#7C8981]
                    "
                  >
                    Reason
                  </th>

                  <th
                    className="
                      px-5
                      py-4
                      text-left
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-[#7C8981]
                    "
                  >
                    Status
                  </th>

                  <th
                    className="
                      px-5
                      py-4
                      text-left
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-[#7C8981]
                    "
                  >
                    Source
                  </th>

                  <th
                    className="
                      px-5
                      py-4
                      text-right
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-[#7C8981]
                    "
                  >
                    Actions
                  </th>

                </tr>
              </thead>


              <tbody>

                {/* LOADING */}

                {loading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-16 text-center"
                    >
                      <div
                        className="
                          inline-flex
                          items-center
                          gap-3
                          text-sm
                          font-medium
                          text-[#718078]
                        "
                      >
                        <span
                          className="
                            h-5
                            w-5
                            animate-spin
                            rounded-full
                            border-2
                            border-[#D8DED9]
                            border-t-[#173B32]
                          "
                        />

                        Loading archived appointments...
                      </div>
                    </td>
                  </tr>
                )}


                {/* EMPTY */}

                {!loading &&
                  filteredAppointments.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-16 text-center"
                      >

                        <div
                          className="
                            mx-auto
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-[#F2F5F0]
                            text-[#6F8F7D]
                          "
                        >
                          <FiArchive size={24} />
                        </div>

                        <p
                          className="
                            mt-4
                            text-sm
                            font-semibold
                            text-[#173B32]
                          "
                        >
                          No archived appointments
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-[#87938C]
                          "
                        >
                          Archived appointments will appear here.
                        </p>

                      </td>
                    </tr>
                  )}


                {/* DATA */}

                {!loading &&
                  filteredAppointments.map(
                    (appointment) => (
                      <tr
                        key={appointment.id}
                        className="
                          border-b
                          border-[#EEEAE1]
                          last:border-b-0
                          hover:bg-[#FCFAF4]
                        "
                      >

                        {/* PATIENT */}

                        <td className="px-5 py-4">
                          <p
                            className="
                              text-sm
                              font-semibold
                              text-[#173B32]
                            "
                          >
                            {appointment.patient_name ||
                              "Unknown patient"}
                          </p>

                          <p
                            className="
                              mt-1
                              text-xs
                              text-[#7E8A83]
                            "
                          >
                            MRN:{" "}
                            {appointment.medical_record_number ||
                              "No MRN"}
                          </p>
                        </td>


                        {/* DATE */}

                        <td className="px-5 py-4">
                          <p
                            className="
                              text-sm
                              font-medium
                              text-[#36564A]
                            "
                          >
                            {formatDate(
                              appointment.appointment_date
                            )}
                          </p>

                          <p
                            className="
                              mt-1
                              text-xs
                              text-[#87938C]
                            "
                          >
                            {formatTime(
                              appointment.appointment_time
                            )}
                          </p>
                        </td>


                        {/* REASON */}

                        <td className="max-w-60 px-5 py-4">
                          <p
                            className="
                              truncate
                              text-sm
                              text-[#52625A]
                            "
                          >
                            {appointment.reason ||
                              "No reason provided"}
                          </p>
                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-4">
                          <span
                            className="
                              inline-flex
                              rounded-full
                              bg-[#F1EEE5]
                              px-3
                              py-1.5
                              text-xs
                              font-semibold
                              text-[#776643]
                            "
                          >
                            {formatStatus(
                              appointment.status
                            )}
                          </span>
                        </td>


                        {/* SOURCE */}

                        <td className="px-5 py-4">
                          <span
                            className="
                              text-sm
                              font-medium
                              text-[#63736B]
                            "
                          >
                            {formatSource(
                              appointment.source
                            )}
                          </span>
                        </td>


                        {/* ACTIONS */}

                        <td className="px-5 py-4">
                          <div
                            className="
                              flex
                              items-center
                              justify-end
                              gap-2
                            "
                          >

                            <button
                              type="button"
                              onClick={() =>
                                handleRestore(
                                  appointment
                                )
                              }
                              disabled={
                                actionId ===
                                appointment.id
                              }
                              className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-[#BFD0C4]
                                bg-[#F5F9F5]
                                px-3.5
                                py-2
                                text-xs
                                font-semibold
                                text-[#315C4B]
                                transition
                                hover:bg-[#EAF2EB]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                            >
                              <FiRotateCcw size={14} />

                              {actionId ===
                              appointment.id
                                ? "Restoring..."
                                : "Restore"}
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                setDeleteTarget(
                                  appointment
                                )
                              }
                              disabled={
                                actionId ===
                                appointment.id
                              }
                              className="
                                inline-flex
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-[#E5C9C3]
                                bg-[#FFF8F6]
                                p-2.5
                                text-[#9A4E43]
                                transition
                                hover:bg-[#FBEDE9]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                              title="Permanently delete"
                            >
                              <FiTrash2 size={15} />
                            </button>

                          </div>
                        </td>

                      </tr>
                    )
                  )}

              </tbody>

            </table>

          </div>
        </div>

      </div>


      {/* ===================================================
          PERMANENT DELETE MODAL
      =================================================== */}

      {deleteTarget && (
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
              !permanentlyDeleting
            ) {
              setDeleteTarget(null);
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

            <div
              className="
                h-1.5
                w-full
                bg-[#B4935A]
              "
            />

            <button
              type="button"
              onClick={() =>
                setDeleteTarget(null)
              }
              disabled={permanentlyDeleting}
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
              aria-label="Close"
            >
              <FiX size={18} />
            </button>


            <div className="px-6 pb-7 pt-7 sm:px-8">

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
                <FiAlertTriangle size={25} />
              </div>


              <h2
                className="
                  mt-5
                  pr-8
                  text-xl
                  font-bold
                  tracking-tight
                  text-[#173B32]
                "
              >
                Permanently Delete?
              </h2>


              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-[#68766E]
                "
              >
                This appointment will be permanently
                deleted and cannot be restored.
                This action cannot be undone.
              </p>


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
                  Appointment record
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
                  {deleteTarget.patient_name ||
                    "Unknown patient"}
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-[#77847D]
                  "
                >
                  MRN:{" "}
                  {deleteTarget.medical_record_number ||
                    "No MRN"}
                </p>
              </div>


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
                  onClick={() =>
                    setDeleteTarget(null)
                  }
                  disabled={permanentlyDeleting}
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
                  onClick={handlePermanentDelete}
                  disabled={permanentlyDeleting}
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
                  {permanentlyDeleting ? (
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

export default AppointmentArchive;