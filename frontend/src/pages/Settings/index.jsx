import { useEffect, useState } from "react";

import Layout from "../../components/layout/Layout";

import SettingsHeader from "../../components/settings/SettingsHeader";
import ProfileSettings from "../../components/settings/ProfileSettings";
import WebsiteSettings from "../../components/settings/WebsiteSettings";
import SecuritySettings from "../../components/settings/SecuritySettings";
import NotificationSettings from "../../components/settings/NotificationSettings";

import { getCurrentUser } from "../../services/settingsService";

import {
  getSelectedTenantName,
  subscribeToTenantChanges,
} from "../../utils/tenantContext";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentUser, setCurrentUser] = useState(null);

  const [profile, setProfile] = useState({
    clinicName: "",
    administrator: "",
    email: "",
    phone: "",
    profileImageUrl: null,
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const user = await getCurrentUser();

      console.log("Settings current user:", user);

      setCurrentUser(user);

      setProfile({
        clinicName:
          getSelectedTenantName() || "",

        administrator:
          user?.name || "",

        email:
          user?.email || "",

        phone:
          user?.phone || "",

        profileImageUrl:
          user?.profile_image_url || null,
      });
    } catch (err) {
      console.error(
        "Failed to load profile settings:",
        err
      );

      setError(
        err?.message ||
          "Failed to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    const unsubscribe =
      subscribeToTenantChanges(
        (selectedTenant) => {
          setProfile((previous) => ({
            ...previous,

            clinicName:
              selectedTenant?.business_name ||
              getSelectedTenantName() ||
              "",
          }));
        }
      );

    return unsubscribe;
  }, []);

  // =====================================================
  // ROLE
  // =====================================================

  const userRole = String(
    currentUser?.role || ""
  )
    .toLowerCase()
    .trim();

  const isSuperAdmin =
    userRole === "super_admin";

  return (
    <Layout>
      <div className="space-y-8">

        <SettingsHeader />

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="rounded-2xl border border-[#d8cdb5] bg-[#fffdf7] p-5 text-[#23483a] shadow-sm">
            Loading your profile...
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* =================================================
            SETTINGS CONTENT
        ================================================= */}

        {!loading && !error && (
          <>
            {/* =============================================
                PROFILE
                Everyone can see this
            ============================================= */}

            <ProfileSettings
              profile={profile}
              setProfile={setProfile}
            />

            {/* =============================================
                SUPER ADMIN ONLY
            ============================================= */}

            {isSuperAdmin && (
              <>
                <WebsiteSettings />

                <SecuritySettings />

                <NotificationSettings />
              </>
            )}
          </>
        )}

      </div>
    </Layout>
  );
}