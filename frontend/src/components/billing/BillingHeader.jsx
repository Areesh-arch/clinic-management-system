
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArchive } from "react-icons/fi";

function BillingHeader({
  onAddPayment,
  onAddExpense,
  onReport,
}) {
  const navigate = useNavigate();

  const handleArchive = () => {
    navigate("/archive");
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Heading */}
        <div>
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: "#173B32",
                color: "#f7f3e9",
              }}
            >
              <span className="text-xl font-semibold">$</span>
            </div>

            <div>
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{ color: "#173B32" }}
              >
                Billing & Accounts
              </h1>

              <p
                className="mt-1 text-sm"
                style={{ color: "#6f8f7d" }}
              >
                Manage payments, outstanding balances and clinic expenses.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Reports */}
          {onReport && (
            <button
              type="button"
              onClick={onReport}
              className="inline-flex min-h-10.5 items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{
                borderColor: "#b4935a",
                backgroundColor: "#fffdf8",
                color: "#173B32",
              }}
            >
              <span className="mr-2">▣</span>
              Reports
            </button>
          )}

          {/* Archive */}
          <button
            type="button"
            onClick={handleArchive}
            className="inline-flex min-h-10.5 items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
            style={{
              borderColor: "#b4935a",
              backgroundColor: "#fffdf8",
              color: "#173B32",
            }}
          >
            <FiArchive
              className="mr-2"
              size={17}
            />
            Archive
          </button>

          {/* Add Expense */}
          <button
            type="button"
            onClick={onAddExpense}
            className="inline-flex min-h-10.5 items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
            style={{
              borderColor: "#6f8f7d",
              backgroundColor: "#fffdf8",
              color: "#173B32",
            }}
          >
            <span className="mr-2 text-lg leading-none">+</span>
            Add Expense
          </button>

          {/* Add Payment */}
          <button
            type="button"
            onClick={onAddPayment}
            className="inline-flex min-h-10.5 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5"
            style={{
              backgroundColor: "#173B32",
              color: "#f7f3e9",
            }}
          >
            <span className="mr-2 text-lg leading-none">+</span>
            Add Payment
          </button>
        </div>
      </div>

      {/* Gold divider */}
      <div
        className="mt-5 h-px w-full"
        style={{
          background:
            "linear-gradient(to right, #b4935a, rgba(180,147,90,0.15), transparent)",
        }}
      />
    </div>
  );
}

export default BillingHeader;
