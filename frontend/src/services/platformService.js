import { apiRequest } from "./api";

// ============================================================
// PLATFORM OVERVIEW
// ============================================================

export async function getPlatformOverview() {
  console.log("PLATFORM OVERVIEW REQUEST STARTED");

  const response = await apiRequest(
    "/platform/overview"
  );

  console.log(
    "PLATFORM OVERVIEW RESPONSE:",
    response
  );

  return response;
}

// ============================================================
// SUPER ADMIN MANAGEMENT
// ============================================================

export async function getPlatformAdmins() {
  return apiRequest("/platform/admins");
}

export async function createPlatformAdmin(data) {
  return apiRequest("/platform/admins", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePlatformAdmin(
  userId,
  data
) {
  return apiRequest(
    `/platform/admins/${userId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export async function deletePlatformAdmin(
  userId
) {
  return apiRequest(
    `/platform/admins/${userId}`,
    {
      method: "DELETE",
    }
  );
}