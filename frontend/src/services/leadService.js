import { apiRequest } from "./api";

// =========================================================
// CRM / LEADS SERVICE
// =========================================================

const LEADS_ENDPOINT = "/crm/leads";

// =========================================================
// GET ALL LEADS
// =========================================================

export async function getLeads() {
  return apiRequest(`${LEADS_ENDPOINT}/`, {
    method: "GET",
  });
}

// =========================================================
// GET LEAD STATISTICS
// =========================================================

export async function getLeadStats() {
  return apiRequest(`${LEADS_ENDPOINT}/stats`, {
    method: "GET",
  });
}

// =========================================================
// GET SINGLE LEAD
// =========================================================

export async function getLead(id) {
  return apiRequest(`${LEADS_ENDPOINT}/${id}`, {
    method: "GET",
  });
}

// =========================================================
// CREATE LEAD
// =========================================================

export async function createLead(leadData) {
  return apiRequest(`${LEADS_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(leadData),
  });
}

// =========================================================
// UPDATE LEAD
// =========================================================

export async function updateLead(id, leadData) {
  return apiRequest(`${LEADS_ENDPOINT}/${id}`, {
    method: "PUT",
    body: JSON.stringify(leadData),
  });
}

// =========================================================
// DELETE LEAD
// =========================================================

export async function deleteLead(id) {
  return apiRequest(`${LEADS_ENDPOINT}/${id}`, {
    method: "DELETE",
  });
}