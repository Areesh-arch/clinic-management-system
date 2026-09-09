import { useEffect, useMemo, useState } from "react";

import "../styles/results.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const API_ORIGIN = API_BASE_URL.replace(
  /\/api\/v1\/?$/,
  ""
);

/*
 * =====================================================
 * DEFAULT RESULT IMAGES
 * =====================================================
 *
 * These are fallback images only.
 * CMS images automatically replace them
 * whenever before_image_url / after_image_url
 * are available.
 */
const DEFAULT_RESULT_IMAGES = [
  {
    before:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=85",
    after:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=85",
  },
  {
    before:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85",
    after:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85",
  },
  {
    before:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=85",
    after:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=85",
  },
  {
    before:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=85",
    after:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85",
  },
];

/*
 * =====================================================
 * DEFAULT RESULTS
 * =====================================================
 */
const DEFAULT_RESULTS = [
  {
    id: "default-result-1",
    title: "Acne Treatment",
    treatment_name: "Acne Treatment",
    description:
      "A personalized acne treatment approach focused on clearer-looking skin and improved texture.",
    display_order: 1,
    is_active: true,
  },
  {
    id: "default-result-2",
    title: "Botox",
    treatment_name: "Botox",
    description:
      "A refined aesthetic treatment designed to soften the appearance of expression lines.",
    display_order: 2,
    is_active: true,
  },
  {
    id: "default-result-3",
    title: "Pigmentation Treatment",
    treatment_name: "Pigmentation Treatment",
    description:
      "Targeted skin treatment designed to improve the appearance of uneven pigmentation and tone.",
    display_order: 3,
    is_active: true,
  },
  {
    id: "default-result-4",
    title: "HydraFacial",
    treatment_name: "HydraFacial",
    description:
      "A refreshing treatment focused on cleansing, hydration, radiance, and smoother-looking skin.",
    display_order: 4,
    is_active: true,
  },
];

/*
 * =====================================================
 * IMAGE URL HELPER
 * =====================================================
 */
function getImageUrl(rawImageUrl, fallbackImage) {
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

/*
 * =====================================================
 * RESULTS COMPONENT
 * =====================================================
 */
export default function Results({
  results = [],
}) {
  const [currentIndex, setCurrentIndex] =
    useState(0);

  /*
   * ===================================================
   * CMS RESULTS
   * ===================================================
   */
  const activeCmsResults = useMemo(() => {
    return (
      Array.isArray(results)
        ? results
        : []
    )
      .filter(
        (result) =>
          result?.is_active !== false
      )
      .sort(
        (a, b) =>
          (a?.display_order ?? 0) -
          (b?.display_order ?? 0)
      );
  }, [results]);

  /*
   * ===================================================
   * USE CMS RESULTS IF AVAILABLE
   * OTHERWISE USE DEFAULT RESULTS
   * ===================================================
   */
  const activeResults =
    activeCmsResults.length > 0
      ? activeCmsResults
      : DEFAULT_RESULTS;

  /*
   * ===================================================
   * RESET CAROUSEL WHEN RESULT COUNT CHANGES
   * ===================================================
   */
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeResults.length]);

  /*
   * ===================================================
   * AUTO SLIDE
   * ===================================================
   */
  useEffect(() => {
    if (activeResults.length <= 1) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrentIndex(
        (previousIndex) =>
          (previousIndex + 1) %
          activeResults.length
      );
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [activeResults.length]);

  /*
   * ===================================================
   * PREVIOUS
   * ===================================================
   */
  const goToPrevious = () => {
    setCurrentIndex((previousIndex) => {
      if (previousIndex === 0) {
        return activeResults.length - 1;
      }

      return previousIndex - 1;
    });
  };

  /*
   * ===================================================
   * NEXT
   * ===================================================
   */
  const goToNext = () => {
    setCurrentIndex(
      (previousIndex) =>
        (previousIndex + 1) %
        activeResults.length
    );
  };

  /*
   * ===================================================
   * GET CARD POSITION
   *
   * This determines whether a card is:
   *
   * previous  = left
   * active    = center
   * next      = right
   * hidden    = everything else
   *
   * ===================================================
   */
  const getCardPosition = (index) => {
    const total = activeResults.length;

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
      className="results-section"
      id="results"
    >
      {/* =================================================
          BACKGROUND
          ================================================= */}
      <div className="results-background" />

      <div className="results-container">
        {/* =================================================
            HEADER
            ================================================= */}
        <div className="results-header">
          <span className="results-label">
            REAL RESULTS
          </span>

          <h2>Before &amp; After</h2>

          <p>
            Explore treatment progress across
            selected skin and aesthetic concerns.
          </p>
        </div>

        {/* =================================================
            CAROUSEL
            ================================================= */}
        <div className="results-carousel">
          {/* LEFT ARROW */}
          <button
            type="button"
            className="results-arrow results-arrow-left"
            onClick={goToPrevious}
            aria-label="Previous result"
          >
            ‹
          </button>

          {/* =================================================
              CARDS AREA
              ================================================= */}
          <div className="results-stage">
            {activeResults.map(
              (result, index) => {
                const fallback =
                  DEFAULT_RESULT_IMAGES[
                    index %
                      DEFAULT_RESULT_IMAGES.length
                  ];

                const beforeImage =
                  getImageUrl(
                    result?.before_image_url,
                    fallback.before
                  );

                const afterImage =
                  getImageUrl(
                    result?.after_image_url,
                    fallback.after
                  );

                const title =
                  result?.title ||
                  result?.treatment_name ||
                  "Treatment Result";

                const description =
                  result?.description ||
                  result?.treatment_name ||
                  "";

                const position =
                  getCardPosition(index);

                return (
                  <article
                    className={`result-card result-card-${position}`}
                    key={
                      result?.id ??
                      result?.slug ??
                      index
                    }
                    aria-hidden={
                      position !== "active"
                    }
                  >
                    {/* =========================================
                        BEFORE / AFTER IMAGES
                        ========================================= */}
                    <div className="result-images">
                      <div className="result-side result-before">
                        <img
                          src={beforeImage}
                          alt={`${title} before treatment`}
                          loading={
                            position ===
                            "active"
                              ? "eager"
                              : "lazy"
                          }
                          onError={(
                            event
                          ) => {
                            if (
                              event
                                .currentTarget
                                .src !==
                              fallback.before
                            ) {
                              event.currentTarget.src =
                                fallback.before;
                            }
                          }}
                        />

                        <span>
                          BEFORE
                        </span>
                      </div>

                      <div className="result-side result-after">
                        <img
                          src={afterImage}
                          alt={`${title} after treatment`}
                          loading={
                            position ===
                            "active"
                              ? "eager"
                              : "lazy"
                          }
                          onError={(
                            event
                          ) => {
                            if (
                              event
                                .currentTarget
                                .src !==
                              fallback.after
                            ) {
                              event.currentTarget.src =
                                fallback.after;
                            }
                          }}
                        />

                        <span>
                          AFTER
                        </span>
                      </div>
                    </div>

                    {/* =========================================
                        CONTENT
                        ========================================= */}
                    <div className="result-content">
                      <h3>{title}</h3>

                      <p>
                        {description}
                      </p>
                    </div>
                  </article>
                );
              }
            )}
          </div>

          {/* RIGHT ARROW */}
          <button
            type="button"
            className="results-arrow results-arrow-right"
            onClick={goToNext}
            aria-label="Next result"
          >
            ›
          </button>
        </div>

        {/* =================================================
            DOTS
            ================================================= */}
        {activeResults.length > 1 && (
          <div className="results-dots">
            {activeResults.map(
              (result, index) => (
                <button
                  type="button"
                  key={
                    result?.id ??
                    result?.slug ??
                    index
                  }
                  className={`results-dot ${
                    currentIndex === index
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setCurrentIndex(index)
                  }
                  aria-label={`Show result ${
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