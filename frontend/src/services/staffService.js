import { apiRequest } from "./api";

export async function getStaff() {
  return apiRequest("/staff/staff/");
}

export async function createStaff(data) {
  return apiRequest("/staff/staff/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateStaff(id, data) {
  return apiRequest(`/staff/staff/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteStaff(id) {
  return apiRequest(`/staff/staff/${id}`, {
    method: "DELETE",
  });
}

export async function getStaffById(id) {
  return apiRequest(`/staff/staff/${id}`);
}