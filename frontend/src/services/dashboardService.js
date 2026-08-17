import { apiRequest } from "./api";

export async function getDashboardData() {
  return await apiRequest("/dashboard/");
}