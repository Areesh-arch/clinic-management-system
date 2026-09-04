const SELECTED_TENANT_ID_KEY = "selected_tenant_id";
const SELECTED_TENANT_NAME_KEY = "selected_tenant_name";

const TENANT_CHANGED_EVENT = "dermacare-tenant-changed";

export function getSelectedTenantId() {
  return localStorage.getItem(SELECTED_TENANT_ID_KEY);
}

export function getSelectedTenantName() {
  return localStorage.getItem(SELECTED_TENANT_NAME_KEY);
}

export function getSelectedTenant() {
  const tenantId = getSelectedTenantId();
  const tenantName = getSelectedTenantName();

  if (!tenantId) {
    return null;
  }

  return {
    id: Number(tenantId),
    business_name: tenantName || "",
  };
}

export function setSelectedTenant(tenant) {
  if (!tenant || tenant.id === undefined || tenant.id === null) {
    throw new Error("Invalid tenant.");
  }

  localStorage.setItem(
    SELECTED_TENANT_ID_KEY,
    String(tenant.id)
  );

  localStorage.setItem(
    SELECTED_TENANT_NAME_KEY,
    tenant.business_name || ""
  );

  window.dispatchEvent(
    new CustomEvent(TENANT_CHANGED_EVENT, {
      detail: {
        id: Number(tenant.id),
        business_name: tenant.business_name || "",
      },
    })
  );
}

export function clearSelectedTenant() {
  localStorage.removeItem(
    SELECTED_TENANT_ID_KEY
  );

  localStorage.removeItem(
    SELECTED_TENANT_NAME_KEY
  );

  window.dispatchEvent(
    new CustomEvent(TENANT_CHANGED_EVENT, {
      detail: null,
    })
  );
}

export function subscribeToTenantChanges(
  callback
) {
  const handler = (event) => {
    callback(event.detail || null);
  };

  window.addEventListener(
    TENANT_CHANGED_EVENT,
    handler
  );

  return () => {
    window.removeEventListener(
      TENANT_CHANGED_EVENT,
      handler
    );
  };
}