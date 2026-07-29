function AppointmentFilters() {
  return (
    <div className="flex flex-wrap gap-4">

      <select className="px-4 py-3 rounded-2xl border border-slate-200">
        <option>All Doctors</option>
        <option>Dr. Sarah Ahmed</option>
        <option>Dr. Hamza Ali</option>
      </select>

      <select className="px-4 py-3 rounded-2xl border border-slate-200">
        <option>All Status</option>
        <option>Completed</option>
        <option>Pending</option>
        <option>Cancelled</option>
      </select>

      <select className="px-4 py-3 rounded-2xl border border-slate-200">
        <option>Today</option>
        <option>Tomorrow</option>
      </select>

    </div>
  );
}

export default AppointmentFilters;