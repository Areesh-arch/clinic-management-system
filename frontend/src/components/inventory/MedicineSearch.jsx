export default function MedicineSearch({
  searchTerm,
  onSearchChange,
}) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <svg
          className="w-5 h-5 text-[#8A938E]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
          />
        </svg>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) =>
          onSearchChange(e.target.value)
        }
        placeholder="Search medicines, brands or categories..."
        className="w-full h-12 pl-12 pr-10 bg-[#FFFDF8] border border-[#DED8CC] rounded-xl text-sm text-[#173C32] placeholder:text-[#9AA29D] outline-none transition-all duration-200 focus:border-[#8FAF9A] focus:ring-4 focus:ring-[#8FAF9A]/10"
      />

      {searchTerm && (
        <button
          type="button"
          onClick={() => onSearchChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A938E] hover:text-[#173C32] transition-colors"
        >
          ×
        </button>
      )}
    </div>
  );
}