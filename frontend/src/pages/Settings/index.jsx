import Layout from "../../components/layout/Layout";

import SettingsHeader from "../../components/settings/SettingsHeader";
import ProfileSettings from "../../components/settings/ProfileSettings";
import SecuritySettings from "../../components/settings/SecuritySettings";
import NotificationSettings from "../../components/settings/NotificationSettings";
import AppearanceSettings from "../../components/settings/AppearanceSettings";
import SaveButton from "../../components/settings/SaveButton";

export default function Settings() {
  return (
    <Layout>

      <div className="space-y-8">

        <SettingsHeader />

        <ProfileSettings />

        <SecuritySettings />

        <AppearanceSettings />

        <NotificationSettings />

        <SaveButton />

      </div>

    </Layout>
  );
}