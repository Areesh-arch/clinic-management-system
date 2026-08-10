import { apiRequest } from "./api";

export const getPatients = () => {
  return apiRequest("/patients/");
};

export const getPatient = (patientId) => {
  return apiRequest(`/patients/${patientId}`);
};

export const createPatient = (patientData) => {
  return apiRequest("/patients/", {
    method: "POST",
    body: JSON.stringify(patientData),
  });
};

export const updatePatient = (patientId, patientData) => {
  return apiRequest(`/patients/${patientId}`, {
    method: "PUT",
    body: JSON.stringify(patientData),
  });
};

export const deletePatient = (patientId) => {
  return apiRequest(`/patients/${patientId}`, {
    method: "DELETE",
  });
};