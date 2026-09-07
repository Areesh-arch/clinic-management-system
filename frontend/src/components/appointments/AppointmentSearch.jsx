import { FiSearch } from "react-icons/fi";

function AppointmentSearch({
  search,
  setSearch,
}) {
  return (
    <div className="relative w-full md:w-96">
      <FiSearch
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-[#71839A]
        "
        size={18}
      />

      <input
        type="text"
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
        placeholder="Search patient or reason..."
        className="
          w-full
          pl-11
          pr-4
          py-3.5
          rounded-2xl
          border
          border-[#DDE5DD]
          bg-white
          text-[#314A67]
          shadow-sm
          outline-none
          placeholder:text-[#9AA8B7]
          focus:border-[#A3B18A]
          focus:ring-2
          focus:ring-[#A3B18A]/20
          transition
        "
      />
    </div>
  );
}

export default AppointmentSearch;