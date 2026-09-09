import { useEffect, useState } from "react";

import "../styles/news.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const API_ORIGIN = API_BASE_URL.replace(
  /\/api\/v1\/?$/,
  ""
);

const DEFAULT_NEWS_IMAGES = [
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=85",
];

const NEWS_BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1800&q=85";

const DEFAULT_BLOGS = [
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
    slug: "understanding-your-skin-a-guide-to-healthy-skin",
    is_published: true,
    display_order: 1,
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
    slug: "the-science-behind-modern-aesthetic-treatments",
    is_published: true,
    display_order: 2,
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
    slug: "why-professional-skin-consultation-matters",
    is_published: true,
    display_order: 3,
  },
];

function getImageUrl(
  rawImageUrl,
  fallbackImage
) {
  if (!rawImageUrl) {
    return fallbackImage;
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

export default function News({
  blogs = [],
}) {
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const cmsBlogs = Array.isArray(blogs)
    ? blogs
    : [];

  const publishedCmsPosts =
    cmsBlogs
      .filter(
        (blog) =>
          blog?.is_published === true
      )
      .sort(
        (a, b) =>
          (a?.display_order ?? 0) -
          (b?.display_order ?? 0)
      );

  const publishedPosts =
    publishedCmsPosts.length > 0
      ? publishedCmsPosts
      : DEFAULT_BLOGS;

  useEffect(() => {
    setCurrentIndex(0);
  }, [publishedPosts.length]);

  useEffect(() => {
    if (publishedPosts.length <= 1) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrentIndex(
        (previousIndex) =>
          (previousIndex + 1) %
          publishedPosts.length
      );
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [publishedPosts.length]);

  const goToPrevious = () => {
    setCurrentIndex((previousIndex) => {
      if (previousIndex === 0) {
        return publishedPosts.length - 1;
      }

      return previousIndex - 1;
    });
  };

  const goToNext = () => {
    setCurrentIndex(
      (previousIndex) =>
        (previousIndex + 1) %
        publishedPosts.length
    );
  };

  const getCardPosition = (index) => {
    const total = publishedPosts.length;

    if (total <= 1) {
      return "active";
    }

    if (index === currentIndex) {
      return "active";
    }

    const previousIndex =
      (currentIndex - 1 + total) % total;

    const nextIndex =
      (currentIndex + 1) % total;

    if (index === previousIndex) {
      return "previous";
    }

    if (index === nextIndex) {
      return "next";
    }

    return "hidden";
  };

  return (
    <section
      className="news-section"
      id="news"
    >
      <div
        className="news-background"
        style={{
          backgroundImage: `url("${NEWS_BACKGROUND_IMAGE}")`,
        }}
      />

      <div className="news-background-overlay" />

      <div className="news-container">
        <div className="news-heading">
          <span className="section-eyebrow">
            FROM THE CLINIC
          </span>

          <h2>
            Latest <em>Insights</em>
          </h2>

          <p>
            Expert knowledge, skincare guidance
            and the latest insights from our
            clinic.
          </p>
        </div>

        <div className="news-carousel">
          <button
            type="button"
            className="news-carousel-arrow news-carousel-arrow-left"
            onClick={goToPrevious}
            aria-label="Previous article"
          >
            ‹
          </button>

          <div className="news-stage">
            {publishedPosts.map(
              (post, index) => {
                const fallbackImage =
                  DEFAULT_NEWS_IMAGES[
                    index %
                      DEFAULT_NEWS_IMAGES.length
                  ];

                const imageUrl =
                  getImageUrl(
                    post?.featured_image_url,
                    fallbackImage
                  );

                const position =
                  getCardPosition(index);

                return (
                  <article
  className={`news-card news-card-${position}`}
  key={
    post?.id ??
    post?.slug ??
    index
  }
  aria-hidden={
    position !== "active"
  }
  onClick={() => {
    if (position === "active" && post?.slug) {
      window.location.href = `/news/${post.slug}`;
    }
  }}
  onKeyDown={(event) => {
    if (
      position === "active" &&
      post?.slug &&
      (event.key === "Enter" ||
        event.key === " ")
    ) {
      event.preventDefault();
      window.location.href = `/news/${post.slug}`;
    }
  }}
  role={
    position === "active"
      ? "link"
      : undefined
  }
  tabIndex={
    position === "active"
      ? 0
      : -1
  }
>
                    <div className="news-image-wrapper">
                      <img
                        src={imageUrl}
                        alt={
                          post?.title ||
                          "Clinic article"
                        }
                        className="news-image"
                        loading={
                          position === "active"
                            ? "eager"
                            : "lazy"
                        }
                        onError={(event) => {
                          if (
                            event.currentTarget
                              .src !==
                            fallbackImage
                          ) {
                            event.currentTarget.src =
                              fallbackImage;
                          }
                        }}
                      />
                    </div>

                    <div className="news-content">
                      <div className="news-meta">
                        {post?.category && (
                          <span>
                            {post.category}
                          </span>
                        )}

                        {post?.published_at && (
                          <span>
                            {formatDate(
                              post.published_at
                            )}
                          </span>
                        )}
                      </div>

                      <h3>
                        {post?.title ||
                          "Clinic Article"}
                      </h3>

                      {post?.excerpt && (
                        <p>
                          {post.excerpt}
                        </p>
                      )}

                      <a
                        href={`/news/${post?.slug}`}
                        className="news-read-more"
                        tabIndex={
                          position === "active"
                            ? 0
                            : -1
                        }
                      >
                        <span>
                          Read Article
                        </span>

                        <span className="news-arrow">
                          →
                        </span>
                      </a>
                    </div>
                  </article>
                );
              }
            )}
          </div>

          <button
            type="button"
            className="news-carousel-arrow news-carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next article"
          >
            ›
          </button>
        </div>

        {publishedPosts.length > 1 && (
          <div className="news-dots">
            {publishedPosts.map(
              (post, index) => (
                <button
                  type="button"
                  key={
                    post?.id ??
                    post?.slug ??
                    index
                  }
                  className={`news-dot ${
                    currentIndex === index
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setCurrentIndex(index)
                  }
                  aria-label={`Show article ${
                    index + 1
                  }`}
                />
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}