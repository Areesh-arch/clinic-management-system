export default function TreatmentInfo() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-6">
        Treatment Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div>

          <label className="block mb-2 font-medium">
            Patient
          </label>

          <select className="w-full border rounded-lg px-4 py-2">

            <option>Select Patient</option>
            <option>Ali Ahmad</option>
            <option>Sara Khan</option>
            <option>Ahmed Ali</option>

          </select>

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Treatment
          </label>

          <select className="w-full border rounded-lg px-4 py-2">

            <option>Select Treatment</option>
            <option>Acne</option>
            <option>Laser</option>
            <option>Chemical Peel</option>

          </select>

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Treatment Date
          </label>

          <input
            type="date"
            className="w-full border rounded-lg px-4 py-2"
          />

        </div>

      </div>

    </div>
  );
}