const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";


export async function apiRequest(
  endpoint,
  options = {}
) {
  // =====================================================
  // GET AUTH TOKEN
  // =====================================================

  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("access_token") ||
    sessionStorage.getItem("token");


  // =====================================================
  // GET SELECTED TENANT
  // =====================================================

  const selectedTenantId =
    localStorage.getItem(
      "selected_tenant_id"
    );


  // =====================================================
  // HEADERS
  // =====================================================

  const headers = {
    ...(options.headers || {}),
  };


  // =====================================================
  // CONTENT TYPE
  // =====================================================

  if (
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] =
      "application/json";
  }


  // =====================================================
  // AUTHORIZATION
  // =====================================================

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }


  // =====================================================
  // SUPER ADMIN TENANT CONTEXT
  // =====================================================
  //
  // Only send the selected tenant when one
  // has actually been selected.
  //
  // The backend remains responsible for
  // deciding whether the authenticated user
  // is allowed to use this tenant.
  //

  if (selectedTenantId) {
    headers["X-Tenant-ID"] =
      selectedTenantId;
  }


  // =====================================================
  // REQUEST
  // =====================================================

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );


  // =====================================================
  // UNAUTHORIZED
  // =====================================================

  if (response.status === 401) {
    throw new Error(
      "Authentication failed. Please log in again."
    );
  }


  // =====================================================
  // OTHER ERRORS
  // =====================================================

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
        Array.isArray(errorData.detail)
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
      // Ignore JSON parsing failure.
    }

    throw new Error(errorMessage);
  }


  // =====================================================
  // NO CONTENT
  // =====================================================

  if (response.status === 204) {
    return null;
  }


  // =====================================================
  // JSON RESPONSE
  // =====================================================

  return response.json();
}