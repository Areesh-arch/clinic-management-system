import {
  useEffect,
  useState,
} from "react";

import {
  getAppointments,
} from "../../services/appointmentService";

import {
  getPatients,
} from "../../services/patientService";

import {
  createTreatment,
  updateTreatment,
} from "../../services/treatmentService";


function TreatmentForm({
  treatment,
  onSuccess,
  onClose,
}) {
  const isEditing =
    Boolean(treatment);


  // =====================================================
  // STATE
  // =====================================================

  const [
    appointments,
    setAppointments,
  ] = useState([]);

  const [
    patients,
    setPatients,
  ] = useState([]);

  const [
    loadingAppointments,
    setLoadingAppointments,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    formData,
    setFormData,
  ] = useState({
    appointment_id: "",
    diagnosis: "",
    notes: "",
    charge: "",
    chief_complaint: "",
    status: "IN_PROGRESS",
  });


  // =====================================================
  // LOAD APPOINTMENTS + PATIENTS
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingAppointments(true);
        setError("");

        const [
          appointmentData,
          patientData,
        ] = await Promise.all([
          getAppointments(),
          getPatients(),
        ]);

        const appointmentList =
          Array.isArray(appointmentData)
            ? appointmentData
            : [];

        const patientList =
          Array.isArray(patientData)
            ? patientData
            : [];

        setAppointments(
          appointmentList
        );

        setPatients(
          patientList
        );

      } catch (err) {
        console.error(
          "Failed to load appointments/patients:",
          err
        );

        setError(
          err?.message ||
          "Failed to load appointments and patients."
        );
      } finally {
        setLoadingAppointments(false);
      }
    };

    loadData();
  }, []);


  // =====================================================
  // LOAD EDITING DATA
  // =====================================================

  useEffect(() => {
    if (!treatment) {
      setFormData({
        appointment_id: "",
        diagnosis: "",
        notes: "",
        charge: "",
        chief_complaint: "",
        status: "IN_PROGRESS",
      });

      return;
    }

    setFormData({
      appointment_id:
        treatment?.appointment_id ?? "",

      diagnosis:
        treatment?.diagnosis ??
        treatment?.treatment ??
        "",

      notes:
        treatment?.notes ??
        "",

      charge:
        treatment?.charge ??
        treatment?.cost ??
        "",

      chief_complaint:
        treatment?.chief_complaint ??
        "",

      status:
        treatment?.status ??
        "IN_PROGRESS",
    });
  }, [treatment]);


  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };


  // =====================================================
  // PATIENT HELPERS
  // =====================================================

  const getPatientIdFromAppointment = (
    appointment
  ) => {
    return (
      appointment?.patient_id ??
      appointment?.patient?.id ??
      appointment?.patient_data?.id ??
      appointment?.patient_info?.id ??
      null
    );
  };


  const findPatientForAppointment = (
    appointment
  ) => {
    const patientId =
      getPatientIdFromAppointment(
        appointment
      );

    if (
      patientId === null ||
      patientId === undefined
    ) {
      return null;
    }

    return (
      patients.find(
        (patient) =>
          String(patient.id) ===
          String(patientId)
      ) || null
    );
  };


  const getPatientName = (
    appointment
  ) => {
    const embeddedPatient =
      appointment?.patient ||
      appointment?.patient_data ||
      appointment?.patient_info ||
      null;

    const directName =
      appointment?.patient_name ||
      appointment?.patient_full_name;

    if (directName) {
      return directName;
    }

    const embeddedName =
      embeddedPatient?.name ||
      embeddedPatient?.full_name;

    if (embeddedName) {
      return embeddedName;
    }

    const embeddedFirstName =
      embeddedPatient?.first_name ||
      appointment?.patient_first_name ||
      "";

    const embeddedLastName =
      embeddedPatient?.last_name ||
      appointment?.patient_last_name ||
      "";

    const embeddedFullName =
      `${embeddedFirstName} ${embeddedLastName}`
        .trim();

    if (embeddedFullName) {
      return embeddedFullName;
    }

    const patient =
      findPatientForAppointment(
        appointment
      );

    if (!patient) {
      return "Unknown patient";
    }

    const patientName =
      patient?.name ||
      patient?.full_name;

    if (patientName) {
      return patientName;
    }

    const firstName =
      patient?.first_name || "";

    const lastName =
      patient?.last_name || "";

    const fullName =
      `${firstName} ${lastName}`.trim();

    return (
      fullName ||
      "Unknown patient"
    );
  };


  const getPatientMrn = (
    appointment
  ) => {
    const embeddedPatient =
      appointment?.patient ||
      appointment?.patient_data ||
      appointment?.patient_info ||
      null;

    const directMrn =
      appointment?.medical_record_number ||
      appointment?.patient_mrn ||
      appointment?.mrn;

    if (directMrn) {
      return directMrn;
    }

    const embeddedMrn =
      embeddedPatient?.medical_record_number ||
      embeddedPatient?.mrn;

    if (embeddedMrn) {
      return embeddedMrn;
    }

    const patient =
      findPatientForAppointment(
        appointment
      );

    if (!patient) {
      return "";
    }

    return (
      patient?.medical_record_number ||
      patient?.mrn ||
      ""
    );
  };


  // =====================================================
  // APPOINTMENT HELPERS
  // =====================================================

  const getAppointmentDate = (
    appointment
  ) => {
    return (
      appointment?.appointment_date ||
      appointment?.date ||
      ""
    );
  };


  const getAppointmentTime = (
    appointment
  ) => {
    const value =
      appointment?.appointment_time ||
      appointment?.time ||
      "";

    if (!value) {
      return "";
    }

    if (
      typeof value === "string" &&
      value.includes("T")
    ) {
      return (
        value
          .split("T")[1]
          ?.slice(0, 5) ||
        value
      );
    }

    return String(value).slice(0, 5);
  };


  const getAppointmentReason = (
    appointment
  ) => {
    return (
      appointment?.reason ||
      appointment?.purpose ||
      appointment?.chief_complaint ||
      appointment?.notes ||
      ""
    );
  };


  const formatAppointmentDate = (
    value
  ) => {
    if (!value) {
      return "Date not available";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // =====================================================
  // SELECTED APPOINTMENT
  // =====================================================

  const selectedAppointment =
    appointments.find(
      (appointment) =>
        String(appointment.id) ===
        String(
          formData.appointment_id
        )
    );


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");


    // -------------------------------------------------
    // CREATE VALIDATION
    // -------------------------------------------------

    if (
      !isEditing &&
      !formData.appointment_id
    ) {
      setError(
        "Please select an appointment."
      );

      return;
    }


    // -------------------------------------------------
    // DIAGNOSIS VALIDATION
    // -------------------------------------------------

    if (
      !formData.diagnosis.trim()
    ) {
      setError(
        "Please enter the diagnosis/treatment details."
      );

      return;
    }


    // -------------------------------------------------
    // STATUS VALIDATION
    // -------------------------------------------------

    if (
      isEditing &&
      ![
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ].includes(formData.status)
    ) {
      setError(
        "Please select a valid treatment status."
      );

      return;
    }


    // -------------------------------------------------
    // CHARGE VALIDATION
    // -------------------------------------------------

    const numericCharge =
      formData.charge === ""
        ? 0
        : Number(formData.charge);

    if (
      Number.isNaN(
        numericCharge
      ) ||
      numericCharge < 0
    ) {
      setError(
        "Please enter a valid charge."
      );

      return;
    }


    try {
      setSaving(true);


      // ------------------------------------------------
      // CREATE PAYLOAD
      // ------------------------------------------------

      const createPayload = {
        appointment_id:
          Number(
            formData.appointment_id
          ),

        diagnosis:
          formData.diagnosis.trim(),

        chief_complaint:
          formData.chief_complaint.trim() ||
          null,

        notes:
          formData.notes.trim() ||
          null,

        charge:
          numericCharge,
      };


      // ------------------------------------------------
      // UPDATE PAYLOAD
      // ------------------------------------------------

      const updatePayload = {
        status:
          formData.status ||
          "IN_PROGRESS",

        diagnosis:
          formData.diagnosis.trim(),

        chief_complaint:
          formData.chief_complaint.trim() ||
          null,

        notes:
          formData.notes.trim() ||
          null,

        charge:
          numericCharge,
      };


      // ------------------------------------------------
      // SEND REQUEST
      // ------------------------------------------------

      let result;

      if (isEditing) {
        result =
          await updateTreatment(
            treatment.id,
            updatePayload
          );
      } else {
        result =
          await createTreatment(
            createPayload
          );
      }


      // ------------------------------------------------
      // SUCCESS
      // ------------------------------------------------

      if (onSuccess) {
        await onSuccess(result);
      }

    } catch (err) {
      console.error(
        "Failed to save treatment:",
        err
      );

      setError(
        err?.message ||
        "Failed to save treatment."
      );
    } finally {
      setSaving(false);
    }
  };


  // =====================================================
  // INPUT CLASS
  // =====================================================

  const inputClass = `
    w-full
    rounded-xl
    border
    border-[#D8DED9]
    bg-[#FFFDF8]
    px-4
    py-3.5
    text-sm
    font-medium
    text-[#263C34]
    outline-none
    transition-all
    duration-200
    placeholder:text-[#A0AAA4]
    focus:border-[#6F8F7D]
    focus:bg-white
    focus:ring-4
    focus:ring-[#6F8F7D]/10
    disabled:cursor-not-allowed
    disabled:bg-[#F3F2ED]
    disabled:text-[#9CA59F]
  `;


  const labelClass = `
    mb-2
    block
    text-[11px]
    font-bold
    uppercase
    tracking-[0.12em]
    text-[#617169]
  `;


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* =================================================
          HEADER
          ================================================= */}

      <div
        className="
          border-b
          border-[#E6E0D4]
          pb-5
        "
      >
        <div
          className="
            flex
            flex-col
            gap-1
          "
        >
          <span
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#B4935A]
            "
          >
            Clinical Record
          </span>

          <h2
            className="
              text-2xl
              font-bold
              tracking-tight
              text-[#173B32]
              sm:text-3xl
            "
          >
            {isEditing
              ? "Edit Treatment"
              : "Add Treatment"}
          </h2>

          <p
            className="
              text-sm
              text-[#78847E]
            "
          >
            {isEditing
              ? "Update the patient's treatment and visit information."
              : "Create a treatment record from an existing appointment."}
          </p>
        </div>

        <div
          className="
            mt-4
            h-px
            w-20
            bg-[#B4935A]
          "
        />
      </div>


      {/* =================================================
          ERROR
          ================================================= */}

      {error && (
        <div
          className="
            rounded-xl
            border
            border-[#E7C7C0]
            bg-[#FFF7F5]
            px-4
            py-3
            text-sm
            font-medium
            text-[#984E42]
          "
        >
          {error}
        </div>
      )}


      {/* =================================================
          APPOINTMENT
          ================================================= */}

      <div>
        <label
          htmlFor="appointment_id"
          className={labelClass}
        >
          Appointment
        </label>

        <select
          id="appointment_id"
          name="appointment_id"
          value={
            formData.appointment_id
          }
          onChange={handleChange}
          disabled={
            isEditing ||
            loadingAppointments ||
            saving
          }
          className={inputClass}
        >
          <option value="">
            {loadingAppointments
              ? "Loading appointments..."
              : appointments.length === 0
                ? "No appointments available"
                : "Select appointment"}
          </option>

          {appointments.map(
            (appointment) => {
              const patientName =
                getPatientName(
                  appointment
                );

              const patientMrn =
                getPatientMrn(
                  appointment
                );

              const date =
                getAppointmentDate(
                  appointment
                );

              const time =
                getAppointmentTime(
                  appointment
                );

              const reason =
                getAppointmentReason(
                  appointment
                );

              return (
                <option
                  key={appointment.id}
                  value={appointment.id}
                >
                  {patientName}
                  {patientMrn
                    ? ` — ${patientMrn}`
                    : ""}
                  {" | "}
                  {formatAppointmentDate(
                    date
                  )}
                  {time
                    ? ` ${time}`
                    : ""}
                  {reason
                    ? ` — ${reason}`
                    : ""}
                </option>
              );
            }
          )}
        </select>

        {!loadingAppointments &&
          appointments.length === 0 && (
            <p
              className="
                mt-2
                text-xs
                font-medium
                text-[#A77A31]
              "
            >
              No appointments were returned by the backend.
            </p>
          )}
      </div>


      {/* =================================================
          SELECTED APPOINTMENT
          ================================================= */}

      {selectedAppointment && (
        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-[#D8E2DC]
            bg-[#F3F7F4]
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              border-b
              border-[#DCE6E0]
              px-4
              py-3
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#173B32]
                text-sm
                font-bold
                text-white
              "
            >
              ✓
            </div>

            <div>
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-[#6F8F7D]
                "
              >
                Selected Appointment
              </p>

              <p
                className="
                  mt-0.5
                  text-sm
                  font-bold
                  text-[#173B32]
                "
              >
                Appointment linked to this treatment
              </p>
            </div>
          </div>


          <div className="p-4">
            <div
              className="
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
              "
            >
              <div>
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-[#87928C]
                  "
                >
                  Patient
                </p>

                <p
                  className="
                    mt-1
                    font-semibold
                    text-[#173B32]
                  "
                >
                  {getPatientName(
                    selectedAppointment
                  )}
                </p>
              </div>

              <div>
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-[#87928C]
                  "
                >
                  MRN
                </p>

                <p
                  className="
                    mt-1
                    font-semibold
                    text-[#527565]
                  "
                >
                  {getPatientMrn(
                    selectedAppointment
                  ) || "—"}
                </p>
              </div>

              <div>
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-[#87928C]
                  "
                >
                  Date
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-medium
                    text-[#45554D]
                  "
                >
                  {formatAppointmentDate(
                    getAppointmentDate(
                      selectedAppointment
                    )
                  )}
                </p>
              </div>

              <div>
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-[#87928C]
                  "
                >
                  Time
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-medium
                    text-[#45554D]
                  "
                >
                  {getAppointmentTime(
                    selectedAppointment
                  ) || "—"}
                </p>
              </div>
            </div>

            {getAppointmentReason(
              selectedAppointment
            ) && (
              <div
                className="
                  mt-4
                  rounded-xl
                  border
                  border-[#DCE6E0]
                  bg-[#FFFDF8]
                  px-3.5
                  py-3
                "
              >
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-[#87928C]
                  "
                >
                  Appointment Reason
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-medium
                    text-[#45554D]
                  "
                >
                  {getAppointmentReason(
                    selectedAppointment
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      )}


      {/* =================================================
          CHIEF COMPLAINT + CHARGE
          ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          md:grid-cols-2
        "
      >
        <div>
          <label
            htmlFor="chief_complaint"
            className={labelClass}
          >
            Chief Complaint
          </label>

          <input
            id="chief_complaint"
            type="text"
            name="chief_complaint"
            value={
              formData.chief_complaint
            }
            onChange={handleChange}
            placeholder="Patient's main complaint"
            disabled={saving}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="charge"
            className={labelClass}
          >
            Treatment Charge
          </label>

          <div className="relative">
            <span
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-xs
                font-bold
                text-[#8A7550]
              "
            >
              PKR
            </span>

            <input
              id="charge"
              type="number"
              name="charge"
              value={
                formData.charge
              }
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.01"
              disabled={saving}
              className={`${inputClass} pl-14`}
            />
          </div>
        </div>
      </div>


      {/* =================================================
          DIAGNOSIS
          ================================================= */}

      <div>
        <label
          htmlFor="diagnosis"
          className={labelClass}
        >
          Diagnosis / Treatment Details
        </label>

        <input
          id="diagnosis"
          type="text"
          name="diagnosis"
          value={
            formData.diagnosis
          }
          onChange={handleChange}
          placeholder="Diagnosis or treatment procedure"
          disabled={saving}
          className={inputClass}
        />
      </div>


      {/* =================================================
          STATUS
          ================================================= */}

      {isEditing && (
        <div>
          <label
            htmlFor="status"
            className={labelClass}
          >
            Treatment Status
          </label>

          <select
            id="status"
            name="status"
            value={
              formData.status
            }
            onChange={handleChange}
            disabled={saving}
            className={inputClass}
          >
            <option value="IN_PROGRESS">
              In Progress
            </option>

            <option value="COMPLETED">
              Completed
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>
          </select>
        </div>
      )}


      {/* =================================================
          NOTES
          ================================================= */}

      <div>
        <label
          htmlFor="notes"
          className={labelClass}
        >
          Clinical Notes
        </label>

        <textarea
          id="notes"
          name="notes"
          value={
            formData.notes
          }
          onChange={handleChange}
          placeholder="Additional visit notes, observations, or instructions..."
          rows={5}
          disabled={saving}
          className={`
            ${inputClass}
            resize-none
          `}
        />
      </div>


      {/* =================================================
          FOOTER
          ================================================= */}

      <div
        className="
          flex
          flex-col-reverse
          gap-3
          border-t
          border-[#E6E0D4]
          pt-5
          sm:flex-row
          sm:justify-end
        "
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="
              w-full
              rounded-xl
              border
              border-[#D8DED9]
              bg-[#FFFDF8]
              px-6
              py-3.5
              text-sm
              font-bold
              text-[#52615A]
              transition-all
              duration-200
              hover:border-[#B9C9C0]
              hover:bg-[#F4F6F3]
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:w-auto
            "
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={
            saving ||
            loadingAppointments
          }
          className="
            w-full
            rounded-xl
            bg-[#173B32]
            px-7
            py-3.5
            text-sm
            font-bold
            text-white
            shadow-[0_5px_14px_rgba(23,59,50,0.16)]
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-[#214B40]
            hover:shadow-[0_8px_20px_rgba(23,59,50,0.22)]
            disabled:cursor-not-allowed
            disabled:opacity-60
            sm:w-auto
          "
        >
          {saving
            ? "Saving..."
            : isEditing
              ? "Update Treatment"
              : "Save Treatment"}
        </button>
      </div>
    </form>
  );
}


export default TreatmentForm;