import { apiRequest } from "./api";

/*
 * ============================================================
 * TENANT SERVICE
 * ============================================================
 *
 * Tenant management is a SUPER ADMIN feature.
 *
 * These endpoints manage clinics registered on the
 * SaaS platform.
 */

/**
 * Get all tenants / clinics.
 */
export async function getTenants() {
  return apiRequest("/tenants/");
}

/**
 * Get one tenant / clinic.
 */
export async function getTenant(tenantId) {
  return apiRequest(`/tenants/${tenantId}`);
}

/**
 * Create a new clinic.
 *
 * Backend also creates:
 * - trial subscription
 * - owner account
 */
export async function createTenant(data) {
  return apiRequest("/tenants/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update clinic information.
 */
export async function updateTenant(tenantId, data) {
  return apiRequest(`/tenants/${tenantId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a clinic.
 */
export async function deleteTenant(tenantId) {
  return apiRequest(`/tenants/${tenantId}`, {
    method: "DELETE",
  });
}