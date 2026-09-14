import { apiRequest } from "./api";


// =========================================================
// GET ALL VISITS
// =========================================================

export async function getVisits() {
  return apiRequest("/visits/");
}


// =========================================================
// GET SINGLE VISIT
// =========================================================

export async function getVisit(visitId) {
  return apiRequest(
    `/visits/${visitId}`
  );
}