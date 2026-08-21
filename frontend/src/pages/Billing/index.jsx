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

// =====================================================
// BILLING PAGE
// =====================================================

function Billing() {
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

  // =====================================================
  // LOAD BILLING DATA
  // =====================================================

  useEffect(() => {
    loadBillingData();
  }, []);

  async function loadBillingData() {
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
      console.error("Failed to load billing:", err);

      setError(
        getErrorMessage(
          err,
          "Failed to load billing information."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // TOTALS
  // =====================================================

  const totalPaid = useMemo(() => {
    return payments.reduce(
      (sum, payment) => sum + Number(payment?.amount || 0),
      0
    );
  }, [payments]);

  const totalOutstanding = useMemo(() => {
    return outstanding.reduce(
      (sum, item) =>
        sum + Number(item?.outstanding_amount || 0),
      0
    );
  }, [outstanding]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (sum, expense) =>
        sum + Number(expense?.amount || 0),
      0
    );
  }, [expenses]);

  // =====================================================
  // ADD PAYMENT
  // =====================================================

  async function handleCreatePayment(formData) {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await createPayment({
        patient_id: Number(formData.patient_id),
        visit_id: Number(formData.visit_id),
        amount: Number(formData.amount),
        payment_method: formData.payment_method,
        payment_date: formData.payment_date,
        notes: formData.notes || null,
      });

      setShowPaymentModal(false);

      setSuccess("Payment recorded successfully.");

      await loadBillingData();
    } catch (err) {
      console.error("Failed to create payment:", err);

      setError(
        getErrorMessage(
          err,
          "Failed to record payment."
        )
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // ADD EXPENSE
  // =====================================================

  async function handleCreateExpense(formData) {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await createExpense({
        description: formData.description,
        amount: Number(formData.amount),
        expense_date: formData.expense_date,
        category: formData.category,
        notes: formData.notes || null,
      });

      setShowExpenseModal(false);

      setSuccess("Expense recorded successfully.");

      await loadBillingData();
    } catch (err) {
      console.error("Failed to create expense:", err);

      setError(
        getErrorMessage(
          err,
          "Failed to record expense."
        )
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // DELETE PAYMENT
  // =====================================================

  async function handleDeletePayment(payment) {
    const paymentId = payment?.id;

    if (!paymentId) {
      setError("Unable to delete this payment because its ID is missing.");
      return;
    }

    const patientName =
      getPatientNameById(payment.patient_id, patients);

    const confirmed = window.confirm(
      `Delete this payment?\n\n` +
        `Patient: ${patientName}\n` +
        `Amount: Rs. ${Number(
          payment.amount || 0
        ).toLocaleString()}\n\n` +
        `This action cannot be undone.`
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
        getErrorMessage(
          err,
          "Failed to delete payment."
        )
      );
    } finally {
      setDeletingPaymentId(null);
    }
  }

  // =====================================================
  // DELETE EXPENSE
  // =====================================================

  async function handleDeleteExpense(expense) {
    const expenseId = expense?.id;

    if (!expenseId) {
      setError("Unable to delete this expense because its ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      `Delete this expense?\n\n` +
        `Description: ${expense.description || "-"}\n` +
        `Amount: Rs. ${Number(
          expense.amount || 0
        ).toLocaleString()}\n\n` +
        `This action cannot be undone.`
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
        getErrorMessage(
          err,
          "Failed to delete expense."
        )
      );
    } finally {
      setDeletingExpenseId(null);
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#DCE7D8] border-t-[#6F9470]" />

            <div className="text-sm font-medium text-[#45524A]">
              Loading billing information...
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <Layout>
      <div className="w-full space-y-6">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C6A15B]" />

              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6F9470]">
                Clinic Accounts
              </span>
            </div>

            <h1 className="text-3xl font-bold text-[#25312A]">
              Billing & Accounts
            </h1>

            <p className="mt-2 text-[#7E867F]">
              Manage payments, outstanding balances and clinic
              expenses.
            </p>
          </div>

          {/* ACTION BUTTONS */}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccess("");
                setShowPaymentModal(true);
              }}
              className="
                rounded-xl
                bg-[#7FA67F]
                px-5
                py-3
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-[#6F9470]
                focus:outline-none
                focus:ring-2
                focus:ring-[#B7CDB3]
                focus:ring-offset-2
              "
            >
              + Add Payment
            </button>

            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccess("");
                setShowExpenseModal(true);
              }}
              className="
                rounded-xl
                border
                border-[#B8C9B8]
                bg-[#FCFBF8]
                px-5
                py-3
                font-semibold
                text-[#315340]
                transition
                hover:bg-[#F1F5F0]
                focus:outline-none
                focus:ring-2
                focus:ring-[#B7CDB3]
                focus:ring-offset-2
              "
            >
              + Add Expense
            </button>
          </div>
        </div>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (
          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-[#CFE0CA]
              bg-[#F0F6EE]
              px-4
              py-3
              text-[#315340]
            "
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7FA67F] text-sm font-bold text-white">
              ✓
            </span>

            <span>{success}</span>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="
              flex
              items-start
              gap-3
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-red-700
            "
          >
            <span className="font-bold">!</span>

            <span>{error}</span>
          </div>
        )}

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            title="Total Paid"
            value={`Rs. ${totalPaid.toLocaleString()}`}
          />

          <SummaryCard
            title="Outstanding"
            value={`Rs. ${totalOutstanding.toLocaleString()}`}
            danger={totalOutstanding > 0}
          />

          <SummaryCard
            title="Total Expenses"
            value={`Rs. ${totalExpenses.toLocaleString()}`}
          />
        </div>

        {/* =================================================
            RECENT PAYMENTS
        ================================================= */}

        <BillingSection
          title="Recent Payments"
          description="Payments received from patients."
          action={
            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccess("");
                setShowPaymentModal(true);
              }}
              className="
                rounded-lg
                bg-[#EEF5EC]
                px-4
                py-2
                text-sm
                font-semibold
                text-[#315340]
                transition
                hover:bg-[#E2EEDF]
              "
            >
              + Payment
            </button>
          }
        >
          {payments.length === 0 ? (
            <EmptyState message="No payments found." />
          ) : (
            <ResponsiveTable>
              <table className="w-full min-w-225">
                <thead>
                  <tr className="border-b border-[#E6E1D8] bg-[#FAF9F5] text-left text-sm text-[#7E867F]">
                    <th className="px-5 py-4 font-semibold">
                      Patient
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Visit
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Amount
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Method
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Date
                    </th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => {
                    const isDeleting =
                      deletingPaymentId === payment.id;

                    return (
                      <tr
                        key={payment.id}
                        className="
                          border-b
                          border-[#E6E1D8]
                          transition
                          last:border-b-0
                          hover:bg-[#FAFAF7]
                        "
                      >
                        {/* PATIENT */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E5EFE2] text-sm font-bold text-[#315340]">
                              {getPatientInitial(
                                getPatientNameById(
                                  payment.patient_id,
                                  patients
                                )
                              )}
                            </div>

                            <div>
                              <div className="font-semibold text-[#25312A]">
                                {getPatientNameById(
                                  payment.patient_id,
                                  patients
                                )}
                              </div>

                              <div className="text-xs text-[#9A9F99]">
                                Patient #{payment.patient_id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* VISIT */}

                        <td className="px-5 py-4 font-medium text-[#45524A]">
                          Visit #{payment.visit_id}
                        </td>

                        {/* AMOUNT */}

                        <td className="px-5 py-4 font-semibold text-[#23483A]">
                          Rs.{" "}
                          {Number(
                            payment.amount || 0
                          ).toLocaleString()}
                        </td>

                        {/* METHOD */}

                        <td className="px-5 py-4">
                          <span
                            className="
                              inline-flex
                              rounded-full
                              bg-[#F0F4ED]
                              px-3
                              py-1
                              text-xs
                              font-semibold
                              text-[#315340]
                            "
                          >
                            {formatPaymentMethod(
                              payment.payment_method
                            )}
                          </span>
                        </td>

                        {/* DATE */}

                        <td className="px-5 py-4 text-[#7E867F]">
                          {formatDate(
                            payment.payment_date
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              handleDeletePayment(payment)
                            }
                            disabled={isDeleting}
                            title="Delete payment"
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-lg
                              border
                              border-red-200
                              bg-red-50
                              px-3
                              py-2
                              text-sm
                              font-semibold
                              text-red-600
                              transition
                              hover:bg-red-100
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >
                            {isDeleting ? (
                              <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <TrashIcon />
                                Delete
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </ResponsiveTable>
          )}
        </BillingSection>

        {/* =================================================
            OUTSTANDING
        ================================================= */}

        <BillingSection
          title="Outstanding Payments"
          description="Patient balances that are still unpaid."
        >
          {outstanding.length === 0 ? (
            <EmptyState message="No outstanding payments." />
          ) : (
            <ResponsiveTable>
              <table className="w-full min-w-200">
                <thead>
                  <tr className="border-b border-[#E6E1D8] bg-[#FAF9F5] text-left text-sm text-[#7E867F]">
                    <th className="px-5 py-4 font-semibold">
                      Patient
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Visit
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Total Charge
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Paid
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Outstanding
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {outstanding.map((item) => (
                    <tr
                      key={item.id}
                      className="
                        border-b
                        border-[#E6E1D8]
                        transition
                        last:border-b-0
                        hover:bg-[#FAFAF7]
                      "
                    >
                      {/* PATIENT */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F2EBD9] text-sm font-bold text-[#8A6A2F]">
                            {getPatientInitial(
                              getPatientNameById(
                                item.patient_id,
                                patients
                              )
                            )}
                          </div>

                          <div>
                            <div className="font-semibold text-[#25312A]">
                              {getPatientNameById(
                                item.patient_id,
                                patients
                              )}
                            </div>

                            <div className="text-xs text-[#9A9F99]">
                              Patient #{item.patient_id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* VISIT */}

                      <td className="px-5 py-4 text-[#45524A]">
                        Visit #{item.visit_id}
                      </td>

                      {/* TOTAL */}

                      <td className="px-5 py-4">
                        Rs.{" "}
                        {Number(
                          item.total_charge || 0
                        ).toLocaleString()}
                      </td>

                      {/* PAID */}

                      <td className="px-5 py-4 font-medium text-[#23483A]">
                        Rs.{" "}
                        {Number(
                          item.total_paid || 0
                        ).toLocaleString()}
                      </td>

                      {/* OUTSTANDING */}

                      <td className="px-5 py-4 font-bold text-[#9A5B45]">
                        Rs.{" "}
                        {Number(
                          item.outstanding_amount || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ResponsiveTable>
          )}
        </BillingSection>

        {/* =================================================
            EXPENSES
        ================================================= */}

        <BillingSection
          title="Clinic Expenses"
          description="Expenses recorded for the clinic."
          action={
            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccess("");
                setShowExpenseModal(true);
              }}
              className="
                rounded-lg
                bg-[#EEF5EC]
                px-4
                py-2
                text-sm
                font-semibold
                text-[#315340]
                transition
                hover:bg-[#E2EEDF]
              "
            >
              + Expense
            </button>
          }
        >
          {expenses.length === 0 ? (
            <EmptyState message="No expenses found." />
          ) : (
            <ResponsiveTable>
              <table className="w-full min-w-200">
                <thead>
                  <tr className="border-b border-[#E6E1D8] bg-[#FAF9F5] text-left text-sm text-[#7E867F]">
                    <th className="px-5 py-4 font-semibold">
                      Description
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Category
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Amount
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Date
                    </th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {expenses.map((expense) => {
                    const isDeleting =
                      deletingExpenseId === expense.id;

                    return (
                      <tr
                        key={expense.id}
                        className="
                          border-b
                          border-[#E6E1D8]
                          transition
                          last:border-b-0
                          hover:bg-[#FAFAF7]
                        "
                      >
                        {/* DESCRIPTION */}

                        <td className="px-5 py-4">
                          <div className="font-semibold text-[#25312A]">
                            {expense.description || "-"}
                          </div>

                          {expense.notes && (
                            <div className="mt-1 max-w-xs truncate text-xs text-[#9A9F99]">
                              {expense.notes}
                            </div>
                          )}
                        </td>

                        {/* CATEGORY */}

                        <td className="px-5 py-4 text-[#45524A]">
                          {expense.category || "-"}
                        </td>

                        {/* AMOUNT */}

                        <td className="px-5 py-4 font-semibold text-[#23483A]">
                          Rs.{" "}
                          {Number(
                            expense.amount || 0
                          ).toLocaleString()}
                        </td>

                        {/* DATE */}

                        <td className="px-5 py-4 text-[#7E867F]">
                          {formatDate(
                            expense.expense_date
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteExpense(expense)
                            }
                            disabled={isDeleting}
                            title="Delete expense"
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-lg
                              border
                              border-red-200
                              bg-red-50
                              px-3
                              py-2
                              text-sm
                              font-semibold
                              text-red-600
                              transition
                              hover:bg-red-100
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >
                            {isDeleting ? (
                              <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <TrashIcon />
                                Delete
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </ResponsiveTable>
          )}
        </BillingSection>
      </div>

      {/* =================================================
          PAYMENT MODAL
      ================================================= */}

      {showPaymentModal && (
        <PaymentModal
          patients={patients}
          visits={visits}
          saving={saving}
          onClose={() => setShowPaymentModal(false)}
          onSubmit={handleCreatePayment}
        />
      )}

      {/* =================================================
          EXPENSE MODAL
      ================================================= */}

      {showExpenseModal && (
        <ExpenseModal
          saving={saving}
          onClose={() => setShowExpenseModal(false)}
          onSubmit={handleCreateExpense}
        />
      )}
    </Layout>
  );
}

// =====================================================
// PAYMENT MODAL
// =====================================================

function PaymentModal({
  patients,
  visits,
  saving,
  onClose,
  onSubmit,
}) {
  const [patientId, setPatientId] = useState("");
  const [visitId, setVisitId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState("cash");
  const [paymentDate, setPaymentDate] =
    useState(getToday());
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");

  // Filter visits according to patient

  const patientVisits = useMemo(() => {
    if (!patientId) {
      return [];
    }

    return visits.filter(
      (visit) =>
        Number(visit.patient_id) ===
        Number(patientId)
    );
  }, [patientId, visits]);

  function handlePatientChange(value) {
    setPatientId(value);
    setVisitId("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!patientId) {
      setFormError("Please select a patient.");
      return;
    }

    if (!visitId) {
      setFormError("Please select a visit.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setFormError(
        "Please enter a valid payment amount."
      );
      return;
    }

    if (!paymentDate) {
      setFormError(
        "Please select the payment date."
      );
      return;
    }

    onSubmit({
      patient_id: patientId,
      visit_id: visitId,
      amount,
      payment_method: paymentMethod,
      payment_date: paymentDate,
      notes,
    });
  }

  return (
    <Modal
      title="Add Payment"
      description="Record a payment received from a patient."
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {formError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        {/* PATIENT */}

        <FormField label="Patient">
          <select
            value={patientId}
            onChange={(e) =>
              handlePatientChange(
                e.target.value
              )
            }
            className="form-input"
          >
            <option value="">
              Select patient
            </option>

            {patients.map((patient) => (
              <option
                key={patient.id}
                value={patient.id}
              >
                {getPatientName(patient)}
              </option>
            ))}
          </select>
        </FormField>

        {/* VISIT */}

        <FormField label="Visit">
          <select
            value={visitId}
            onChange={(e) =>
              setVisitId(e.target.value)
            }
            disabled={!patientId}
            className="form-input disabled:bg-[#F1F1ED]"
          >
            <option value="">
              {patientId
                ? "Select visit"
                : "Select patient first"}
            </option>

            {patientVisits.map((visit) => (
              <option
                key={visit.id}
                value={visit.id}
              >
                {getVisitLabel(visit)}
              </option>
            ))}
          </select>
        </FormField>

        {/* AMOUNT */}

        <FormField label="Amount">
          <div className="relative">
            <span
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-sm
                font-medium
                text-[#7E867F]
              "
            >
              Rs.
            </span>

            <input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              placeholder="3000"
              className="form-input pl-12"
            />
          </div>
        </FormField>

        {/* PAYMENT METHOD */}

        <FormField label="Payment Method">
          <select
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(
                e.target.value
              )
            }
            className="form-input"
          >
            <option value="cash">
              Cash
            </option>

            <option value="card">
              Card
            </option>

            <option value="bank_transfer">
              Bank Transfer
            </option>

            <option value="mobile_wallet">
              Mobile Wallet
            </option>
          </select>
        </FormField>

        {/* DATE */}

        <FormField label="Payment Date">
          <input
            type="date"
            value={paymentDate}
            onChange={(e) =>
              setPaymentDate(
                e.target.value
              )
            }
            className="form-input"
          />
        </FormField>

        {/* NOTES */}

        <FormField
          label="Notes"
          optional
        >
          <textarea
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            placeholder="Optional payment notes..."
            rows="3"
            className="form-input resize-none"
          />
        </FormField>

        {/* ACTIONS */}

        <ModalActions
          saving={saving}
          onCancel={onClose}
          submitText="Save Payment"
        />
      </form>
    </Modal>
  );
}

// =====================================================
// EXPENSE MODAL
// =====================================================

function ExpenseModal({
  saving,
  onClose,
  onSubmit,
}) {
  const [description, setDescription] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [expenseDate, setExpenseDate] =
    useState(getToday());

  const [notes, setNotes] = useState("");

  const [formError, setFormError] =
    useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!description.trim()) {
      setFormError(
        "Please enter an expense description."
      );
      return;
    }

    if (!category.trim()) {
      setFormError(
        "Please enter an expense category."
      );
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setFormError(
        "Please enter a valid expense amount."
      );
      return;
    }

    if (!expenseDate) {
      setFormError(
        "Please select the expense date."
      );
      return;
    }

    onSubmit({
      description: description.trim(),
      category: category.trim(),
      amount,
      expense_date: expenseDate,
      notes,
    });
  }

  return (
    <Modal
      title="Add Clinic Expense"
      description="Record an expense paid by the clinic."
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {formError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        {/* DESCRIPTION */}

        <FormField label="Description">
          <input
            type="text"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="Medical supplies"
            className="form-input"
          />
        </FormField>

        {/* CATEGORY */}

        <FormField label="Category">
          <input
            type="text"
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
            placeholder="Supplies"
            className="form-input"
          />
        </FormField>

        {/* AMOUNT */}

        <FormField label="Amount">
          <div className="relative">
            <span
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-sm
                font-medium
                text-[#7E867F]
              "
            >
              Rs.
            </span>

            <input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              placeholder="5000"
              className="form-input pl-12"
            />
          </div>
        </FormField>

        {/* DATE */}

        <FormField label="Expense Date">
          <input
            type="date"
            value={expenseDate}
            onChange={(e) =>
              setExpenseDate(
                e.target.value
              )
            }
            className="form-input"
          />
        </FormField>

        {/* NOTES */}

        <FormField
          label="Notes"
          optional
        >
          <textarea
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            placeholder="Optional expense notes..."
            rows="3"
            className="form-input resize-none"
          />
        </FormField>

        {/* ACTIONS */}

        <ModalActions
          saving={saving}
          onCancel={onClose}
          submitText="Save Expense"
        />
      </form>
    </Modal>
  );
}

// =====================================================
// MODAL
// =====================================================

function Modal({
  title,
  description,
  onClose,
  children,
}) {
  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-[#1D2A23]/45
        p-4
        backdrop-blur-[2px]
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          max-h-[90vh]
          w-full
          max-w-lg
          overflow-y-auto
          rounded-2xl
          border
          border-[#E6E1D8]
          bg-[#FCFBF8]
          shadow-2xl
        "
      >
        {/* MODAL HEADER */}

        <div
          className="
            flex
            items-start
            justify-between
            border-b
            border-[#E6E1D8]
            bg-[#FAF9F5]
            px-6
            py-5
          "
        >
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-6 rounded-full bg-[#C6A15B]" />
            </div>

            <h2 className="text-xl font-bold text-[#25312A]">
              {title}
            </h2>

            <p className="mt-1 text-sm text-[#7E867F]">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              ml-4
              rounded-lg
              px-2
              py-1
              text-xl
              text-[#7E867F]
              transition
              hover:bg-[#F0F2EE]
              hover:text-[#25312A]
            "
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* MODAL CONTENT */}

        <div className="px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// FORM FIELD
// =====================================================

function FormField({
  label,
  optional = false,
  children,
}) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-semibold text-[#45524A]">
        {label}

        {optional && (
          <span className="ml-1 font-normal text-[#9A9F99]">
            (optional)
          </span>
        )}
      </div>

      {children}
    </label>
  );
}

// =====================================================
// MODAL ACTIONS
// =====================================================

function ModalActions({
  saving,
  onCancel,
  submitText,
}) {
  return (
    <div
      className="
        flex
        flex-col-reverse
        gap-3
        border-t
        border-[#E6E1D8]
        pt-5
        sm:flex-row
        sm:justify-end
      "
    >
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="
          rounded-xl
          border
          border-[#D9D8D1]
          px-5
          py-3
          font-medium
          text-[#45524A]
          transition
          hover:bg-[#F1F2EE]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={saving}
        className="
          rounded-xl
          bg-[#7FA67F]
          px-5
          py-3
          font-semibold
          text-white
          shadow-sm
          transition
          hover:bg-[#6F9470]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {saving ? "Saving..." : submitText}
      </button>
    </div>
  );
}

// =====================================================
// BILLING SECTION
// =====================================================

function BillingSection({
  title,
  description,
  action,
  children,
}) {
  return (
    <section
      className="
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-[#E6E1D8]
        bg-[#FCFBF8]
        shadow-sm
      "
    >
      <div
        className="
          flex
          flex-col
          gap-3
          border-b
          border-[#E6E1D8]
          px-5
          py-5
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h2 className="text-xl font-semibold text-[#25312A]">
            {title}
          </h2>

          <p className="mt-1 text-sm text-[#7E867F]">
            {description}
          </p>
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

// =====================================================
// RESPONSIVE TABLE
// =====================================================

function ResponsiveTable({ children }) {
  return (
    <div className="w-full overflow-x-auto">
      {children}
    </div>
  );
}

// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  title,
  value,
  danger = false,
}) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-[#E6E1D8]
        bg-[#FCFBF8]
        p-5
        shadow-sm
      "
    >
      <div className="absolute right-0 top-0 h-1 w-20 bg-[#C6A15B]" />

      <p className="text-sm font-medium text-[#7E867F]">
        {title}
      </p>

      <p
        className={`
          mt-3
          text-2xl
          font-bold
          ${
            danger
              ? "text-[#9A5B45]"
              : "text-[#23483A]"
          }
        `}
      >
        {value}
      </p>
    </div>
  );
}

// =====================================================
// EMPTY STATE
// =====================================================

function EmptyState({ message }) {
  return (
    <div className="px-5 py-12 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F4ED] text-[#6F9470]">
        —
      </div>

      <div className="text-sm text-[#8C938D]">
        {message}
      </div>
    </div>
  );
}

// =====================================================
// TRASH ICON
// =====================================================

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 6h18"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 6l-1 14a2 2 0 0 1-2 1H8a2 2 0 0 1-2-1L5 6"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 10v7M14 10v7"
      />
    </svg>
  );
}

// =====================================================
// HELPERS
// =====================================================

function getToday() {
  const today = new Date();

  return today.toISOString().split("T")[0];
}

// =====================================================
// PATIENT NAME
// =====================================================

function getPatientName(patient) {
  if (!patient) {
    return "Unknown Patient";
  }

  if (patient.full_name) {
    return patient.full_name;
  }

  if (patient.name) {
    return patient.name;
  }

  const firstName = patient.first_name || "";
  const lastName = patient.last_name || "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  if (fullName) {
    return fullName;
  }

  return `Patient #${patient.id}`;
}

// =====================================================
// FIND PATIENT NAME BY ID
// =====================================================

function getPatientNameById(
  patientId,
  patients
) {
  const patient = patients.find(
    (item) =>
      Number(item.id) === Number(patientId)
  );

  if (patient) {
    return getPatientName(patient);
  }

  return `Patient #${patientId}`;
}

// =====================================================
// PATIENT INITIAL
// =====================================================

function getPatientInitial(name) {
  if (!name) {
    return "?";
  }

  return name
    .trim()
    .charAt(0)
    .toUpperCase();
}

// =====================================================
// VISIT LABEL
// =====================================================

function getVisitLabel(visit) {
  if (visit.diagnosis) {
    return `Visit #${visit.id} — ${visit.diagnosis}`;
  }

  if (visit.visit_time) {
    return `Visit #${visit.id} — ${visit.visit_time}`;
  }

  if (visit.visit_date) {
    return `Visit #${visit.id} — ${visit.visit_date}`;
  }

  return `Visit #${visit.id}`;
}

// =====================================================
// PAYMENT METHOD
// =====================================================

function formatPaymentMethod(method) {
  if (!method) {
    return "-";
  }

  return method
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(date) {
  if (!date) {
    return "-";
  }

  try {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  } catch {
    return date;
  }
}

// =====================================================
// ERROR MESSAGE
// =====================================================

function getErrorMessage(
  error,
  fallback
) {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  if (error.detail) {
    if (typeof error.detail === "string") {
      return error.detail;
    }

    try {
      return JSON.stringify(error.detail);
    } catch {
      return fallback;
    }
  }

  return fallback;
}

// =====================================================
// EXPORT
// =====================================================

export default Billing;