export default function MedicineHeader({ onAddMedicine }) {
  return (
    <div className="flex justify-between items-center mb-6">

      <div>
        <h1 className="text-3xl font-bold">
          Inventory
        </h1>

        <p className="text-gray-500">
          Manage medicines and stock.
        </p>
      </div>


      <button
        onClick={onAddMedicine}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        + Add Medicine
      </button>

    </div>
  );
}