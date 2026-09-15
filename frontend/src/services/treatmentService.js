import { apiRequest } from "./api";

// ============================================================
// GET ALL ACTIVE TREATMENTS / VISITS
// ============================================================

export async function getTreatments() {
  return apiRequest("/visits/");
}


// ============================================================
// GET SINGLE ACTIVE TREATMENT / VISIT
// ============================================================

export async function getTreatment(treatmentId) {
  return apiRequest(`/visits/${treatmentId}`);
}


// ============================================================
// GET ARCHIVED TREATMENTS / VISITS
// ============================================================

export async function getArchivedTreatments() {
  return apiRequest("/visits/archived");
}


// ============================================================
// CREATE TREATMENT / VISIT
// ============================================================

export async function createTreatment(treatmentData) {
  return apiRequest("/visits/", {
    method: "POST",
    body: JSON.stringify({
      appointment_id: Number(treatmentData.appointment_id),
      diagnosis: treatmentData.diagnosis || null,
      charge: Number(treatmentData.charge || 0),
      chief_complaint: treatmentData.chief_complaint || null,
      notes: treatmentData.notes || null,
    }),
  });
}


// ============================================================
// UPDATE TREATMENT / VISIT
// ============================================================

export async function updateTreatment(
  treatmentId,
  treatmentData
) {
  return apiRequest(`/visits/${treatmentId}`, {
    method: "PUT",
    body: JSON.stringify({
      status: treatmentData.status || null,
      diagnosis: treatmentData.diagnosis || null,
      charge: Number(treatmentData.charge || 0),
      chief_complaint:
        treatmentData.chief_complaint || null,
      notes: treatmentData.notes || null,
    }),
  });
}


// ============================================================
// ARCHIVE TREATMENT
// ============================================================

export async function archiveTreatment(treatmentId) {
  return apiRequest(
    `/visits/${treatmentId}/archive`,
    {
      method: "POST",
    }
  );
}


// ============================================================
// RESTORE TREATMENT
// ============================================================

export async function restoreTreatment(treatmentId) {
  return apiRequest(
    `/visits/${treatmentId}/restore`,
    {
      method: "POST",
    }
  );
}


// ============================================================
// PERMANENTLY DELETE TREATMENT
// ============================================================

export async function permanentlyDeleteTreatment(
  treatmentId
) {
  return apiRequest(
    `/visits/${treatmentId}/permanent`,
    {
      method: "DELETE",
    }
  );
}


// ============================================================
// LEGACY DELETE
// DELETE NOW MEANS ARCHIVE
// ============================================================

export async function deleteTreatment(treatmentId) {
  return apiRequest(`/visits/${treatmentId}`, {
    method: "DELETE",
  });
}