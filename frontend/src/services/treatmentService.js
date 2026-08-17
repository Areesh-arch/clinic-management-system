import { apiRequest } from "./api";

// ==========================================
// GET ALL TREATMENTS / VISITS
// ==========================================

export const getTreatments = async () => {
  return await apiRequest("/api/v1/visits/");
};


// ==========================================
// GET SINGLE TREATMENT / VISIT
// ==========================================

export const getTreatment = async (treatmentId) => {
  return await apiRequest(
    `/api/v1/visits/${treatmentId}`
  );
};


// ==========================================
// CREATE TREATMENT / VISIT
// ==========================================

export const createTreatment = async (treatmentData) => {
  return await apiRequest(
    "/api/v1/visits/",
    {
      method: "POST",

      body: JSON.stringify({
        appointment_id: Number(
          treatmentData.appointment_id
        ),

        diagnosis:
          treatmentData.treatment || null,

        charge:
          Number(treatmentData.charge || 0),

        chief_complaint:
          treatmentData.chief_complaint || null,

        notes:
          treatmentData.notes || null,
      }),
    }
  );
};


// ==========================================
// UPDATE TREATMENT / VISIT
// ==========================================

export const updateTreatment = async (
  treatmentId,
  treatmentData
) => {
  return await apiRequest(
    `/api/v1/visits/${treatmentId}`,
    {
      method: "PUT",

      body: JSON.stringify({
        status:
          treatmentData.status,

        diagnosis:
          treatmentData.treatment,

        charge:
          Number(treatmentData.charge || 0),

        chief_complaint:
          treatmentData.chief_complaint || null,

        notes:
          treatmentData.notes || null,
      }),
    }
  );
};


// ==========================================
// DELETE TREATMENT / VISIT
// ==========================================

export const deleteTreatment = async (
  treatmentId
) => {
  return await apiRequest(
    `/api/v1/visits/${treatmentId}`,
    {
      method: "DELETE",
    }
  );
};