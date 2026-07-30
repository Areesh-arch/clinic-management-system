export default function ProfileSettings() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-6">
        Clinic Information
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <input
          type="text"
          placeholder="Clinic Name"
          className="border rounded-lg px-4 py-2"
        />

        <input
          type="text"
          placeholder="Administrator"
          className="border rounded-lg px-4 py-2"
        />

        <input
          type="email"
          placeholder="Email"
          className="border rounded-lg px-4 py-2"
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="border rounded-lg px-4 py-2"
        />

      </div>

    </div>
  );
}