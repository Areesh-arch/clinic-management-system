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
    } catch {}

    throw new Error(message);
  }

  return response.json();
}


const publicWebsiteService = {

  // ==========================================================
  // SITE SETTINGS
  // ==========================================================

  getSiteSettings() {
    return publicRequest(
      "/settings/site/public"
    );
  },


  // ==========================================================
  // SERVICES
  // ==========================================================

  getServices() {
    return publicRequest(
      "/cms/services/public"
    );
  },


  // ==========================================================
  // RESULTS
  // ==========================================================

  getResults() {
    return publicRequest(
      "/cms/results/public"
    );
  },


  // ==========================================================
  // TESTIMONIALS
  // ==========================================================

  getTestimonials() {
    return publicRequest(
      "/cms/testimonials/public"
    );
  },


  // ==========================================================
  // SKIN QUIZ
  // ==========================================================

  getQuizQuestions() {
    return publicRequest(
      "/cms/quiz/public"
    );
  },


  // ==========================================================
  // BLOGS / NEWS
  // ==========================================================

  getBlogs() {
    return publicRequest(
      "/cms/blogs/public"
    );
  },


  // ==========================================================
  // SINGLE BLOG ARTICLE
  // ==========================================================

  getBlogBySlug(slug) {
    return publicRequest(
      `/cms/blogs/public/${encodeURIComponent(slug)}`
    );
  },
};


export default publicWebsiteService;