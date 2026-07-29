import { FiSearch } from "react-icons/fi";

function AppointmentSearch() {
  return (
    <div className="relative w-full md:w-96">

      <FiSearch
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        placeholder="Search appointment..."
        className="
          w-full
          pl-11
          pr-4
          py-3
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[#A3B18A]
        "
      />

    </div>
  );
}

export default AppointmentSearch;