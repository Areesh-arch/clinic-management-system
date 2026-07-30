import { FiSearch } from "react-icons/fi";

function TreatmentSearch({ search, setSearch }) {
  return (
    <div className="relative">

      <FiSearch
        className="absolute left-4 top-4 text-gray-400"
      />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search treatments..."
        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none"
      />

    </div>
  );
}

export default TreatmentSearch;