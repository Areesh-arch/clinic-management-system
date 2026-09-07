import { useState } from "react";
import "../styles/contact.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (status.message) {
      setStatus({
        type: "",
        message: "",
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      setStatus({
        type: "error",
        message: "Please enter your name and phone number.",
      });

      return;
    }

    setIsSubmitting(true);

    setStatus({
      type: "",
      message: "",
    });

    try {
      const response = await fetch(`${API_URL}/crm/leads/public`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.name.trim(),
          phone: formData.phone.trim(),
          source: "website",
          status: "new",
        }),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        let errorMessage =
          "Unable to send your request. Please try again.";

        if (Array.isArray(data?.detail)) {
          errorMessage = data.detail
            .map((error) => error?.msg || "Invalid information.")
            .join(" ");
        } else if (typeof data?.detail === "string") {
          errorMessage = data.detail;
        }

        throw new Error(errorMessage);
      }

      setStatus({
        type: "success",
        message:
          "Thank you. Your request has been received. Our clinic team will contact you shortly.",
      });

      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form submission failed:", error);

      setStatus({
        type: "error",
        message:
          error.message ||
          "Something went wrong. Please try again or contact the clinic directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
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

        <div className="contact-content">
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

          <div className="contact-form-wrapper">
            <form
              className="contact-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label htmlFor="name">Your Name</label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+92 300 0000000"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">How Can We Help?</label>

                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Tell us what you would like to discuss..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              {status.message && (
                <div
                  className={`contact-form-status ${
                    status.type === "success"
                      ? "success"
                      : "error"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                className="contact-submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Sending..."
                  : "Request Consultation"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}