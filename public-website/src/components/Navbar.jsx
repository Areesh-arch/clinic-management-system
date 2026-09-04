import "../styles/navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          <span className="logo-mark">A</span>

          <span className="logo-text">
            <strong>DERMA</strong>
            <small>CLINIC</small>
          </span>
        </a>

        <nav className="navbar-links">
          <a href="#about">About</a>
          <a href="#treatments">Treatments</a>
          <a href="#results">Results</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#skin-quiz">Skin Quiz</a>
          <a href="#news">News</a>
          <a href="#contact">Contact</a>
        </nav>

        <a href="#contact" className="navbar-button">
          Book Consultation
        </a>
      </div>
    </header>
  );
}