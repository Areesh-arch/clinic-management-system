import { useState } from "react";

const INITIAL_STATE = {
  name: "",
  category: "",
  brand: "",

  unit: "",
  issue_unit: "",
  units_per_stock_unit: "1",

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

  const handleStockUnitChange = (e) => {
    const value = e.target.value;

    setMedicine((previous) => ({
      ...previous,
      unit: value,

      // For same-unit medicines, automatically
      // use the same sale unit.
      issue_unit:
        previous.issue_unit ||
        value,

      // Same unit = 1 sale unit per stock unit.
      units_per_stock_unit:
        previous.issue_unit === previous.unit
          ? "1"
          : previous.units_per_stock_unit,
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

    const unitsPerStockUnit =
      Number(
        medicine.units_per_stock_unit
      );

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
        "Please select the stock unit."
      );
      return;
    }

    if (!medicine.issue_unit.trim()) {
      setError(
        "Please select the sale unit."
      );
      return;
    }

    if (
      !Number.isInteger(
        unitsPerStockUnit
      ) ||
      unitsPerStockUnit < 1
    ) {
      setError(
        "Units per stock unit must be at least 1."
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

    /*
     * If stock unit and sale unit are the same,
     * conversion must always be 1.
     */
    if (
      medicine.unit ===
        medicine.issue_unit &&
      unitsPerStockUnit !== 1
    ) {
      setError(
        "When stock unit and sale unit are the same, units per stock unit must be 1."
      );
      return;
    }

    const payload = {
      name: medicine.name.trim(),

      category:
        medicine.category.trim(),

      brand:
        medicine.brand.trim() || null,

      unit: medicine.unit.trim(),

      issue_unit:
        medicine.issue_unit.trim(),

      quantity,

      minimum_stock:
        minimumStock,

      units_per_stock_unit:
        unitsPerStockUnit,

      // New medicines start without loose stock.
      loose_quantity: 0,

      purchase_price:
        purchasePrice,

      selling_price:
        sellingPrice,

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
      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="rounded-xl border border-[#E4CAC5] bg-[#F8ECE9] px-4 py-3">
          <p className="text-sm font-medium text-[#8B554D]">
            {error}
          </p>
        </div>
      )}

      {/* =================================================
          MEDICINE INFORMATION
      ================================================= */}

      <div>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#173C32]">
            Medicine Information
          </h3>

          <p className="mt-1 text-xs text-[#89928D]">
            Add the medicine and define how it is
            stocked and sold.
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
              placeholder="e.g. Panadol"
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
              placeholder="e.g. Painkiller"
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

          {/* Stock Unit */}

          <Field
            label="Stock Unit"
            required
          >
            <select
              name="unit"
              value={medicine.unit}
              onChange={
                handleStockUnitChange
              }
              required
              className={inputClass}
            >
              <option value="">
                Select stock unit
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

          {/* Sale Unit */}

          <Field
            label="Sale / Issue Unit"
            required
          >
            <select
              name="issue_unit"
              value={medicine.issue_unit}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">
                Select sale unit
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

          {/* Conversion */}

          <Field
            label="Sale Units per Stock Unit"
            required
            className="sm:col-span-2"
          >
            <div className="space-y-2">
              <input
                name="units_per_stock_unit"
                value={
                  medicine.units_per_stock_unit
                }
                onChange={handleChange}
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 10"
                required
                className={inputClass}
              />

              <p className="text-[11px] leading-5 text-[#89928D]">
                Example: If 1 Box contains
                10 Packs, enter{" "}
                <span className="font-semibold text-[#52645B]">
                  10
                </span>
                .
              </p>
            </div>
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

      {/* =================================================
          STOCK & PRICING
      ================================================= */}

      <div className="border-t border-[#E7E1D5] pt-5">

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#173C32]">
            Stock & Pricing
          </h3>

          <p className="mt-1 text-xs text-[#89928D]">
            Enter stock in complete stock units.
            The system calculates sale-unit stock
            automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Quantity */}

          <Field
            label={`Current Quantity${
              medicine.unit
                ? ` (${medicine.unit})`
                : ""
            }`}
            required
          >
            <input
              name="quantity"
              value={medicine.quantity}
              onChange={handleChange}
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 5"
              required
              className={inputClass}
            />
          </Field>

          {/* Minimum Stock */}

          <Field
            label={`Minimum Stock${
              medicine.unit
                ? ` (${medicine.unit})`
                : ""
            }`}
            required
          >
            <input
              name="minimum_stock"
              value={medicine.minimum_stock}
              onChange={handleChange}
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 2"
              required
              className={inputClass}
            />
          </Field>

          {/* Purchase Price */}

          <Field
            label={`Purchase Price${
              medicine.unit
                ? ` / ${medicine.unit}`
                : ""
            }`}
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
            label={`Selling Price${
              medicine.unit
                ? ` / ${medicine.unit}`
                : ""
            }`}
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

        {/* Conversion Preview */}

        {medicine.unit &&
          medicine.issue_unit &&
          Number(
            medicine.units_per_stock_unit
          ) > 0 && (
            <div className="mt-4 rounded-xl border border-[#DDE5DF] bg-[#F4F7F3] px-4 py-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#173C32]">
                    Stock conversion
                  </p>

                  <p className="mt-0.5 text-[11px] text-[#718078]">
                    1{" "}
                    {medicine.unit}{" "}
                    ={" "}
                    {
                      medicine.units_per_stock_unit
                    }{" "}
                    {
                      medicine.issue_unit
                    }
                  </p>
                </div>

                {medicine.selling_price &&
                  Number(
                    medicine.units_per_stock_unit
                  ) > 0 && (
                    <p className="text-xs font-semibold text-[#A58B52]">
                      Approx. Rs.{" "}
                      {(
                        Number(
                          medicine.selling_price
                        ) /
                        Number(
                          medicine.units_per_stock_unit
                        )
                      ).toFixed(2)}
                      {" / "}
                      {medicine.issue_unit}
                    </p>
                  )}
              </div>
            </div>
          )}
      </div>

      {/* =================================================
          ACTIONS
      ================================================= */}

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