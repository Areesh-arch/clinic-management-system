import apiRequest from "./api";

/*
|--------------------------------------------------------------------------
| CMS Services
|--------------------------------------------------------------------------
*/

const CMS_SERVICES_URL = "/cms/services";
const CMS_RESULTS_URL = "/cms/results";

/*
|--------------------------------------------------------------------------
| SERVICES
|--------------------------------------------------------------------------
*/

export const getCMSServices = async () => {
  return apiRequest(`${CMS_SERVICES_URL}/`, {
    method: "GET",
  });
};

export const getCMSService = async (serviceId) => {
  return apiRequest(`${CMS_SERVICES_URL}/${serviceId}`, {
    method: "GET",
  });
};

export const createCMSService = async (serviceData) => {
  return apiRequest(`${CMS_SERVICES_URL}/`, {
    method: "POST",
    body: JSON.stringify(serviceData),
  });
};

export const updateCMSService = async (serviceId, serviceData) => {
  return apiRequest(`${CMS_SERVICES_URL}/${serviceId}`, {
    method: "PUT",
    body: JSON.stringify(serviceData),
  });
};

export const deleteCMSService = async (serviceId) => {
  return apiRequest(`${CMS_SERVICES_URL}/${serviceId}`, {
    method: "DELETE",
  });
};

/*
|--------------------------------------------------------------------------
| RESULTS
|--------------------------------------------------------------------------
*/

/**
 * Get all before/after results.
 */
export const getCMSResults = async () => {
  return apiRequest(`${CMS_RESULTS_URL}/`, {
    method: "GET",
  });
};

/**
 * Get one result.
 */
export const getCMSResult = async (resultId) => {
  return apiRequest(`${CMS_RESULTS_URL}/${resultId}`, {
    method: "GET",
  });
};

/**
 * Create result with actual image files.
 *
 * IMPORTANT:
 * Do NOT manually set Content-Type.
 * apiRequest/fetch must generate the multipart boundary.
 */
export const createCMSResult = async ({
  title,
  description,
  treatmentName,
  beforeImage,
  afterImage,
  published,
}) => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description || "");
  formData.append("treatment_name", treatmentName || "");
  formData.append("is_active", String(published));
  formData.append("display_order", "0");

  if (beforeImage) {
    formData.append("before_image", beforeImage);
  }

  if (afterImage) {
    formData.append("after_image", afterImage);
  }

  return apiRequest(`${CMS_RESULTS_URL}/`, {
    method: "POST",
    body: formData,
  });
};

/**
 * Update result.
 */
export const updateCMSResult = async ({
  resultId,
  title,
  description,
  treatmentName,
  beforeImage,
  afterImage,
  published,
}) => {
  const formData = new FormData();

  if (title !== undefined) {
    formData.append("title", title);
  }

  if (description !== undefined) {
    formData.append("description", description || "");
  }

  if (treatmentName !== undefined) {
    formData.append("treatment_name", treatmentName || "");
  }

  if (published !== undefined) {
    formData.append("is_active", String(published));
  }

  if (beforeImage) {
    formData.append("before_image", beforeImage);
  }

  if (afterImage) {
    formData.append("after_image", afterImage);
  }

  return apiRequest(`${CMS_RESULTS_URL}/${resultId}`, {
    method: "PUT",
    body: formData,
  });
};

/**
 * Delete result.
 */
export const deleteCMSResult = async (resultId) => {
  return apiRequest(`${CMS_RESULTS_URL}/${resultId}`, {
    method: "DELETE",
  });
};

export default {
  getCMSServices,
  getCMSService,
  createCMSService,
  updateCMSService,
  deleteCMSService,

  getCMSResults,
  getCMSResult,
  createCMSResult,
  updateCMSResult,
  deleteCMSResult,
};