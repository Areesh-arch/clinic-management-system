import { useEffect, useState } from "react";

import Layout from "../../components/layout/Layout";

import SettingsHeader from "../../components/settings/SettingsHeader";
import ProfileSettings from "../../components/settings/ProfileSettings";
import WebsiteSettings from "../../components/settings/WebsiteSettings";
import SecuritySettings from "../../components/settings/SecuritySettings";
import NotificationSettings from "../../components/settings/NotificationSettings";
import SaveButton from "../../components/settings/SaveButton";

import {
  getCurrentUser,
  getTenant,
  updateTenant,
  updateUser,
} from "../../services/settingsService";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState({
    clinicName: "",
    administrator: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const currentUser = await getCurrentUser();

      setUser(currentUser);

      const tenant = await getTenant(
        currentUser.tenant_id
      );

      setProfile({
        clinicName:
          tenant.business_name || "",

        administrator:
          currentUser.name || "",

        email:
          currentUser.email || "",

        phone: "",
      });
    } catch (err) {
      console.error(
        "Failed to load settings:",
        err
      );

      setError(
        err?.message ||
          "Failed to load settings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await updateTenant(
        user.tenant_id,
        {
          business_name:
            profile.clinicName,
        }
      );

      await updateUser(
        user.id,
        {
          full_name:
            profile.administrator,

          email:
            profile.email,
        }
      );

      setMessage(
        "Clinic settings saved successfully."
      );

      await loadSettings();
    } catch (err) {
      console.error(
        "Failed to save settings:",
        err
      );

      setError(
        err?.message ||
          "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <SettingsHeader />

        {loading && (
          <div className="rounded-xl border border-[#d8cdb5] bg-[#fffdf7] p-5 text-[#23483a]">
            Loading your clinic settings...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl border border-[#c7d8c9] bg-[#edf5ed] p-4 text-[#23483a]">
            {message}
          </div>
        )}

        {!loading && (
          <>
            {/* =================================================
                CLINIC PROFILE
            ================================================= */}

            <ProfileSettings
              profile={profile}
              setProfile={setProfile}
            />

            <SaveButton
              onSave={handleSave}
              saving={saving}
            />

            {/* =================================================
                WEBSITE
            ================================================= */}

            <WebsiteSettings />

            {/* =================================================
                SECURITY
            ================================================= */}

            <SecuritySettings />

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <NotificationSettings />
          </>
        )}
      </div>
    </Layout>
  );
}