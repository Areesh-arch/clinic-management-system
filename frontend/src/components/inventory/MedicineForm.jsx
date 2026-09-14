
import { useEffect, useState } from "react";

const INITIAL_STATE = {
  name: "",
  category: "",
  brand: "",
  unit: "",
  issue_unit: "",
  units_per_stock_unit: 1,
  quantity: "",
  minimum_stock: "",
  purchase_price: "",
  selling_price: "",
  expiry_date: "",
};

function getFormState(medicine) {
  if (!medicine) {
    return INITIAL_STATE;
  }

  return {
    name: medicine.name ?? "",
    category: medicine.category ?? "",
    brand: medicine.brand ?? "",
    unit: medicine.unit ?? "",
    issue_unit:
      medicine.issue_unit ??
      medicine.unit ??
      "",
    units_per_stock_unit:
      medicine.units_per_stock_unit ?? 1,
    quantity: medicine.quantity ?? "",
    minimum_stock: medicine.minimum_stock ?? "",
    purchase_price:
      medicine.purchase_price ?? "",
    selling_price:
      medicine.selling_price ?? "",
    expiry_date: medicine.expiry_date
      ? String(medicine.expiry_date).slice(0, 10)
      : "",
  };
}

export default function MedicineForm({
  medicine,
  onSave,
  onCancel,
}) {
  const isEditing = Boolean(medicine?.id);

  const [form, setForm] = useState(
    getFormState(medicine)
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // IMPORTANT:
  // Whenever a different medicine is selected for editing,
  // refill all fields with that medicine's data.
  useEffect(() => {
    setForm(getFormState(medicine));
    setError("");
  }, [medicine]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleStockUnitChange = (e) => {
    const value = e.target.value;

    setForm((previous) => ({
      ...previous,
      unit: value,
      issue_unit:
        previous.issue_unit || value,
    }));
  };

  const handleIssueUnitChange = (e) => {
    setForm((previous) => ({
      ...previous,
      issue_unit: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Medicine name is required.");
      return;
    }

    if (!form.category.trim()) {
      setError("Category is required.");
      return;
    }

    if (!form.unit.trim()) {
      setError("Stock unit is required.");
      return;
    }

    if (!form.issue_unit.trim()) {
      setError("Sale unit is required.");
      return;
    }

    const quantity = Number(form.quantity);
    const minimumStock = Number(form.minimum_stock);
    const unitsPerStockUnit = Number(
      form.units_per_stock_unit
    );
    const purchasePrice = Number(
      form.purchase_price
    );
    const sellingPrice = Number(
      form.selling_price
    );

    if (
      Number.isNaN(quantity) ||
      quantity < 0
    ) {
      setError("Please enter a valid quantity.");
      return;
    }

    if (
      Number.isNaN(minimumStock) ||
      minimumStock < 0
    ) {
      setError(
        "Please enter a valid minimum stock."
      );
      return;
    }

    if (
      Number.isNaN(unitsPerStockUnit) ||
      unitsPerStockUnit <= 0
    ) {
      setError(
        "Packs per stock unit must be greater than 0."
      );
      return;
    }

    if (
      Number.isNaN(purchasePrice) ||
      purchasePrice < 0
    ) {
      setError(
        "Please enter a valid purchase price."
      );
      return;
    }

    if (
      Number.isNaN(sellingPrice) ||
      sellingPrice < 0
    ) {
      setError(
        "Please enter a valid selling price."
      );
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      brand: form.brand.trim() || null,

      // Stock unit
      unit: form.unit.trim(),

      // Sale / issue unit
      issue_unit: form.issue_unit.trim(),

      quantity,
      minimum_stock: minimumStock,
      units_per_stock_unit:
        unitsPerStockUnit,

      /*
       * Keep the existing loose quantity while editing.
       * New medicine starts with 0 loose units.
       */
      loose_quantity: isEditing
        ? Number(medicine?.loose_quantity ?? 0)
        : 0,

      purchase_price: purchasePrice,
      selling_price: sellingPrice,

      expiry_date:
        form.expiry_date || null,
    };

    try {
      setSaving(true);

      if (isEditing) {
        // EDIT
        await onSave(
          medicine.id,
          payload
        );
      } else {
        // ADD
        await onSave(payload);
      }
    } catch (err) {
      console.error(
        "Failed to save medicine:",
        err
      );

      setError(
        err?.message ||
          "Failed to save medicine."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Medicine Name */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#173B32]">
          Medicine Name
        </label>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Panadol"
          className="w-full rounded-xl border border-[#d8d1c2] bg-[#fffdf8] px-4 py-3 text-sm text-[#173B32] outline-none transition focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#6f8f7d]/20"
        />
      </div>

      {/* Category + Brand */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#173B32]">
            Category
          </label>

          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. Painkiller"
            className="w-full rounded-xl border border-[#d8d1c2] bg-[#fffdf8] px-4 py-3 text-sm text-[#173B32] outline-none transition focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#6f8f7d]/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#173B32]">
            Brand
          </label>

          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="e.g. GSK"
            className="w-full rounded-xl border border-[#d8d1c2] bg-[#fffdf8] px-4 py-3 text-sm text-[#173B32] outline-none transition focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#6f8f7d]/20"
          />
        </div>
      </div>

      {/* Stock Unit + Sale Unit */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#173B32]">
            Stock Unit
          </label>

          <input
            type="text"
            name="unit"
            value={form.unit}
            onChange={handleStockUnitChange}
            placeholder="e.g. Box"
            className="w-full rounded-xl border border-[#d8d1c2] bg-[#fffdf8] px-4 py-3 text-sm text-[#173B32] outline-none transition focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#6f8f7d]/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#173B32]">
            Sale Unit
          </label>

          <input
            type="text"
            name="issue_unit"
            value={form.issue_unit}
            onChange={handleIssueUnitChange}
            placeholder="e.g. Pack"
            className="w-full rounded-xl border border-[#d8d1c2] bg-[#fffdf8] px-4 py-3 text-sm text-[#173B32] outline-none transition focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#6f8f7d]/20"
          />
        </div>
      </div>

      {/* Conversion */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#173B32]">
          Sale Units per Stock Unit
        </label>

        <input
          type="number"
          name="units_per_stock_unit"
          min="1"
          value={form.units_per_stock_unit}
          onChange={handleChange}
          className="w-full rounded-xl border border-[#d8d1c2] bg-[#fffdf8] px-4 py-3 text-sm text-[#173B32] outline-none transition focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#6f8f7d]/20"
        />

        <p className="mt-1.5 text-xs text-[#6f8f7d]">
          Example: 1 Box = 10 Packs
        </p>
      </div>

      {/* Quantity + Minimum Stock */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#173B32]">
            Quantity
          </label>

          <input
            type="number"
            name="quantity"
            min="0"
            step="1"
            value={form.quantity}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#d8d1c2] bg-[#fffdf8] px-4 py-3 text-sm text-[#173B32] outline-none transition focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#6f8f7d]/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#173B32]">
            Minimum Stock
          </label>

          <input
            type="number"
            name="minimum_stock"
            min="0"
            step="1"
            value={form.minimum_stock}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#d8d1c2] bg-[#fffdf8] px-4 py-3 text-sm text-[#173B32] outline-none transition focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#6f8f7d]/20"
          />
        </div>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#173B32]">
            Purchase Price
          </label>

          <input
            type="number"
            name="purchase_price"
            min="0"
            step="0.01"
            value={form.purchase_price}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#d8d1c2] bg-[#fffdf8] px-4 py-3 text-sm text-[#173B32] outline-none transition focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#6f8f7d]/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#173B32]">
            Selling Price
          </label>

          <input
            type="number"
            name="selling_price"
            min="0"
            step="0.01"
            value={form.selling_price}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#d8d1c2] bg-[#fffdf8] px-4 py-3 text-sm text-[#173B32] outline-none transition focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#6f8f7d]/20"
          />
        </div>
      </div>

      {/* Expiry */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#173B32]">
          Expiry Date
        </label>

        <input
          type="date"
          name="expiry_date"
          value={form.expiry_date}
          onChange={handleChange}
          className="w-full rounded-xl border border-[#d8d1c2] bg-[#fffdf8] px-4 py-3 text-sm text-[#173B32] outline-none transition focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#6f8f7d]/20"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col-reverse gap-3 border-t border-[#e5dfd2] pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-xl border border-[#d8d1c2] bg-[#fffdf8] px-5 py-3 text-sm font-semibold text-[#173B32] transition hover:bg-[#f7f3e9] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#173B32] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#214b40] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : isEditing
            ? "Save Changes"
            : "Add Medicine"}
        </button>
      </div>
    </form>
  );
}
