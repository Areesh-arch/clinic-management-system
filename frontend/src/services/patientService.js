import { apiRequest } from "./api";


// =====================================================
// GET ALL PATIENTS
// =====================================================

export const getPatients = async () => {
  return await apiRequest("/patients/");
};


// =====================================================
// GET SINGLE PATIENT
// =====================================================

export const getPatient = async (patientId) => {
  return await apiRequest(`/patients/${patientId}`);
};


// =====================================================
// CREATE PATIENT
// =====================================================

export const createPatient = async (patientData) => {
  return await apiRequest("/patients/", {
    method: "POST",
    body: JSON.stringify(patientData),
  });
};


// =====================================================
// UPDATE PATIENT
// =====================================================

export const updatePatient = async (
  patientId,
  patientData
) => {
  return await apiRequest(`/patients/${patientId}`, {
    method: "PUT",
    body: JSON.stringify(patientData),
  });
};


// =====================================================
// DELETE PATIENT
// =====================================================

export const deletePatient = async (patientId) => {
  return await apiRequest(`/patients/${patientId}`, {
    method: "DELETE",
  });
};