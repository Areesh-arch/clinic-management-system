import { useEffect, useState } from "react";

import "../styles/article.css";

import publicWebsiteService from "../services/publicWebsiteService";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const API_ORIGIN = API_BASE_URL.replace(
  /\/api\/v1\/?$/,
  ""
);

const DEFAULT_NEWS_IMAGES = [
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=85",
];

const DEFAULT_ARTICLES = [
  {
    id: "default-blog-1",
    title:
      "Understanding Your Skin: A Guide to Healthy Skin",

    category: "SKIN HEALTH",

    excerpt:
      "Discover simple, dermatologist-backed ways to understand and care for your skin every day.",

    content:
      "Healthy skin begins with understanding what your skin needs. Factors such as hydration, sun exposure, lifestyle, and your individual skin type can all influence how your skin looks and feels.\n\nA simple routine built around gentle cleansing, regular moisturization, and daily sun protection can create a strong foundation for healthy-looking skin.\n\nProfessional guidance can also help identify concerns early and create a routine that is appropriate for your individual skin needs.",

    published_at: "2026-09-08",

    slug:
      "understanding-your-skin-a-guide-to-healthy-skin",

    is_published: true,

    featured_image_url:
      DEFAULT_NEWS_IMAGES[0],
  },

  {
    id: "default-blog-2",

    title:
      "The Science Behind Modern Aesthetic Treatments",

    category: "AESTHETIC CARE",

    excerpt:
      "Learn how modern aesthetic treatments can enhance natural features while keeping results refined.",

    content:
      "Modern aesthetic care is increasingly focused on subtle, balanced results rather than changing the way someone naturally looks.\n\nA thoughtful consultation is the starting point. It allows treatment choices to be considered according to skin condition, individual concerns, and the desired outcome.\n\nWhen treatments are carefully planned and performed appropriately, the goal is to support natural-looking results while maintaining healthy-looking skin.",

    published_at: "2026-09-08",

    slug:
      "the-science-behind-modern-aesthetic-treatments",

    is_published: true,

    featured_image_url:
      DEFAULT_NEWS_IMAGES[1],
  },

  {
    id: "default-blog-3",

    title:
      "Why Professional Skin Consultation Matters",

    category: "EXPERT ADVICE",

    excerpt:
      "Every skin journey is different. Here's why professional assessment is an important first step.",

    content:
      "No two skin journeys are exactly alike. The same concern can have different causes and may require a different approach from one person to another.\n\nA professional consultation provides an opportunity to understand your concerns, discuss your goals, and consider an appropriate treatment or skincare plan.\n\nTaking the time to assess your skin before beginning treatment can help make your care more focused, informed, and personal.",

    published_at: "2026-09-08",

    slug:
      "why-professional-skin-consultation-matters",

    is_published: true,

    featured_image_url:
      DEFAULT_NEWS_IMAGES[2],
  },
];

function getImageUrl(rawImageUrl) {
  if (!rawImageUrl) {
    return "";
  }

  const imageUrl = String(rawImageUrl).trim();

  if (!imageUrl) {
    return "";
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  return `${API_ORIGIN}${
    imageUrl.startsWith("/") ? "" : "/"
  }${imageUrl}`;
}

function getArticleImage(article) {
  /*
   * CMS image has priority.
   *
   * featured_image_url is the field used by the CMS.
   * The other fields are included as safe fallbacks
   * in case the backend response uses a different
   * image property.
   */
  return (
    article?.featured_image_url ||
    article?.image_url ||
    article?.featured_image ||
    ""
  );
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function renderContent(content) {
  if (!content) {
    return null;
  }

  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs.map(
    (paragraph, index) => (
      <p key={index}>{paragraph}</p>
    )
  );
}

export default function ArticlePage() {
  const slug = window.location.pathname
    .replace(/^\/news\//, "")
    .replace(/\/$/, "");

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadArticle() {
      try {
        setLoading(true);
        setError("");

        /*
         * =====================================================
         * 1. ALWAYS TRY CMS FIRST
         * =====================================================
         *
         * This is important.
         *
         * Previously we checked DEFAULT_ARTICLES first.
         * That prevented CMS articles with the same slug
         * from ever being loaded.
         *
         * Now CMS gets first priority.
         */

        try {
          const cmsArticle =
            await publicWebsiteService.getBlogBySlug(
              slug
            );

          if (
            mounted &&
            cmsArticle &&
            typeof cmsArticle === "object"
          ) {
            setArticle(cmsArticle);
            return;
          }
        } catch (cmsError) {
          /*
           * CMS article was not available.
           *
           * We do not immediately show an error because
           * this may simply mean that this is one of our
           * built-in default articles.
           */

          console.warn(
            "CMS article unavailable, checking default article:",
            cmsError
          );
        }

        /*
         * =====================================================
         * 2. FALL BACK TO DEFAULT ARTICLE
         * =====================================================
         */

        const defaultArticle =
          DEFAULT_ARTICLES.find(
            (item) => item.slug === slug
          );

        if (defaultArticle) {
          if (mounted) {
            setArticle(defaultArticle);
          }

          return;
        }

        /*
         * =====================================================
         * 3. NOTHING FOUND
         * =====================================================
         */

        if (mounted) {
          setArticle(null);
          setError("Article could not be found.");
        }
      } catch (requestError) {
        console.error(
          "Failed to load article:",
          requestError
        );

        if (!mounted) {
          return;
        }

        /*
         * Even if something unexpected happens,
         * try the matching default article.
         */

        const defaultArticle =
          DEFAULT_ARTICLES.find(
            (item) => item.slug === slug
          );

        if (defaultArticle) {
          setArticle(defaultArticle);
          setError("");
        } else {
          setArticle(null);
          setError(
            requestError?.message ||
              "Article could not be loaded."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      loadArticle();
    } else {
      setLoading(false);
      setError(
        "Article could not be identified."
      );
    }

    return () => {
      mounted = false;
    };
  }, [slug]);

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <main className="article-page">
        <section className="article-loading">
          <div className="article-loading-inner">
            <span className="article-loading-dot"></span>

            <p>
              Loading article
            </p>
          </div>
        </section>
      </main>
    );
  }

  /* =========================================================
     NOT FOUND
     ========================================================= */

  if (!article) {
    return (
      <main className="article-page">
        <section className="article-not-found">
          <div className="article-not-found-inner">
            <span>
              FROM THE CLINIC
            </span>

            <h1>
              Article
              <br />
              not found.
            </h1>

            {error && (
              <p>{error}</p>
            )}

            <a href="/#news">
              ← Back to Insights
            </a>
          </div>
        </section>
      </main>
    );
  }

  /*
   * =========================================================
   * IMAGE
   * =========================================================
   *
   * CMS image wins.
   *
   * If CMS has no image, use the default article image.
   */

  const rawArticleImage =
    getArticleImage(article);

  let imageUrl =
    getImageUrl(rawArticleImage);

  /*
   * If the article does not have an image at all,
   * use the matching default article image.
   */

  if (!imageUrl) {
    const defaultArticle =
      DEFAULT_ARTICLES.find(
        (item) => item.slug === slug
      );

    if (defaultArticle) {
      imageUrl = getImageUrl(
        defaultArticle.featured_image_url
      );
    }
  }

  const formattedDate = formatDate(
    article.published_at ||
      article.created_at
  );

  return (
    <main className="article-page">
      {/* =====================================================
          HERO
          ===================================================== */}

      <section
        className={`article-hero ${
          imageUrl
            ? "article-hero-with-image"
            : "article-hero-no-image"
        }`}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt=""
            className="article-hero-image"
            aria-hidden="true"
            onError={(event) => {
              /*
               * If CMS image fails to load,
               * fall back to the default image.
               */

              const defaultArticle =
                DEFAULT_ARTICLES.find(
                  (item) =>
                    item.slug === slug
                );

              const fallbackImage =
                defaultArticle
                  ? getImageUrl(
                      defaultArticle.featured_image_url
                    )
                  : "";

              if (
                fallbackImage &&
                event.currentTarget.src !==
                  fallbackImage
              ) {
                event.currentTarget.src =
                  fallbackImage;
              }
            }}
          />
        )}

        <div className="article-hero-overlay"></div>

        <div
          className="article-hero-pattern"
          aria-hidden="true"
        >
          <span className="pattern-s pattern-s-one">
            S
          </span>

          <span className="pattern-s pattern-s-two">
            S
          </span>
        </div>

        <div className="article-hero-content">
          <a
            href="/#news"
            className="article-back"
          >
            <span>←</span>

            Back to Insights
          </a>

          <div className="article-hero-text">
            <div className="article-meta">
              {article.category && (
                <span className="article-category">
                  {article.category}
                </span>
              )}

              {article.category &&
                formattedDate && (
                  <span className="article-meta-separator">
                    •
                  </span>
                )}

              {formattedDate && (
                <span className="article-date">
                  {formattedDate}
                </span>
              )}
            </div>

            <h1>
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="article-excerpt">
                {article.excerpt}
              </p>
            )}
          </div>

          <div className="article-scroll">
            <span></span>

            <p>
              Read article
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          ARTICLE BODY
          ===================================================== */}

      <section className="article-body-section">
        <div className="article-body-layout">
          <aside className="article-sidebar">
            <div className="article-sidebar-line"></div>

            <div className="article-sidebar-item">
              <span>
                Category
              </span>

              <strong>
                {article.category ||
                  "Clinic Insights"}
              </strong>
            </div>

            {article.author_name && (
              <div className="article-sidebar-item">
                <span>
                  Written by
                </span>

                <strong>
                  {article.author_name}
                </strong>
              </div>
            )}

            {formattedDate && (
              <div className="article-sidebar-item">
                <span>
                  Published
                </span>

                <strong>
                  {formattedDate}
                </strong>
              </div>
            )}
          </aside>

          <article className="article-content">
            {article.author_name && (
              <div className="article-mobile-author">
                <span>
                  Written by
                </span>

                <strong>
                  {article.author_name}
                </strong>
              </div>
            )}

            <div className="article-text">
              {article.content ? (
                renderContent(
                  article.content
                )
              ) : article.excerpt ? (
                <p>
                  {article.excerpt}
                </p>
              ) : (
                <p>
                  More information about this
                  topic will be available soon.
                </p>
              )}
            </div>
          </article>
        </div>
      </section>

      {/* =====================================================
          BOTTOM
          ===================================================== */}

      <section className="article-bottom">
        <div className="article-bottom-pattern">
          <span className="bottom-s">
            S
          </span>
        </div>

        <div className="article-bottom-inner">
          <span>
            Continue exploring
          </span>

          <a href="/#news">
            <span>
              Back to Insights
            </span>

            <strong>
              →
            </strong>
          </a>
        </div>
      </section>
    </main>
  );
}