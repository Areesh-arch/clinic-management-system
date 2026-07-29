function PatientFilters({
  status,
  setStatus,
  gender,
  setGender,
}) {
  return (
    <div className="flex flex-wrap gap-4">

      {/* Status Filter */}

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="
          px-4
          py-3
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[#A3B18A]
          transition-all
          duration-300
        "
      >
        <option value="All">All Status</option>
        <option value="Active">Active</option>
        <option value="Follow-up">Follow-up</option>
        <option value="Inactive">Inactive</option>
      </select>

      {/* Gender Filter */}

      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="
          px-4
          py-3
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[#A3B18A]
          transition-all
          duration-300
        "
      >
        <option value="All">All Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

    </div>
  );
}

export default PatientFilters;