import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  FiArchive,
  FiArrowLeft,
  FiDollarSign,
  FiLoader,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import Layout from "../../components/layout/Layout";

import {
  getArchivedPayments,
  restorePayment,
  permanentlyDeletePayment,
  getArchivedExpenses,
  restoreExpense,
  permanentlyDeleteExpense,
} from "../../services/invoiceService";

const FOREST = "#173B32";
const GOLD = "#B4935A";
const IVORY = "#F7F3E9";
const SAGE = "#6F8F7D";

// =====================================================
// HELPERS
// =====================================================

function formatMoney(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

function getPatientName(item) {
  return (
    item?.patient_name ||
    item?.patient?.name ||
    item?.patient?.full_name ||
    "Unknown Patient"
  );
}

function getPatientMrn(item) {
  return (
    item?.medical_record_number ||
    item?.patient?.medical_record_number ||
    "—"
  );
}

function getPaymentMethod(method) {
  if (!method) return "—";

  return String(method)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

// =====================================================
// EMPTY STATE
// =====================================================

function EmptyState({ type }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: `${SAGE}18`,
          color: FOREST,
        }}
      >
        <FiArchive size={28} />
      </div>

      <h3
        className="text-lg font-semibold"
        style={{ color: FOREST }}
      >
        No archived {type}
      </h3>

      <p className="mt-2 max-w-md text-sm text-slate-500">
        Archived {type.toLowerCase()} will appear here. You can restore
        them later or permanently delete them from this page.
      </p>
    </div>
  );
}

// =====================================================
// CONFIRM DELETE MODAL
// =====================================================

function ConfirmDeleteModal({
  item,
  type,
  loading,
  onCancel,
  onConfirm,
}) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ backgroundColor: FOREST }}
        >
          <div className="flex items-center gap-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <FiTrash2 size={19} />
            </div>

            <div>
              <h3 className="font-semibold">
                Permanently Delete
              </h3>

              <p className="text-xs text-white/70">
                This action cannot be undone
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="px-6 py-6">
          <p className="text-sm leading-6 text-slate-600">
            Are you sure you want to permanently delete this{" "}
            <span className="font-semibold text-slate-800">
              {type.toLowerCase()}
            </span>
            ?
          </p>

          <div
            className="mt-4 rounded-xl border px-4 py-3"
            style={{
              backgroundColor: IVORY,
              borderColor: `${GOLD}55`,
            }}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Record
            </p>

            <p
              className="mt-1 font-semibold"
              style={{ color: FOREST }}
            >
              {type === "Payment"
                ? getPatientName(item)
                : item?.description || "Expense"}
            </p>

            {type === "Payment" && (
              <p className="mt-1 text-xs text-slate-500">
                MRN: {getPatientMrn(item)}
              </p>
            )}
          </div>

          <p className="mt-4 text-xs leading-5 text-red-600">
            Permanently deleting this record will remove it from the
            database. It cannot be restored afterward.
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 />
                  Permanently Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// PAYMENT ROW
// =====================================================

function PaymentRow({
  item,
  onRestore,
  onDelete,
  restoring,
}) {
  return (
    <div className="min-w-225 border-b border-[#eee9dd] px-5 py-4 transition hover:bg-[#fbf9f3]">
      <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_180px] items-center gap-4">
        {/* PATIENT */}
        <div>
          <p
            className="font-semibold"
            style={{ color: FOREST }}
          >
            {getPatientName(item)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            MRN: {getPatientMrn(item)}
          </p>
        </div>

        {/* VISIT */}
        <div>
          <p className="text-sm text-slate-600">
            {item?.visit_id
              ? `Visit #${item.visit_id}`
              : "—"}
          </p>
        </div>

        {/* AMOUNT */}
        <div>
          <p
            className="font-semibold"
            style={{ color: FOREST }}
          >
            Rs. {formatMoney(item?.amount)}
          </p>
        </div>

        {/* METHOD */}
        <div>
          <span
            className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: `${SAGE}18`,
              color: FOREST,
            }}
          >
            {getPaymentMethod(item?.payment_method)}
          </span>
        </div>

        {/* DATE */}
        <div className="text-sm text-slate-500">
          {formatDate(
            item?.payment_date || item?.created_at
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onRestore(item)}
            disabled={restoring === item?.id}
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition hover:bg-[#eef4f0] disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              borderColor: `${SAGE}55`,
              color: FOREST,
            }}
          >
            {restoring === item?.id ? (
              <FiLoader className="animate-spin" />
            ) : (
              <FiRefreshCw />
            )}
            Restore
          </button>

          <button
            type="button"
            onClick={() => onDelete(item)}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            <FiTrash2 />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// EXPENSE ROW
// =====================================================

function ExpenseRow({
  item,
  onRestore,
  onDelete,
  restoring,
}) {
  return (
    <div className="min-w-225 border-b border-[#eee9dd] px-5 py-4 transition hover:bg-[#fbf9f3]">
      <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_180px] items-center gap-4">
        <div>
          <p
            className="font-semibold"
            style={{ color: FOREST }}
          >
            {item?.description || "Expense"}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Expense #{item?.id ?? "—"}
          </p>
        </div>

        <div>
          <span
            className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: `${GOLD}18`,
              color: "#7b622f",
            }}
          >
            {item?.category || "Uncategorized"}
          </span>
        </div>

        <div>
          <p
            className="font-semibold"
            style={{ color: FOREST }}
          >
            Rs. {formatMoney(item?.amount)}
          </p>
        </div>

        <div className="text-sm text-slate-500">
          {formatDate(
            item?.expense_date || item?.created_at
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onRestore(item)}
            disabled={restoring === item?.id}
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition hover:bg-[#eef4f0] disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              borderColor: `${SAGE}55`,
              color: FOREST,
            }}
          >
            {restoring === item?.id ? (
              <FiLoader className="animate-spin" />
            ) : (
              <FiRefreshCw />
            )}
            Restore
          </button>

          <button
            type="button"
            onClick={() => onDelete(item)}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            <FiTrash2 />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// ARCHIVE PAGE
// =====================================================

export default function Archive() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("payments");

  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [restoring, setRestoring] = useState(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // =====================================================
  // LOAD ARCHIVE
  // =====================================================

  const loadArchive = async () => {
    try {
      setLoading(true);
      setError("");

      const [paymentData, expenseData] = await Promise.all([
        getArchivedPayments(),
        getArchivedExpenses(),
      ]);

      setPayments(
        Array.isArray(paymentData)
          ? paymentData
          : paymentData?.items ||
              paymentData?.data ||
              []
      );

      setExpenses(
        Array.isArray(expenseData)
          ? expenseData
          : expenseData?.items ||
              expenseData?.data ||
              []
      );
    } catch (err) {
      console.error("Failed to load archive:", err);

      setError(
        err?.message ||
          "Unable to load archived records. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchive();
  }, []);

  // =====================================================
  // FILTER PAYMENTS
  // =====================================================

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return payments;

    return payments.filter((item) => {
      const values = [
        getPatientName(item),
        getPatientMrn(item),
        item?.id,
        item?.visit_id,
        item?.payment_method,
        item?.notes,
        item?.amount,
      ];

      return values.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [payments, search]);

  // =====================================================
  // FILTER EXPENSES
  // =====================================================

  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return expenses;

    return expenses.filter((item) => {
      const values = [
        item?.description,
        item?.category,
        item?.id,
        item?.notes,
        item?.amount,
      ];

      return values.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [expenses, search]);

  const currentCount =
    activeTab === "payments"
      ? filteredPayments.length
      : filteredExpenses.length;

  const totalArchived =
    payments.length + expenses.length;

  // =====================================================
  // RESTORE PAYMENT
  // =====================================================

  const handleRestorePayment = async (payment) => {
    try {
      setRestoring(payment.id);

      await restorePayment(payment.id);

      setPayments((current) =>
        current.filter(
          (item) => item.id !== payment.id
        )
      );
    } catch (err) {
      console.error(
        "Failed to restore payment:",
        err
      );

      window.alert(
        err?.message ||
          "Unable to restore this payment."
      );
    } finally {
      setRestoring(null);
    }
  };

  // =====================================================
  // RESTORE EXPENSE
  // =====================================================

  const handleRestoreExpense = async (expense) => {
    try {
      setRestoring(expense.id);

      await restoreExpense(expense.id);

      setExpenses((current) =>
        current.filter(
          (item) => item.id !== expense.id
        )
      );
    } catch (err) {
      console.error(
        "Failed to restore expense:",
        err
      );

      window.alert(
        err?.message ||
          "Unable to restore this expense."
      );
    } finally {
      setRestoring(null);
    }
  };

  // =====================================================
  // PERMANENT DELETE
  // =====================================================

  const handlePermanentDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);

      if (deleteTarget.type === "Payment") {
        await permanentlyDeletePayment(
          deleteTarget.item.id
        );

        setPayments((current) =>
          current.filter(
            (item) =>
              item.id !== deleteTarget.item.id
          )
        );
      } else {
        await permanentlyDeleteExpense(
          deleteTarget.item.id
        );

        setExpenses((current) =>
          current.filter(
            (item) =>
              item.id !== deleteTarget.item.id
          )
        );
      }

      setDeleteTarget(null);
    } catch (err) {
      console.error(
        "Permanent delete failed:",
        err
      );

      window.alert(
        err?.message ||
          "Unable to permanently delete this record."
      );
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <Layout>
      <div
        className="min-h-screen px-4 py-5 sm:px-6 lg:px-8"
        style={{ backgroundColor: IVORY }}
      >
        <div className="mx-auto max-w-375">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm"
                    style={{
                      backgroundColor: FOREST,
                      color: "#ffffff",
                    }}
                  >
                    <FiArchive size={22} />
                  </div>

                  <div>
                    <h1
                      className="text-2xl font-bold sm:text-3xl"
                      style={{ color: FOREST }}
                    >
                      Archive
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                      Manage archived billing records safely.
                    </p>
                  </div>
                </div>

                <div
                  className="mt-5 h-0.75 w-full max-w-225 rounded-full"
                  style={{ backgroundColor: GOLD }}
                />
              </div>

              {/* BACK TO BILLING + REFRESH */}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/billing")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-[#fbf9f3]"
                  style={{
                    borderColor: `${FOREST}22`,
                    color: FOREST,
                  }}
                >
                  <FiArrowLeft size={17} />
                  Back to Billing
                </button>

                <button
                  type="button"
                  onClick={loadArchive}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-[#fbf9f3] disabled:opacity-60"
                  style={{
                    borderColor: `${FOREST}22`,
                    color: FOREST,
                  }}
                >
                  <FiRefreshCw
                    className={
                      loading
                        ? "animate-spin"
                        : ""
                    }
                  />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#e9e2d3] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Archived Payments
                  </p>

                  <p
                    className="mt-2 text-2xl font-bold"
                    style={{ color: FOREST }}
                  >
                    {payments.length}
                  </p>
                </div>

                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `${FOREST}10`,
                    color: FOREST,
                  }}
                >
                  <FiDollarSign size={20} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e9e2d3] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Archived Expenses
                  </p>

                  <p
                    className="mt-2 text-2xl font-bold"
                    style={{ color: FOREST }}
                  >
                    {expenses.length}
                  </p>
                </div>

                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `${GOLD}18`,
                    color: "#7b622f",
                  }}
                >
                  <FiArchive size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              MAIN CARD
          ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-[#e9e2d3] bg-white shadow-sm">

            {/* TABS */}

            <div className="border-b border-[#eee9dd] px-4 pt-4 sm:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div className="flex gap-1 overflow-x-auto">

                  {/* PAYMENTS TAB */}

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("payments");
                      setSearch("");
                    }}
                    className="relative whitespace-nowrap rounded-t-xl px-5 py-3 text-sm font-semibold transition"
                    style={{
                      color:
                        activeTab === "payments"
                          ? FOREST
                          : "#64748b",
                      backgroundColor:
                        activeTab === "payments"
                          ? `${FOREST}09`
                          : "transparent",
                    }}
                  >
                    Payments

                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                      {payments.length}
                    </span>

                    {activeTab === "payments" && (
                      <span
                        className="absolute bottom-0 left-4 right-4 h-0.75 rounded-full"
                        style={{
                          backgroundColor: GOLD,
                        }}
                      />
                    )}
                  </button>

                  {/* EXPENSES TAB */}

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("expenses");
                      setSearch("");
                    }}
                    className="relative whitespace-nowrap rounded-t-xl px-5 py-3 text-sm font-semibold transition"
                    style={{
                      color:
                        activeTab === "expenses"
                          ? FOREST
                          : "#64748b",
                      backgroundColor:
                        activeTab === "expenses"
                          ? `${FOREST}09`
                          : "transparent",
                    }}
                  >
                    Expenses

                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                      {expenses.length}
                    </span>

                    {activeTab === "expenses" && (
                      <span
                        className="absolute bottom-0 left-4 right-4 h-0.75 rounded-full"
                        style={{
                          backgroundColor: GOLD,
                        }}
                      />
                    )}
                  </button>
                </div>

                {/* SEARCH */}

                <div className="relative w-full md:max-w-xs">
                  <FiSearch
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    size={17}
                    color="#94a3b8"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder={
                      activeTab === "payments"
                        ? "Search payments..."
                        : "Search expenses..."
                    }
                    className="w-full rounded-xl border bg-[#fbfaf6] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:bg-white"
                    style={{
                      borderColor: `${FOREST}20`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* CONTENT */}

            {loading ? (
              <div className="flex min-h-87.5 items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <FiLoader
                    className="animate-spin"
                    size={20}
                    style={{ color: FOREST }}
                  />
                  Loading archived records...
                </div>
              </div>
            ) : error ? (
              <div className="flex min-h-87.5 flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 rounded-xl bg-red-50 p-4 text-red-600">
                  <FiX size={24} />
                </div>

                <p className="font-semibold text-slate-700">
                  Unable to load Archive
                </p>

                <p className="mt-2 max-w-md text-sm text-slate-500">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={loadArchive}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                  style={{ backgroundColor: FOREST }}
                >
                  <FiRefreshCw />
                  Try Again
                </button>
              </div>
            ) : (
              <>
                {/* PAYMENT TABLE */}

                {activeTab === "payments" &&
                  filteredPayments.length > 0 && (
                    <div className="overflow-x-auto">

                      <div className="min-w-225 border-b border-[#eee9dd] bg-[#fbfaf6] px-5 py-3">
                        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_180px] gap-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          <span>Patient</span>
                          <span>Visit</span>
                          <span>Amount</span>
                          <span>Method</span>
                          <span>Date</span>
                          <span className="text-right">
                            Actions
                          </span>
                        </div>
                      </div>

                      {filteredPayments.map((item) => (
                        <PaymentRow
                          key={item.id}
                          item={item}
                          restoring={restoring}
                          onRestore={
                            handleRestorePayment
                          }
                          onDelete={(payment) =>
                            setDeleteTarget({
                              type: "Payment",
                              item: payment,
                            })
                          }
                        />
                      ))}
                    </div>
                  )}

                {/* EXPENSE TABLE */}

                {activeTab === "expenses" &&
                  filteredExpenses.length > 0 && (
                    <div className="overflow-x-auto">

                      <div className="min-w-225 border-b border-[#eee9dd] bg-[#fbfaf6] px-5 py-3">
                        <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_180px] gap-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          <span>Description</span>
                          <span>Category</span>
                          <span>Amount</span>
                          <span>Date</span>
                          <span className="text-right">
                            Actions
                          </span>
                        </div>
                      </div>

                      {filteredExpenses.map((item) => (
                        <ExpenseRow
                          key={item.id}
                          item={item}
                          restoring={restoring}
                          onRestore={
                            handleRestoreExpense
                          }
                          onDelete={(expense) =>
                            setDeleteTarget({
                              type: "Expense",
                              item: expense,
                            })
                          }
                        />
                      ))}
                    </div>
                  )}

                {/* EMPTY STATE */}

                {currentCount === 0 && (
                  <EmptyState
                    type={
                      activeTab === "payments"
                        ? "Payments"
                        : "Expenses"
                    }
                  />
                )}
              </>
            )}

            {/* FOOTER */}

            {!loading && !error && (
              <div className="border-t border-[#eee9dd] bg-[#fbfaf6] px-5 py-4">
                <p className="text-xs text-slate-400">
                  Showing {currentCount} archived{" "}
                  {activeTab === "payments"
                    ? "payment"
                    : "expense"}
                  {currentCount !== 1 ? "s" : ""}
                  {search.trim()
                    ? " matching your search"
                    : ""}
                  .
                </p>
              </div>
            )}
          </div>

          {/* =================================================
              INFO
          ================================================= */}

          <div
            className="mt-5 rounded-2xl border px-5 py-4"
            style={{
              borderColor: `${GOLD}45`,
              backgroundColor: `${GOLD}0D`,
            }}
          >
            <div className="flex gap-3">
              <FiArchive
                className="mt-0.5 shrink-0"
                style={{ color: GOLD }}
                size={18}
              />

              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: FOREST }}
                >
                  How Archive works
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Archived records are hidden from normal Billing.
                  Restore brings them back to Billing. Permanent
                  Delete removes the record completely and cannot be
                  undone.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            {totalArchived} total archived record
            {totalArchived !== 1 ? "s" : ""}
          </p>
        </div>

        {/* ===================================================
            PERMANENT DELETE MODAL
        =================================================== */}

        <ConfirmDeleteModal
          item={deleteTarget?.item}
          type={deleteTarget?.type}
          loading={deleting}
          onCancel={() => {
            if (!deleting) {
              setDeleteTarget(null);
            }
          }}
          onConfirm={handlePermanentDelete}
        />
      </div>
    </Layout>
  );
}