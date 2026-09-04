import "../styles/results.css";

const results = [
  {
    title: "Acne Treatment",
    description: "8-week progress, inflammatory acne",
    beforeImage: "/images/results/acne-before.jpg",
    afterImage: "/images/results/acne-after.jpg",
  },
  {
    title: "Pigmentation Correction",
    description: "12-week progress, sun damage",
    beforeImage: "/images/results/pigmentation-before.jpg",
    afterImage: "/images/results/pigmentation-after.jpg",
  },
  {
    title: "Anti-Aging Treatment",
    description: "6-week progress, fine lines",
    beforeImage: "/images/results/anti-aging-before.jpg",
    afterImage: "/images/results/anti-aging-after.jpg",
  },
];

export default function Results() {
  return (
    <section className="results-section" id="results">
      <div className="results-container">

        {/* =====================================================
            SECTION HEADING
            ===================================================== */}

        <div className="results-header">
          <span className="results-label">REAL RESULTS</span>

          <h2>Before &amp; After — Real Patient Outcomes</h2>

          <p>
            Shared with patient consent, showing typical treatment progress.
          </p>
        </div>

        {/* =====================================================
            RESULTS CARDS
            ===================================================== */}

        <div className="results-grid">
          {results.map((result) => (
            <article
              className="result-card"
              key={result.title}
            >
              {/* =================================================
                  BEFORE / AFTER IMAGES
                  50 / 50 SPLIT
                  ================================================= */}

              <div className="result-images">

                <div className="result-side result-before">
                  <img
                    src={result.beforeImage}
                    alt={`${result.title} before treatment`}
                  />

                  <span>BEFORE</span>
                </div>

                <div className="result-side result-after">
                  <img
                    src={result.afterImage}
                    alt={`${result.title} after treatment`}
                  />

                  <span>AFTER</span>
                </div>

              </div>

              {/* =================================================
                  CARD INFORMATION
                  ================================================= */}

              <div className="result-content">
                <h3>{result.title}</h3>

                <p>{result.description}</p>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}