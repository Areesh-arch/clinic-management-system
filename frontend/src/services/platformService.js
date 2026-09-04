import { apiRequest } from "./api";

export async function getPlatformOverview() {
  return apiRequest("/platform/overview");
}