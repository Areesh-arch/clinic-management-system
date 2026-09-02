import { apiRequest } from "./api";

// =====================================================
// CMS API SERVICE
// =====================================================

const cmsService = {
  // =====================================================
  // SERVICES
  // Backend:
  // /api/v1/cms/services/
  // =====================================================

  getServices: async () => {
    return apiRequest("/cms/services/");
  },

  createService: async (data) => {
    return apiRequest("/cms/services/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateService: async (id, data) => {
    return apiRequest(`/cms/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteService: async (id) => {
    return apiRequest(`/cms/services/${id}`, {
      method: "DELETE",
    });
  },

  // =====================================================
  // RESULTS
  // Backend:
  // /api/v1/cms/results/
  // =====================================================

  getResults: async () => {
    return apiRequest("/cms/results/");
  },

  createResult: async (formData) => {
    return apiRequest("/cms/results/", {
      method: "POST",
      body: formData,
    });
  },

  updateResult: async (id, formData) => {
    return apiRequest(`/cms/results/${id}`, {
      method: "PUT",
      body: formData,
    });
  },

  deleteResult: async (id) => {
    return apiRequest(`/cms/results/${id}`, {
      method: "DELETE",
    });
  },

  // =====================================================
  // BLOGS
  // Backend:
  // /api/v1/cms/blogs/
  // =====================================================

  getBlogs: async () => {
    return apiRequest("/cms/blogs/");
  },

  createBlog: async (data) => {
    return apiRequest("/cms/blogs/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateBlog: async (id, data) => {
    return apiRequest(`/cms/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteBlog: async (id) => {
    return apiRequest(`/cms/blogs/${id}`, {
      method: "DELETE",
    });
  },

  // =====================================================
  // QUIZ
  // Backend:
  // /api/v1/cms/quiz/
  // =====================================================

  getQuizQuestions: async () => {
    return apiRequest("/cms/quiz/");
  },

  createQuizQuestion: async (data) => {
    return apiRequest("/cms/quiz/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateQuizQuestion: async (id, data) => {
    return apiRequest(`/cms/quiz/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteQuizQuestion: async (id) => {
    return apiRequest(`/cms/quiz/${id}`, {
      method: "DELETE",
    });
  },

  // =====================================================
  // SITE SETTINGS
  // Backend:
  // /api/v1/settings/site/
  // =====================================================

  getSiteSettings: async () => {
    return apiRequest("/settings/site/");
  },

  createSiteSettings: async (data) => {
    return apiRequest("/settings/site/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateSiteSettings: async (data) => {
    return apiRequest("/settings/site/", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

export default cmsService;