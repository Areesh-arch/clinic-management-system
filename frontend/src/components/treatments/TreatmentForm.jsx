import { useEffect, useState } from "react";

import { getAppointments } from "../../services/appointmentService";

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
  // LOAD APPOINTMENTS
  // =====================================================

  useEffect(() => {

    const loadAppointments =
      async () => {

        try {

          setLoadingAppointments(
            true
          );

          setError("");


          const data =
            await getAppointments();


          console.log(
            "Appointments available for treatment:",
            data
          );


          /*
           * IMPORTANT:
           *
           * Do NOT filter appointments by
           * status === "SCHEDULED" here.
           *
           * We first need to display the actual
           * appointments returned by the backend.
           *
           * Once the complete workflow is working,
           * we can add business rules for which
           * appointments can become visits.
           */

          const appointmentList =
            Array.isArray(data)
              ? data
              : [];


          setAppointments(
            appointmentList
          );

        } catch (err) {

          console.error(
            "Failed to load appointments:",
            err
          );


          setError(
            err.message ||
            "Failed to load appointments."
          );

        } finally {

          setLoadingAppointments(
            false
          );

        }

      };


    loadAppointments();

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
        treatment.appointment_id ??
        "",

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

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

  };


  // =====================================================
  // SELECTED APPOINTMENT
  // =====================================================

  const selectedAppointment =
    appointments.find(
      (appointment) =>
        String(
          appointment.id
        ) ===
        String(
          formData.appointment_id
        )
    );


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit =
    async (event) => {

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
              ? Number(
                  formData.charge
                )
              : 0,

        };


        // ------------------------------------------------
        // UPDATE PAYLOAD
        // ------------------------------------------------
        //
        // appointment_id is intentionally NOT included
        // because the appointment should not be changed
        // when editing an existing treatment.
        //

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
              ? Number(
                  formData.charge
                )
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

          await onSuccess(
            result
          );

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
            (appointment) => (

              <option
                key={
                  appointment.id
                }
                value={
                  appointment.id
                }
              >

                Appointment #
                {appointment.id}

                {" - "}

                {appointment.appointment_date ||
                  appointment.date ||
                  "N/A"}

                {appointment.status
                  ? ` (${appointment.status})`
                  : ""}

              </option>

            )
          )}

        </select>


        {/* -------------------------------------------------
            APPOINTMENT HELP
        ------------------------------------------------- */}

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
              font-semibold
              text-[#25312A]
            "
          >

            Appointment #
            {selectedAppointment.id}

          </p>


          <p
            className="
              mt-1
              text-sm
              text-gray-600
            "
          >

            Date:{" "}

            {
              selectedAppointment.appointment_date ||
              selectedAppointment.date ||
              "N/A"
            }

          </p>


          {selectedAppointment.status && (

            <p
              className="
                mt-1
                text-sm
                text-gray-600
              "
            >

              Status:{" "}

              {selectedAppointment.status}

            </p>

          )}

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

            <option value="SCHEDULED">
              Scheduled
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