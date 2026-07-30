import MedicineStatusBadge from "./MedicineStatusBadge";

export default function MedicineRow({ medicine }) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3">{medicine.name}</td>

      <td className="p-3">{medicine.category}</td>

      <td className="p-3">{medicine.stock}</td>

      <td className="p-3">Rs. {medicine.price}</td>

      <td className="p-3">{medicine.supplier}</td>

      <td className="p-3">{medicine.expiry}</td>

      <td className="p-3">
        <MedicineStatusBadge status={medicine.status} />
      </td>

      <td className="p-3">
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-3 py-1 rounded">
            Edit
          </button>

          <button className="bg-red-500 text-white px-3 py-1 rounded">
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}