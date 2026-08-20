import { useEffect, useState } from "react";

import Layout from "../../components/layout/Layout";

import {
  getPayments,
  getExpenses,
  getAllOutstanding,
} from "../../services/invoiceService";

function Billing() {
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [outstanding, setOutstanding] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      ] = await Promise.all([
        getPayments(),
        getExpenses(),
        getAllOutstanding(),
      ]);

      setPayments(paymentsData || []);
      setExpenses(expensesData || []);
      setOutstanding(outstandingData || []);
    } catch (err) {
      console.error("Failed to load billing:", err);

      setError(
        err?.message ||
          "Failed to load billing information."
      );
    } finally {
      setLoading(false);
    }
  }

  const totalPaid = payments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount || 0),
    0
  );

  const totalOutstanding = outstanding.reduce(
    (sum, item) =>
      sum + Number(item.outstanding_amount || 0),
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount || 0),
    0
  );

  if (loading) {
    return (
      <Layout>
        <div className="rounded-2xl border border-[#E6E1D8] bg-[#FCFBF8] p-8 text-[#45524A]">
          Loading billing information...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div>
          <h1 className="text-3xl font-bold text-[#25312A]">
            Billing & Accounts
          </h1>

          <p className="mt-2 text-[#7E867F]">
            Manage payments, outstanding balances and clinic expenses.
          </p>
        </div>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* ================================================= */}
        {/* SUMMARY CARDS */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          <SummaryCard
            title="Total Paid"
            value={`Rs. ${totalPaid.toLocaleString()}`}
          />

          <SummaryCard
            title="Outstanding"
            value={`Rs. ${totalOutstanding.toLocaleString()}`}
          />

          <SummaryCard
            title="Total Expenses"
            value={`Rs. ${totalExpenses.toLocaleString()}`}
          />

        </div>

        {/* ================================================= */}
        {/* PAYMENTS */}
        {/* ================================================= */}

        <section className="rounded-2xl border border-[#E6E1D8] bg-[#FCFBF8] shadow-sm">

          <div className="border-b border-[#E6E1D8] px-6 py-5">
            <h2 className="text-xl font-semibold text-[#25312A]">
              Recent Payments
            </h2>

            <p className="mt-1 text-sm text-[#7E867F]">
              Payments received from patients.
            </p>
          </div>

          {payments.length === 0 ? (
            <EmptyState message="No payments found." />
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b border-[#E6E1D8] text-left text-sm text-[#7E867F]">

                    <th className="px-6 py-4">
                      Patient
                    </th>

                    <th className="px-6 py-4">
                      Visit
                    </th>

                    <th className="px-6 py-4">
                      Amount
                    </th>

                    <th className="px-6 py-4">
                      Method
                    </th>

                    <th className="px-6 py-4">
                      Date
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-[#E6E1D8] last:border-b-0"
                    >

                      <td className="px-6 py-4 text-[#25312A]">
                        Patient #{payment.patient_id}
                      </td>

                      <td className="px-6 py-4 text-[#45524A]">
                        Visit #{payment.visit_id}
                      </td>

                      <td className="px-6 py-4 font-semibold text-[#23483A]">
                        Rs.{" "}
                        {Number(
                          payment.amount
                        ).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 capitalize text-[#45524A]">
                        {payment.payment_method}
                      </td>

                      <td className="px-6 py-4 text-[#7E867F]">
                        {payment.payment_date}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* ================================================= */}
        {/* OUTSTANDING */}
        {/* ================================================= */}

        <section className="rounded-2xl border border-[#E6E1D8] bg-[#FCFBF8] shadow-sm">

          <div className="border-b border-[#E6E1D8] px-6 py-5">

            <h2 className="text-xl font-semibold text-[#25312A]">
              Outstanding Payments
            </h2>

            <p className="mt-1 text-sm text-[#7E867F]">
              Patient balances that are still unpaid.
            </p>

          </div>

          {outstanding.length === 0 ? (
            <EmptyState message="No outstanding payments." />
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-[#E6E1D8] text-left text-sm text-[#7E867F]">

                    <th className="px-6 py-4">
                      Patient
                    </th>

                    <th className="px-6 py-4">
                      Visit
                    </th>

                    <th className="px-6 py-4">
                      Total Charge
                    </th>

                    <th className="px-6 py-4">
                      Paid
                    </th>

                    <th className="px-6 py-4">
                      Outstanding
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {outstanding.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#E6E1D8] last:border-b-0"
                    >

                      <td className="px-6 py-4 text-[#25312A]">
                        Patient #{item.patient_id}
                      </td>

                      <td className="px-6 py-4 text-[#45524A]">
                        Visit #{item.visit_id}
                      </td>

                      <td className="px-6 py-4">
                        Rs.{" "}
                        {Number(
                          item.total_charge
                        ).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-[#23483A]">
                        Rs.{" "}
                        {Number(
                          item.total_paid
                        ).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 font-semibold text-[#9A5B45]">
                        Rs.{" "}
                        {Number(
                          item.outstanding_amount
                        ).toLocaleString()}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* ================================================= */}
        {/* EXPENSES */}
        {/* ================================================= */}

        <section className="rounded-2xl border border-[#E6E1D8] bg-[#FCFBF8] shadow-sm">

          <div className="border-b border-[#E6E1D8] px-6 py-5">

            <h2 className="text-xl font-semibold text-[#25312A]">
              Clinic Expenses
            </h2>

            <p className="mt-1 text-sm text-[#7E867F]">
              Expenses recorded for the clinic.
            </p>

          </div>

          {expenses.length === 0 ? (
            <EmptyState message="No expenses found." />
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-[#E6E1D8] text-left text-sm text-[#7E867F]">

                    <th className="px-6 py-4">
                      Description
                    </th>

                    <th className="px-6 py-4">
                      Category
                    </th>

                    <th className="px-6 py-4">
                      Amount
                    </th>

                    <th className="px-6 py-4">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {expenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-b border-[#E6E1D8] last:border-b-0"
                    >

                      <td className="px-6 py-4 text-[#25312A]">
                        {expense.description}
                      </td>

                      <td className="px-6 py-4 text-[#45524A]">
                        {expense.category}
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        Rs.{" "}
                        {Number(
                          expense.amount
                        ).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-[#7E867F]">
                        {expense.expense_date}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>
    </Layout>
  );
}


// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-[#E6E1D8] bg-[#FCFBF8] p-6 shadow-sm">

      <p className="text-sm font-medium text-[#7E867F]">
        {title}
      </p>

      <p className="mt-3 text-2xl font-bold text-[#23483A]">
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
    <div className="px-6 py-10 text-center text-[#8C938D]">
      {message}
    </div>
  );
}

export default Billing;