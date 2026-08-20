export default function MedicineTable({
  medicines = [],
  loading,
  onUpdate,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="bg-[#FFFDF8] border border-[#E7E1D5] rounded-2xl shadow-[0_4px_20px_rgba(23,60,50,0.04)] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E7E1D5]">
          <div className="h-5 w-40 bg-[#EEEAE1] rounded animate-pulse" />
        </div>

        <div className="p-6 space-y-5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-12 bg-[#F1EEE7] rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (medicines.length === 0) {
    return (
      <div className="bg-[#FFFDF8] border border-[#E7E1D5] rounded-2xl p-12 text-center shadow-[0_4px_20px_rgba(23,60,50,0.04)]">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#E3EEE6] flex items-center justify-center text-[#496C59] text-xl">
          ✦
        </div>

        <h3 className="mt-4 text-lg font-semibold text-[#173C32]">
          No medicines found
        </h3>

        <p className="mt-1 text-sm text-[#7D8882]">
          Try changing your search or stock filter.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF8] border border-[#E7E1D5] rounded-2xl shadow-[0_4px_20px_rgba(23,60,50,0.04)] overflow-hidden">
      <div className="px-6 py-5 border-b border-[#E7E1D5] flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#173C32]">
            Medicine Inventory
          </h2>

          <p className="mt-1 text-sm text-[#818B85]">
            {medicines.length}{" "}
            {medicines.length === 1
              ? "medicine"
              : "medicines"}{" "}
            displayed
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-[#718078]">
          <span className="w-2 h-2 rounded-full bg-[#8FAF9A]" />
          Live inventory
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead>
            <tr className="bg-[#F6F3EB] border-b border-[#E7E1D5]">
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
                Medicine
              </th>

              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
                Category
              </th>

              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
                Stock
              </th>

              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
                Purchase
              </th>

              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
                Selling
              </th>

              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
                Status
              </th>

              <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#ECE7DD]">
            {medicines.map((medicine) => {
              const quantity = Number(
                medicine.quantity
              );

              const minimumStock = Number(
                medicine.minimum_stock
              );

              let status = "In Stock";

              if (quantity === 0) {
                status = "Out of Stock";
              } else if (
                quantity <= minimumStock
              ) {
                status = "Low Stock";
              }

              return (
                <tr
                  key={medicine.id}
                  className="group hover:bg-[#F9F7F1] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-[#173C32]">
                        {medicine.name}
                      </p>

                      {medicine.brand && (
                        <p className="mt-0.5 text-xs text-[#89928D]">
                          {medicine.brand}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-[#52645B]">
                    {medicine.category}
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <span className="text-sm font-semibold text-[#29483D]">
                        {medicine.quantity}
                      </span>

                      <span className="ml-1 text-xs text-[#929A95]">
                        {medicine.unit}
                      </span>

                      <p className="mt-0.5 text-[11px] text-[#9A9F9B]">
                        Min:{" "}
                        {medicine.minimum_stock}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-[#52645B]">
                    Rs.{" "}
                    {Number(
                      medicine.purchase_price
                    ).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-[#29483D]">
                    Rs.{" "}
                    {Number(
                      medicine.selling_price
                    ).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={status} />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdate?.(
                            medicine.id,
                            medicine
                          )
                        }
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#496C59] hover:bg-[#E3EEE6] transition-colors"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete?.(medicine.id)
                        }
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#8C5D55] hover:bg-[#F4E7E4] transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "In Stock":
      "bg-[#E5F0E8] text-[#416B51] border-[#C9DECf]",

    "Low Stock":
      "bg-[#F6EDDC] text-[#947039] border-[#E8D6AE]",

    "Out of Stock":
      "bg-[#F4E6E3] text-[#8B554D] border-[#E4CAC5]",
  };

  const dots = {
    "In Stock": "bg-[#6F9A7D]",
    "Low Stock": "bg-[#C9A96E]",
    "Out of Stock": "bg-[#A96B61]",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${styles[status]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dots[status]}`}
      />

      {status}
    </span>
  );
}