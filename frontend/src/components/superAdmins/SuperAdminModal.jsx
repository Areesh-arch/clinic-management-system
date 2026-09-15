import { useEffect, useState } from "react";

import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
  FiX,
} from "react-icons/fi";


function SuperAdminModal({
  open,
  admin,
  onClose,
  onSave,
  saving = false,
}) {
  const isEditing = Boolean(admin);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    is_active: true,
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");


  useEffect(() => {
    if (!open) {
      return;
    }

    setForm({
      full_name: admin?.full_name || "",
      email: admin?.email || "",
      password: "",
      is_active:
        admin?.is_active !== undefined
          ? admin.is_active
          : true,
    });

    setShowPassword(false);
    setError("");
  }, [open, admin]);


  if (!open) {
    return null;
  }


  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.full_name.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (!isEditing && !form.password) {
      setError("Password is required.");
      return;
    }

    if (
      !isEditing &&
      form.password.length < 6
    ) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    const payload = {
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      is_active: form.is_active,
    };

    if (form.password.trim()) {
      payload.password = form.password;
    }

    try {
      await onSave(payload);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to save Super Admin."
      );
    }
  };


  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#173B32]/50 px-4 py-6 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#D8CDB5] bg-[#FCFBF8] shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-[#E6E1D8] px-6 py-5">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A58B52]">
              Platform Access
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#173B32]">
              {isEditing
                ? "Edit Super Admin"
                : "Add Super Admin"}
            </h2>
          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#66736B] transition hover:bg-[#F1EEE7] hover:text-[#173B32]"
            aria-label="Close"
          >
            <FiX className="text-xl" />
          </button>

        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}


          {/* FULL NAME */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-[#45524A]">
              Full Name
            </label>

            <div className="relative">

              <FiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A948D]" />

              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Enter full name"
                disabled={saving}
                className="w-full rounded-2xl border border-[#D8CDB5] bg-white py-3 pl-11 pr-4 text-sm text-[#173B32] outline-none transition placeholder:text-[#A0A69F] focus:border-[#A58B52] focus:ring-2 focus:ring-[#A58B52]/15 disabled:bg-[#F2F0EB]"
              />

            </div>

          </div>


          {/* EMAIL */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-[#45524A]">
              Email Address
            </label>

            <div className="relative">

              <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A948D]" />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                disabled={saving}
                className="w-full rounded-2xl border border-[#D8CDB5] bg-white py-3 pl-11 pr-4 text-sm text-[#173B32] outline-none transition placeholder:text-[#A0A69F] focus:border-[#A58B52] focus:ring-2 focus:ring-[#A58B52]/15 disabled:bg-[#F2F0EB]"
              />

            </div>

          </div>


          {/* PASSWORD */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-[#45524A]">

              {isEditing
                ? "New Password"
                : "Password"}

              {isEditing && (
                <span className="ml-2 font-normal text-[#929A94]">
                  Optional
                </span>
              )}

            </label>

            <div className="relative">

              <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A948D]" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={
                  isEditing
                    ? "Leave blank to keep current password"
                    : "Enter password"
                }
                disabled={saving}
                className="w-full rounded-2xl border border-[#D8CDB5] bg-white py-3 pl-11 pr-12 text-sm text-[#173B32] outline-none transition placeholder:text-[#A0A69F] focus:border-[#A58B52] focus:ring-2 focus:ring-[#A58B52]/15 disabled:bg-[#F2F0EB]"
              />


              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#7A857D] hover:bg-[#F1EEE7] hover:text-[#173B32]"
                tabIndex={-1}
              >
                {showPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </button>

            </div>

          </div>


          {/* STATUS */}

          <div className="rounded-2xl border border-[#E6E1D8] bg-[#F7F3E9]/60 p-4">

            <label className="flex cursor-pointer items-center justify-between gap-4">

              <div>
                <p className="text-sm font-semibold text-[#173B32]">
                  Active Account
                </p>

                <p className="mt-1 text-xs leading-5 text-[#7A857D]">
                  Allow this administrator to sign in
                  and manage the platform.
                </p>
              </div>


              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                disabled={saving}
                className="h-5 w-5 accent-[#173B32]"
              />

            </label>

          </div>


          {/* ACTIONS */}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-2xl border border-[#D8CDB5] bg-white px-5 py-3 text-sm font-semibold text-[#45524A] transition hover:bg-[#F5F1E7] disabled:opacity-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-[#173B32] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#23483A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Super Admin"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}


export default SuperAdminModal;