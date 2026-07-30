function DoctorForm() {
  return (
    <div className="space-y-4">

      <h2 className="text-2xl font-bold">
        Add Doctor
      </h2>

      <input
        type="text"
        placeholder="Doctor Name"
        className="w-full border rounded-xl p-3"
      />

      <input
        type="text"
        placeholder="Specialization"
        className="w-full border rounded-xl p-3"
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full border rounded-xl p-3"
      />

      <input
        type="text"
        placeholder="Phone"
        className="w-full border rounded-xl p-3"
      />

      <button
        className="bg-[#A8C5A0] text-white px-6 py-3 rounded-xl"
      >
        Save Doctor
      </button>

    </div>
  );
}

export default DoctorForm;