function DoctorStatusBadge({ status }) {
  const colors = {
    Available: "bg-green-100 text-green-700",
    Busy: "bg-yellow-100 text-yellow-700",
    "On Leave": "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        colors[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
}

export default DoctorStatusBadge;