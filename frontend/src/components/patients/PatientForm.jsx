import { useEffect, useState } from "react";
import {
  createPatient,
  updatePatient,
} from "../../services/patientService";

const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  gender: "",
  date_of_birth: "",

  phone: "",
  email: "",

  address: "",
  city: "",
  country: "Pakistan",

  cnic: "",
  occupation: "",

  marital_status: "",
  blood_group: "",

  allergies: "",
  medical_history: "",
  notes: "",

  emergency_contact_name: "",
  emergency_contact_phone: "",

  profile_photo: "",
};

/*
 * Convert backend patient data into values that
 * React form inputs can safely use.
 */
const normalizePatientData = (patient) => {
  if (!patient) {
    return { ...EMPTY_FORM };
  }

  return {
    first_name: patient.first_name ?? "",
    last_name: patient.last_name ?? "",

    /*
     * Backend enum values are returned as strings such as
     * "MALE", "FEMALE", "OTHER".
     * The select options use lowercase values.
     */
    gender: patient.gender
      ? String(patient.gender).toLowerCase()
      : "",

    /*
     * HTML date input requires YYYY-MM-DD.
     */
    date_of_birth: patient.date_of_birth
      ? String(patient.date_of_birth).slice(0, 10)
      : "",

    phone: patient.phone ?? "",
    email: patient.email ?? "",

    address: patient.address ?? "",
    city: patient.city ?? "",
    country: patient.country ?? "Pakistan",

    cnic: patient.cnic ?? "",
    occupation: patient.occupation ?? "",

    /*
     * Backend enum values:
     * SINGLE, MARRIED, DIVORCED, WIDOWED
     */
    marital_status: patient.marital_status
      ? String(patient.marital_status).toLowerCase()
      : "",

    /*
     * Blood group values are returned by the backend
     * as enum names such as A_POSITIVE.
     * Convert them to the values used by the select.
     */
    blood_group: normalizeBloodGroup(patient.blood_group),

    allergies: patient.allergies ?? "",
    medical_history: patient.medical_history ?? "",
    notes: patient.notes ?? "",

    emergency_contact_name:
      patient.emergency_contact_name ?? "",

    emergency_contact_phone:
      patient.emergency_contact_phone ?? "",

    profile_photo: patient.profile_photo ?? "",
  };
};

/*
 * Convert backend BloodGroup enum values into
 * the values used by the HTML select.
 *
 * Examples:
 * A_POSITIVE -> A+
 * A_NEGATIVE -> A-
 * AB_POSITIVE -> AB+
 * O_NEGATIVE -> O-
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

    // Also support values already returned as A+, A-, etc.
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
   * When editing a patient, load that patient's existing
   * information into the form.
   *
   * This also makes sure that if the user switches from
   * one patient to another, the new patient's data appears.
   */
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData(normalizePatientData(initialData));
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
     * Required fields
     */
    if (
      !formData.first_name.trim() ||
      !formData.last_name.trim() ||
      !formData.gender ||
      !formData.date_of_birth
    ) {
      setError(
        "First name, last name, gender and date of birth are required."
      );
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
       * Build the payload using the CURRENT form values.
       *
       * Because edit mode is pre-filled, fields that the
       * user does not change keep their original values.
       */
      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),

        gender: formData.gender,

        date_of_birth: formData.date_of_birth,

        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,

        address: formData.address.trim() || null,
        city: formData.city.trim() || null,
        country: formData.country.trim() || null,

        cnic: formData.cnic.trim() || null,
        occupation: formData.occupation.trim() || null,

        marital_status:
          formData.marital_status || null,

        blood_group:
          formData.blood_group || null,

        allergies:
          formData.allergies.trim() || null,

        medical_history:
          formData.medical_history.trim() || null,

        notes:
          formData.notes.trim() || null,

        emergency_contact_name:
          formData.emergency_contact_name.trim() || null,

        emergency_contact_phone:
          formData.emergency_contact_phone.trim() || null,

        /*
         * Keep the existing profile photo if there is one.
         */
        profile_photo:
          formData.profile_photo.trim() || null,
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

        savedPatient = await createPatient(payload);

        console.log(
          "Patient created successfully:",
          savedPatient
        );
      }

      /*
       * Tell the parent component that the operation
       * completed successfully.
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
      className="space-y-6"
    >
      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* PERSONAL INFORMATION */}

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name *"
            className="input"
          />

          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name *"
            className="input"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="input"
          >
            <option value="">
              Select Gender *
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

          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="input"
          />

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="input"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="input"
          />

        </div>
      </div>

      {/* ADDRESS */}

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Address
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="input"
          />

          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            className="input"
          />

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            rows={3}
            className="input md:col-span-2"
          />

        </div>
      </div>

      {/* ADDITIONAL INFORMATION */}

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Additional Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            name="cnic"
            value={formData.cnic}
            onChange={handleChange}
            placeholder="CNIC"
            className="input"
          />

          <input
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            placeholder="Occupation"
            className="input"
          />

          <select
            name="marital_status"
            value={formData.marital_status}
            onChange={handleChange}
            className="input"
          >
            <option value="">
              Select Marital Status
            </option>

            <option value="single">
              Single
            </option>

            <option value="married">
              Married
            </option>

            <option value="divorced">
              Divorced
            </option>

            <option value="widowed">
              Widowed
            </option>
          </select>

          <select
            name="blood_group"
            value={formData.blood_group}
            onChange={handleChange}
            className="input"
          >
            <option value="">
              Select Blood Group
            </option>

            <option value="A+">
              A+
            </option>

            <option value="A-">
              A-
            </option>

            <option value="B+">
              B+
            </option>

            <option value="B-">
              B-
            </option>

            <option value="AB+">
              AB+
            </option>

            <option value="AB-">
              AB-
            </option>

            <option value="O+">
              O+
            </option>

            <option value="O-">
              O-
            </option>
          </select>

        </div>
      </div>

      {/* MEDICAL INFORMATION */}

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Medical Information
        </h3>

        <div className="space-y-4">

          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="Allergies"
            rows={3}
            className="input w-full"
          />

          <textarea
            name="medical_history"
            value={formData.medical_history}
            onChange={handleChange}
            placeholder="Medical History"
            rows={3}
            className="input w-full"
          />

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notes"
            rows={3}
            className="input w-full"
          />

        </div>
      </div>

      {/* EMERGENCY CONTACT */}

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Emergency Contact
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            name="emergency_contact_name"
            value={formData.emergency_contact_name}
            onChange={handleChange}
            placeholder="Emergency Contact Name"
            className="input"
          />

          <input
            name="emergency_contact_phone"
            value={formData.emergency_contact_phone}
            onChange={handleChange}
            placeholder="Emergency Contact Phone"
            className="input"
          />

        </div>
      </div>

      {/* BUTTONS */}

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="
            px-5
            py-3
            rounded-xl
            border
            border-slate-300
            text-slate-700
            hover:bg-slate-50
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