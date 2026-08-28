import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <a href="/" className="footer-logo">
            <span className="footer-logo-mark">A</span>

            <span className="footer-logo-text">
              <strong>DERMA</strong>
              <small>CLINIC</small>
            </span>
          </a>

          <p>
            Refined dermatology and aesthetic care,
            thoughtfully designed around you.
          </p>
        </div>

        {/* Navigation */}
        <div className="footer-column">
          <h4>Explore</h4>

          <a href="#about">About</a>
          <a href="#treatments">Treatments</a>
          <a href="#results">Results</a>
          <a href="#skin-quiz">Skin Quiz</a>
          <a href="#news">News</a>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h4>Contact</h4>

          <a href="#contact">Contact Us</a>
          <a href="#appointment">Book Consultation</a>

          <span>Mon — Sat</span>
          <span>10:00 AM — 7:00 PM</span>
        </div>

        {/* Social / WhatsApp */}
        <div className="footer-column footer-connect">
          <h4>Connect</h4>

          <a
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-whatsapp"
          >
            WhatsApp
          </a>

          <a href="#instagram">Instagram</a>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Derma Clinic. All rights reserved.
        </p>

        <div className="footer-bottom-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}