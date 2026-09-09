
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

function getImageUrl(rawImageUrl) {
  if (!rawImageUrl) {
    return "";
  }

  if (
    rawImageUrl.startsWith("http://") ||
    rawImageUrl.startsWith("https://")
  ) {
    return rawImageUrl;
  }

  return `${API_ORIGIN}${
    rawImageUrl.startsWith("/") ? "" : "/"
  }${rawImageUrl}`;
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

  return paragraphs.map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
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

        const data =
          await publicWebsiteService.getBlogBySlug(slug);

        if (!mounted) {
          return;
        }

        setArticle(data);
      } catch (requestError) {
        console.error(
          "Failed to load article:",
          requestError
        );

        if (!mounted) {
          return;
        }

        setArticle(null);

        setError(
          requestError?.message ||
            "Article could not be loaded."
        );
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
            <p>Loading article</p>
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
            <span>FROM THE CLINIC</span>

            <h1>
              Article
              <br />
              not found.
            </h1>

            {error && <p>{error}</p>}

            <a href="/#news">
              ← Back to Insights
            </a>
          </div>
        </section>
      </main>
    );
  }

  const imageUrl = getImageUrl(
    article.featured_image_url
  );

  const formattedDate = formatDate(
    article.published_at ||
      article.created_at
  );

  return (
    <main className="article-page">

      {/* =====================================================
          HERO / IMAGE BEHIND HEADING
          ===================================================== */}

      <section
        className={`article-hero ${
          imageUrl
            ? "article-hero-with-image"
            : "article-hero-no-image"
        }`}
      >

        {/* BACKGROUND IMAGE */}

        {imageUrl && (
          <img
            src={imageUrl}
            alt=""
            className="article-hero-image"
            aria-hidden="true"
          />
        )}

        {/* DARK OVERLAY */}

        <div className="article-hero-overlay"></div>

        {/* S PATTERN */}

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

        {/* HERO CONTENT */}

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
            <p>Read article</p>
          </div>

        </div>
      </section>

      {/* =====================================================
          ARTICLE BODY
          ===================================================== */}

      <section className="article-body-section">

        <div className="article-body-layout">

          {/* SIDE INFORMATION */}

          <aside className="article-sidebar">

            <div className="article-sidebar-line"></div>

            <div className="article-sidebar-item">
              <span>Category</span>

              <strong>
                {article.category ||
                  "Clinic Insights"}
              </strong>
            </div>

            {article.author_name && (
              <div className="article-sidebar-item">
                <span>Written by</span>

                <strong>
                  {article.author_name}
                </strong>
              </div>
            )}

            {formattedDate && (
              <div className="article-sidebar-item">
                <span>Published</span>

                <strong>
                  {formattedDate}
                </strong>
              </div>
            )}

          </aside>

          {/* ARTICLE */}

          <article className="article-content">

            {article.author_name && (
              <div className="article-mobile-author">
                <span>Written by</span>

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
          FOOTER
          ===================================================== */}

      <section className="article-bottom">

        <div className="article-bottom-pattern">
          <span className="bottom-s">S</span>
        </div>

        <div className="article-bottom-inner">

          <span>
            Continue exploring
          </span>

          <a href="/#news">
            <span>Back to Insights</span>
            <strong>→</strong>
          </a>

        </div>

      </section>

    </main>
  );
}
