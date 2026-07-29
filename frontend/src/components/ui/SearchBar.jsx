import { FiSearch } from "react-icons/fi";

function SearchBar() {
  return (
    <div className="relative">

      <FiSearch className="absolute left-4 top-3 text-slate-400" />

      <input
        type="text"
        placeholder="Search..."
        className="w-72 pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7A9E7E]"
      />

    </div>
  );
}

export default SearchBar;