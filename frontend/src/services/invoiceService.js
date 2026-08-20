import { apiRequest } from "./api";

// =====================================================
// PAYMENTS
// =====================================================

export async function getPayments() {
  return apiRequest("/payments/payments/", {
    method: "GET",
  });
}

export async function getPayment(paymentId) {
  return apiRequest(`/payments/payments/${paymentId}`, {
    method: "GET",
  });
}

export async function createPayment(data) {
  return apiRequest("/payments/payments/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePayment(paymentId, data) {
  return apiRequest(`/payments/payments/${paymentId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deletePayment(paymentId) {
  return apiRequest(`/payments/payments/${paymentId}`, {
    method: "DELETE",
  });
}

// =====================================================
// EXPENSES
// =====================================================

export async function getExpenses() {
  return apiRequest("/expenses/expenses/", {
    method: "GET",
  });
}

export async function createExpense(data) {
  return apiRequest("/expenses/expenses/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateExpense(expenseId, data) {
  return apiRequest(`/expenses/expenses/${expenseId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteExpense(expenseId) {
  return apiRequest(`/expenses/expenses/${expenseId}`, {
    method: "DELETE",
  });
}

// =====================================================
// OUTSTANDING
// =====================================================

export async function getOutstanding() {
  return apiRequest("/outstanding/outstanding/", {
    method: "GET",
  });
}

export async function getAllOutstanding() {
  return apiRequest("/outstanding/outstanding/all", {
    method: "GET",
  });
}

export async function getOutstandingById(outstandingId) {
  return apiRequest(
    `/outstanding/outstanding/${outstandingId}`,
    {
      method: "GET",
    }
  );
}

export async function getVisitOutstanding(visitId) {
  return apiRequest(
    `/outstanding/outstanding/visit/${visitId}`,
    {
      method: "GET",
    }
  );
}