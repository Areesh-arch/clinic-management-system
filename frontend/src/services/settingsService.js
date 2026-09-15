import { apiRequest } from "./api";


// ============================================================
// CURRENT LOGGED-IN USER
// ============================================================

export async function getCurrentUser() {
  return apiRequest("/auth/me", {
    method: "GET",
  });
}


// ============================================================
// TENANT / CLINIC
// SUPER_ADMIN uses the selected tenant from the frontend.
// ============================================================

export async function getTenant(tenantId) {
  return apiRequest(`/tenants/${tenantId}`, {
    method: "GET",
  });
}


export async function updateTenant(
  tenantId,
  data
) {
  return apiRequest(`/tenants/${tenantId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}


// ============================================================
// USER
// ============================================================

export async function updateUser(
  userId,
  data
) {
  return apiRequest(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}


// ============================================================
// PERSONAL PROFILE IMAGE
// This updates the logged-in user's own profile picture.
// ============================================================

export async function uploadProfileImage(
  file
) {
  const formData = new FormData();

  formData.append(
    "image",
    file
  );

  return apiRequest(
    "/auth/profile-image",
    {
      method: "POST",
      body: formData,
    }
  );
}


// ============================================================
// REMOVE PERSONAL PROFILE IMAGE
// ============================================================

export async function removeProfileImage() {
  return apiRequest(
    "/auth/profile-image",
    {
      method: "DELETE",
    }
  );
}


// ============================================================
// CLINIC / TENANT PROFILE IMAGE
// SUPER_ADMIN uploads the image for the SELECTED CLINIC.
// This does NOT update the SUPER_ADMIN's personal image.
// ============================================================

export async function uploadClinicProfileImage(
  tenantId,
  file
) {
  const formData = new FormData();

  formData.append(
    "image",
    file
  );

  return apiRequest(
    `/tenants/${tenantId}/profile-image`,
    {
      method: "POST",
      body: formData,
    }
  );
}


// ============================================================
// CHANGE PASSWORD
// ============================================================

export async function changePassword(
  data
) {
  return apiRequest(
    "/auth/change-password",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}