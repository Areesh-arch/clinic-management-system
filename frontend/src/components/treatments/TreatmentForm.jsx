import { useEffect, useState } from "react";

import {
  getAppointments,
} from "../../services/appointmentService";

import {
  createTreatment,
} from "../../services/treatmentService";


function TreatmentForm({
  onSuccess,
  onClose,
}) {

  const [appointments, setAppointments] =
    useState([]);

  const [loadingAppointments, setLoadingAppointments] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [formData, setFormData] = useState({
    appointment_id: "",
    treatment: "",
    charge: "",
    status: "IN_PROGRESS",
    chief_complaint: "",
    notes: "",
  });


  // ==========================================
  // LOAD SCHEDULED APPOINTMENTS
  // ==========================================

  useEffect(() => {

    const loadAppointments = async () => {

      try {

        setLoadingAppointments(true);
        setError("");

        const data =
          await getAppointments();

        const scheduled =
          Array.isArray(data)
            ? data.filter(
                (appointment) =>
                  appointment.status === "SCHEDULED"
              )
            : [];

        setAppointments(scheduled);

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

        setLoadingAppointments(false);

      }
    };


    loadAppointments();

  }, []);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

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


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");


    if (!formData.appointment_id) {

      setError(
        "Please select an appointment."
      );

      return;
    }


    if (!formData.treatment.trim()) {

      setError(
        "Please enter the treatment."
      );

      return;
    }


    try {

      setSaving(true);


      const createdTreatment =
        await createTreatment(
          formData
        );


      console.log(
        "Treatment created:",
        createdTreatment
      );


      if (onSuccess) {
        onSuccess(
          createdTreatment
        );
      }


      if (onClose) {
        onClose();
      }


    } catch (err) {

      console.error(
        "Failed to create treatment:",
        err
      );

      setError(
        err.message ||
        "Failed to create treatment."
      );

    } finally {

      setSaving(false);

    }

  };


  // ==========================================
  // GET SELECTED APPOINTMENT
  // ==========================================

  const selectedAppointment =
    appointments.find(
      (appointment) =>
        String(appointment.id) ===
        String(formData.appointment_id)
    );


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      <h2 className="text-3xl font-bold text-[#25312A]">
        Add Treatment
      </h2>


      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">
          {error}
        </div>
      )}


      {/* ======================================
          APPOINTMENT
      ====================================== */}

      <div>

        <label className="block text-sm font-medium text-[#45524A] mb-2">
          Appointment
        </label>

        <select
          name="appointment_id"
          value={formData.appointment_id}
          onChange={handleChange}
          disabled={
            loadingAppointments ||
            saving
          }
          className="w-full border border-[#25312A] rounded-xl p-4 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#A8C5A0]"
        >

          <option value="">
            {loadingAppointments
              ? "Loading appointments..."
              : "Select appointment"}
          </option>


          {appointments.map(
            (appointment) => (

              <option
                key={appointment.id}
                value={appointment.id}
              >
                Appointment #{appointment.id}
                {" - "}
                {appointment.appointment_date}
              </option>

            )
          )}

        </select>

      </div>


      {/* ======================================
          SELECTED APPOINTMENT INFORMATION
      ====================================== */}

      {selectedAppointment && (
        <div className="rounded-xl bg-[#F6F4EF] border border-[#E6E1D8] p-4">

          <p className="text-sm text-gray-500">
            Selected appointment
          </p>

          <p className="font-semibold text-[#25312A] mt-1">
            Appointment #{selectedAppointment.id}
          </p>

          <p className="text-sm text-gray-600 mt-1">
            Date:{" "}
            {selectedAppointment.appointment_date ||
              "N/A"}
          </p>

        </div>
      )}


      {/* ======================================
          TREATMENT
      ====================================== */}

      <input
        type="text"
        name="treatment"
        value={formData.treatment}
        onChange={handleChange}
        placeholder="Treatment"
        disabled={saving}
        className="w-full border border-[#25312A] rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#A8C5A0]"
      />


      {/* ======================================
          COST
      ====================================== */}

      <input
        type="number"
        name="charge"
        value={formData.charge}
        onChange={handleChange}
        placeholder="Cost (£)"
        min="0"
        step="0.01"
        disabled={saving}
        className="w-full border border-[#25312A] rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#A8C5A0]"
      />


      {/* ======================================
          STATUS
      ====================================== */}

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        disabled={saving}
        className="w-full border border-[#25312A] rounded-xl p-4 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#A8C5A0]"
      >

        <option value="IN_PROGRESS">
          In Progress
        </option>

        <option value="COMPLETED">
          Completed
        </option>

      </select>


      {/* ======================================
          CHIEF COMPLAINT
      ====================================== */}

      <textarea
        name="chief_complaint"
        value={formData.chief_complaint}
        onChange={handleChange}
        placeholder="Chief Complaint (optional)"
        rows="3"
        disabled={saving}
        className="w-full border border-[#25312A] rounded-xl p-4 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#A8C5A0]"
      />


      {/* ======================================
          NOTES
      ====================================== */}

      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Notes (optional)"
        rows="3"
        disabled={saving}
        className="w-full border border-[#25312A] rounded-xl p-4 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#A8C5A0]"
      />


      {/* ======================================
          SAVE
      ====================================== */}

      <button
        type="submit"
        disabled={
          saving ||
          loadingAppointments
        }
        className="w-full bg-[#A8C5A0] text-white rounded-xl py-4 text-lg font-semibold hover:bg-[#90B68A] disabled:opacity-60 disabled:cursor-not-allowed transition"
      >

        {saving
          ? "Saving..."
          : "Save Treatment"}

      </button>

    </form>
  );
}


export default TreatmentForm;