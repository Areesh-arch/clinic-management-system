import { apiRequest } from "./api";


// =========================================================
// GET ALL ACTIVE APPOINTMENTS
// =========================================================

export async function getAppointments() {
  return apiRequest("/appointments/");
}


// =========================================================
// GET SINGLE ACTIVE APPOINTMENT
// =========================================================

export async function getAppointment(appointmentId) {
  return apiRequest(
    `/appointments/${appointmentId}`
  );
}


// =========================================================
// GET ARCHIVED APPOINTMENTS
// =========================================================

export async function getArchivedAppointments() {
  return apiRequest(
    "/appointments/archived"
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
      body: JSON.stringify(
        appointmentData
      ),
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
      body: JSON.stringify(
        appointmentData
      ),
    }
  );
}


// =========================================================
// ARCHIVE APPOINTMENT
// =========================================================

export async function archiveAppointment(
  appointmentId
) {
  return apiRequest(
    `/appointments/${appointmentId}/archive`,
    {
      method: "POST",
    }
  );
}


// =========================================================
// RESTORE APPOINTMENT
// =========================================================

export async function restoreAppointment(
  appointmentId
) {
  return apiRequest(
    `/appointments/${appointmentId}/restore`,
    {
      method: "POST",
    }
  );
}


// =========================================================
// PERMANENT DELETE
// =========================================================

export async function permanentlyDeleteAppointment(
  appointmentId
) {
  return apiRequest(
    `/appointments/${appointmentId}/permanent`,
    {
      method: "DELETE",
    }
  );
}


// =========================================================
// DELETE = ARCHIVE
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