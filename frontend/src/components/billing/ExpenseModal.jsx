import React, { useEffect, useState } from "react";
import BillingModal from "./BillingModal";
import { getToday } from "./billingUtils";

function ExpenseModal({
  open,
  onClose,
  onSubmit,
  saving = false,
}) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    expense_date: getToday(),
    category: "",
    notes: "",
  });

  const [error, setError] = useState("");

  /* =========================================================
     RESET
  ========================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormData({
      description: "",
      amount: "",
      expense_date: getToday(),
      category: "",
      notes: "",
    });

    setError("");
  }, [open]);

  /* =========================================================
     CHANGE
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.description.trim()) {
      setError("Please enter an expense description.");
      return;
    }

    if (
      formData.amount === "" ||
      Number(formData.amount) <= 0
    ) {
      setError("Please enter a valid expense amount.");
      return;
    }

    if (!formData.expense_date) {
      setError("Please select an expense date.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Please enter an expense category.");
      return;
    }

    try {
      await onSubmit({
        description: formData.description.trim(),
        amount: Number(formData.amount),
        expense_date: formData.expense_date,
        category: formData.category.trim(),
        notes: formData.notes.trim() || null,
      });
    } catch (submitError) {
      setError(
        submitError?.message ||
          "Unable to save expense. Please try again."
      );
    }
  };

  return (
    <BillingModal
      open={open}
      onClose={onClose}
      title="Add Expense"
      subtitle="Record an expense paid by the clinic."
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 p-5 sm:p-6">
          {/* Error */}
          {error && (
            <div
              className="rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: "rgba(180, 80, 70, 0.22)",
                backgroundColor: "rgba(180, 80, 70, 0.06)",
                color: "#a3483e",
              }}
            >
              {error}
            </div>
          )}

          {/* Description */}
          <FormField
            label="Description"
            required
          >
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Electricity bill"
              className={inputClass}
            />
          </FormField>

          {/* Category */}
          <FormField
            label="Category"
            required
          >
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Utilities"
              className={inputClass}
            />
          </FormField>

          {/* Amount + Date */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              label="Amount"
              required
            >
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold"
                  style={{ color: "#6f8f7d" }}
                >
                  Rs.
                </span>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </FormField>

            <FormField
              label="Expense Date"
              required
            >
              <input
                type="date"
                name="expense_date"
                value={formData.expense_date}
                onChange={handleChange}
                className={inputClass}
              />
            </FormField>
          </div>

          {/* Notes */}
          <FormField
            label="Notes"
            hint="Optional"
          >
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Add any additional notes..."
              className={`${inputClass} resize-none`}
            />
          </FormField>
        </div>

        {/* Actions */}
        <div
          className="flex flex-col-reverse gap-3 border-t px-5 py-4 sm:flex-row sm:justify-end sm:px-6"
          style={{
            borderColor: "rgba(23, 59, 50, 0.10)",
            backgroundColor: "#f7f3e9",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="min-h-10.5 rounded-xl border px-5 py-2.5 text-sm font-semibold transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              borderColor: "rgba(23, 59, 50, 0.16)",
              color: "#173B32",
              backgroundColor: "#fffdf8",
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="min-h-10.5 rounded-xl px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              backgroundColor: "#173B32",
              color: "#f7f3e9",
            }}
          >
            {saving ? "Saving..." : "Save Expense"}
          </button>
        </div>
      </form>
    </BillingModal>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  required = false,
  hint,
  children,
}) {
  return (
    <div>
      <label
        className="mb-1.5 block text-sm font-semibold"
        style={{ color: "#173B32" }}
      >
        {label}

        {required && (
          <span
            className="ml-1"
            style={{ color: "#b4935a" }}
          >
            *
          </span>
        )}
      </label>

      {children}

      {hint && (
        <p
          className="mt-1.5 text-xs"
          style={{ color: "#8a9a91" }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   INPUT STYLE
========================================================= */

const inputClass =
  "w-full rounded-xl border bg-[#fffdf8] px-3.5 py-2.5 text-sm text-[#173B32] outline-none transition placeholder:text-[#9aaa9f] focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#6f8f7d]/15";

export default ExpenseModal;