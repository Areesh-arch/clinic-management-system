function TreatmentFilters({
  doctor,
  setDoctor,
  status,
  setStatus,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4">

      <select
        value={doctor}
        onChange={(e) => setDoctor(e.target.value)}
        className="border rounded-xl p-3"
      >
        <option>All</option>
        <option>Dr Sarah Ahmed</option>
        <option>Dr John Smith</option>
        <option>Dr Emily Brown</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border rounded-xl p-3"
      >
        <option>All</option>
        <option>Completed</option>
        <option>Scheduled</option>
        <option>In Progress</option>
      </select>

    </div>
  );
}

export default TreatmentFilters;