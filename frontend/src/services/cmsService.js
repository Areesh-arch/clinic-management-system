import api from "./api";

const CMS_BASE = "/cms";

const cmsService = {
  // =====================================================
  // HOMEPAGE
  // =====================================================

  getHomepage: async () => {
    const response = await api.get(
      `${CMS_BASE}/homepage`
    );

    return response.data;
  },

  updateHomepage: async (data) => {
    const response = await api.put(
      `${CMS_BASE}/homepage`,
      data
    );

    return response.data;
  },

  // =====================================================
  // TREATMENTS
  // =====================================================

  getTreatments: async () => {
    const response = await api.get(
      `${CMS_BASE}/treatments`
    );

    return response.data;
  },

  createTreatment: async (data) => {
    const response = await api.post(
      `${CMS_BASE}/treatments`,
      data
    );

    return response.data;
  },

  updateTreatment: async (id, data) => {
    const response = await api.put(
      `${CMS_BASE}/treatments/${id}`,
      data
    );

    return response.data;
  },

  deleteTreatment: async (id) => {
    const response = await api.delete(
      `${CMS_BASE}/treatments/${id}`
    );

    return response.data;
  },

  // =====================================================
  // RESULTS
  // =====================================================

  getResults: async () => {
    const response = await api.get(
      `${CMS_BASE}/results`
    );

    return response.data;
  },

  createResult: async (formData) => {
    const response = await api.post(
      `${CMS_BASE}/results`,
      formData
    );

    return response.data;
  },

  updateResult: async (id, formData) => {
    const response = await api.put(
      `${CMS_BASE}/results/${id}`,
      formData
    );

    return response.data;
  },

  deleteResult: async (id) => {
    const response = await api.delete(
      `${CMS_BASE}/results/${id}`
    );

    return response.data;
  },

  // =====================================================
  // BLOGS
  // =====================================================

  getBlogs: async () => {
    const response = await api.get(
      `${CMS_BASE}/blogs`
    );

    return response.data;
  },

  createBlog: async (data) => {
    const response = await api.post(
      `${CMS_BASE}/blogs`,
      data
    );

    return response.data;
  },

  updateBlog: async (id, data) => {
    const response = await api.put(
      `${CMS_BASE}/blogs/${id}`,
      data
    );

    return response.data;
  },

  deleteBlog: async (id) => {
    const response = await api.delete(
      `${CMS_BASE}/blogs/${id}`
    );

    return response.data;
  },

  // =====================================================
  // QUIZ
  // =====================================================

  getQuizQuestions: async () => {
    const response = await api.get(
      `${CMS_BASE}/quiz`
    );

    return response.data;
  },

  createQuizQuestion: async (data) => {
    const response = await api.post(
      `${CMS_BASE}/quiz`,
      data
    );

    return response.data;
  },

  updateQuizQuestion: async (id, data) => {
    const response = await api.put(
      `${CMS_BASE}/quiz/${id}`,
      data
    );

    return response.data;
  },

  deleteQuizQuestion: async (id) => {
    const response = await api.delete(
      `${CMS_BASE}/quiz/${id}`
    );

    return response.data;
  },

  // =====================================================
  // CONTACT
  // =====================================================

  getContact: async () => {
    const response = await api.get(
      `${CMS_BASE}/contact`
    );

    return response.data;
  },

  updateContact: async (data) => {
    const response = await api.put(
      `${CMS_BASE}/contact`,
      data
    );

    return response.data;
  },
};

export default cmsService;