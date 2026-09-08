function TreatmentFilters({
  status,
  setStatus,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border border-[#25312A] rounded-xl p-3 bg-white"
      >
        <option value="All">
          All
        </option>

        <option value="IN_PROGRESS">
          In Progress
        </option>

        <option value="COMPLETED">
          Completed
        </option>

        <option value="CANCELLED">
          Cancelled
        </option>
      </select>
    </div>
  );
}

export default TreatmentFilters;