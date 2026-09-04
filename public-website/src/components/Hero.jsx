import "../styles/hero.css";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-container">
        <div className="hero-content">
          <p className="hero-eyebrow">
            AESTHETIC & DERMATOLOGY
          </p>

          <h1>
            Refined care.
            <br />
            <em>Beautifully natural.</em>
          </h1>

          <p className="hero-description">
            Personalized dermatological and aesthetic care designed
            around your skin, your confidence, and your individuality.
          </p>

          <div className="hero-actions">
            <a
              href="#appointment"
              className="hero-primary-button"
            >
              Book a Consultation
            </a>

            <a
              href="#treatments"
              className="hero-secondary-button"
            >
              Explore Treatments
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-placeholder">
            <span>CLINIC IMAGE</span>
          </div>
        </div>
      </div>
    </section>
  );
}