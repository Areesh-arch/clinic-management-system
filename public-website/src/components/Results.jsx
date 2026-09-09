import "../styles/results.css";

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

export default function Results({ results = [] }) {
  const activeResults = results
    .filter(
      (result) => result?.is_active !== false
    )
    .sort(
      (a, b) =>
        (a?.display_order ?? 0) -
        (b?.display_order ?? 0)
    );

  return (
    <section
      className="results-section"
      id="results"
    >
      <div className="results-container">
        <div className="results-header">
          <span className="results-label">
            REAL RESULTS
          </span>

          <h2>
            Before &amp; After — Real Patient Outcomes
          </h2>

          <p>
            Shared with patient consent, showing
            typical treatment progress.
          </p>
        </div>

        <div className="results-grid">
          {activeResults.length === 0 ? (
            <div className="results-empty">
              <p>
                Our treatment results will be
                available here soon.
              </p>
            </div>
          ) : (
            activeResults.map((result) => {
              const beforeImage = getImageUrl(
                result?.before_image_url
              );

              const afterImage = getImageUrl(
                result?.after_image_url
              );

              return (
                <article
                  className="result-card"
                  key={
                    result?.id ??
                    result?.slug
                  }
                >
                  <div className="result-images">
                    <div className="result-side result-before">
                      {beforeImage ? (
                        <img
                          src={beforeImage}
                          alt={`${result?.title || "Treatment"} before treatment`}
                          loading="lazy"
                          onError={(event) => {
                            console.error(
                              "Failed to load BEFORE result image:",
                              beforeImage
                            );

                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="result-image-placeholder">
                          BEFORE
                        </div>
                      )}

                      <span>BEFORE</span>
                    </div>

                    <div className="result-side result-after">
                      {afterImage ? (
                        <img
                          src={afterImage}
                          alt={`${result?.title || "Treatment"} after treatment`}
                          loading="lazy"
                          onError={(event) => {
                            console.error(
                              "Failed to load AFTER result image:",
                              afterImage
                            );

                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="result-image-placeholder">
                          AFTER
                        </div>
                      )}

                      <span>AFTER</span>
                    </div>
                  </div>

                  <div className="result-content">
                    <h3>
                      {result?.title ||
                        result?.treatment_name ||
                        "Treatment Result"}
                    </h3>

                    <p>
                      {result?.description ||
                        result?.treatment_name ||
                        ""}
                    </p>
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