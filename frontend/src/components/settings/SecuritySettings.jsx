export default function SecuritySettings() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-6">
        Change Password
      </h2>

      <div className="space-y-4">

        <input
          type="password"
          placeholder="Current Password"
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border rounded-lg px-4 py-2"
        />

      </div>

    </div>
  );
}