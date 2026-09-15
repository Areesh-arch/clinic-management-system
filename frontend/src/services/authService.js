const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";


// =========================================================
// STORAGE HELPERS
// =========================================================

function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
}


function saveTokens(
  accessToken,
  refreshToken,
  rememberMe
) {
  clearTokens();

  const storage = rememberMe
    ? localStorage
    : sessionStorage;

  storage.setItem(
    "access_token",
    accessToken
  );

  storage.setItem(
    "refresh_token",
    refreshToken
  );
}


// =========================================================
// LOGIN
// =========================================================

export async function loginUser(
  email,
  password,
  rememberMe = false
) {
  const formData =
    new URLSearchParams();

  formData.append(
    "username",
    email
  );

  formData.append(
    "password",
    password
  );

  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },

      body: formData,
    }
  );

  if (!response.ok) {
    let errorMessage =
      "Login failed";

    try {
      const errorData =
        await response.json();

      if (
        typeof errorData.detail ===
        "string"
      ) {
        errorMessage =
          errorData.detail;
      }
    } catch {
      // Ignore invalid response body.
    }

    throw new Error(
      errorMessage
    );
  }

  const data =
    await response.json();

  saveTokens(
    data.access_token,
    data.refresh_token,
    rememberMe
  );

  return data;
}


// =========================================================
// REFRESH TOKEN
// =========================================================

export async function refreshAccessToken() {
  const refreshToken =
    localStorage.getItem(
      "refresh_token"
    ) ||
    sessionStorage.getItem(
      "refresh_token"
    );

  if (!refreshToken) {
    throw new Error(
      "No refresh token available."
    );
  }

  const response = await fetch(
    `${API_URL}/auth/refresh`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        refresh_token:
          refreshToken,
      }),
    }
  );

  if (!response.ok) {
    clearTokens();

    throw new Error(
      "Refresh token expired."
    );
  }

  const data =
    await response.json();

  const useLocalStorage =
    Boolean(
      localStorage.getItem(
        "refresh_token"
      )
    );

  const storage =
    useLocalStorage
      ? localStorage
      : sessionStorage;

  storage.setItem(
    "access_token",
    data.access_token
  );

  if (data.refresh_token) {
    storage.setItem(
      "refresh_token",
      data.refresh_token
    );
  }

  return data;
}


// =========================================================
// LOGOUT
// =========================================================

export function logoutUser() {
  clearTokens();
}