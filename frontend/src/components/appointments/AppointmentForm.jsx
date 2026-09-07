import { useEffect, useMemo, useState } from "react";

import {
  FiCalendar,
  FiClock,
  FiUser,
  FiFileText,
  FiSearch,
  FiX,
  FiSave,
  FiAlertCircle,
  FiCheckCircle,
  FiCheck,
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
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getLocalTimeString = (date = new Date()) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const roundTimeToNextFiveMinutes = (date = new Date()) => {
  const rounded = new Date(date);

  rounded.setSeconds(0);
  rounded.setMilliseconds(0);

  const minutes = rounded.getMinutes();

  const nextFive = Math.ceil((minutes + 1) / 5) * 5;

  if (nextFive >= 60) {
    rounded.setHours(rounded.getHours() + 1);
    rounded.setMinutes(0);
  } else {
    rounded.setMinutes(nextFive);
  }

  return getLocalTimeString(rounded);
};

// ======================================================
// INITIAL FORM DATA
// ======================================================

const getInitialFormData = () => ({
  patient_id: "",
  appointment_date: getLocalDateString(),
  appointment_time: roundTimeToNextFiveMinutes(),
  duration_minutes: 30,
  reason: "",

  // null means:
  // "let the software determine whether this is a follow-up"
  //
  // true means:
  // "staff explicitly selected follow-up"
  //
  // false means:
  // "staff explicitly removed follow-up"
  is_follow_up: null,

  notes: "",
});

// ======================================================
// COMPONENT
// ======================================================

function AppointmentForm({
  appointment = null,
  mode = "create",
  patients = [],
  appointments = [],
  initialPatientId = "",
  onSuccess,
  onCancel,
}) {
  const isEditMode = mode === "edit" || Boolean(appointment);

  const [formData, setFormData] = useState(getInitialFormData);

  const [patientSearch, setPatientSearch] = useState("");
  const [showPatientList, setShowPatientList] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ====================================================
  // NORMALIZE PATIENT LIST
  // ====================================================

  const patientList = useMemo(() => {
    if (!Array.isArray(patients)) {
      return [];
    }

    return patients.filter(
      (patient) =>
        patient?.id !== null &&
        patient?.id !== undefined
    );
  }, [patients]);

  // ====================================================
  // NORMALIZE APPOINTMENT LIST
  // ====================================================

  const appointmentList = useMemo(() => {
    if (!Array.isArray(appointments)) {
      return [];
    }

    return appointments.filter(
      (item) =>
        item?.id !== null &&
        item?.id !== undefined
    );
  }, [appointments]);

  // ====================================================
  // SELECTED PATIENT
  // ====================================================

  const selectedPatient = useMemo(() => {
    if (!formData.patient_id) {
      return null;
    }

    return (
      patientList.find(
        (patient) =>
          Number(patient.id) ===
          Number(formData.patient_id)
      ) || null
    );
  }, [patientList, formData.patient_id]);

  // ====================================================
  // PATIENT NAME
  // ====================================================

  const getPatientName = (patient) => {
    if (!patient) {
      return "";
    }

    const fullName = [
      patient.first_name,
      patient.last_name,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    return (
      fullName ||
      patient.name ||
      `Patient #${patient.id}`
    );
  };

  // ====================================================
  // CHECK PREVIOUS APPOINTMENT
  // ====================================================

  const hasPreviousAppointment = (patientId) => {
    if (!patientId) {
      return false;
    }

    const selectedId = Number(patientId);

    return appointmentList.some((item) => {
      if (
        Number(item?.patient_id) !== selectedId
      ) {
        return false;
      }

      // When editing an existing appointment,
      // don't count the appointment itself.
      if (
        appointment?.id !== null &&
        appointment?.id !== undefined &&
        Number(item.id) === Number(appointment.id)
      ) {
        return false;
      }

      return true;
    });
  };

  // ====================================================
  // FILTER PATIENTS
  // ====================================================

  const filteredPatients = useMemo(() => {
    const searchValue = patientSearch
      .toLowerCase()
      .trim();

    if (!searchValue) {
      return patientList;
    }

    return patientList.filter((patient) => {
      const name = getPatientName(patient)
        .toLowerCase();

      const mrn = String(
        patient?.medical_record_number || ""
      )
        .toLowerCase()
        .trim();

      return (
        name.includes(searchValue) ||
        mrn.includes(searchValue)
      );
    });
  }, [patientList, patientSearch]);

  // ====================================================
  // POPULATE FORM
  // ====================================================

  useEffect(() => {
    // --------------------------------------------------
    // CREATE MODE
    // --------------------------------------------------

    if (!appointment) {
      const initialData = getInitialFormData();

      if (initialPatientId) {
        const numericPatientId =
          Number(initialPatientId);

        initialData.patient_id =
          numericPatientId;

        // Automatically determine follow-up status
        // from the current tenant's appointments.
        initialData.is_follow_up =
          hasPreviousAppointment(
            numericPatientId
          );
      }

      setFormData(initialData);

      const preselectedPatient =
        patientList.find(
          (patient) =>
            Number(patient.id) ===
            Number(initialPatientId)
        );

      if (preselectedPatient) {
        setPatientSearch(
          getPatientName(preselectedPatient)
        );
      } else {
        setPatientSearch("");
      }

      setShowPatientList(false);
      setError("");
      setSuccess("");

      return;
    }

    // --------------------------------------------------
    // EDIT MODE
    // --------------------------------------------------

    const appointmentPatientId =
      appointment.patient_id ?? "";

    setFormData({
      patient_id: appointmentPatientId,

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

      is_follow_up:
        appointment.is_follow_up === true,

      notes:
        appointment.notes ?? "",
    });

    const existingPatient =
      patientList.find(
        (patient) =>
          Number(patient.id) ===
          Number(appointmentPatientId)
      );

    if (existingPatient) {
      setPatientSearch(
        getPatientName(existingPatient)
      );
    } else {
      setPatientSearch("");
    }

    setShowPatientList(false);
    setError("");
    setSuccess("");
  }, [
    appointment,
    initialPatientId,
    patientList,
    appointmentList,
  ]);

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
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
    setSuccess("");
  };

  // ====================================================
  // PATIENT SELECT
  // ====================================================

  const handlePatientSelect = (patient) => {
    const patientId = Number(patient.id);

    // Automatically determine whether this patient
    // already has an appointment.
    const automaticallyFollowUp =
      hasPreviousAppointment(patientId);

    setFormData((previous) => ({
      ...previous,

      patient_id: patientId,

      is_follow_up:
        automaticallyFollowUp,
    }));

    setPatientSearch(
      getPatientName(patient)
    );

    setShowPatientList(false);
    setError("");
    setSuccess("");
  };

  // ====================================================
  // PATIENT SEARCH
  // ====================================================

  const handlePatientSearchChange = (event) => {
    const value = event.target.value;

    setPatientSearch(value);

    setShowPatientList(true);

    setFormData((previous) => ({
      ...previous,
      patient_id: "",
      is_follow_up: null,
    }));

    setError("");
    setSuccess("");
  };

  // ====================================================
  // CLEAR PATIENT
  // ====================================================

  const handleClearPatient = () => {
    setPatientSearch("");

    setFormData((previous) => ({
      ...previous,
      patient_id: "",
      is_follow_up: null,
    }));

    setShowPatientList(true);
    setError("");
    setSuccess("");
  };

  // ====================================================
  // VALIDATION
  // ====================================================

  const validateForm = () => {
    if (!formData.patient_id) {
      return "Please select a patient.";
    }

    if (!selectedPatient) {
      return "Please select a valid patient from the list.";
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

    const selectedDateTime = new Date(
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

    const minimumAllowed = new Date(
      now.getTime() + 60 * 1000
    );

    if (
      selectedDateTime <= minimumAllowed
    ) {
      return (
        "Please select a future appointment date and time."
      );
    }

    const duration = Number(
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
      const payload = {
        patient_id: Number(
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

        // IMPORTANT:
        // We preserve true/false.
        //
        // null is also allowed so backend can
        // automatically determine the status.
        is_follow_up:
          formData.is_follow_up,

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
      } else {
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

        {/* PATIENT */}

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
              Search and select the patient for this appointment.
            </p>
          </div>

          <div className="relative">
            <label
              htmlFor="patient_search"
              className={labelClass}
            >
              Select Patient
            </label>

            <div className="relative">
              <FiSearch
                className="
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  text-[#789078]
                  pointer-events-none
                "
                size={18}
              />

              <input
                id="patient_search"
                type="text"
                value={patientSearch}
                onChange={
                  handlePatientSearchChange
                }
                onFocus={() =>
                  setShowPatientList(true)
                }
                placeholder="Search patient by name or MRN..."
                disabled={loading}
                autoComplete="off"
                className={inputClass}
              />

              {patientSearch && (
                <button
                  type="button"
                  onClick={handleClearPatient}
                  disabled={loading}
                  className="
                    absolute right-3 top-1/2
                    -translate-y-1/2
                    flex h-8 w-8
                    items-center justify-center
                    rounded-full
                    text-slate-400
                    hover:bg-slate-100
                    hover:text-slate-600
                  "
                  aria-label="Clear patient"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>

            {/* PATIENT DROPDOWN */}

            {showPatientList && (
              <div
                className="
                  absolute z-50 mt-2 w-full
                  overflow-hidden
                  rounded-2xl
                  border border-slate-200
                  bg-white
                  shadow-xl
                "
              >
                <div
                  className="
                    max-h-64
                    overflow-y-auto
                    p-2
                  "
                >
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map(
                      (patient) => {
                        const patientName =
                          getPatientName(
                            patient
                          );

                        const mrn =
                          patient?.medical_record_number ||
                          "";

                        const isSelected =
                          Number(
                            formData.patient_id
                          ) ===
                          Number(patient.id);

                        return (
                          <button
                            key={patient.id}
                            type="button"
                            onClick={() =>
                              handlePatientSelect(
                                patient
                              )
                            }
                            className={`
                              w-full
                              flex items-center
                              justify-between
                              gap-4
                              rounded-xl
                              px-4 py-3
                              text-left
                              transition
                              ${
                                isSelected
                                  ? "bg-[#EEF5EC]"
                                  : "hover:bg-[#F7FAF7]"
                              }
                            `}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className="
                                  flex h-10 w-10
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  bg-[#EEF5EC]
                                  text-[#556B55]
                                "
                              >
                                <FiUser size={17} />
                              </div>

                              <div className="min-w-0">
                                <div
                                  className="
                                    font-semibold
                                    text-[#193B63]
                                    truncate
                                  "
                                >
                                  {patientName}
                                </div>

                                <div
                                  className="
                                    mt-0.5 text-xs
                                    text-slate-500
                                  "
                                >
                                  {mrn ||
                                    "MRN unavailable"}
                                </div>
                              </div>
                            </div>

                            {isSelected && (
                              <FiCheck
                                className="
                                  shrink-0
                                  text-[#556B55]
                                "
                                size={19}
                              />
                            )}
                          </button>
                        );
                      }
                    )
                  ) : (
                    <div
                      className="
                        px-5 py-8
                        text-center
                      "
                    >
                      <FiUser
                        className="
                          mx-auto mb-2
                          text-slate-300
                        "
                        size={28}
                      />

                      <p
                        className="
                          font-medium
                          text-slate-500
                        "
                      >
                        No patients found
                      </p>

                      <p
                        className="
                          mt-1 text-xs
                          text-slate-400
                        "
                      >
                        Try searching by patient name or MRN.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SELECTED PATIENT */}

            {selectedPatient && (
              <div
                className="
                  mt-3 flex items-center
                  justify-between gap-4
                  rounded-2xl
                  border border-[#DCE7D9]
                  bg-[#F5F9F3]
                  px-4 py-3
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-full
                      bg-[#E5EFE2]
                      text-[#556B55]
                    "
                  >
                    <FiUser size={16} />
                  </div>

                  <div>
                    <p
                      className="
                        font-semibold
                        text-[#193B63]
                      "
                    >
                      {getPatientName(
                        selectedPatient
                      )}
                    </p>

                    <p
                      className="
                        mt-0.5 text-xs
                        text-slate-500
                      "
                    >
                      {selectedPatient.medical_record_number ||
                        "MRN unavailable"}
                    </p>
                  </div>
                </div>

                <span
                  className="
                    rounded-full
                    bg-[#E5EFE2]
                    px-3 py-1
                    text-xs font-semibold
                    text-[#556B55]
                  "
                >
                  Selected
                </span>
              </div>
            )}

            {patientList.length === 0 && (
              <p
                className="
                  mt-2 text-xs
                  text-amber-600
                "
              >
                No patients are available in this clinic.
              </p>
            )}
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
                  value={
                    formData.appointment_date
                  }
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
                  value={
                    formData.appointment_time
                  }
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
              value={
                formData.duration_minutes
              }
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

          {/* FOLLOW-UP */}

          <div className="mt-5">
            <label
              className="
                flex cursor-pointer
                items-center gap-3
                rounded-2xl
                border border-[#E4E9E2]
                bg-white
                px-4 py-4
                transition
                hover:bg-[#F7FAF7]
              "
            >
              <input
                type="checkbox"
                name="is_follow_up"
                checked={
                  formData.is_follow_up === true
                }
                onChange={handleChange}
                disabled={loading}
                className="
                  h-5 w-5
                  rounded
                  border-slate-300
                  accent-[#556B55]
                "
              />

              <div>
                <p
                  className="
                    font-semibold
                    text-[#294C60]
                  "
                >
                  Follow-up appointment
                </p>

                <p
                  className="
                    mt-0.5 text-xs
                    text-slate-400
                  "
                >
                  Automatically selected when this patient has a previous appointment. You can change it manually.
                </p>
              </div>
            </label>
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