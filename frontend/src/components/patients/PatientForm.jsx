
import { useEffect, useState } from "react";

import {
  createPatient,
  updatePatient,
} from "../../services/patientService";

const EMPTY_FORM = {
  full_name: "",
  gender: "",
  date_of_birth: "",
  phone: "",
  email: "",
  city: "",
  blood_group: "",
  allergies: "",
  medical_history: "",
  notes: "",
};

/*
 * Convert backend BloodGroup enum values into
 * the values used by the HTML select.
 */
const normalizeBloodGroup = (bloodGroup) => {
  if (!bloodGroup) {
    return "";
  }

  const value = String(bloodGroup);

  const bloodGroupMap = {
    A_POSITIVE: "A+",
    A_NEGATIVE: "A-",
    B_POSITIVE: "B+",
    B_NEGATIVE: "B-",
    AB_POSITIVE: "AB+",
    AB_NEGATIVE: "AB-",
    O_POSITIVE: "O+",
    O_NEGATIVE: "O-",
    "A+": "A+",
    "A-": "A-",
    "B+": "B+",
    "B-": "B-",
    "AB+": "AB+",
    "AB-": "AB-",
    "O+": "O+",
    "O-": "O-",
  };

  return bloodGroupMap[value] ?? value;
};

/*
 * Convert backend patient data into
 * values that React form inputs can safely use.
 */
const normalizePatientData = (patient) => {
  if (!patient) {
    return { ...EMPTY_FORM };
  }

  const firstName = patient.first_name ?? "";
  const lastName = patient.last_name ?? "";

  const fullName = [firstName, lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    full_name: fullName,
    gender: patient.gender
      ? String(patient.gender).toLowerCase()
      : "",
    date_of_birth: patient.date_of_birth
      ? String(patient.date_of_birth).slice(0, 10)
      : "",
    phone: patient.phone ?? "",
    email: patient.email ?? "",
    city: patient.city ?? "",
    blood_group: normalizeBloodGroup(
      patient.blood_group
    ),
    allergies: patient.allergies ?? "",
    medical_history: patient.medical_history ?? "",
    notes: patient.notes ?? "",
  };
};

/*
 * Split the single Full Name field into the
 * existing backend first_name and last_name fields.
 *
 * Examples:
 * "Areesha Azam" -> first_name: Areesha
 *                   last_name: Azam
 *
 * "Areesha" -> first_name: Areesha
 *              last_name: ""
 */
const splitFullName = (fullName) => {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return {
      first_name: "",
      last_name: "",
    };
  }

  if (parts.length === 1) {
    return {
      first_name: parts[0],
      last_name: "",
    };
  }

  return {
    first_name: parts[0],
    last_name: parts.slice(1).join(" "),
  };
};

function PatientForm({
  initialData = null,
  isEditing = false,
  onCancel,
  onSuccess,
}) {
  const [formData, setFormData] = useState(() =>
    normalizePatientData(initialData)
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /*
   * Load existing patient information when editing.
   */
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData(
        normalizePatientData(initialData)
      );
    } else {
      setFormData({ ...EMPTY_FORM });
    }

    setError("");
  }, [initialData, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    /*
     * FULL NAME AND PHONE ARE REQUIRED.
     */
    if (!formData.full_name.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    /*
     * Edit mode requires the existing patient's ID.
     */
    if (isEditing && !initialData?.id) {
      setError(
        "Unable to update patient because the patient ID is missing."
      );
      return;
    }

    try {
      setSaving(true);

      /*
       * Convert Full Name into the existing backend
       * first_name and last_name fields.
       */
      const { first_name, last_name } =
        splitFullName(formData.full_name);

      /*
       * Keep the existing backend API structure.
       * Optional fields are sent as null when empty.
       */
      const payload = {
        first_name,
        last_name,
        gender: formData.gender || null,
        date_of_birth:
          formData.date_of_birth || null,
        phone:
          formData.phone.trim() || null,
        email:
          formData.email.trim() || null,
        city:
          formData.city.trim() || null,
        blood_group:
          formData.blood_group || null,
        allergies:
          formData.allergies.trim() || null,
        medical_history:
          formData.medical_history.trim() || null,
        notes:
          formData.notes.trim() || null,
      };

      let savedPatient;

      if (isEditing) {
        console.log(
          "Updating patient:",
          initialData.id,
          payload
        );

        savedPatient = await updatePatient(
          initialData.id,
          payload
        );

        console.log(
          "Patient updated successfully:",
          savedPatient
        );
      } else {
        console.log(
          "Creating patient:",
          payload
        );

        savedPatient = await createPatient(
          payload
        );

        console.log(
          "Patient created successfully:",
          savedPatient
        );
      }

      /*
       * Return the saved patient to the parent.
       *
       * AppointmentForm uses this when creating
       * a new patient from inside an appointment.
       */
      if (onSuccess) {
        onSuccess(savedPatient);
      }
    } catch (error) {
      console.error(
        isEditing
          ? "Update patient failed:"
          : "Create patient failed:",
        error
      );

      setError(
        error.message ||
          (isEditing
            ? "Failed to update patient."
            : "Failed to create patient.")
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7"
    >
      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* PATIENT INFORMATION */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#173b32]">
            Patient Information
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Enter the patient's basic information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FULL NAME */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#173b32] mb-2">
              Full Name
              <span className="text-[#a58b52] ml-1">
                *
              </span>
            </label>

            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter patient's full name"
              className="input w-full"
            />
          </div>

          {/* GENDER */}
          <div>
            <label className="block text-sm font-medium text-[#173b32] mb-2">
              Gender
            </label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input w-full"
            >
              <option value="">
                Select Gender
              </option>

              <option value="male">
                Male
              </option>

              <option value="female">
                Female
              </option>

              <option value="other">
                Other
              </option>
            </select>
          </div>

          {/* DATE OF BIRTH */}
          <div>
            <label className="block text-sm font-medium text-[#173b32] mb-2">
              Date of Birth
            </label>

            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="input w-full"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium text-[#173b32] mb-2">
              Phone
              <span className="text-[#a58b52] ml-1">
                *
              </span>
            </label>

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="03XX XXXXXXX"
              className="input w-full"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-[#173b32] mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="patient@email.com"
              className="input w-full"
            />
          </div>

          {/* CITY */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#173b32] mb-2">
              City
            </label>

            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              className="input w-full"
            />
          </div>
        </div>
      </div>

      {/* MEDICAL INFORMATION */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#173b32]">
            Medical Information
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Optional information for the patient's record.
          </p>
        </div>

        <div className="space-y-4">
          {/* BLOOD GROUP */}
          <div>
            <label className="block text-sm font-medium text-[#173b32] mb-2">
              Blood Group
            </label>

            <select
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
              className="input w-full"
            >
              <option value="">
                Select Blood Group
              </option>

              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* ALLERGIES */}
          <div>
            <label className="block text-sm font-medium text-[#173b32] mb-2">
              Allergies
            </label>

            <textarea
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="Any known allergies"
              rows={2}
              className="input w-full resize-none"
            />
          </div>

          {/* MEDICAL HISTORY */}
          <div>
            <label className="block text-sm font-medium text-[#173b32] mb-2">
              Medical History
            </label>

            <textarea
              name="medical_history"
              value={formData.medical_history}
              onChange={handleChange}
              placeholder="Relevant medical history"
              rows={3}
              className="input w-full resize-none"
            />
          </div>

          {/* NOTES */}
          <div>
            <label className="block text-sm font-medium text-[#173b32] mb-2">
              Notes
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional notes"
              rows={3}
              className="input w-full resize-none"
            />
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-end gap-3 pt-6 border-t border-[#dfe6df]">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="
            px-5
            py-3
            rounded-xl
            border
            border-[#cbd6ce]
            text-[#173b32]
            bg-white
            hover:bg-[#f7f3e9]
            transition
            disabled:opacity-50
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="
            px-6
            py-3
            rounded-xl
            bg-[#556B55]
            text-white
            font-medium
            hover:bg-[#465946]
            transition
            disabled:opacity-50
          "
        >
          {saving
            ? isEditing
              ? "Updating..."
              : "Saving..."
            : isEditing
              ? "Update Patient"
              : "Save Patient"}
        </button>
      </div>
    </form>
  );
}

export default PatientForm;
