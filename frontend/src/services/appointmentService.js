import { apiRequest } from "./api";


// =========================================================
// GET ALL APPOINTMENTS
// =========================================================

export async function getAppointments() {
  return apiRequest("/appointments/");
}


// =========================================================
// GET SINGLE APPOINTMENT
// =========================================================

export async function getAppointment(appointmentId) {
  return apiRequest(
    `/appointments/${appointmentId}`
  );
}


// =========================================================
// CREATE APPOINTMENT
// =========================================================

export async function createAppointment(
  appointmentData
) {
  return apiRequest(
    "/appointments/",
    {
      method: "POST",
      body: JSON.stringify(appointmentData),
    }
  );
}


// =========================================================
// UPDATE APPOINTMENT
// =========================================================

export async function updateAppointment(
  appointmentId,
  appointmentData
) {
  return apiRequest(
    `/appointments/${appointmentId}`,
    {
      method: "PUT",
      body: JSON.stringify(appointmentData),
    }
  );
}


// =========================================================
// DELETE APPOINTMENT
// =========================================================

export async function deleteAppointment(
  appointmentId
) {
  return apiRequest(
    `/appointments/${appointmentId}`,
    {
      method: "DELETE",
    }
  );
}