import { apiRequest } from "./api";

export async function getMedicineLog() {
  return apiRequest("/inventory/medicine-log/");
}