import inventoryData from "../../utils/inventoryData";

export default function MedicineStats() {
  const total = inventoryData.length;

  const inStock = inventoryData.filter(
    (m) => m.status === "In Stock"
  ).length;

  const lowStock = inventoryData.filter(
    (m) => m.status === "Low Stock"
  ).length;

  const outOfStock = inventoryData.filter(
    (m) => m.status === "Out of Stock"
  ).length;

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-gray-500">Total Medicines</p>
        <h2 className="text-3xl font-bold">{total}</h2>
      </div>

      <div className="bg-green-100 rounded-lg p-4">
        <p>In Stock</p>
        <h2 className="text-3xl font-bold">{inStock}</h2>
      </div>

      <div className="bg-yellow-100 rounded-lg p-4">
        <p>Low Stock</p>
        <h2 className="text-3xl font-bold">{lowStock}</h2>
      </div>

      <div className="bg-red-100 rounded-lg p-4">
        <p>Out of Stock</p>
        <h2 className="text-3xl font-bold">{outOfStock}</h2>
      </div>
    </div>
  );
}