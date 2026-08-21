function LowStockCard({ data = [] }) {
  return (
    <div
      className="
        w-full
        min-w-0
        bg-white
        rounded-2xl
        border border-[#E6E0D5]
        shadow-sm
        p-5
        sm:p-6
      "
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-[#556B55]">
          Low Stock Medicines
        </h2>

        <span className="text-xs text-[#8A918B]">
          Inventory
        </span>
      </div>

      {data.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-[#6E766F]">
            No low-stock medicines.
          </p>

          <p className="text-xs text-[#9AA19B] mt-1">
            Your inventory is currently healthy.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((medicine, index) => (
            <div
              key={
                medicine.id ||
                medicine.name ||
                index
              }
              className="
                flex
                justify-between
                items-center
                gap-3
                border-b
                border-[#F0ECE4]
                pb-3
                last:border-0
              "
            >
              <div className="min-w-0">
                <p className="font-medium text-sm text-[#3E4D42] truncate">
                  {medicine.name}
                </p>
              </div>

              <span
                className={`
                  shrink-0
                  px-2.5
                  py-1
                  rounded-full
                  text-xs
                  font-medium
                  ${
                    medicine.stock <= 3
                      ? "bg-red-100 text-red-600"
                      : medicine.stock <= 5
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }
                `}
              >
                {medicine.stock} Left
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LowStockCard;