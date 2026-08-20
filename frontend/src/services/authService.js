const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";


export async function loginUser(
  email,
  password,
  rememberMe = false
) {

  // =====================================================
  // FORM DATA
  // =====================================================

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


  // =====================================================
  // LOGIN REQUEST
  // =====================================================

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


  // =====================================================
  // ERROR
  // =====================================================

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
      // Response was not JSON
    }

    throw new Error(
      errorMessage
    );
  }


  // =====================================================
  // RESPONSE
  // =====================================================

  const data =
    await response.json();


  // =====================================================
  // CLEAR OLD TOKENS
  // =====================================================

  localStorage.removeItem(
    "access_token"
  );

  sessionStorage.removeItem(
    "access_token"
  );


  // =====================================================
  // SAVE TOKEN
  // =====================================================

  if (rememberMe) {

    localStorage.setItem(
      "access_token",
      data.access_token
    );

  } else {

    sessionStorage.setItem(
      "access_token",
      data.access_token
    );
  }


  return data;
}


// =========================================================
// LOGOUT
// =========================================================

export function logoutUser() {

  localStorage.removeItem(
    "access_token"
  );

  sessionStorage.removeItem(
    "access_token"
  );
}