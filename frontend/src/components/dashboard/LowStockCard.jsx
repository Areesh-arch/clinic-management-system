function LowStockCard({ medicines = [] }) {
  return (
    <div
      className="
        bg-white
        rounded-3xl
        border border-slate-200
        shadow-sm
        p-8
      "
    >
      <h2 className="text-2xl font-bold text-[#556B55] mb-6">
        Low Stock Medicines
      </h2>

      {medicines.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-slate-500">
            No low-stock medicines.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {medicines.map((medicine, index) => (
            <div
              key={medicine.id || medicine.name || index}
              className="
                flex
                justify-between
                items-center
                border-b
                border-slate-100
                pb-3
              "
            >
              <div>
                <p className="font-semibold text-slate-700">
                  {medicine.name}
                </p>
              </div>

              <span
                className={`
                  px-3
                  py-1
                  rounded-full
                  text-sm
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