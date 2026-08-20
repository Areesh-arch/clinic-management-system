import { apiRequest } from "./api";

// CURRENT LOGGED-IN USER
export async function getCurrentUser() {
  return apiRequest("/auth/me", {
    method: "GET",
  });
}

// GET CLINIC / TENANT
export async function getTenant(tenantId) {
  return apiRequest(`/tenants/tenants/${tenantId}`, {
    method: "GET",
  });
}

// UPDATE CLINIC / TENANT
export async function updateTenant(tenantId, data) {
  return apiRequest(`/tenants/tenants/${tenantId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// UPDATE USER
export async function updateUser(userId, data) {
  return apiRequest(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// CHANGE PASSWORD
export async function changePassword(data) {
  return apiRequest("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}