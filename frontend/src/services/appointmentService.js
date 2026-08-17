import { apiRequest } from "./api";


// ==========================================
// GET ALL APPOINTMENTS
// ==========================================

export const getAppointments = async () => {

  return await apiRequest(
    "/api/v1/appointments/"
  );

};


// ==========================================
// GET SINGLE APPOINTMENT
// ==========================================

export const getAppointment = async (
  appointmentId
) => {

  return await apiRequest(
    `/api/v1/appointments/${appointmentId}`
  );

};


// ==========================================
// CREATE APPOINTMENT
// ==========================================

export const createAppointment = async (
  appointmentData
) => {

  return await apiRequest(
    "/api/v1/appointments/",
    {
      method: "POST",

      body: JSON.stringify(
        appointmentData
      ),
    }
  );

};


// ==========================================
// UPDATE APPOINTMENT
// ==========================================

export const updateAppointment = async (
  appointmentId,
  appointmentData
) => {

  return await apiRequest(
    `/api/v1/appointments/${appointmentId}`,
    {
      method: "PUT",

      body: JSON.stringify(
        appointmentData
      ),
    }
  );

};


// ==========================================
// DELETE APPOINTMENT
// ==========================================

export const deleteAppointment = async (
  appointmentId
) => {

  return await apiRequest(
    `/api/v1/appointments/${appointmentId}`,
    {
      method: "DELETE",
    }
  );

};