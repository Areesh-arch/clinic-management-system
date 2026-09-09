import { useEffect, useState } from "react";

import "../styles/services.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const API_ORIGIN = API_BASE_URL.replace(
  /\/api\/v1\/?$/,
  ""
);

const DEFAULT_SERVICE_IMAGES = [
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=85",
];

const DEFAULT_SERVICES = [
  {
    id: "default-acne-treatment",
    name: "Acne Treatment",
    short_description:
      "Personalized care designed to calm breakouts, improve texture, and support clearer-looking skin.",
    display_order: 1,
    is_active: true,
  },
  {
    id: "default-skin-rejuvenation",
    name: "Skin Rejuvenation",
    short_description:
      "Refined treatments that restore radiance, smooth texture, and enhance your skin's natural appearance.",
    display_order: 2,
    is_active: true,
  },
  {
    id: "default-facial-aesthetics",
    name: "Facial Aesthetics",
    short_description:
      "Thoughtful aesthetic treatments designed to enhance balance while keeping results natural and elegant.",
    display_order: 3,
    is_active: true,
  },
  {
    id: "default-anti-aging",
    name: "Anti-Aging Care",
    short_description:
      "Modern skin treatments focused on firmness, hydration, fine lines, and graceful skin rejuvenation.",
    display_order: 4,
    is_active: true,
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

export default function Services({
  services = [],
}) {
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const cmsServices = Array.isArray(services)
    ? services
    : [];

  const activeCmsServices = cmsServices
    .filter(
      (service) =>
        service?.is_active !== false
    )
    .sort(
      (a, b) =>
        (a?.display_order ?? 0) -
        (b?.display_order ?? 0)
    );

  const activeServices =
    activeCmsServices.length > 0
      ? activeCmsServices
      : DEFAULT_SERVICES;

  const usingDefaults =
    activeCmsServices.length === 0;

  /*
   * ===================================================
   * RESET CAROUSEL
   * ===================================================
   */
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeServices.length]);

  /*
   * ===================================================
   * AUTO SLIDE
   * ===================================================
   */
  useEffect(() => {
    if (activeServices.length <= 1) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrentIndex(
        (previousIndex) =>
          (previousIndex + 1) %
          activeServices.length
      );
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [activeServices.length]);

  /*
   * ===================================================
   * PREVIOUS
   * ===================================================
   */
  const goToPrevious = () => {
    setCurrentIndex((previousIndex) => {
      if (previousIndex === 0) {
        return activeServices.length - 1;
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
        activeServices.length
    );
  };

  /*
   * ===================================================
   * CARD POSITION
   *
   * previous = left
   * active   = center
   * next     = right
   * hidden   = everything else
   * ===================================================
   */
  const getCardPosition = (index) => {
    const total = activeServices.length;

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
      className="services"
      id="treatments"
    >
      <div className="services-container">
        {/* =================================================
            HEADING
            ================================================= */}
        <div className="services-heading">
          <div>
            <p className="section-eyebrow">
              OUR EXPERTISE
            </p>

            <h2>
              Treatments designed
              <br />
              <em>around you.</em>
            </h2>
          </div>

          <p className="services-intro">
            Every treatment begins with
            understanding your skin, your concerns,
            and the result you want to achieve.
          </p>
        </div>

        {/* =================================================
            SERVICES CAROUSEL
            ================================================= */}
        <div className="services-carousel">
          {/* LEFT ARROW */}
          <button
            type="button"
            className="services-arrow services-arrow-left"
            onClick={goToPrevious}
            aria-label="Previous treatment"
          >
            ‹
          </button>

          {/* =================================================
              CARDS
              ================================================= */}
          <div className="services-stage">
            {activeServices.map(
              (service, index) => {
                const fallbackImage =
                  DEFAULT_SERVICE_IMAGES[
                    index %
                      DEFAULT_SERVICE_IMAGES.length
                  ];

                const imageUrl = getImageUrl(
                  service?.image_url,
                  fallbackImage
                );

                const description =
                  service?.short_description ||
                  service?.description ||
                  "";

                const position =
                  getCardPosition(index);

                return (
                  <article
                    className={`service-card service-card-${position}`}
                    key={
                      service?.id ??
                      service?.slug ??
                      index
                    }
                    aria-hidden={
                      position !== "active"
                    }
                  >
                    <span className="service-number">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <div className="service-image-wrapper">
                      <img
                        className="service-image"
                        src={imageUrl}
                        alt={
                          service?.name ||
                          "Clinic treatment"
                        }
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

                    <div className="service-content">
                      <h3>
                        {service?.name ||
                          "Treatment"}
                      </h3>

                      {description && (
                        <p>
                          {description}
                        </p>
                      )}
                    </div>
                  </article>
                );
              }
            )}
          </div>

          {/* RIGHT ARROW */}
          <button
            type="button"
            className="services-arrow services-arrow-right"
            onClick={goToNext}
            aria-label="Next treatment"
          >
            ›
          </button>
        </div>

        {/* =================================================
            DOTS
            ================================================= */}
        {activeServices.length > 1 && (
          <div className="services-dots">
            {activeServices.map(
              (service, index) => (
                <button
                  type="button"
                  key={
                    service?.id ??
                    service?.slug ??
                    index
                  }
                  className={`services-dot ${
                    currentIndex === index
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setCurrentIndex(index)
                  }
                  aria-label={`Show treatment ${
                    index + 1
                  }`}
                />
              )
            )}
          </div>
        )}

        {/* =================================================
            DEFAULT TEXT
            ================================================= */}
        {usingDefaults && (
          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
              fontSize: "11px",
              color:
                "rgba(24, 57, 47, 0.45)",
            }}
          >
            Discover our signature treatments and
            personalized approach to skin health.
          </p>
        )}
      </div>
    </section>
  );
}