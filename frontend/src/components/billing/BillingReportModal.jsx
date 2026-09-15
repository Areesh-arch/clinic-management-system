import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import BillingModal from "./BillingModal";
import {
  formatDate,
  formatPaymentMethod,
  getPatientNameById,
  getVisitLabel,
} from "./billingUtils";

function BillingReportModal({
  open,
  onClose,
  payments = [],
  expenses = [],
  outstanding = [],
  patients = [],
  visits = [],
}) {
  const [reportType, setReportType] = useState("summary");
  const [dateRange, setDateRange] = useState("month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const dateFilter = useMemo(() => {
    return getDateFilter(
      dateRange,
      customStartDate,
      customEndDate
    );
  }, [dateRange, customStartDate, customEndDate]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) =>
      isDateInRange(
        payment.payment_date,
        dateFilter
      )
    );
  }, [payments, dateFilter]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) =>
      isDateInRange(
        expense.expense_date ??
          expense.date ??
          expense.created_at,
        dateFilter
      )
    );
  }, [expenses, dateFilter]);

  /*
   * Outstanding is a CURRENT BALANCE snapshot.
   * We intentionally do not apply the payment/expense date
   * filter to it because an outstanding record does not
   * necessarily represent a transaction date.
   */
  const filteredOutstanding = outstanding;

  const totalPaid = useMemo(
    () =>
      filteredPayments.reduce(
        (sum, payment) =>
          sum + Number(payment.amount || 0),
        0
      ),
    [filteredPayments]
  );

  const totalExpenses = useMemo(
    () =>
      filteredExpenses.reduce(
        (sum, expense) =>
          sum + Number(expense.amount || 0),
        0
      ),
    [filteredExpenses]
  );

  const totalOutstanding = useMemo(
    () =>
      filteredOutstanding.reduce(
        (sum, item) =>
          sum +
          Number(
            item.outstanding_amount ??
              item.outstanding ??
              0
          ),
        0
      ),
    [filteredOutstanding]
  );

  const netReceived = totalPaid - totalExpenses;

  const reportTitle = getReportTitle(reportType);

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    const summaryRows = [
      ["Billing Report"],
      ["Report Type", reportTitle],
      ["Date Range", getDateRangeLabel(dateFilter)],
      [],
      ["Metric", "Amount"],
      ["Total Paid", totalPaid],
      ["Total Expenses", totalExpenses],
      ["Net Received", netReceived],
      ["Current Outstanding", totalOutstanding],
      [],
      ["Payment Records", filteredPayments.length],
      ["Expense Records", filteredExpenses.length],
      ["Outstanding Records", filteredOutstanding.length],
    ];

    const paymentRows = filteredPayments.map(
      (payment) => ({
        Patient: getPatientNameById(
          patients,
          payment.patient_id
        ),
        "Patient ID": payment.patient_id || "",
        "Visit ID": payment.visit_id || "",
        Amount: Number(payment.amount || 0),
        "Payment Method": formatPaymentMethod(
          payment.payment_method
        ),
        "Payment Date": formatDate(
          payment.payment_date
        ),
        Notes: payment.notes || "",
      })
    );

    const outstandingRows = filteredOutstanding.map(
      (item) => {
        const totalAmount = Number(
          item.total_amount ??
            item.total ??
            item.amount ??
            0
        );

        const paidAmount = Number(
          item.paid_amount ??
            item.paid ??
            0
        );

        const outstandingAmount = Number(
          item.outstanding_amount ??
            item.outstanding ??
            Math.max(
              totalAmount - paidAmount,
              0
            )
        );

        return {
          Patient: getPatientNameById(
            patients,
            item.patient_id
          ),
          "Patient ID": item.patient_id || "",
          "Visit ID": item.visit_id || "",
          "Total Amount": totalAmount,
          Paid: paidAmount,
          Outstanding: outstandingAmount,
          Date: formatDate(
            item.visit_date ??
              item.date ??
              item.created_at
          ),
        };
      }
    );

    const expenseRows = filteredExpenses.map(
      (expense) => ({
        Description:
          expense.description || "",
        Category: expense.category || "",
        Amount: Number(expense.amount || 0),
        "Expense Date": formatDate(
          expense.expense_date ??
            expense.date ??
            expense.created_at
        ),
        Notes: expense.notes || "",
      })
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet(summaryRows),
      "Summary"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(
        paymentRows.length
          ? paymentRows
          : [
              {
                Patient: "",
                "Patient ID": "",
                "Visit ID": "",
                Amount: 0,
                "Payment Method": "",
                "Payment Date": "",
                Notes: "",
              },
            ]
      ),
      "Payments"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(
        outstandingRows.length
          ? outstandingRows
          : [
              {
                Patient: "",
                "Patient ID": "",
                "Visit ID": "",
                "Total Amount": 0,
                Paid: 0,
                Outstanding: 0,
                Date: "",
              },
            ]
      ),
      "Outstanding"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(
        expenseRows.length
          ? expenseRows
          : [
              {
                Description: "",
                Category: "",
                Amount: 0,
                "Expense Date": "",
                Notes: "",
              },
            ]
      ),
      "Expenses"
    );

    const today = new Date()
      .toISOString()
      .slice(0, 10);

    XLSX.writeFile(
      workbook,
      `billing-report-${today}.xlsx`
    );
  };

  return (
    <BillingModal
      open={open}
      onClose={onClose}
      title="Billing Reports"
      subtitle="Generate financial reports from your existing billing data."
      maxWidth="max-w-6xl"
    >
      <div className="p-5 sm:p-6">
        {/* =====================================================
            FILTERS
        ===================================================== */}

        <div
          className="rounded-2xl border p-4 sm:p-5"
          style={{
            borderColor:
              "rgba(23, 59, 50, 0.10)",
            backgroundColor: "#f7f3e9",
          }}
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Report Type */}
            <FormField label="Report">
              <select
                value={reportType}
                onChange={(event) =>
                  setReportType(event.target.value)
                }
                className={inputClass}
              >
                <option value="summary">
                  Financial Summary
                </option>
                <option value="payments">
                  Payments
                </option>
                <option value="outstanding">
                  Outstanding
                </option>
                <option value="expenses">
                  Expenses
                </option>
              </select>
            </FormField>

            {/* Date Range */}
            <FormField label="Date Range">
              <select
                value={dateRange}
                onChange={(event) =>
                  setDateRange(event.target.value)
                }
                className={inputClass}
              >
                <option value="today">Today</option>
                <option value="week">
                  This Week
                </option>
                <option value="month">
                  This Month
                </option>
                <option value="year">
                  This Year
                </option>
                <option value="all">
                  All Time
                </option>
                <option value="custom">
                  Custom Range
                </option>
              </select>
            </FormField>

            {/* Export */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleExport}
                className="w-full min-h-10.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#173B32",
                  color: "#f7f3e9",
                }}
              >
                Export Excel
              </button>
            </div>
          </div>

          {/* Custom Dates */}
          {dateRange === "custom" && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Start Date">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(event) =>
                    setCustomStartDate(
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </FormField>

              <FormField label="End Date">
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(event) =>
                    setCustomEndDate(
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </FormField>
            </div>
          )}
        </div>

        {/* =====================================================
            REPORT DESCRIPTION
        ===================================================== */}

        <div className="mt-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3
                className="text-lg font-bold"
                style={{ color: "#173B32" }}
              >
                {reportTitle}
              </h3>

              <p
                className="mt-1 text-xs"
                style={{ color: "#6f8f7d" }}
              >
                {getDateRangeLabel(dateFilter)}
              </p>
            </div>

            <span
              className="inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor:
                  "rgba(180, 147, 90, 0.14)",
                color: "#8a6d2f",
              }}
            >
              Outstanding = current balance
            </span>
          </div>
        </div>

        {/* =====================================================
            SUMMARY CARDS
        ===================================================== */}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ReportCard
            title="Total Paid"
            value={totalPaid}
            accent="#173B32"
          />

          <ReportCard
            title="Total Expenses"
            value={totalExpenses}
            accent="#6f8f7d"
          />

          <ReportCard
            title="Net Received"
            value={netReceived}
            accent="#b4935a"
          />

          <ReportCard
            title="Outstanding"
            value={totalOutstanding}
            accent="#8a6d2f"
          />
        </div>

        {/* =====================================================
            REPORT TABLE
        ===================================================== */}

        <div className="mt-6">
          {reportType === "summary" && (
            <SummaryReport
              payments={filteredPayments}
              expenses={filteredExpenses}
              outstanding={filteredOutstanding}
            />
          )}

          {reportType === "payments" && (
            <PaymentsReport
              payments={filteredPayments}
              patients={patients}
            />
          )}

          {reportType === "outstanding" && (
            <OutstandingReport
              outstanding={filteredOutstanding}
              patients={patients}
            />
          )}

          {reportType === "expenses" && (
            <ExpensesReport
              expenses={filteredExpenses}
            />
          )}
        </div>
      </div>
    </BillingModal>
  );
}

/* =========================================================
   REPORT CARD
========================================================= */

function ReportCard({
  title,
  value,
  accent,
}) {
  return (
    <div
      className="rounded-xl border bg-[#fffdf8] p-4"
      style={{
        borderColor:
          "rgba(23, 59, 50, 0.10)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className="text-xs font-semibold"
          style={{ color: "#6f8f7d" }}
        >
          {title}
        </span>

        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: accent }}
        />
      </div>

      <p
        className="mt-2 wrap-break-words text-lg font-bold"
        style={{ color: "#173B32" }}
      >
        Rs. {formatAmount(value)}
      </p>
    </div>
  );
}

/* =========================================================
   SUMMARY REPORT
========================================================= */

function SummaryReport({
  payments,
  expenses,
  outstanding,
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl border bg-[#fffdf8]"
      style={{
        borderColor:
          "rgba(23, 59, 50, 0.10)",
      }}
    >
      <div
        className="border-b px-4 py-3"
        style={{
          borderColor:
            "rgba(23, 59, 50, 0.08)",
          backgroundColor: "#f7f3e9",
        }}
      >
        <h4
          className="text-sm font-bold"
          style={{ color: "#173B32" }}
        >
          Report Overview
        </h4>
      </div>

      <div className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <OverviewItem
          label="Payment Records"
          value={payments.length}
        />

        <OverviewItem
          label="Expense Records"
          value={expenses.length}
        />

        <OverviewItem
          label="Outstanding Records"
          value={outstanding.length}
        />
      </div>
    </div>
  );
}

function OverviewItem({
  label,
  value,
}) {
  return (
    <div className="p-5">
      <p
        className="text-xs font-medium"
        style={{ color: "#6f8f7d" }}
      >
        {label}
      </p>

      <p
        className="mt-1 text-2xl font-bold"
        style={{ color: "#173B32" }}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   PAYMENTS REPORT
========================================================= */

function PaymentsReport({
  payments,
  patients,
}) {
  if (!payments.length) {
    return <EmptyReport text="No payments found for this period." />;
  }

  return (
    <ReportTable>
      <thead>
        <tr>
          <th>Patient</th>
          <th>Amount</th>
          <th>Method</th>
          <th>Date</th>
          <th>Notes</th>
        </tr>
      </thead>

      <tbody>
        {payments.map((payment, index) => (
          <tr key={payment.id ?? index}>
            <td>
              {getPatientNameById(
                patients,
                payment.patient_id
              )}
            </td>

            <td className="font-semibold">
              Rs. {formatAmount(payment.amount)}
            </td>

            <td>
              {formatPaymentMethod(
                payment.payment_method
              )}
            </td>

            <td>
              {formatDate(payment.payment_date)}
            </td>

            <td>
              {payment.notes || "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </ReportTable>
  );
}

/* =========================================================
   OUTSTANDING REPORT
========================================================= */

function OutstandingReport({
  outstanding,
  patients,
}) {
  if (!outstanding.length) {
    return (
      <EmptyReport text="No outstanding balances found." />
    );
  }

  return (
    <ReportTable>
      <thead>
        <tr>
          <th>Patient</th>
          <th>Visit</th>
          <th>Total</th>
          <th>Paid</th>
          <th>Outstanding</th>
        </tr>
      </thead>

      <tbody>
        {outstanding.map((item, index) => {
          const total = Number(
            item.total_amount ??
              item.total ??
              item.amount ??
              0
          );

          const paid = Number(
            item.paid_amount ??
              item.paid ??
              0
          );

          const balance = Number(
            item.outstanding_amount ??
              item.outstanding ??
              Math.max(total - paid, 0)
          );

          return (
            <tr key={item.id ?? index}>
              <td>
                {getPatientNameById(
                  patients,
                  item.patient_id
                )}
              </td>

              <td>
                {item.visit_id
                  ? `Visit #${item.visit_id}`
                  : item.visit_name ||
                    item.description ||
                    "—"}
              </td>

              <td>
                Rs. {formatAmount(total)}
              </td>

              <td>
                Rs. {formatAmount(paid)}
              </td>

              <td className="font-bold">
                Rs. {formatAmount(balance)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </ReportTable>
  );
}

/* =========================================================
   EXPENSE REPORT
========================================================= */

function ExpensesReport({
  expenses,
}) {
  if (!expenses.length) {
    return (
      <EmptyReport text="No expenses found for this period." />
    );
  }

  return (
    <ReportTable>
      <thead>
        <tr>
          <th>Description</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Notes</th>
        </tr>
      </thead>

      <tbody>
        {expenses.map((expense, index) => (
          <tr key={expense.id ?? index}>
            <td>
              {expense.description || "—"}
            </td>

            <td>
              {formatCategory(
                expense.category
              )}
            </td>

            <td className="font-semibold">
              Rs. {formatAmount(expense.amount)}
            </td>

            <td>
              {formatDate(
                expense.expense_date ??
                  expense.date ??
                  expense.created_at
              )}
            </td>

            <td>
              {expense.notes || "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </ReportTable>
  );
}

/* =========================================================
   SHARED REPORT TABLE
========================================================= */

function ReportTable({ children }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border bg-[#fffdf8]"
      style={{
        borderColor:
          "rgba(23, 59, 50, 0.10)",
      }}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-187.5 border-collapse">
          {children}
        </table>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY REPORT
========================================================= */

function EmptyReport({ text }) {
  return (
    <div
      className="rounded-2xl border px-5 py-12 text-center"
      style={{
        borderColor:
          "rgba(23, 59, 50, 0.10)",
        backgroundColor: "#fffdf8",
      }}
    >
      <div
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl"
        style={{
          backgroundColor:
            "rgba(23, 59, 50, 0.08)",
          color: "#173B32",
        }}
      >
        —
      </div>

      <p
        className="mt-4 text-sm font-medium"
        style={{ color: "#173B32" }}
      >
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  children,
}) {
  return (
    <div>
      <label
        className="mb-1.5 block text-sm font-semibold"
        style={{ color: "#173B32" }}
      >
        {label}
      </label>

      {children}
    </div>
  );
}

/* =========================================================
   DATE FILTER
========================================================= */

function getDateFilter(
  range,
  customStartDate,
  customEndDate
) {
  const now = new Date();

  if (range === "all") {
    return {
      start: null,
      end: null,
    };
  }

  if (range === "custom") {
    return {
      start: customStartDate || null,
      end: customEndDate || null,
    };
  }

  const today = toDateString(now);

  if (range === "today") {
    return {
      start: today,
      end: today,
    };
  }

  if (range === "week") {
    const day = now.getDay();

    const diffToMonday =
      day === 0 ? 6 : day - 1;

    const start = new Date(now);
    start.setDate(
      now.getDate() - diffToMonday
    );

    return {
      start: toDateString(start),
      end: today,
    };
  }

  if (range === "month") {
    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    return {
      start: toDateString(start),
      end: today,
    };
  }

  if (range === "year") {
    const start = new Date(
      now.getFullYear(),
      0,
      1
    );

    return {
      start: toDateString(start),
      end: today,
    };
  }

  return {
    start: null,
    end: null,
  };
}

function isDateInRange(
  value,
  filter
) {
  if (!filter.start && !filter.end) {
    return true;
  }

  if (!value) {
    return false;
  }

  const date = normalizeDate(value);

  if (!date) {
    return false;
  }

  if (
    filter.start &&
    date < filter.start
  ) {
    return false;
  }

  if (
    filter.end &&
    date > filter.end
  ) {
    return false;
  }

  return true;
}

function normalizeDate(value) {
  if (!value) {
    return null;
  }

  const stringValue = String(value);

  const match =
    stringValue.match(
      /^\d{4}-\d{2}-\d{2}/
    );

  if (match) {
    return match[0];
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return toDateString(date);
}

function toDateString(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================================================
   REPORT LABELS
========================================================= */

function getReportTitle(type) {
  const titles = {
    summary: "Financial Summary",
    payments: "Payments Report",
    outstanding: "Outstanding Report",
    expenses: "Expenses Report",
  };

  return titles[type] || "Billing Report";
}

function getDateRangeLabel(filter) {
  if (!filter.start && !filter.end) {
    return "All available records";
  }

  if (
    filter.start &&
    filter.end &&
    filter.start === filter.end
  ) {
    return formatDate(filter.start);
  }

  if (filter.start && filter.end) {
    return `${formatDate(
      filter.start
    )} — ${formatDate(filter.end)}`;
  }

  if (filter.start) {
    return `From ${formatDate(
      filter.start
    )}`;
  }

  return `Until ${formatDate(
    filter.end
  )}`;
}

function formatCategory(category) {
  if (!category) {
    return "Other";
  }

  return String(category)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

function formatAmount(value) {
  return Number(value || 0).toLocaleString(
    "en-PK",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
}

/* =========================================================
   INPUT STYLE
========================================================= */

const inputClass =
  "w-full rounded-xl border bg-[#fffdf8] px-3.5 py-2.5 text-sm text-[#173B32] outline-none transition placeholder:text-[#9aaa9f] focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#6f8f7d]/15";

export default BillingReportModal;