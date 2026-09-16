import { useEffect, useMemo, useState } from "react";

import Layout from "../../components/layout/Layout";

import {
  getPayments,
  createPayment,
  deletePayment,
  getExpenses,
  createExpense,
  deleteExpense,
  getAllOutstanding,
} from "../../services/invoiceService";

import { getPatients } from "../../services/patientService";
import { getTreatments } from "../../services/treatmentService";

import BillingHeader from "../../components/billing/BillingHeader";
import BillingSummary from "../../components/billing/BillingSummary";
import PaymentsSection from "../../components/billing/PaymentsSection";
import OutstandingSection from "../../components/billing/OutstandingSection";
import ExpensesSection from "../../components/billing/ExpensesSection";
import PaymentModal from "../../components/billing/PaymentModal";
import ExpenseModal from "../../components/billing/ExpenseModal";
import BillingReportModal from "../../components/billing/BillingReportModal";

import { getErrorMessage } from "../../components/billing/billingUtils";

function Billing() {
  // ============================================================
  // STATE
  // ============================================================

  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [outstanding, setOutstanding] = useState([]);
  const [patients, setPatients] = useState([]);
  const [visits, setVisits] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [deletingPaymentId, setDeletingPaymentId] = useState(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // ============================================================
  // LOAD BILLING DATA
  // ============================================================

  const loadBillingData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        paymentsData,
        expensesData,
        outstandingData,
        patientsData,
        visitsData,
      ] = await Promise.all([
        getPayments(),
        getExpenses(),
        getAllOutstanding(),
        getPatients(),
        getTreatments(),
      ]);

      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      setExpenses(Array.isArray(expensesData) ? expensesData : []);
      setOutstanding(
        Array.isArray(outstandingData) ? outstandingData : []
      );
      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setVisits(Array.isArray(visitsData) ? visitsData : []);
    } catch (err) {
      console.error("Failed to load billing data:", err);
      setError(
        getErrorMessage(err, "Failed to load billing data.")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillingData();
  }, []);

  // ============================================================
  // SUMMARY TOTALS
  // ============================================================

  const totalPaid = useMemo(() => {
    return payments.reduce(
      (sum, payment) => sum + Number(payment?.amount || 0),
      0
    );
  }, [payments]);

  const totalOutstanding = useMemo(() => {
    return outstanding.reduce((sum, item) => {
      const value =
        item?.outstanding_amount ??
        item?.outstanding ??
        0;

      return sum + Number(value || 0);
    }, 0);
  }, [outstanding]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (sum, expense) => sum + Number(expense?.amount || 0),
      0
    );
  }, [expenses]);

  // ============================================================
  // PAYMENT
  // ============================================================

  const handleCreatePayment = async (formData) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        patient_id: Number(formData.patient_id),
        visit_id: Number(formData.visit_id),
        amount: Number(formData.amount),
        payment_method: formData.payment_method,
        payment_date: formData.payment_date,
        notes: formData.notes || null,
      };

      await createPayment(payload);

      setShowPaymentModal(false);
      setSuccess("Payment recorded successfully.");

      await loadBillingData();
    } catch (err) {
      console.error("Failed to create payment:", err);
      setError(
        getErrorMessage(err, "Failed to record payment.")
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // EXPENSE
  // ============================================================

  const handleCreateExpense = async (formData) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        description: formData.description,
        amount: Number(formData.amount),
        expense_date: formData.expense_date,
        category: formData.category,
        notes: formData.notes || null,
      };

      await createExpense(payload);

      setShowExpenseModal(false);
      setSuccess("Expense recorded successfully.");

      await loadBillingData();
    } catch (err) {
      console.error("Failed to create expense:", err);
      setError(
        getErrorMessage(err, "Failed to record expense.")
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DELETE PAYMENT
  // ============================================================

  const handleDeletePayment = async (payment) => {
    const paymentId = payment?.id;

    if (!paymentId) {
      setError("Unable to delete this payment.");
      return;
    }

    const patientName =
      payment?.patient_name ||
      payment?.patient?.name ||
      "this patient";

    const amount = Number(payment?.amount || 0).toLocaleString(
      "en-PK",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

    const confirmed = window.confirm(
      `Delete payment of Rs. ${amount} for ${patientName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingPaymentId(paymentId);
      setError("");
      setSuccess("");

      await deletePayment(paymentId);

      setSuccess("Payment deleted successfully.");

      await loadBillingData();
    } catch (err) {
      console.error("Failed to delete payment:", err);
      setError(
        getErrorMessage(err, "Failed to delete payment.")
      );
    } finally {
      setDeletingPaymentId(null);
    }
  };

  // ============================================================
  // DELETE EXPENSE
  // ============================================================

  const handleDeleteExpense = async (expense) => {
    const expenseId = expense?.id;

    if (!expenseId) {
      setError("Unable to delete this expense.");
      return;
    }

    const description =
      expense?.description || "this expense";

    const amount = Number(expense?.amount || 0).toLocaleString(
      "en-PK",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

    const confirmed = window.confirm(
      `Delete expense "${description}" of Rs. ${amount}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingExpenseId(expenseId);
      setError("");
      setSuccess("");

      await deleteExpense(expenseId);

      setSuccess("Expense deleted successfully.");

      await loadBillingData();
    } catch (err) {
      console.error("Failed to delete expense:", err);
      setError(
        getErrorMessage(err, "Failed to delete expense.")
      );
    } finally {
      setDeletingExpenseId(null);
    }
  };

  // ============================================================
  // OPEN MODALS
  // ============================================================

  const openPaymentModal = () => {
    setError("");
    setSuccess("");
    setShowPaymentModal(true);
  };

  const openExpenseModal = () => {
    setError("");
    setSuccess("");
    setShowExpenseModal(true);
  };

  const openReportModal = () => {
    setError("");
    setSuccess("");
    setShowReportModal(true);
  };

  // ============================================================
  // CLOSE MODALS
  // ============================================================

  const closePaymentModal = () => {
    if (!saving) {
      setShowPaymentModal(false);
    }
  };

  const closeExpenseModal = () => {
    if (!saving) {
      setShowExpenseModal(false);
    }
  };

  const closeReportModal = () => {
    setShowReportModal(false);
  };

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return (
      <Layout>
        <div
          className="flex min-h-[70vh] items-center justify-center px-4"
          style={{ backgroundColor: "#f7f3e9" }}
        >
          <div className="text-center">
            <div
              className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4"
              style={{
                borderColor: "rgba(23,59,50,0.15)",
                borderTopColor: "#173B32",
              }}
            />

            <p
              className="text-sm font-medium"
              style={{ color: "#173B32" }}
            >
              Loading billing data...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <Layout>
      <div
        className="min-h-full px-4 py-5 sm:px-6 lg:px-8"
        style={{ backgroundColor: "#f7f3e9" }}
      >
        <div className="mx-auto max-w-[1600px]">
          {/* HEADER */}
          <BillingHeader
            onAddPayment={openPaymentModal}
            onAddExpense={openExpenseModal}
            onReport={openReportModal}
          />

          {/* ERROR */}
          {error && (
            <div
              className="mb-5 flex items-start justify-between gap-4 rounded-2xl border px-4 py-3 text-sm"
              style={{
                borderColor: "rgba(180, 70, 70, 0.22)",
                backgroundColor: "#fff8f6",
                color: "#9f3f3f",
              }}
            >
              <div>
                <p className="font-semibold">
                  Something went wrong
                </p>
                <p className="mt-1">{error}</p>
              </div>

              <button
                type="button"
                onClick={() => setError("")}
                className="shrink-0 text-lg font-bold leading-none"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div
              className="mb-5 flex items-start justify-between gap-4 rounded-2xl border px-4 py-3 text-sm"
              style={{
                borderColor: "rgba(23, 59, 50, 0.18)",
                backgroundColor: "#f5faf6",
                color: "#173B32",
              }}
            >
              <div>
                <p className="font-semibold">Success</p>
                <p className="mt-1">{success}</p>
              </div>

              <button
                type="button"
                onClick={() => setSuccess("")}
                className="shrink-0 text-lg font-bold leading-none"
                aria-label="Dismiss success message"
              >
                ×
              </button>
            </div>
          )}

          {/* SUMMARY */}
          <BillingSummary
            totalPaid={totalPaid}
            totalOutstanding={totalOutstanding}
            totalExpenses={totalExpenses}
          />

          {/* PAYMENTS */}
          <PaymentsSection
            payments={payments}
            patients={patients}
            onAdd={openPaymentModal}
            onDelete={handleDeletePayment}
            deletingPaymentId={deletingPaymentId}
          />

          {/* OUTSTANDING */}
          <OutstandingSection
            outstanding={outstanding}
            patients={patients}
          />

          {/* EXPENSES */}
          <ExpensesSection
            expenses={expenses}
            onAdd={openExpenseModal}
            onDelete={handleDeleteExpense}
            deletingExpenseId={deletingExpenseId}
          />

          {/* PAYMENT MODAL */}
      

          <PaymentModal
            open={showPaymentModal}
            onClose={closePaymentModal}
            onSubmit={handleCreatePayment}
            patients={patients}
            visits={visits}
            payments={payments}
            saving={saving}
        />

          {/* EXPENSE MODAL */}
          <ExpenseModal
            open={showExpenseModal}
            onClose={closeExpenseModal}
            onSubmit={handleCreateExpense}
            saving={saving}
          />

          {/* REPORT MODAL */}
          <BillingReportModal
            open={showReportModal}
            onClose={closeReportModal}
            payments={payments}
            expenses={expenses}
            outstanding={outstanding}
            patients={patients}
            visits={visits}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Billing;