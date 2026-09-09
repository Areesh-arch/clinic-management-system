import "../styles/services.css";

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

export default function Services({ services = [] }) {
  const activeServices = services
    .filter(
      (service) => service?.is_active !== false
    )
    .sort(
      (a, b) =>
        (a?.display_order ?? 0) -
        (b?.display_order ?? 0)
    );

  return (
    <section className="services" id="treatments">
      <div className="services-container">

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
            Every treatment begins with understanding
            your skin, your concerns, and the result
            you want to achieve.
          </p>
        </div>

        <div className="services-grid">
          {activeServices.length === 0 ? (
            <div className="services-empty">
              <p>
                Our treatment services will be available
                here soon.
              </p>
            </div>
          ) : (
            activeServices.map((service, index) => {
              const imageUrl = getImageUrl(
                service?.image_url
              );

              const description =
                service?.short_description ||
                service?.description ||
                "";

              return (
                <article
                  className="service-card"
                  key={
                    service?.id ??
                    service?.slug ??
                    index
                  }
                >
                  <span className="service-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {imageUrl && (
                    <div className="service-image-wrapper">
                      <img
                        className="service-image"
                        src={imageUrl}
                        alt={
                          service?.name ||
                          "Clinic treatment"
                        }
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    </div>
                  )}

                  <div className="service-content">
                    <h3>
                      {service?.name ||
                        "Treatment"}
                    </h3>

                    {description && (
                      <p>{description}</p>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}