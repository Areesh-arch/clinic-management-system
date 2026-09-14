import { useState } from "react";

const INITIAL_STATE = {
  name: "",
  category: "",
  brand: "",
  unit: "",
  quantity: "",
  minimum_stock: "",
  purchase_price: "",
  selling_price: "",
  expiry_date: "",
};

export default function MedicineForm({
  onSave,
  onCancel,
}) {
  const [medicine, setMedicine] =
    useState(INITIAL_STATE);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMedicine((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const quantity =
      Number(medicine.quantity);

    const minimumStock =
      Number(medicine.minimum_stock);

    const purchasePrice =
      Number(medicine.purchase_price);

    const sellingPrice =
      Number(medicine.selling_price);

    if (!medicine.name.trim()) {
      setError(
        "Please enter the medicine name."
      );
      return;
    }

    if (!medicine.category.trim()) {
      setError(
        "Please enter the medicine category."
      );
      return;
    }

    if (!medicine.unit.trim()) {
      setError(
        "Please enter the medicine unit."
      );
      return;
    }

    if (quantity < 0) {
      setError(
        "Quantity cannot be negative."
      );
      return;
    }

    if (minimumStock < 0) {
      setError(
        "Minimum stock cannot be negative."
      );
      return;
    }

    if (purchasePrice < 0) {
      setError(
        "Purchase price cannot be negative."
      );
      return;
    }

    if (sellingPrice < 0) {
      setError(
        "Selling price cannot be negative."
      );
      return;
    }

    const payload = {
      name: medicine.name.trim(),
      category: medicine.category.trim(),
      brand:
        medicine.brand.trim() || null,
      unit: medicine.unit.trim(),
      quantity,
      minimum_stock: minimumStock,
      purchase_price: purchasePrice,
      selling_price: sellingPrice,
      expiry_date:
        medicine.expiry_date || null,
    };

    try {
      setSaving(true);

      await onSave(payload);

      setMedicine(INITIAL_STATE);
    } catch (err) {
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
      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="rounded-xl border border-[#E4CAC5] bg-[#F8ECE9] px-4 py-3">
          <p className="text-sm font-medium text-[#8B554D]">
            {error}
          </p>
        </div>
      )}


      {/* ================================================= */}
      {/* BASIC INFORMATION */}
      {/* ================================================= */}

      <div>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#173C32]">
            Medicine Information
          </h3>

          <p className="mt-1 text-xs text-[#89928D]">
            Add the medicine to your clinic stock.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Medicine Name */}

          <Field
            label="Medicine Name"
            required
            className="sm:col-span-2"
          >
            <input
              name="name"
              value={medicine.name}
              onChange={handleChange}
              type="text"
              placeholder="e.g. Amoxicillin"
              required
              className={inputClass}
            />
          </Field>


          {/* Category */}

          <Field
            label="Category"
            required
          >
            <input
              name="category"
              value={medicine.category}
              onChange={handleChange}
              type="text"
              placeholder="e.g. Antibiotic"
              required
              className={inputClass}
            />
          </Field>


          {/* Brand */}

          <Field label="Brand">
            <input
              name="brand"
              value={medicine.brand}
              onChange={handleChange}
              type="text"
              placeholder="e.g. GSK"
              className={inputClass}
            />
          </Field>


          {/* Unit */}

          <Field
            label="Unit"
            required
          >
            <select
              name="unit"
              value={medicine.unit}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">
                Select unit
              </option>

              <option value="Tablet">
                Tablet
              </option>

              <option value="Capsule">
                Capsule
              </option>

              <option value="Bottle">
                Bottle
              </option>

              <option value="Box">
                Box
              </option>

              <option value="Tube">
                Tube
              </option>

              <option value="Vial">
                Vial
              </option>

              <option value="Ampoule">
                Ampoule
              </option>

              <option value="Sachet">
                Sachet
              </option>

              <option value="Pack">
                Pack
              </option>

              <option value="Piece">
                Piece
              </option>
            </select>
          </Field>


          {/* Expiry */}

          <Field label="Expiry Date">
            <input
              name="expiry_date"
              value={medicine.expiry_date}
              onChange={handleChange}
              type="date"
              className={inputClass}
            />
          </Field>

        </div>
      </div>


      {/* ================================================= */}
      {/* STOCK */}
      {/* ================================================= */}

      <div className="border-t border-[#E7E1D5] pt-5">

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#173C32]">
            Stock & Pricing
          </h3>

          <p className="mt-1 text-xs text-[#89928D]">
            Set the current stock and medicine prices.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Quantity */}

          <Field
            label="Current Quantity"
            required
          >
            <input
              name="quantity"
              value={medicine.quantity}
              onChange={handleChange}
              type="number"
              min="0"
              step="1"
              placeholder="0"
              required
              className={inputClass}
            />
          </Field>


          {/* Minimum Stock */}

          <Field
            label="Minimum Stock"
            required
          >
            <input
              name="minimum_stock"
              value={medicine.minimum_stock}
              onChange={handleChange}
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 10"
              required
              className={inputClass}
            />
          </Field>


          {/* Purchase Price */}

          <Field
            label="Purchase Price"
            required
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8A938E]">
                Rs.
              </span>

              <input
                name="purchase_price"
                value={
                  medicine.purchase_price
                }
                onChange={handleChange}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                required
                className={`${inputClass} pl-11`}
              />
            </div>
          </Field>


          {/* Selling Price */}

          <Field
            label="Selling Price"
            required
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8A938E]">
                Rs.
              </span>

              <input
                name="selling_price"
                value={
                  medicine.selling_price
                }
                onChange={handleChange}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                required
                className={`${inputClass} pl-11`}
              />
            </div>
          </Field>

        </div>
      </div>


      {/* ================================================= */}
      {/* ACTIONS */}
      {/* ================================================= */}

      <div className="flex flex-col-reverse gap-3 border-t border-[#E7E1D5] pt-5 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="w-full rounded-xl border border-[#D9D5CA] bg-[#FFFDF8] px-5 py-3 text-sm font-semibold text-[#52645B] transition-colors hover:bg-[#F3F0E8] hover:text-[#173C32] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-[#173C32] px-5 py-3 text-sm font-semibold text-white shadow-[0_5px_16px_rgba(23,60,50,0.14)] transition-all hover:bg-[#245346] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {saving
            ? "Saving..."
            : "Save Medicine"}
        </button>

      </div>
    </form>
  );
}


/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  required = false,
  children,
  className = "",
}) {
  return (
    <label
      className={`block ${className}`}
    >
      <span className="mb-1.5 block text-xs font-semibold text-[#52645B]">
        {label}

        {required && (
          <span className="ml-1 text-[#A96B61]">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}


/* =========================================================
   INPUT STYLE
========================================================= */

const inputClass =
  "w-full rounded-xl border border-[#DCD8CE] bg-[#FFFDF8] px-3.5 py-3 text-sm text-[#29483D] outline-none transition-all placeholder:text-[#A2A8A4] focus:border-[#6F8F7D] focus:ring-2 focus:ring-[#6F8F7D]/15";