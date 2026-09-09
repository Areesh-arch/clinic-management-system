
import "../styles/footer.css";

const LOGO_URL =
  "http://127.0.0.1:8000/uploads/cms_images/14/7b148326f42247aaaaf1bcdab7d247bf.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">

          <a
            href="/"
            className="footer-logo"
          >
            <img
              src={LOGO_URL}
              alt="Elite Derma Care"
              className="footer-logo-image"
            />
          </a>

          <p className="footer-description">
            Personalized dermatological and aesthetic
            care designed around your skin, confidence,
            and individuality.
          </p>

        </div>

        {/* Navigation */}
        <div className="footer-column">
          <h4>Explore</h4>

          <a href="#about">
            About
          </a>

          <a href="#treatments">
            Treatments
          </a>

          <a href="#results">
            Results
          </a>

          <a href="#skin-quiz">
            Skin Quiz
          </a>

          <a href="#news">
            News
          </a>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h4>Contact</h4>

          <a href="#contact">
            Contact Us
          </a>

          <a href="#contact">
            Book Consultation
          </a>

          <span>
            Mon–Sat: 10:00 AM–7:00 PM
          </span>
        </div>

        {/* Connect */}
        <div className="footer-column footer-connect">
          <h4>Connect</h4>

          <a
            href="https://wa.me/923007399150"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-whatsapp"
          >
            WhatsApp
          </a>

          <a href="#instagram">
            Instagram
          </a>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()}{" "}
          Elite Derma Care. All rights reserved.
        </p>

        <div className="footer-bottom-links">
          <a href="#privacy">
            Privacy Policy
          </a>

          <a href="#terms">
            Terms
          </a>
        </div>

      </div>
    </footer>
  );
}
