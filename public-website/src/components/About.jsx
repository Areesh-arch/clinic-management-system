import "../styles/about.css";

export default function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-content">
          <p className="about-eyebrow">ABOUT OUR CLINIC</p>

          <h2>
            Where refined care
            <span> meets beautiful results.</span>
          </h2>

          <p className="about-description">
            We believe aesthetic and dermatological care should feel personal,
            thoughtful, and effortless. Our approach combines modern
            treatments with careful consultation to create results that feel
            natural and uniquely yours.
          </p>

          <p className="about-description secondary">
            From your first consultation to every step of your treatment
            journey, our team focuses on comfort, precision, and exceptional
            care.
          </p>

          <button
            className="about-button"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Discover Our Approach
          </button>
        </div>

        <div className="about-visual">
          <div className="about-image-frame">
            <div className="about-image-placeholder">
              <span>CLINIC</span>
              <strong>EXCELLENCE</strong>
            </div>
          </div>

          <div className="about-accent-card">
            <span className="accent-line"></span>
            <p>
              Personal care.
              <br />
              Exceptional standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}