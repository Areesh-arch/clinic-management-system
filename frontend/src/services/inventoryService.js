import { apiRequest } from "./api";

export async function getInventory() {
  return apiRequest("/inventory/");
}

export async function getArchivedInventory() {
  return apiRequest("/inventory/archived");
}

export async function getInventoryItem(inventoryId) {
  return apiRequest(`/inventory/${inventoryId}`);
}

export async function createInventory(inventoryData) {
  return apiRequest("/inventory/", {
    method: "POST",
    body: JSON.stringify({
      name: inventoryData.name,
      category: inventoryData.category,
      brand: inventoryData.brand || null,

      unit: inventoryData.unit,
      issue_unit: inventoryData.issue_unit,

      quantity: Number(inventoryData.quantity),
      minimum_stock: Number(inventoryData.minimum_stock),

      units_per_stock_unit: Number(
        inventoryData.units_per_stock_unit || 1
      ),

      loose_quantity: Number(
        inventoryData.loose_quantity || 0
      ),

      purchase_price: Number(
        inventoryData.purchase_price
      ),

      selling_price: Number(
        inventoryData.selling_price
      ),

      expiry_date:
        inventoryData.expiry_date || null,
    }),
  });
}

export async function updateInventory(
  inventoryId,
  inventoryData
) {
  return apiRequest(`/inventory/${inventoryId}`, {
    method: "PUT",
    body: JSON.stringify({
      name: inventoryData.name,
      category: inventoryData.category,
      brand: inventoryData.brand || null,

      unit: inventoryData.unit,
      issue_unit: inventoryData.issue_unit,

      quantity: Number(inventoryData.quantity),
      minimum_stock: Number(inventoryData.minimum_stock),

      units_per_stock_unit: Number(
        inventoryData.units_per_stock_unit || 1
      ),

      loose_quantity: Number(
        inventoryData.loose_quantity || 0
      ),

      purchase_price: Number(
        inventoryData.purchase_price
      ),

      selling_price: Number(
        inventoryData.selling_price
      ),

      expiry_date:
        inventoryData.expiry_date || null,
    }),
  });
}

/*
 * Existing DELETE endpoint now performs a soft archive.
 */
export async function deleteInventory(inventoryId) {
  return apiRequest(`/inventory/${inventoryId}`, {
    method: "DELETE",
  });
}

/*
 * Explicit archive endpoint.
 */
export async function archiveInventory(inventoryId) {
  return apiRequest(
    `/inventory/${inventoryId}/archive`,
    {
      method: "POST",
    }
  );
}

/*
 * Restore an archived inventory item.
 */
export async function restoreInventory(inventoryId) {
  return apiRequest(
    `/inventory/${inventoryId}/restore`,
    {
      method: "POST",
    }
  );
}

/*
 * Permanently delete an archived inventory item.
 */
export async function permanentlyDeleteInventory(
  inventoryId
) {
  return apiRequest(
    `/inventory/${inventoryId}/permanent`,
    {
      method: "DELETE",
    }
  );
}