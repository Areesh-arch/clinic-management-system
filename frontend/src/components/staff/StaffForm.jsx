import { useEffect, useState } from "react";

import {
  createStaff,
  updateStaff,
} from "../../services/staffService";

function StaffForm({ staff, onSuccess }) {

  const isEditMode = Boolean(staff);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    designation: "",
    phone: "",
    salary: "",
    hire_date: "",
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD STAFF DATA WHEN EDITING
  // =========================================================

  useEffect(() => {
    if (staff) {
      setForm({
        full_name: staff.name || "",
        email: staff.email || "",
        password: "",
        designation: staff.designation || "",
        phone: staff.phone || "",
        salary: staff.salary || "",
        hire_date: staff.hire_date || "",
        is_active: staff.is_active ?? true,
      });
    }
  }, [staff]);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (isEditMode) {

        // PUT /staff/{id}
        const payload = {
          full_name: form.full_name,
          email: form.email,
          designation: form.designation,
          phone: form.phone,
          salary:
            form.salary === ""
              ? null
              : Number(form.salary),
          hire_date: form.hire_date,
          is_active: form.is_active,
        };

        await updateStaff(
          staff.id,
          payload
        );

      } else {

        // POST /staff/
        const payload = {
          full_name: form.full_name,
          email: form.email,
          password: form.password,
          designation: form.designation,
          phone: form.phone,
          salary:
            form.salary === ""
              ? null
              : Number(form.salary),
          hire_date: form.hire_date,
          is_active: form.is_active,
        };

        await createStaff(payload);
      }

      onSuccess();

    } catch (err) {

      console.error(
        isEditMode
          ? "Failed to update staff:"
          : "Failed to create staff:",
        err
      );

      setError(
        err.message ||
        (
          isEditMode
            ? "Failed to update staff."
            : "Failed to create staff."
        )
      );

    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      <h2 className="text-2xl font-bold text-[#45524A]">
        {isEditMode
          ? "Edit Staff"
          : "Add Staff"}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* NAME */}

      <input
        name="full_name"
        value={form.full_name}
        onChange={handleChange}
        type="text"
        placeholder="Full Name"
        required
        className="w-full border rounded-xl p-3"
      />

      {/* EMAIL */}

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        type="email"
        placeholder="Email"
        required
        className="w-full border rounded-xl p-3"
      />

      {/* PASSWORD ONLY WHEN CREATING */}

      {!isEditMode && (
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          placeholder="Password"
          required
          className="w-full border rounded-xl p-3"
        />
      )}

      {/* DESIGNATION */}

      <input
        name="designation"
        value={form.designation}
        onChange={handleChange}
        type="text"
        placeholder="Designation (e.g. Nurse, Receptionist)"
        required
        className="w-full border rounded-xl p-3"
      />

      {/* PHONE */}

      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        type="text"
        placeholder="Phone"
        required
        className="w-full border rounded-xl p-3"
      />

      {/* SALARY */}

      <input
        name="salary"
        value={form.salary}
        onChange={handleChange}
        type="number"
        min="0"
        placeholder="Salary"
        className="w-full border rounded-xl p-3"
      />

      {/* HIRE DATE */}

      <div>
        <label className="block text-sm font-medium mb-2">
          Hire Date
        </label>

        <input
          name="hire_date"
          value={form.hire_date}
          onChange={handleChange}
          type="date"
          required
          className="w-full border rounded-xl p-3"
        />
      </div>

      {/* ACTIVE */}

      <label className="flex items-center gap-3">
        <input
          name="is_active"
          type="checkbox"
          checked={form.is_active}
          onChange={handleChange}
        />

        <span>
          Active Staff Member
        </span>
      </label>

      {/* BUTTON */}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-[#A8C5A0]
                   hover:bg-[#93B88A]
                   disabled:opacity-50
                   text-white px-6 py-3
                   rounded-xl font-semibold"
      >
        {saving
          ? "Saving..."
          : isEditMode
            ? "Update Staff"
            : "Save Staff"}
      </button>

    </form>
  );
}

export default StaffForm;