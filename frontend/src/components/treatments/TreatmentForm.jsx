function TreatmentForm() {
  return (
    <form className="space-y-5">

      <h2 className="text-2xl font-bold">
        Add Treatment
      </h2>

      <input
        type="text"
        placeholder="Patient Name"
        className="w-full border rounded-xl p-3"
      />

      <input
        type="text"
        placeholder="Doctor Name"
        className="w-full border rounded-xl p-3"
      />

      <input
        type="text"
        placeholder="Treatment"
        className="w-full border rounded-xl p-3"
      />

      <input
        type="date"
        className="w-full border rounded-xl p-3"
      />

      <input
        type="number"
        placeholder="Cost (£)"
        className="w-full border rounded-xl p-3"
      />

      <select className="w-full border rounded-xl p-3">

        <option>Scheduled</option>

        <option>In Progress</option>

        <option>Completed</option>

      </select>

      <button
        type="submit"
        className="w-full bg-[#A8C5A0] text-white rounded-xl py-3 hover:bg-[#90B68A]"
      >
        Save Treatment
      </button>

    </form>
  );
}

export default TreatmentForm;