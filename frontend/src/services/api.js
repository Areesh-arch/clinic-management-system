import {
  refreshAccessToken,
} from "./authService";


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";


let refreshPromise = null;


// =========================================================
// TOKEN
// =========================================================

function getAccessToken() {
  return (
    localStorage.getItem(
      "access_token"
    ) ||
    sessionStorage.getItem(
      "access_token"
    )
  );
}


// =========================================================
// REQUEST
// =========================================================

export async function apiRequest(
  endpoint,
  options = {},
  retry = true
) {
  const token =
    getAccessToken();

  const selectedTenantId =
    localStorage.getItem(
      "selected_tenant_id"
    );

  const headers = {
    ...(options.headers || {}),
  };


  // -------------------------------------------------------
  // JSON CONTENT TYPE
  // -------------------------------------------------------

  if (
    !(options.body instanceof FormData) &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] =
      "application/json";
  }


  // -------------------------------------------------------
  // AUTHORIZATION
  // -------------------------------------------------------

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }


  // -------------------------------------------------------
  // TENANT
  // -------------------------------------------------------

  if (selectedTenantId) {
    headers["X-Tenant-ID"] =
      selectedTenantId;
  }


  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );


  // =======================================================
  // ACCESS TOKEN EXPIRED
  // =======================================================

  if (
    response.status === 401 &&
    retry &&
    endpoint !== "/auth/login" &&
    endpoint !== "/auth/refresh"
  ) {
    try {

      // ---------------------------------------------------
      // Prevent multiple simultaneous refresh requests.
      // ---------------------------------------------------

      if (!refreshPromise) {
        refreshPromise =
          refreshAccessToken()
            .finally(() => {
              refreshPromise = null;
            });
      }

      await refreshPromise;


      // ---------------------------------------------------
      // Retry the original request once.
      // ---------------------------------------------------

      return apiRequest(
        endpoint,
        options,
        false
      );

    } catch (refreshError) {

      console.error(
        "Authentication refresh failed:",
        refreshError
      );

      throw new Error(
        "Authentication failed. Please log in again."
      );
    }
  }


  // =======================================================
  // OTHER 401
  // =======================================================

  if (response.status === 401) {
    throw new Error(
      "Authentication failed. Please log in again."
    );
  }


  // =======================================================
  // OTHER ERRORS
  // =======================================================

  if (!response.ok) {
    let errorMessage =
      `Request failed: ${response.status}`;

    try {
      const errorData =
        await response.json();

      if (
        typeof errorData.detail ===
        "string"
      ) {
        errorMessage =
          errorData.detail;

      } else if (
        Array.isArray(
          errorData.detail
        )
      ) {
        errorMessage =
          errorData.detail
            .map(
              (item) =>
                item.msg ||
                "Validation error"
            )
            .join(", ");
      }
    } catch {
      // Ignore invalid response body.
    }

    throw new Error(
      errorMessage
    );
  }


  // =======================================================
  // NO CONTENT
  // =======================================================

  if (response.status === 204) {
    return null;
  }


  return response.json();
}