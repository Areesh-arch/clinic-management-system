import { medicines } from "../../utils/dashboardData";

function LowStockCard() {
  return (
   <div
  className="
    bg-white
    rounded-3xl
    border border-slate-200
    shadow-sm
    hover:scale-105
    transition-all
    duration-300
    p-8
  "
>
      <h2 className="text-3xl font-bold text-[#556B55] mb-6">
        Low Stock Medicines
      </h2>

      <div className="space-y-4">

        {medicines.map((medicine) => (

          <div
            key={medicine.name}
            className="flex justify-between items-center border-b pb-3"
          >

            <div>

              <p className="font-semibold">
                {medicine.name}
              </p>

            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium
              ${
                medicine.stock <= 3
                  ? "bg-red-100 text-red-600"
                  : medicine.stock <= 5
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {medicine.stock} Left
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}

export default LowStockCard;