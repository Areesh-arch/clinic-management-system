import { apiRequest } from "./api";

export async function getAllSubscriptions() {
  return apiRequest("/subscriptions/");
}

export async function changeSubscriptionPlan(tenantId, plan) {
  return apiRequest(
    `/subscriptions/upgrade/${tenantId}?plan=${encodeURIComponent(plan)}`,
    {
      method: "PUT",
    }
  );
}

export async function getMySubscription() {
  return apiRequest("/subscriptions/me");
}