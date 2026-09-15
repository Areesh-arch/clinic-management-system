import { useMemo, useState } from "react";
import {
  FiDownload,
  FiFileText,
  FiPackage,
  FiX,
} from "react-icons/fi";
import * as XLSX from "xlsx";

const formatNumber = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return number.toLocaleString();
};

const formatMoney = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "Rs. 0.00";
  }

  return `Rs. ${number.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString();
};

const getStockStatus = (medicine) => {
  const quantity = Number(medicine?.quantity ?? 0);
  const minimumStock = Number(
    medicine?.minimum_stock ?? 0
  );

  if (quantity <= 0) {
    return "Out of Stock";
  }

  if (quantity <= minimumStock) {
    return "Low Stock";
  }

  return "In Stock";
};

function StatusBadge({ status }) {
  if (status === "Out of Stock") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#FBE9E7] px-3 py-1.5 text-xs font-semibold text-[#A34E4A]">
        Out of Stock
      </span>
    );
  }

  if (status === "Low Stock") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#F8F0DF] px-3 py-1.5 text-xs font-semibold text-[#8A6D35]">
        Low Stock
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-[#E8F1EA] px-3 py-1.5 text-xs font-semibold text-[#426A50]">
      In Stock
    </span>
  );
}

export default function InventoryLogModal({
  medicines = [],
  onClose,
}) {
  const [exporting, setExporting] = useState(false);

  const inventoryRows = useMemo(() => {
    return medicines.map((medicine) => ({
      ...medicine,
      stock_status: getStockStatus(medicine),
    }));
  }, [medicines]);

  const statistics = useMemo(() => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    inventoryRows.forEach((medicine) => {
      if (medicine.stock_status === "Out of Stock") {
        outOfStock += 1;
      } else if (medicine.stock_status === "Low Stock") {
        lowStock += 1;
      } else {
        inStock += 1;
      }
    });

    return {
      total: inventoryRows.length,
      inStock,
      lowStock,
      outOfStock,
    };
  }, [inventoryRows]);

  const handleExportExcel = () => {
    if (!inventoryRows.length) {
      return;
    }

    try {
      setExporting(true);

      const exportRows = inventoryRows.map(
        (medicine, index) => ({
          "#": index + 1,

          "Medicine Name":
            medicine.name || "",

          Category:
            medicine.category || "",

          Brand:
            medicine.brand || "",

          "Stock Unit":
            medicine.unit || "",

          "Sale Unit":
            medicine.issue_unit ||
            medicine.unit ||
            "",

          "Units per Stock Unit":
            Number(
              medicine.units_per_stock_unit || 1
            ),

          Quantity:
            Number(medicine.quantity || 0),

          "Loose Quantity":
            Number(
              medicine.loose_quantity || 0
            ),

          "Minimum Stock":
            Number(
              medicine.minimum_stock || 0
            ),

          "Purchase Price":
            Number(
              medicine.purchase_price || 0
            ),

          "Selling Price":
            Number(
              medicine.selling_price || 0
            ),

          "Expiry Date":
            medicine.expiry_date
              ? formatDate(
                  medicine.expiry_date
                )
              : "",

          "Stock Status":
            medicine.stock_status,
        })
      );

      const worksheet =
        XLSX.utils.json_to_sheet(
          exportRows
        );

      worksheet["!cols"] = [
        { wch: 6 },
        { wch: 28 },
        { wch: 18 },
        { wch: 18 },
        { wch: 15 },
        { wch: 15 },
        { wch: 22 },
        { wch: 12 },
        { wch: 16 },
        { wch: 16 },
        { wch: 18 },
        { wch: 18 },
        { wch: 16 },
        { wch: 18 },
      ];

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Inventory Log"
      );

      const now = new Date();

      const datePart =
        now.toISOString().slice(0, 10);

      const fileName =
        `inventory-log-${datePart}.xlsx`;

      XLSX.writeFile(
        workbook,
        fileName
      );
    } catch (error) {
      console.error(
        "Failed to export inventory log:",
        error
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-[#173B32]/60 px-3 py-4 backdrop-blur-sm sm:px-5 sm:py-6"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose?.();
        }
      }}
    >
      <div className="flex max-h-[94vh] w-full max-w-375 flex-col overflow-hidden rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] shadow-[0_25px_80px_rgba(23,59,50,0.22)]">
        {/* HEADER */}
        <div className="relative shrink-0 overflow-hidden bg-[#173B32]">
          <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full border border-white/10" />
          <div className="absolute -bottom-24 right-40 h-40 w-40 rounded-full border border-[#B4935A]/20" />

          <div className="relative flex flex-col gap-4 px-5 py-5 sm:px-7 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#E4D2A7]">
                <FiFileText size={22} />
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Inventory Log
                </h2>

                <p className="mt-1 text-xs text-[#D9E4DE] sm:text-sm">
                  Complete record of your clinic inventory.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10 sm:right-5 sm:top-5"
              aria-label="Close inventory log"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-[#F7F3E9]">
          {/* SUMMARY */}
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 sm:p-6">
            <div className="rounded-xl border border-[#E5E8E3] bg-[#FFFDF8] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#818983]">
                Total Medicines
              </p>

              <p className="mt-2 text-2xl font-bold text-[#173B32]">
                {statistics.total}
              </p>
            </div>

            <div className="rounded-xl border border-[#DCE9DF] bg-[#F9FCF9] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6F8075]">
                In Stock
              </p>

              <p className="mt-2 text-2xl font-bold text-[#426A50]">
                {statistics.inStock}
              </p>
            </div>

            <div className="rounded-xl border border-[#E8DDC5] bg-[#FFFCF5] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8A7650]">
                Low Stock
              </p>

              <p className="mt-2 text-2xl font-bold text-[#8A6D35]">
                {statistics.lowStock}
              </p>
            </div>

            <div className="rounded-xl border border-[#EEDBD9] bg-[#FFF9F8] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94706C]">
                Out of Stock
              </p>

              <p className="mt-2 text-2xl font-bold text-[#A34E4A]">
                {statistics.outOfStock}
              </p>
            </div>
          </div>

          {/* TABLE */}
          <div className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="overflow-hidden rounded-2xl border border-[#E4E8E2] bg-[#FFFDF8] shadow-[0_2px_12px_rgba(23,59,50,0.05)]">
              <div className="flex items-center justify-between border-b border-[#E7E1D5] px-4 py-4 sm:px-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF1EC] text-[#5F7A68]">
                    <FiPackage size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#173B32] sm:text-base">
                      Complete Inventory
                    </h3>

                    <p className="text-xs text-[#818983]">
                      {statistics.total}{" "}
                      {statistics.total === 1
                        ? "record"
                        : "records"}
                    </p>
                  </div>
                </div>
              </div>

              {inventoryRows.length === 0 ? (
                <div className="px-5 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF1EC] text-[#6F8F7D]">
                    <FiPackage size={25} />
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-[#173B32]">
                    No inventory records
                  </h3>

                  <p className="mt-1 text-sm text-[#7B827D]">
                    There are currently no medicines in inventory.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-375 w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[#E7E1D5] bg-[#F5F7F3] text-left">
                        <th className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-[#657169]">
                          #
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-[#657169]">
                          Medicine
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-[#657169]">
                          Category
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-[#657169]">
                          Brand
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-[#657169]">
                          Stock Unit
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-[#657169]">
                          Sale Unit
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[0.06em] text-[#657169]">
                          Units / Stock
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.06em] text-[#657169]">
                          Quantity
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.06em] text-[#657169]">
                          Loose Qty
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.06em] text-[#657169]">
                          Min. Stock
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.06em] text-[#657169]">
                          Purchase Price
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.06em] text-[#657169]">
                          Selling Price
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-[#657169]">
                          Expiry
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-[#657169]">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {inventoryRows.map(
                        (medicine, index) => (
                          <tr
                            key={
                              medicine.id ??
                              `${medicine.name}-${index}`
                            }
                            className="border-b border-[#EEF0EC] transition-colors last:border-b-0 hover:bg-[#FAFBF8]"
                          >
                            <td className="px-4 py-4 text-sm font-medium text-[#7B827D]">
                              {index + 1}
                            </td>

                            <td className="px-4 py-4">
                              <div className="min-w-45">
                                <p className="font-semibold text-[#173B32]">
                                  {medicine.name ||
                                    "—"}
                                </p>

                                {medicine.id != null && (
                                  <p className="mt-0.5 text-[11px] text-[#929A94]">
                                    ID #{medicine.id}
                                  </p>
                                )}
                              </div>
                            </td>

                            <td className="px-4 py-4 text-sm text-[#526159]">
                              {medicine.category ||
                                "—"}
                            </td>

                            <td className="px-4 py-4 text-sm text-[#526159]">
                              {medicine.brand ||
                                "—"}
                            </td>

                            <td className="px-4 py-4 text-sm font-medium text-[#30443B]">
                              {medicine.unit ||
                                "—"}
                            </td>

                            <td className="px-4 py-4 text-sm font-medium text-[#30443B]">
                              {medicine.issue_unit ||
                                medicine.unit ||
                                "—"}
                            </td>

                            <td className="px-4 py-4 text-center text-sm text-[#526159]">
                              {formatNumber(
                                medicine.units_per_stock_unit ||
                                  1
                              )}
                            </td>

                            <td className="px-4 py-4 text-right text-sm font-semibold text-[#173B32]">
                              {formatNumber(
                                medicine.quantity
                              )}
                            </td>

                            <td className="px-4 py-4 text-right text-sm text-[#526159]">
                              {formatNumber(
                                medicine.loose_quantity
                              )}
                            </td>

                            <td className="px-4 py-4 text-right text-sm text-[#526159]">
                              {formatNumber(
                                medicine.minimum_stock
                              )}
                            </td>

                            <td className="px-4 py-4 text-right text-sm font-medium text-[#526159]">
                              {formatMoney(
                                medicine.purchase_price
                              )}
                            </td>

                            <td className="px-4 py-4 text-right text-sm font-semibold text-[#173B32]">
                              {formatMoney(
                                medicine.selling_price
                              )}
                            </td>

                            <td className="px-4 py-4 text-sm text-[#526159]">
                              {formatDate(
                                medicine.expiry_date
                              )}
                            </td>

                            <td className="px-4 py-4">
                              <StatusBadge
                                status={
                                  medicine.stock_status
                                }
                              />
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#E7E1D5] bg-[#FFFDF8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-center text-xs text-[#858D87] sm:text-left">
            Exporting includes all inventory records.
          </p>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#D9DED9] bg-white px-5 py-2.5 text-sm font-semibold text-[#526159] transition hover:border-[#BFC8C1] hover:bg-[#F8FAF7] sm:w-auto"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={
                exporting ||
                inventoryRows.length === 0
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#173B32] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_5px_16px_rgba(23,59,50,0.14)] transition hover:bg-[#245346] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <FiDownload size={17} />

              {exporting
                ? "Exporting..."
                : "Export Excel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}