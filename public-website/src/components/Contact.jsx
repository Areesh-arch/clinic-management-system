import "../styles/contact.css";

export default function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">

        {/* Section Heading */}
        <div className="contact-heading">
          <span className="contact-label">GET IN TOUCH</span>

          <h2>
            Begin Your Journey
            <span> to Better Skin</span>
          </h2>

          <p>
            Have a question or ready to book your consultation?
            Our clinic team is here to help you take the next step.
          </p>
        </div>

        {/* Contact Content */}
        <div className="contact-content">

          {/* Contact Information */}
          <div className="contact-info">

            <div className="contact-item">
              <div className="contact-icon">✦</div>

              <div>
                <h3>Visit Our Clinic</h3>
                <p>
                  Your Clinic Address
                  <br />
                  City, Pakistan
                </p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">✆</div>

              <div>
                <h3>Call Us</h3>
                <a href="tel:+923000000000">
                  +92 300 0000000
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">✉</div>

              <div>
                <h3>Email</h3>
                <a href="mailto:info@dermaclinic.com">
                  info@dermaclinic.com
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">◷</div>

              <div>
                <h3>Opening Hours</h3>
                <p>
                  Monday – Saturday
                  <br />
                  10:00 AM – 8:00 PM
                </p>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper">

            <form
              className="contact-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you. We will contact you shortly.");
              }}
            >

              <div className="form-row">

                <div className="form-group">
                  <label htmlFor="name">Your Name</label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+92"
                    required
                  />
                </div>

              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">How Can We Help?</label>

                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Tell us how we can help..."
                  required
                />
              </div>

              <button type="submit" className="contact-submit">
                Send Message
                <span>→</span>
              </button>

            </form>

          </div>
        </div>

      </div>
    </section>
  );
}