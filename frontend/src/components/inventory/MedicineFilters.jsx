export default function MedicineFilters({
  stockFilter,
  onFilterChange,
}) {
  return (
    <div className="relative">
      <select
        value={stockFilter}
        onChange={(e) =>
          onFilterChange(e.target.value)
        }
        className="appearance-none h-12 min-w-[170px] pl-4 pr-10 bg-[#FFFDF8] border border-[#DED8CC] rounded-xl text-sm font-medium text-[#365247] outline-none cursor-pointer transition-all duration-200 focus:border-[#8FAF9A] focus:ring-4 focus:ring-[#8FAF9A]/10"
      >
        <option value="all">
          All Stock
        </option>

        <option value="in_stock">
          In Stock
        </option>

        <option value="low_stock">
          Low Stock
        </option>

        <option value="out_of_stock">
          Out of Stock
        </option>
      </select>

      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#718078]">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="m6 9 6 6 6-6"
          />
        </svg>
      </div>
    </div>
  );
}