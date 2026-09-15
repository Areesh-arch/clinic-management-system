import { useState } from "react";
import { changePassword } from "../../services/settingsService";

export default function SecuritySettings() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async () => {
    setMessage("");
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setSaving(true);

      await changePassword({
        new_password: newPassword,
      });

      setMessage("Password changed successfully.");

      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Failed to change password:", err);

      setError(
        err?.message || "Failed to change password."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#E6E1D8] bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold text-[#25312A]">
        Change Password
      </h2>

      <p className="mb-6 text-sm text-[#7E867F]">
        Update your password to keep your account secure.
      </p>

      <div className="max-w-xl space-y-4">

        {/* New Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#45524A]">
            New Password
          </label>

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full rounded-xl border border-[#D8D3C8] bg-[#FCFBF8] px-4 py-3 text-[#25312A] outline-none focus:border-[#7A9E7E] focus:ring-2 focus:ring-[#A8C5A0]/30"
          />
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#45524A]">
            Confirm New Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full rounded-xl border border-[#D8D3C8] bg-[#FCFBF8] px-4 py-3 text-[#25312A] outline-none focus:border-[#7A9E7E] focus:ring-2 focus:ring-[#A8C5A0]/30"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {message && (
          <div className="rounded-xl border border-[#C7D8C9] bg-[#EDF5ED] px-4 py-3 text-sm text-[#23483A]">
            {message}
          </div>
        )}

        {/* Button */}
        <button
          type="button"
          onClick={handleChangePassword}
          disabled={saving}
          className="rounded-xl bg-[#7A9E7E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#688B6C] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Changing Password..." : "Change Password"}
        </button>
      </div>
    </div>
  );
}