export default function NotificationSettings() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-6">
        Notifications
      </h2>

      <div className="space-y-4">

        <label className="flex items-center gap-3">
          <input type="checkbox" />
          Email Notifications
        </label>

        <label className="flex items-center gap-3">
          <input type="checkbox" />
          SMS Notifications
        </label>

        <label className="flex items-center gap-3">
          <input type="checkbox" />
          Appointment Reminders
        </label>

      </div>

    </div>
  );
}