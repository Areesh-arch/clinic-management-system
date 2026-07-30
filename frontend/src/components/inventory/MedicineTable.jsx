import inventoryData from "../../utils/inventoryData";
import MedicineRow from "./MedicineRow";

export default function MedicineTable() {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-3 text-left">Medicine</th>

            <th className="p-3 text-left">Category</th>

            <th className="p-3 text-left">Stock</th>

            <th className="p-3 text-left">Price</th>

            <th className="p-3 text-left">Supplier</th>

            <th className="p-3 text-left">Expiry</th>

            <th className="p-3 text-left">Status</th>

            <th className="p-3 text-left">Actions</th>

          </tr>

        </thead>

        <tbody>

          {inventoryData.map((medicine) => (
            <MedicineRow
              key={medicine.id}
              medicine={medicine}
            />
          ))}

        </tbody>

      </table>
    </div>
  );
}