export default function AppearanceSettings() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-6">
        Appearance
      </h2>

      <div className="space-y-4">

        <label className="block font-medium text-gray-700">
          Theme
        </label>

        <select className="w-full border rounded-lg px-4 py-2">

          <option>Light</option>

          <option>Dark</option>

        </select>

      </div>

    </div>
  );
}