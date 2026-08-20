// src/services/dashboardService.js
import { apiRequest } from "./api";

export function getDashboardData(){
  return apiRequest("/dashboard/");
};