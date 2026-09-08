import { useEffect, useState } from "react";

import { getAppointments } from "../../services/appointmentService";
import { getPatients } from "../../services/patientService";

import {
  createTreatment,
  updateTreatment,
} from "../../services/treatmentService";


function TreatmentForm({
  treatment,
  onSuccess,
  onClose,
}) {

  // =====================================================
  // MODE
  // =====================================================

  const isEditing = Boolean(treatment);


  // =====================================================
  // STATE
  // =====================================================

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  const [loadingAppointments, setLoadingAppointments] =
    useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
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

        console.log(
          "Appointments available for treatment:",
          appointmentData
        );

        console.log(
          "Patients available for treatment:",
          patientData
        );

        const appointmentList =
          Array.isArray(appointmentData)
            ? appointmentData
            : [];

        const patientList =
          Array.isArray(patientData)
            ? patientData
            : [];

        setAppointments(appointmentList);
        setPatients(patientList);

      } catch (err) {

        console.error(
          "Failed to load appointments/patients:",
          err
        );

        setError(
          err.message ||
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
        treatment.appointment_id ?? "",

      diagnosis:
        treatment.diagnosis ??
        treatment.treatment ??
        "",

      notes:
        treatment.notes ??
        "",

      charge:
        treatment.charge ??
        treatment.cost ??
        "",

      chief_complaint:
        treatment.chief_complaint ??
        "",

      status:
        treatment.status ??
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


  const getPatientName = (appointment) => {

    // -------------------------------------------------
    // First try patient already included in appointment
    // -------------------------------------------------

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
      `${embeddedFirstName} ${embeddedLastName}`.trim();

    if (embeddedFullName) {
      return embeddedFullName;
    }


    // -------------------------------------------------
    // Otherwise find patient using patient_id
    // -------------------------------------------------

    const patient =
      findPatientForAppointment(
        appointment
      );

    if (!patient) {
      return "Unknown patient";
    }

    const patientName =
      patient.name ||
      patient.full_name;

    if (patientName) {
      return patientName;
    }

    const firstName =
      patient.first_name ||
      "";

    const lastName =
      patient.last_name ||
      "";

    const fullName =
      `${firstName} ${lastName}`.trim();

    return fullName || "Unknown patient";

  };


  const getPatientMrn = (appointment) => {

    // -------------------------------------------------
    // First try appointment response
    // -------------------------------------------------

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


    // -------------------------------------------------
    // Otherwise find patient using patient_id
    // -------------------------------------------------

    const patient =
      findPatientForAppointment(
        appointment
      );

    if (!patient) {
      return "";
    }

    return (
      patient.medical_record_number ||
      patient.mrn ||
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
        value.split("T")[1]?.slice(0, 5) ||
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

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString();

  };


  // =====================================================
  // SELECTED APPOINTMENT
  // =====================================================

  const selectedAppointment =
    appointments.find(
      (appointment) =>
        String(appointment.id) ===
        String(formData.appointment_id)
    );


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (event) => {

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
    // STATUS VALIDATION FOR UPDATE
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
          formData.charge !== ""
            ? Number(formData.charge)
            : 0,

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
          formData.charge !== ""
            ? Number(formData.charge)
            : 0,

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


      console.log(
        "Treatment saved:",
        result
      );


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
        err.message ||
        "Failed to save treatment."
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      {/* =================================================
          TITLE
          ================================================= */}

      <h2
        className="
          text-3xl
          font-bold
          text-[#25312A]
        "
      >
        {isEditing
          ? "Edit Treatment"
          : "Add Treatment"}
      </h2>


      {/* =================================================
          ERROR
          ================================================= */}

      {error && (

        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-red-700
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
          className="
            mb-2
            block
            text-sm
            font-medium
            text-[#45524A]
          "
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
          className="
            w-full
            rounded-xl
            border
            border-[#25312A]
            bg-white
            p-4
            text-lg
            focus:outline-none
            focus:ring-2
            focus:ring-[#A8C5A0]
            disabled:cursor-not-allowed
            disabled:bg-gray-100
          "
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
                text-sm
                text-amber-600
              "
            >
              No appointments were returned
              by the backend.
            </p>

          )}

      </div>


      {/* =================================================
          SELECTED APPOINTMENT INFO
          ================================================= */}

      {selectedAppointment && (

        <div
          className="
            rounded-xl
            border
            border-[#E6E1D8]
            bg-[#F6F4EF]
            p-4
          "
        >

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Selected appointment
          </p>


          <p
            className="
              mt-1
              text-lg
              font-semibold
              text-[#25312A]
            "
          >
            {getPatientName(
              selectedAppointment
            )}
          </p>


          {getPatientMrn(
            selectedAppointment
          ) && (

            <p
              className="
                mt-1
                text-sm
                font-medium
                text-[#5F7A63]
              "
            >
              MRN:{" "}
              {getPatientMrn(
                selectedAppointment
              )}
            </p>

          )}


          <div
            className="
              mt-3
              space-y-1
              text-sm
              text-gray-600
            "
          >

            <p>
              Date:{" "}
              {formatAppointmentDate(
                getAppointmentDate(
                  selectedAppointment
                )
              )}
            </p>


            {getAppointmentTime(
              selectedAppointment
            ) && (

              <p>
                Time:{" "}
                {getAppointmentTime(
                  selectedAppointment
                )}
              </p>

            )}


            {getAppointmentReason(
              selectedAppointment
            ) && (

              <p>
                Reason:{" "}
                {getAppointmentReason(
                  selectedAppointment
                )}
              </p>

            )}


            {selectedAppointment.status && (

              <p>
                Status:{" "}
                {selectedAppointment.status}
              </p>

            )}

          </div>

        </div>

      )}


      {/* =================================================
          CHIEF COMPLAINT
          ================================================= */}

      <div>

        <label
          htmlFor="chief_complaint"
          className="
            mb-2
            block
            text-sm
            font-medium
            text-[#45524A]
          "
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
          className="
            w-full
            rounded-xl
            border
            border-[#25312A]
            p-4
            text-lg
            focus:outline-none
            focus:ring-2
            focus:ring-[#A8C5A0]
            disabled:bg-gray-100
          "
        />

      </div>


      {/* =================================================
          DIAGNOSIS
          ================================================= */}

      <div>

        <label
          htmlFor="diagnosis"
          className="
            mb-2
            block
            text-sm
            font-medium
            text-[#45524A]
          "
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
          className="
            w-full
            rounded-xl
            border
            border-[#25312A]
            p-4
            text-lg
            focus:outline-none
            focus:ring-2
            focus:ring-[#A8C5A0]
            disabled:bg-gray-100
          "
        />

      </div>


      {/* =================================================
          CHARGE
          ================================================= */}

      <div>

        <label
          htmlFor="charge"
          className="
            mb-2
            block
            text-sm
            font-medium
            text-[#45524A]
          "
        >
          Charge
        </label>


        <input
          id="charge"
          type="number"
          name="charge"
          value={
            formData.charge
          }
          onChange={handleChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          disabled={saving}
          className="
            w-full
            rounded-xl
            border
            border-[#25312A]
            p-4
            text-lg
            focus:outline-none
            focus:ring-2
            focus:ring-[#A8C5A0]
            disabled:bg-gray-100
          "
        />

      </div>


      {/* =================================================
          STATUS
          ================================================= */}

      {isEditing && (

        <div>

          <label
            htmlFor="status"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-[#45524A]
            "
          >
            Status
          </label>


          <select
            id="status"
            name="status"
            value={
              formData.status
            }
            onChange={handleChange}
            disabled={saving}
            className="
              w-full
              rounded-xl
              border
              border-[#25312A]
              bg-white
              p-4
              text-lg
              focus:outline-none
              focus:ring-2
              focus:ring-[#A8C5A0]
              disabled:bg-gray-100
            "
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
          className="
            mb-2
            block
            text-sm
            font-medium
            text-[#45524A]
          "
        >
          Notes
        </label>


        <textarea
          id="notes"
          name="notes"
          value={
            formData.notes
          }
          onChange={handleChange}
          placeholder="Additional visit notes..."
          rows={4}
          disabled={saving}
          className="
            w-full
            resize-none
            rounded-xl
            border
            border-[#25312A]
            p-4
            text-lg
            focus:outline-none
            focus:ring-2
            focus:ring-[#A8C5A0]
            disabled:bg-gray-100
          "
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
              rounded-xl
              border
              border-gray-200
              bg-white
              px-6
              py-4
              font-semibold
              text-gray-600
              transition
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-60
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
            bg-[#A8C5A0]
            py-4
            text-lg
            font-semibold
            text-white
            transition
            hover:bg-[#90B68A]
            disabled:cursor-not-allowed
            disabled:opacity-60
            sm:w-auto
            sm:px-8
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