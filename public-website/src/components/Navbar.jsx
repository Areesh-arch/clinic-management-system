
import "../styles/navbar.css";

const LOGO_URL =
  "http://127.0.0.1:8000/uploads/cms_images/14/7b148326f42247aaaaf1bcdab7d247bf.png";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">

        <a
          href="/"
          className="navbar-logo"
          aria-label="Clinic home"
        >
          <img
            src={LOGO_URL}
            alt="Clinic logo"
            className="navbar-logo-image"
          />
        </a>

        <nav className="navbar-links">
          <a href="#about">About</a>
          <a href="#treatments">Treatments</a>
          <a href="#results">Results</a>
          <a href="#feedback">Testimonials</a>
          <a href="#skin-quiz">Skin Quiz</a>
          <a href="#news">News</a>
          <a href="#contact">Contact</a>
        </nav>

        <a
          href="#contact"
          className="navbar-button"
        >
          Book Consultation
        </a>

      </div>
    </header>
  );
}
