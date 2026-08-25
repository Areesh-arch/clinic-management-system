function StaffFilters({ status, setStatus }) {
  return (
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="border rounded-xl px-4 py-3"
    >
      <option value="All">All</option>
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
    </select>
  );
}

export default StaffFilters;