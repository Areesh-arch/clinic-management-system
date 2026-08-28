import { useEffect, useMemo, useState } from "react";

import {
  FiCalendar,
  FiClock,
  FiUser,
  FiFileText,
  FiX,
  FiSave,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

import {
  createAppointment,
  updateAppointment,
} from "../../services/appointmentService";


// ======================================================
// HELPERS
// ======================================================

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


const getLocalTimeString = (date = new Date()) => {
  const hours = String(
    date.getHours()
  ).padStart(2, "0");

  const minutes = String(
    date.getMinutes()
  ).padStart(2, "0");

  return `${hours}:${minutes}`;
};


const roundTimeToNextFiveMinutes = (
  date = new Date()
) => {

  const rounded = new Date(date);

  rounded.setSeconds(0);
  rounded.setMilliseconds(0);

  const minutes = rounded.getMinutes();

  const nextFive =
    Math.ceil((minutes + 1) / 5) * 5;

  if (nextFive >= 60) {

    rounded.setHours(
      rounded.getHours() + 1
    );

    rounded.setMinutes(0);

  } else {

    rounded.setMinutes(nextFive);
  }

  return getLocalTimeString(rounded);
};


const getInitialFormData = () => ({
  patient_id: "",

  appointment_date:
    getLocalDateString(),

  appointment_time:
    roundTimeToNextFiveMinutes(),

  duration_minutes: 30,

  reason: "",

  notes: "",
});


// ======================================================
// COMPONENT
// ======================================================

function AppointmentForm({
  appointment = null,
  mode = "create",
  onSuccess,
  onCancel,
}) {

  const isEditMode =
    mode === "edit" ||
    Boolean(appointment);


  const [formData, setFormData] =
    useState(getInitialFormData);


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState("");


  const [success, setSuccess] =
    useState("");


  // ====================================================
  // POPULATE FORM
  // ====================================================

  useEffect(() => {

    if (!appointment) {

      setFormData(
        getInitialFormData()
      );

      setError("");
      setSuccess("");

      return;
    }


    setFormData({

      patient_id:
        appointment.patient_id ?? "",

      appointment_date:
        appointment.appointment_date ?? "",

      appointment_time:
        appointment.appointment_time
          ? String(
              appointment.appointment_time
            ).slice(0, 5)
          : "",

      duration_minutes:
        appointment.duration_minutes ?? 30,

      reason:
        appointment.reason ?? "",

      notes:
        appointment.notes ?? "",
    });


    setError("");
    setSuccess("");

  }, [appointment]);


  // ====================================================
  // MINIMUM DATE
  // ====================================================

  const minimumDate = useMemo(
    () => getLocalDateString(),
    []
  );


  // ====================================================
  // MINIMUM TIME
  // ====================================================

  const minimumTime = useMemo(() => {

    if (
      formData.appointment_date !==
      minimumDate
    ) {
      return undefined;
    }

    return roundTimeToNextFiveMinutes();

  }, [
    formData.appointment_date,
    minimumDate,
  ]);


  // ====================================================
  // INPUT HANDLER
  // ====================================================

  const handleChange = (event) => {

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


    setError("");
    setSuccess("");
  };


  // ====================================================
  // VALIDATION
  // ====================================================

  const validateForm = () => {

    if (!formData.patient_id) {
      return "Please enter the patient ID.";
    }


    if (!formData.appointment_date) {
      return "Please select an appointment date.";
    }


    if (!formData.appointment_time) {
      return "Please select an appointment time.";
    }


    if (!formData.reason.trim()) {
      return "Please enter the reason for the appointment.";
    }


    const selectedDateTime =
      new Date(
        `${formData.appointment_date}T${formData.appointment_time}:00`
      );


    if (
      Number.isNaN(
        selectedDateTime.getTime()
      )
    ) {

      return (
        "Please enter a valid appointment date and time."
      );
    }


    const now = new Date();


    const minimumAllowed =
      new Date(
        now.getTime() +
        60 * 1000
      );


    if (
      selectedDateTime <=
      minimumAllowed
    ) {

      return (
        "Please select a future appointment date and time."
      );
    }


    const duration =
      Number(
        formData.duration_minutes
      );


    if (
      !Number.isFinite(duration) ||
      duration <= 0
    ) {

      return (
        "Please select a valid appointment duration."
      );
    }


    return null;
  };


  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    const validationError =
      validateForm();


    if (validationError) {

      setError(validationError);

      return;
    }


    setLoading(true);


    try {

      // =================================================
      // IMPORTANT:
      //
      // doctor_id is intentionally NOT included.
      //
      // Backend determines the doctor from
      // the authenticated user.
      // =================================================

      const payload = {

        patient_id:
          Number(
            formData.patient_id
          ),

        appointment_date:
          formData.appointment_date,

        appointment_time:
          formData.appointment_time,

        duration_minutes:
          Number(
            formData.duration_minutes
          ),

        reason:
          formData.reason.trim(),

        notes:
          formData.notes.trim() ||
          null,
      };


      console.log(
        isEditMode
          ? "Updating appointment:"
          : "Creating appointment:",
        payload
      );


      let result;


      // =================================================
      // UPDATE
      // =================================================

      if (isEditMode) {

        result =
          await updateAppointment(
            appointment.id,
            payload
          );


        console.log(
          "UPDATE APPOINTMENT RESPONSE:",
          result
        );


        setSuccess(
          "Appointment updated successfully."
        );

      }


      // =================================================
      // CREATE
      // =================================================

      else {

        result =
          await createAppointment(
            payload
          );


        console.log(
          "CREATE APPOINTMENT RESPONSE:",
          result
        );


        setSuccess(
          "Appointment created successfully."
        );
      }


      if (onSuccess) {
        await onSuccess(result);
      }

    } catch (err) {

      console.error(
        isEditMode
          ? "Failed to update appointment:"
          : "Failed to save appointment:",
        err
      );


      setError(
        err?.message ||
        (
          isEditMode
            ? "Failed to update appointment."
            : "Failed to create appointment."
        )
      );

    } finally {

      setLoading(false);
    }
  };


  // ======================================================
  // STYLES
  // ======================================================

  const inputClass =
    "w-full rounded-2xl " +
    "border border-slate-200 " +
    "bg-white " +
    "px-4 py-3.5 pl-11 " +
    "text-slate-700 " +
    "placeholder:text-slate-400 " +
    "outline-none " +
    "transition-all duration-200 " +
    "focus:border-[#789078] " +
    "focus:ring-4 " +
    "focus:ring-[#A3B18A]/15 " +
    "disabled:cursor-not-allowed " +
    "disabled:bg-slate-50 " +
    "disabled:opacity-70";


  const labelClass =
    "mb-2 block text-sm font-semibold text-[#294C60]";


  const sectionClass =
    "rounded-3xl border border-[#E4E9E2] " +
    "bg-[#FBFCFA] p-5 md:p-6";


  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="w-full">

      {/* HEADER */}

      <div className="mb-7 flex items-start justify-between">

        <div>

          <div
            className="
              mb-3 inline-flex items-center gap-2
              rounded-full bg-[#EEF5EC]
              px-3 py-1.5 text-xs font-semibold
              text-[#556B55]
            "
          >

            <span
              className="
                h-2 w-2 rounded-full
                bg-[#7FA27F]
              "
            />

            {isEditMode
              ? "Appointment Management"
              : "Appointment Scheduling"}

          </div>


          <h2
            className="
              text-3xl font-bold tracking-tight
              text-[#173B56]
            "
          >

            {isEditMode
              ? "Edit Appointment"
              : "New Appointment"}

          </h2>


          <p
            className="
              mt-2 text-sm text-slate-500
            "
          >

            {isEditMode
              ? "Update the appointment details below."
              : "Schedule a new appointment for your clinic."}

          </p>

        </div>


        {onCancel && (

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-full text-slate-400
              transition hover:bg-[#EEF5EC]
              hover:text-[#556B55]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label="Close"
          >
            <FiX size={23} />
          </button>

        )}

      </div>


      {/* ERROR */}

      {error && (

        <div
          className="
            mb-6 flex items-start gap-3
            rounded-2xl border border-red-100
            bg-red-50 px-4 py-4
            text-sm text-red-700
          "
        >

          <FiAlertCircle
            className="mt-0.5 shrink-0"
            size={18}
          />

          <div>

            <p className="font-semibold">
              Unable to save appointment
            </p>

            <p className="mt-1">
              {error}
            </p>

          </div>

        </div>

      )}


      {/* SUCCESS */}

      {success && (

        <div
          className="
            mb-6 flex items-start gap-3
            rounded-2xl border border-emerald-100
            bg-emerald-50 px-4 py-4
            text-sm text-emerald-700
          "
        >

          <FiCheckCircle
            className="mt-0.5 shrink-0"
            size={18}
          />

          <p className="font-semibold">
            {success}
          </p>

        </div>

      )}


      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* PARTICIPANT */}

        <div className={sectionClass}>

          <div className="mb-5">

            <h3
              className="
                text-base font-bold
                text-[#294C60]
              "
            >
              Patient
            </h3>

            <p
              className="
                mt-1 text-sm text-slate-500
              "
            >
              Select the patient for this appointment.
            </p>

          </div>


          <div>

            <label
              htmlFor="patient_id"
              className={labelClass}
            >
              Patient ID
            </label>


            <div className="relative">

              <FiUser
                className="
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  text-[#789078]
                "
                size={18}
              />


              <input
                id="patient_id"
                name="patient_id"
                type="number"
                min="1"
                value={formData.patient_id}
                onChange={handleChange}
                placeholder="e.g. 3"
                disabled={loading}
                className={inputClass}
              />

            </div>


            <p
              className="
                mt-1.5 text-xs text-slate-400
              "
            >
              Enter the patient's database ID.
            </p>

          </div>

        </div>


        {/* SCHEDULE */}

        <div
          className="
            rounded-3xl border border-[#E4E9E2]
            bg-white p-5 md:p-6
          "
        >

          <div className="mb-5">

            <h3
              className="
                text-base font-bold
                text-[#294C60]
              "
            >
              Schedule
            </h3>

            <p
              className="
                mt-1 text-sm text-slate-500
              "
            >
              Choose a future date and appointment time.
            </p>

          </div>


          <div
            className="
              grid grid-cols-1 gap-5
              md:grid-cols-2
            "
          >

            {/* DATE */}

            <div>

              <label
                htmlFor="appointment_date"
                className={labelClass}
              >
                Appointment Date
              </label>


              <div className="relative">

                <FiCalendar
                  className="
                    pointer-events-none
                    absolute left-4 top-1/2
                    -translate-y-1/2
                    text-[#789078]
                  "
                  size={18}
                />


                <input
                  id="appointment_date"
                  name="appointment_date"
                  type="date"
                  min={minimumDate}
                  value={formData.appointment_date}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClass}
                />

              </div>

            </div>


            {/* TIME */}

            <div>

              <label
                htmlFor="appointment_time"
                className={labelClass}
              >
                Appointment Time
              </label>


              <div className="relative">

                <FiClock
                  className="
                    pointer-events-none
                    absolute left-4 top-1/2
                    -translate-y-1/2
                    text-[#789078]
                  "
                  size={18}
                />


                <input
                  id="appointment_time"
                  name="appointment_time"
                  type="time"
                  min={minimumTime}
                  value={formData.appointment_time}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClass}
                />

              </div>


              <p
                className="
                  mt-1.5 text-xs text-slate-400
                "
              >
                Past appointment times cannot be selected.
              </p>

            </div>

          </div>


          {/* DURATION */}

          <div className="mt-5 max-w-md">

            <label
              htmlFor="duration_minutes"
              className={labelClass}
            >
              Duration
            </label>


            <select
              id="duration_minutes"
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleChange}
              disabled={loading}
              className="
                w-full rounded-2xl
                border border-slate-200
                bg-white px-4 py-3.5
                text-slate-700 outline-none
                transition
                focus:border-[#789078]
                focus:ring-4
                focus:ring-[#A3B18A]/15
                disabled:cursor-not-allowed
                disabled:bg-slate-50
              "
            >

              <option value={15}>
                15 minutes
              </option>

              <option value={30}>
                30 minutes
              </option>

              <option value={45}>
                45 minutes
              </option>

              <option value={60}>
                60 minutes
              </option>

              <option value={90}>
                90 minutes
              </option>

              <option value={120}>
                120 minutes
              </option>

            </select>

          </div>

        </div>


        {/* DETAILS */}

        <div className={sectionClass}>

          <div className="mb-5">

            <h3
              className="
                text-base font-bold
                text-[#294C60]
              "
            >
              Appointment Details
            </h3>

            <p
              className="
                mt-1 text-sm text-slate-500
              "
            >
              Add the reason and any useful notes.
            </p>

          </div>


          {/* REASON */}

          <div>

            <label
              htmlFor="reason"
              className={labelClass}
            >
              Reason
            </label>


            <div className="relative">

              <FiFileText
                className="
                  pointer-events-none
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  text-[#789078]
                "
                size={18}
              />


              <input
                id="reason"
                name="reason"
                type="text"
                value={formData.reason}
                onChange={handleChange}
                placeholder="e.g. acne, skin consultation..."
                maxLength={255}
                disabled={loading}
                className={inputClass}
              />

            </div>


            <p
              className="
                mt-1.5 text-xs text-slate-400
              "
            >
              Briefly describe the purpose of the visit.
            </p>

          </div>


          {/* NOTES */}

          <div className="mt-5">

            <label
              htmlFor="notes"
              className={labelClass}
            >
              Notes

              <span
                className="
                  ml-2 font-normal text-slate-400
                "
              >
                Optional
              </span>

            </label>


            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional information..."
              rows={4}
              disabled={loading}
              className="
                w-full resize-none rounded-2xl
                border border-slate-200
                bg-white px-4 py-3.5
                text-slate-700
                placeholder:text-slate-400
                outline-none transition
                focus:border-[#789078]
                focus:ring-4
                focus:ring-[#A3B18A]/15
                disabled:cursor-not-allowed
                disabled:bg-slate-50
              "
            />

          </div>

        </div>


        {/* FOOTER */}

        <div
          className="
            flex flex-col-reverse gap-3
            border-t border-slate-200 pt-6
            sm:flex-row sm:justify-end
          "
        >

          {onCancel && (

            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="
                rounded-2xl border border-slate-200
                bg-white px-6 py-3
                font-semibold text-slate-600
                transition
                hover:border-[#D8E2D5]
                hover:bg-[#F5F8F4]
                hover:text-[#556B55]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

          )}


          <button
            type="submit"
            disabled={loading}
            className="
              inline-flex items-center justify-center
              gap-2 rounded-2xl
              bg-[#556B55] px-7 py-3
              font-semibold text-white
              shadow-sm transition-all duration-200
              hover:bg-[#465946]
              hover:shadow-md
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >

            {loading ? (

              <>

                <span
                  className="
                    h-4 w-4 animate-spin
                    rounded-full border-2
                    border-white/30
                    border-t-white
                  "
                />

                Saving...

              </>

            ) : (

              <>

                <FiSave size={17} />

                {isEditMode
                  ? "Update Appointment"
                  : "Save Appointment"}

              </>

            )}

          </button>

        </div>

      </form>

    </div>
  );
}


export default AppointmentForm;