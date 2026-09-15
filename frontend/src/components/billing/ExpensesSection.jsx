import React from "react";
import { formatDate } from "./billingUtils";

function ExpensesSection({
  expenses = [],
  onAdd,
  onDelete,
  deletingExpenseId = null,
}) {
  return (
    <section
      className="mb-6 overflow-hidden rounded-2xl border bg-[#fffdf8] shadow-sm"
      style={{ borderColor: "rgba(23, 59, 50, 0.10)" }}
    >
      {/* Header */}
      <div
        className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: "rgba(23, 59, 50, 0.08)" }}
      >
        <div>
          <h2
            className="text-lg font-bold"
            style={{ color: "#173B32" }}
          >
            Clinic Expenses
          </h2>

          <p
            className="mt-1 text-xs"
            style={{ color: "#6f8f7d" }}
          >
            Track expenses and other clinic outflows.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex min-h-10 items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5"
          style={{
            borderColor: "#b4935a",
            backgroundColor: "#fffdf8",
            color: "#173B32",
          }}
        >
          <span className="mr-2 text-lg leading-none">+</span>
          Add Expense
        </button>
      </div>

      {/* Table */}
      {expenses.length === 0 ? (
        <EmptyExpensesState onAdd={onAdd} />
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-212.5 border-collapse">
            <thead>
              <tr
                style={{
                  backgroundColor: "#f7f3e9",
                  color: "#173B32",
                }}
              >
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide">
                  Description
                </th>

                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide">
                  Category
                </th>

                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide">
                  Amount
                </th>

                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide">
                  Expense Date
                </th>

                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide">
                  Notes
                </th>

                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense, index) => (
                <tr
                  key={expense.id ?? index}
                  className="border-t transition hover:bg-[#f7f3e9]/50"
                  style={{
                    borderColor:
                      "rgba(23, 59, 50, 0.08)",
                  }}
                >
                  {/* Description */}
                  <td className="px-5 py-4">
                    <div className="min-w-45">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "#173B32" }}
                      >
                        {expense.description || "—"}
                      </p>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor:
                          "rgba(111, 143, 125, 0.14)",
                        color: "#173B32",
                      }}
                    >
                      {formatCategory(expense.category)}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4">
                    <span
                      className="text-sm font-bold"
                      style={{ color: "#173B32" }}
                    >
                      Rs. {formatAmount(expense.amount)}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4">
                    <span
                      className="text-sm"
                      style={{ color: "#40584f" }}
                    >
                      {formatDate(
                        expense.expense_date ??
                          expense.date ??
                          expense.created_at
                      )}
                    </span>
                  </td>

                  {/* Notes */}
                  <td className="max-w-62.5 px-5 py-4">
                    <span
                      className="block truncate text-sm"
                      title={expense.notes || ""}
                      style={{ color: "#6f8f7d" }}
                    >
                      {expense.notes || "—"}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onDelete(expense)}
                      disabled={
                        deletingExpenseId === expense.id
                      }
                      className="inline-flex h-9 min-w-18 items-center justify-center rounded-lg border px-3 text-xs font-semibold transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        borderColor:
                          "rgba(180, 80, 70, 0.25)",
                        color: "#a3483e",
                      }}
                    >
                      {deletingExpenseId === expense.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      {expenses.length > 0 && (
        <div
          className="border-t px-5 py-3"
          style={{
            borderColor: "rgba(23, 59, 50, 0.08)",
            backgroundColor: "#f7f3e9",
          }}
        >
          <p
            className="text-xs"
            style={{ color: "#6f8f7d" }}
          >
            Showing {expenses.length} expense
            {expenses.length === 1 ? "" : "s"}.
          </p>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyExpensesState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold"
        style={{
          backgroundColor: "rgba(180, 147, 90, 0.12)",
          color: "#b4935a",
        }}
      >
        ₨
      </div>

      <h3
        className="text-sm font-bold"
        style={{ color: "#173B32" }}
      >
        No expenses yet
      </h3>

      <p
        className="mt-1 max-w-sm text-sm"
        style={{ color: "#6f8f7d" }}
      >
        Clinic expenses will appear here once you add them.
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="mt-5 rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
        style={{
          backgroundColor: "#173B32",
          color: "#f7f3e9",
        }}
      >
        Add First Expense
      </button>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatAmount(value) {
  return Number(value || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatCategory(category) {
  if (!category) {
    return "Other";
  }

  return String(category)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default ExpensesSection;