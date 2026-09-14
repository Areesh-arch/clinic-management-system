import { apiRequest } from "./api";

// =========================================================
// CREATE PRESCRIPTION / ISSUE MEDICINES
// =========================================================

export async function createPrescription(
  prescriptionData
) {
  return apiRequest("/prescriptions/", {
    method: "POST",
    body: JSON.stringify(prescriptionData),
  });
}


// =========================================================
// GET PRESCRIPTIONS
// =========================================================

export async function getPrescriptions() {
  return apiRequest("/prescriptions/");
}


// =========================================================
// GET SINGLE PRESCRIPTION
// =========================================================

export async function getPrescription(
  prescriptionId
) {
  return apiRequest(
    `/prescriptions/${prescriptionId}`
  );
}