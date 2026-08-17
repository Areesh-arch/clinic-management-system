const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

const getAuthToken = () => {
  return (
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token")
  );
};

const getAuthHeaders = () => {
  const token = getAuthToken();

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};

const handleResponse = async (response, defaultMessage) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    if (response.status === 401) {
      throw new Error(
        errorData.detail || "Not authenticated. Please login again."
      );
    }

    throw new Error(
      errorData.detail || defaultMessage
    );
  }

  return response;
};


// ================================
// GET ALL PATIENTS
// ================================

export const getPatients = async () => {
  const response = await fetch(
    `${API_URL}/patients/`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  await handleResponse(
    response,
    "Failed to load patients"
  );

  return response.json();
};


// ================================
// GET SINGLE PATIENT
// ================================

export const getPatient = async (patientId) => {
  const response = await fetch(
    `${API_URL}/patients/${patientId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  await handleResponse(
    response,
    "Failed to load patient"
  );

  return response.json();
};


// ================================
// CREATE PATIENT
// ================================

export const createPatient = async (patientData) => {
  const response = await fetch(
    `${API_URL}/patients/`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(patientData),
    }
  );

  await handleResponse(
    response,
    "Failed to create patient"
  );

  return response.json();
};


// ================================
// UPDATE PATIENT
// ================================

export const updatePatient = async (
  patientId,
  patientData
) => {
  const response = await fetch(
    `${API_URL}/patients/${patientId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(patientData),
    }
  );

  await handleResponse(
    response,
    "Failed to update patient"
  );

  return response.json();
};


// ================================
// DELETE PATIENT
// ================================

export const deletePatient = async (patientId) => {
  const response = await fetch(
    `${API_URL}/patients/${patientId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  await handleResponse(
    response,
    "Failed to delete patient"
  );

  return true;
};