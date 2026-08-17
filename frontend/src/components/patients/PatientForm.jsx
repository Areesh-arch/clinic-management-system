import { useState } from "react";
import { createPatient } from "../../services/patientService";

function PatientForm({ onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
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
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";

    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    if (Number.isNaN(birthDate.getTime())) {
      return "";
    }

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDifference =
      today.getMonth() -
      birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (
        monthDifference === 0 &&
        today.getDate() < birthDate.getDate()
      )
    ) {
      age--;
    }

    return age >= 0 ? age : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

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

    try {
      setSaving(true);

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

        profile_photo:
          formData.profile_photo.trim() || null,
      };

      console.log("Creating patient:", payload);

      const createdPatient =
        await createPatient(payload);

      console.log(
        "Patient created successfully:",
        createdPatient
      );

      if (onSuccess) {
        onSuccess(createdPatient);
      }
    } catch (error) {
      console.error(
        "Create patient failed:",
        error
      );

      setError(
        error.message ||
          "Failed to create patient."
      );
    } finally {
      setSaving(false);
    }
  };

  const age = calculateAge(
    formData.date_of_birth
  );

  const inputClass = `
    w-full
    rounded-xl
    border
    border-[#DDE5DF]
    bg-white
    px-4
    py-3
    text-[#1E2D45]
    placeholder-[#8EA0B8]
    outline-none
    transition-all
    duration-200
    focus:border-[#5F7A63]
    focus:ring-4
    focus:ring-[#EAF2E7]
    hover:border-[#B8C8BC]
  `;

  const textareaClass = `
    w-full
    rounded-xl
    border
    border-[#DDE5DF]
    bg-white
    px-4
    py-3
    text-[#1E2D45]
    placeholder-[#8EA0B8]
    outline-none
    resize-none
    transition-all
    duration-200
    focus:border-[#5F7A63]
    focus:ring-4
    focus:ring-[#EAF2E7]
    hover:border-[#B8C8BC]
  `;

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex
        flex-col
        min-h-full
        bg-[#F8FAF7]
      "
    >

      {/* ERROR MESSAGE */}

      {error && (
        <div className="mx-6 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              !
            </div>

            <div>
              <p className="font-medium text-red-700">
                Unable to save patient
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FORM CONTENT */}

      <div className="space-y-6 p-6">

        {/* ================= PERSONAL INFORMATION ================= */}

        <section className="overflow-hidden rounded-2xl border border-[#DDE5DF] bg-white shadow-sm">

          <div className="border-b border-[#DDE5DF] bg-[#EAF2E7] px-6 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5F7A63] text-white">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#1E2D45]">
                  Personal Information
                </h3>

                <p className="text-sm text-[#60738F]">
                  Basic information about the patient
                </p>
              </div>

            </div>

          </div>

          <div className="p-6">

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* FIRST NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1E2D45]">
                  First Name
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={inputClass}
                />
              </div>

              {/* LAST NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1E2D45]">
                  Last Name
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className={inputClass}
                />
              </div>

              {/* GENDER */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1E2D45]">
                  Gender
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">
                    Select gender
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
                <label className="mb-2 block text-sm font-medium text-[#1E2D45]">
                  Date of Birth
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />

                {age !== "" && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#EAF2E7] px-3 py-1.5 text-sm text-[#4F6853]">
                    <span className="font-medium">
                      Age
                    </span>

                    <span className="font-bold">
                      {age} years
                    </span>
                  </div>
                )}
              </div>

              {/* PHONE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1E2D45]">
                  Phone
                </label>

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03XX XXXXXXX"
                  className={inputClass}
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1E2D45]">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="patient@example.com"
                  className={inputClass}
                />
              </div>

            </div>

          </div>
        </section>


        {/* ================= ADDRESS ================= */}

        <section className="overflow-hidden rounded-2xl border border-[#DDE5DF] bg-white shadow-sm">

          <div className="border-b border-[#DDE5DF] bg-[#F8FAF7] px-6 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2E7] text-[#5F7A63]">

                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 21a2 2 0 01-2.828 0l-4.243-4.343a8 8 0 1111.314 0z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#1E2D45]">
                  Address
                </h3>

                <p className="text-sm text-[#60738F]">
                  Patient's residential information
                </p>
              </div>

            </div>

          </div>

          <div className="p-6">

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* CITY */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1E2D45]">
                  City
                </label>

                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Gujranwala"
                  className={inputClass}
                />
              </div>

              {/* COUNTRY */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1E2D45]">
                  Country
                </label>

                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className={inputClass}
                />
              </div>

              {/* ADDRESS */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-[#1E2D45]">
                  Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  rows={3}
                  className={textareaClass}
                />

              </div>

            </div>

          </div>

        </section>


        {/* ================= ADDITIONAL INFORMATION ================= */}

        <section className="overflow-hidden rounded-2xl border border-[#DDE5DF] bg-white shadow-sm">

          <div className="border-b border-[#DDE5DF] bg-[#F8FAF7] px-6 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2E7] text-[#5F7A63]">

                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>

              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#1E2D45]">
                  Additional Information
                </h3>

                <p className="text-sm text-[#60738F]">
                  Identification and personal details
                </p>
              </div>

            </div>

          </div>

          <div className="p-6">

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* CNIC */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1E2D45]">
                  CNIC
                </label>

                <input
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleChange}
                  placeholder="XXXXX-XXXXXXX-X"
                  className={inputClass}
                />
              </div>

              {/* OCCUPATION */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1E2D45]">
                  Occupation
                </label>

                <input
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="e.g. Teacher"
                  className={inputClass}
                />
              </div>

              {/* MARITAL STATUS */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1E2D45]">
                  Marital Status
                </label>

                <select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">
                    Select marital status
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
              </div>

              {/* BLOOD GROUP */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1E2D45]">
                  Blood Group
                </label>

                <select
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">
                    Select blood group
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

            </div>

          </div>

        </section>


        {/* ================= MEDICAL INFORMATION ================= */}

        <section className="overflow-hidden rounded-2xl border border-[#E9D8AF] bg-white shadow-sm">

          <div className="border-b border-[#E9D8AF] bg-[#FFF8E8] px-6 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0C9] text-[#C28A20]">

                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>

              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#1E2D45]">
                  Medical Information
                </h3>

                <p className="text-sm text-[#60738F]">
                  Important medical history and notes
                </p>
              </div>

            </div>

          </div>

          <div className="space-y-5 p-6">

            {/* ALLERGIES */}

            <div>

              <label className="mb-2 block text-sm font-medium text-[#1E2D45]">
                Allergies
              </label>

              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="List known allergies..."
                rows={3}
                className={textareaClass}
              />

            </div>

            {/* MEDICAL HISTORY */}

            <div>

              <label className="mb-2 block text-sm font-medium text-[#1E2D45]">
                Medical History
              </label>

              <textarea
                name="medical_history"
                value={formData.medical_history}
                onChange={handleChange}
                placeholder="Previous diseases, surgeries, medications, etc."
                rows={4}
                className={textareaClass}
              />

            </div>

            {/* NOTES */}

            <div>

              <label className="mb-2 block text-sm font-medium text-[#1E2D45]">
                Notes
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional clinical notes..."
                rows={3}
                className={textareaClass}
              />

            </div>

          </div>

        </section>


        {/* ================= EMERGENCY CONTACT ================= */}

        <section className="overflow-hidden rounded-2xl border border-[#DDE5DF] bg-white shadow-sm">

          <div className="border-b border-[#DDE5DF] bg-[#F8FAF7] px-6 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2E7] text-[#5F7A63]">

                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16a2 2 0 001.73 3z"
                  />
                </svg>

              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#1E2D45]">
                  Emergency Contact
                </h3>

                <p className="text-sm text-[#60738F]">
                  Contact person for emergencies
                </p>
              </div>

            </div>

          </div>

          <div className="p-6">

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-medium text-[#1E2D45]">
                  Contact Name
                </label>

                <input
                  name="emergency_contact_name"
                  value={
                    formData.emergency_contact_name
                  }
                  onChange={handleChange}
                  placeholder="Emergency contact name"
                  className={inputClass}
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-[#1E2D45]">
                  Contact Phone
                </label>

                <input
                  name="emergency_contact_phone"
                  value={
                    formData.emergency_contact_phone
                  }
                  onChange={handleChange}
                  placeholder="03XX XXXXXXX"
                  className={inputClass}
                />

              </div>

            </div>

          </div>

        </section>

      </div>


      {/* ================= STICKY ACTION BAR ================= */}

      <div className="
        sticky
        bottom-0
        z-20
        border-t
        border-[#DDE5DF]
        bg-white/95
        px-6
        py-4
        backdrop-blur
      ">

        <div className="flex items-center justify-between gap-4">

          <p className="hidden text-sm text-[#60738F] sm:block">
            <span className="text-red-500">*</span>{" "}
            Required fields
          </p>

          <div className="ml-auto flex gap-3">

            {/* CANCEL */}

            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="
                rounded-xl
                border
                border-[#DDE5DF]
                bg-white
                px-5
                py-3
                font-medium
                text-[#1E2D45]
                transition-all
                duration-200
                hover:border-[#B8C8BC]
                hover:bg-[#F8FAF7]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            {/* SAVE */}

            <button
              type="submit"
              disabled={saving}
              className="
                flex
                min-w-[150px]
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#5F7A63]
                px-6
                py-3
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:bg-[#4F6853]
                hover:shadow-md
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {saving ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-30"
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="3"
                    />

                    <path
                      className="opacity-90"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                    />
                  </svg>

                  Saving...
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>

                  Save Patient
                </>
              )}

            </button>

          </div>

        </div>

      </div>

    </form>
  );
}

export default PatientForm;