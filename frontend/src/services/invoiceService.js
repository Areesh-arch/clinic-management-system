
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

// Archive payment
export async function archivePayment(paymentId) {
  return apiRequest(`/payments/payments/${paymentId}/archive`, {
    method: "POST",
  });
}

// Keep old function working.
// Existing Billing code can still call deletePayment(),
// but it now archives instead of permanently deleting.
export async function deletePayment(paymentId) {
  return archivePayment(paymentId);
}

// Get archived payments
export async function getArchivedPayments() {
  return apiRequest("/payments/payments/archived", {
    method: "GET",
  });
}

// Restore archived payment
export async function restorePayment(paymentId) {
  return apiRequest(`/payments/payments/${paymentId}/restore`, {
    method: "POST",
  });
}

// Permanently delete an archived payment
export async function permanentlyDeletePayment(paymentId) {
  return apiRequest(`/payments/payments/${paymentId}/permanent`, {
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

// Archive expense
export async function archiveExpense(expenseId) {
  return apiRequest(`/expenses/expenses/${expenseId}/archive`, {
    method: "POST",
  });
}

// Keep old function working.
// Existing Billing code can still call deleteExpense(),
// but it now archives instead of permanently deleting.
export async function deleteExpense(expenseId) {
  return archiveExpense(expenseId);
}

// Get archived expenses
export async function getArchivedExpenses() {
  return apiRequest("/expenses/expenses/archived", {
    method: "GET",
  });
}

// Restore archived expense
export async function restoreExpense(expenseId) {
  return apiRequest(`/expenses/expenses/${expenseId}/restore`, {
    method: "POST",
  });
}

// Permanently delete an archived expense
export async function permanentlyDeleteExpense(expenseId) {
  return apiRequest(`/expenses/expenses/${expenseId}/permanent`, {
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
