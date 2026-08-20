import { apiRequest } from "./api";


// =========================================================
// GET ALL INVENTORY
// =========================================================

export async function getInventory() {
  return apiRequest("/inventory/");
}


// =========================================================
// GET SINGLE INVENTORY ITEM
// =========================================================

export async function getInventoryItem(inventoryId) {
  return apiRequest(
    `/inventory/${inventoryId}`
  );
}


// =========================================================
// CREATE INVENTORY ITEM
// =========================================================

export async function createInventory(inventoryData) {
  return apiRequest(
    "/inventory/",
    {
      method: "POST",
      body: JSON.stringify({
        name: inventoryData.name,
        category: inventoryData.category,
        brand: inventoryData.brand || null,
        unit: inventoryData.unit,
        quantity: Number(inventoryData.quantity),
        minimum_stock: Number(inventoryData.minimum_stock),
        purchase_price: Number(
          inventoryData.purchase_price
        ),
        selling_price: Number(
          inventoryData.selling_price
        ),
        expiry_date:
          inventoryData.expiry_date || null,
      }),
    }
  );
}


// =========================================================
// UPDATE INVENTORY ITEM
// =========================================================

export async function updateInventory(
  inventoryId,
  inventoryData
) {
  return apiRequest(
    `/inventory/${inventoryId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        name: inventoryData.name,
        category: inventoryData.category,
        brand: inventoryData.brand || null,
        unit: inventoryData.unit,
        quantity: Number(inventoryData.quantity),
        minimum_stock: Number(
          inventoryData.minimum_stock
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
    }
  );
}


// =========================================================
// DELETE INVENTORY ITEM
// =========================================================

export async function deleteInventory(
  inventoryId
) {
  return apiRequest(
    `/inventory/${inventoryId}`,
    {
      method: "DELETE",
    }
  );
}