import { useState } from "react";
import { changePassword } from "../../services/settingsService";

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async () => {
    setMessage("");
    setError("");

    // Check required fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    // Check password length
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    // Check confirmation
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setSaving(true);

      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      setMessage("Password changed successfully.");

      // Clear fields after successful change
      setCurrentPassword("");
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
    <div className="bg-white rounded-xl border border-[#E6E1D8] shadow-sm p-6">
      <h2 className="text-xl font-semibold text-[#25312A] mb-2">
        Change Password
      </h2>

      <p className="text-sm text-[#7E867F] mb-6">
        Update your password to keep your account secure.
      </p>

      <div className="space-y-4 max-w-xl">

        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-[#45524A] mb-2">
            Current Password
          </label>

          <input
            type="password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
            placeholder="Enter current password"
            className="w-full border border-[#D8D3C8] rounded-xl px-4 py-3 bg-[#FCFBF8] text-[#25312A] outline-none focus:border-[#7A9E7E] focus:ring-2 focus:ring-[#A8C5A0]/30"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-[#45524A] mb-2">
            New Password
          </label>

          <input
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            placeholder="Enter new password"
            className="w-full border border-[#D8D3C8] rounded-xl px-4 py-3 bg-[#FCFBF8] text-[#25312A] outline-none focus:border-[#7A9E7E] focus:ring-2 focus:ring-[#A8C5A0]/30"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-[#45524A] mb-2">
            Confirm New Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            placeholder="Confirm new password"
            className="w-full border border-[#D8D3C8] rounded-xl px-4 py-3 bg-[#FCFBF8] text-[#25312A] outline-none focus:border-[#7A9E7E] focus:ring-2 focus:ring-[#A8C5A0]/30"
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