export default function PatientSelector() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-4">
        Patient Information
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <select className="border rounded-lg px-4 py-2">

          <option>Select Patient</option>

          <option>Ali Ahmad</option>

          <option>Sara Khan</option>

          <option>Ahmed Ali</option>

        </select>

        <select className="border rounded-lg px-4 py-2">

          <option>Select Treatment</option>

          <option>Acne</option>

          <option>Laser</option>

          <option>Chemical Peel</option>

        </select>

      </div>

    </div>
  );
}