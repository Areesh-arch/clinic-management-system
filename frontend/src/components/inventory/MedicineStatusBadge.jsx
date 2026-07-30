export default function MedicineStatusBadge({ status }) {
  let color = "";

  switch (status) {
    case "In Stock":
      color = "bg-green-100 text-green-700";
      break;

    case "Low Stock":
      color = "bg-yellow-100 text-yellow-700";
      break;

    case "Out of Stock":
      color = "bg-red-100 text-red-700";
      break;

    default:
      color = "bg-gray-100 text-gray-700";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      {status}
    </span>
  );
}