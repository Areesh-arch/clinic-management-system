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


// =========================================================
// UPDATE ONE MEDICINE
// =========================================================

export async function updatePrescriptionItem(
  itemId,
  itemData
) {
  return apiRequest(
    `/prescriptions/items/${itemId}`,
    {
      method: "PUT",
      body: JSON.stringify(itemData),
    }
  );
}


// =========================================================
// DELETE ONE MEDICINE
// =========================================================

export async function deletePrescriptionItem(
  itemId
) {
  return apiRequest(
    `/prescriptions/items/${itemId}`,
    {
      method: "DELETE",
    }
  );
}


// =========================================================
// DELETE WHOLE PRESCRIPTION
// =========================================================

export async function deletePrescription(
  prescriptionId
) {
  return apiRequest(
    `/prescriptions/${prescriptionId}`,
    {
      method: "DELETE",
    }
  );
}