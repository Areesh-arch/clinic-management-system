function DoctorFilters({ status, setStatus }) {
  return (
    <div className="flex gap-4">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border rounded-xl px-4 py-2"
      >
        <option>All</option>
        <option>Available</option>
        <option>Busy</option>
        <option>On Leave</option>
      </select>
    </div>
  );
}

export default DoctorFilters;