const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";


export async function apiRequest(
  endpoint,
  options = {}
) {

  // =====================================================
  // GET TOKEN
  // =====================================================

  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");


  // =====================================================
  // HEADERS
  // =====================================================

  const headers = {
    ...(options.headers || {}),
  };


  // =====================================================
  // DO NOT SET JSON CONTENT TYPE FOR FORMDATA
  // =====================================================

  if (!(options.body instanceof FormData)) {
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

    localStorage.removeItem(
      "access_token"
    );

    sessionStorage.removeItem(
      "access_token"
    );

    throw new Error(
      "Not authenticated"
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

      if (errorData.detail) {
        errorMessage =
          errorData.detail;
      }

    } catch {
      // Ignore JSON parsing failure
    }

    throw new Error(errorMessage);
  }


  // =====================================================
  // DELETE 204
  // =====================================================

  if (response.status === 204) {
    return null;
  }


  // =====================================================
  // JSON
  // =====================================================

  return response.json();
}