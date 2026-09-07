const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

async function publicRequest(endpoint) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`
  );

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;

    try {
      const data = await response.json();

      if (typeof data.detail === "string") {
        message = data.detail;
      }
    } catch {
      // Ignore invalid JSON.
    }

    throw new Error(message);
  }

  return response.json();
}

const publicWebsiteService = {
  getSiteSettings() {
    return publicRequest("/settings/site/public");
  },

  getServices() {
    return publicRequest("/cms/services/public");
  },

  getResults() {
    return publicRequest("/cms/results/public");
  },

  getTestimonials() {
    return publicRequest("/cms/testimonials/public");
  },

  getQuizQuestions() {
    return publicRequest("/cms/quiz/public");
  },
};

export default publicWebsiteService;