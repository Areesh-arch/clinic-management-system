import { useState } from "react";

export default function MedicineFilters({
  value = "all",
  onChange,
}) {
  const [open, setOpen] = useState(false);

  const options = [
    {
      value: "all",
      label: "All Medicines",
    },
    {
      value: "in_stock",
      label: "In Stock",
    },
    {
      value: "low_stock",
      label: "Low Stock",
    },
    {
      value: "out_of_stock",
      label: "Out of Stock",
    },
  ];

  const selectedOption =
    options.find((option) => option.value === value) ||
    options[0];

  const handleSelect = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }

    setOpen(false);
  };

  return (
    <div className="relative w-full md:w-56">
      {/* Filter Button */}
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className="
          flex w-full items-center justify-between
          rounded-xl border
          border-[#d9d0b8]
          bg-[#fffdf6]
          px-4 py-3
          text-sm font-medium
          text-[#244b3c]
          shadow-sm
          transition
          hover:border-[#9caf88]
          hover:bg-[#f8f5e8]
          focus:outline-none
          focus:ring-2
          focus:ring-[#9caf88]/30
        "
      >
        <div className="flex items-center gap-3">
          {/* Filter Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-[#6f8f78]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5h18M6 12h12m-9 7h6"
            />
          </svg>

          <span>{selectedOption.label}</span>
        </div>

        {/* Chevron */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 text-[#6f8f78] transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m6 9 6 6 6-6"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute
            z-50
            mt-2
            w-full
            overflow-hidden
            rounded-xl
            border
            border-[#ded6c2]
            bg-[#fffdf6]
            shadow-xl
          "
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                  flex w-full items-center justify-between
                  px-4 py-3
                  text-left
                  text-sm
                  transition
                  ${
                    isSelected
                      ? "bg-[#e7efe3] font-semibold text-[#244b3c]"
                      : "text-[#4f6257] hover:bg-[#f4f1e5]"
                  }
                `}
              >
                <span>{option.label}</span>

                {isSelected && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#6f8f78]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}