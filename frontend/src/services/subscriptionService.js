import { apiRequest } from "./api";

export async function getAllSubscriptions() {
  return apiRequest("/subscriptions/");
}

export async function getMySubscription() {
  return apiRequest("/subscriptions/me");
}

export async function getPlanConfigs() {
  return apiRequest("/subscriptions/plans");
}

export async function getPlanConfig(plan) {
  return apiRequest(
    `/subscriptions/plans/${encodeURIComponent(plan)}`
  );
}

export async function updatePlanConfig(plan, data) {
  return apiRequest(
    `/subscriptions/plans/${encodeURIComponent(plan)}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export async function changeSubscriptionPlan(
  tenantId,
  plan
) {
  return apiRequest(
    `/subscriptions/upgrade/${tenantId}?plan=${encodeURIComponent(
      plan
    )}`,
    {
      method: "PUT",
    }
  );
}