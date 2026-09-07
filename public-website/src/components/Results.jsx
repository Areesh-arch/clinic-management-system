import "../styles/results.css";

export default function Results({ results = [] }) {
  const activeResults = results.filter(
    (result) => result.is_active !== false
  );

  return (
    <section className="results-section" id="results">
      <div className="results-container">
        <div className="results-header">
          <span className="results-label">
            REAL RESULTS
          </span>

          <h2>
            Before &amp; After — Real Patient Outcomes
          </h2>

          <p>
            Shared with patient consent, showing typical treatment progress.
          </p>
        </div>

        <div className="results-grid">
          {activeResults.map((result) => (
            <article
              className="result-card"
              key={result.id ?? result.slug}
            >
              <div className="result-images">
                <div className="result-side result-before">
                  <img
                    src={result.before_image_url}
                    alt={`${result.title} before treatment`}
                  />

                  <span>BEFORE</span>
                </div>

                <div className="result-side result-after">
                  <img
                    src={result.after_image_url}
                    alt={`${result.title} after treatment`}
                  />

                  <span>AFTER</span>
                </div>
              </div>

              <div className="result-content">
                <h3>{result.title}</h3>

                <p>
                  {result.description ||
                    result.treatment_name ||
                    ""}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}