import "../styles/hero.css";

export default function Hero({ settings }) {
  const homepageImage =
    settings?.homepage_image_url ||
    "";

  return (
    <section className="hero" id="home">
      <div className="hero-container">

        <div className="hero-content">

          <p className="hero-eyebrow">
            {settings?.homepage_eyebrow ||
              "AESTHETIC & DERMATOLOGY"}
          </p>

          <h1>
            {settings?.homepage_title ? (
              settings.homepage_title
            ) : (
              <>
                Refined care.
                <br />
                <em>Beautifully natural.</em>
              </>
            )}
          </h1>

          <p className="hero-description">
            {settings?.homepage_description ||
              "Personalized dermatological and aesthetic care designed around your skin, your confidence, and your individuality."}
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

          {homepageImage ? (
            <div className="hero-image-wrapper">
              <img
                src={homepageImage}
                alt="Clinic"
                className="hero-image"
              />
            </div>
          ) : (
            <div className="hero-image-placeholder">
              <span>CLINIC IMAGE</span>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}