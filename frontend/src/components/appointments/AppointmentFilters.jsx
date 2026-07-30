function AppointmentFilters({
  doctor,
  setDoctor,
  status,
  setStatus,
  date,
  setDate,
}) {
  return (
    <div className="flex flex-wrap gap-4">

      <select
        value={doctor}
        onChange={(e) => setDoctor(e.target.value)}
        className="px-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <option value="All">All Doctors</option>
        <option value="Dr. Sarah Ahmed">Dr. Sarah Ahmed</option>
        <option value="Dr. Hamza Ali">Dr. Hamza Ali</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <option value="All">All Status</option>
        <option value="Completed">Completed</option>
        <option value="Pending">Pending</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <select
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="px-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <option value="All">All Dates</option>
        <option value="Today">Today</option>
        <option value="Tomorrow">Tomorrow</option>
      </select>

    </div>
  );
}

export default AppointmentFilters;