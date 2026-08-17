function TreatmentStatusBadge({
  status,
}) {

  const styles = {
    COMPLETED:
      "bg-green-100 text-green-700",

    SCHEDULED:
      "bg-blue-100 text-blue-700",

    IN_PROGRESS:
      "bg-yellow-100 text-yellow-700",
  };


  const labels = {
    COMPLETED:
      "Completed",

    SCHEDULED:
      "Scheduled",

    IN_PROGRESS:
      "In Progress",
  };


  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        styles[status] ||
        "bg-gray-100 text-gray-700"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}


export default TreatmentStatusBadge;