import { apiRequest } from "./api";


// =========================================================
// GET ALL TREATMENTS / VISITS
// =========================================================

export async function getTreatments() {

  return apiRequest(
    "/visits/"
  );

}


// =========================================================
// GET SINGLE TREATMENT / VISIT
// =========================================================

export async function getTreatment(
  treatmentId
) {

  return apiRequest(
    `/visits/${treatmentId}`
  );

}


// =========================================================
// CREATE TREATMENT / VISIT
// =========================================================

export async function createTreatment(
  treatmentData
) {

  return apiRequest(
    "/visits/",
    {
      method: "POST",

      body: JSON.stringify({

        appointment_id:
          Number(
            treatmentData.appointment_id
          ),

        diagnosis:
          treatmentData.diagnosis ||
          null,

        charge:
          Number(
            treatmentData.charge || 0
          ),

        chief_complaint:
          treatmentData.chief_complaint ||
          null,

        notes:
          treatmentData.notes ||
          null,

      }),
    }
  );

}


// =========================================================
// UPDATE TREATMENT / VISIT
// =========================================================

export async function updateTreatment(
  treatmentId,
  treatmentData
) {

  return apiRequest(
    `/visits/${treatmentId}`,
    {
      method: "PUT",

      body: JSON.stringify({

        status:
          treatmentData.status ||
          null,

        diagnosis:
          treatmentData.diagnosis ||
          null,

        charge:
          Number(
            treatmentData.charge || 0
          ),

        chief_complaint:
          treatmentData.chief_complaint ||
          null,

        notes:
          treatmentData.notes ||
          null,

      }),
    }
  );

}


// =========================================================
// DELETE TREATMENT / VISIT
// =========================================================

export async function deleteTreatment(
  treatmentId
) {

  return apiRequest(
    `/visits/${treatmentId}`,
    {
      method: "DELETE",
    }
  );

}