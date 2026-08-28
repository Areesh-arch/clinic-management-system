import "../styles/results.css";

const results = [
  {
    title: "Acne Treatment",
    description: "8-week progress, inflammatory acne",
  },
  {
    title: "Pigmentation Correction",
    description: "12-week progress, sun damage",
  },
  {
    title: "Anti-Aging Treatment",
    description: "6-week progress, fine lines",
  },
];

export default function Results() {
  return (
    <section className="results-section" id="results">
      <div className="results-container">

        {/* Section Heading */}
        <div className="results-header">
          <span className="results-label">REAL RESULTS</span>

          <h2>Before &amp; After — Real Patient Outcomes</h2>

          <p>
            Shared with patient consent, showing typical treatment progress.
          </p>
        </div>

        {/* Results Cards */}
        <div className="results-grid">
          {results.map((result) => (
            <article className="result-card" key={result.title}>

              {/* Before / After */}
              <div className="result-images">

                <div className="result-side result-before">
                  <span>BEFORE</span>
                </div>

                <div className="result-side result-after">
                  <span>AFTER</span>
                </div>

              </div>

              {/* Card Information */}
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