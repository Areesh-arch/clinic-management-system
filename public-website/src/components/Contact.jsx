
import { useState } from "react";

import "../styles/contact.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

/*
=========================================================
DEFAULT CONTACT DATA
=========================================================

These values are shown when CMS does not have a value.

CMS values automatically override these defaults.
*/
const DEFAULT_CONTACT = {
  phone: "+92 300 7399150",
  email: "hello@elitedermacare.com",
  address: "Main Boulevard, Lahore, Pakistan",
  whatsapp: "+92 300 7399150",
  openingHours: "Monday – Saturday · 10:00 AM – 7:00 PM",
};

const formatAppointmentDate = (value) => {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatAppointmentTime = (value) => {
  if (!value) return "";

  const [hourString, minuteString] = value.split(":");

  let hour = Number(hourString);
  const minute = (minuteString || "00").slice(0, 2);

  if (Number.isNaN(hour)) {
    return value;
  }

  const suffix = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12;

  return `${hour}:${minute} ${suffix}`;
};

export default function Contact({ siteSettings }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    gender: "",
    dateOfBirth: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const [bookingConfirmation, setBookingConfirmation] =
    useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const phone =
    siteSettings?.phone ||
    siteSettings?.contact_phone ||
    DEFAULT_CONTACT.phone;

  const email =
    siteSettings?.email ||
    siteSettings?.contact_email ||
    DEFAULT_CONTACT.email;

  const address =
    siteSettings?.address ||
    siteSettings?.contact_address ||
    DEFAULT_CONTACT.address;

  const whatsapp =
    siteSettings?.whatsapp ||
    siteSettings?.whatsapp_number ||
    siteSettings?.contact_whatsapp ||
    DEFAULT_CONTACT.whatsapp;

  const openingHours =
    siteSettings?.opening_hours ||
    siteSettings?.contact_opening_hours ||
    DEFAULT_CONTACT.openingHours;

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

    /*
    =====================================================
    REQUIRED FIELDS
    =====================================================
    */

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.gender ||
      !formData.dateOfBirth ||
      !formData.appointmentDate ||
      !formData.appointmentTime
    ) {
      setStatus({
        type: "error",
        message:
          "Please complete your name, phone, gender, date of birth, appointment date, and appointment time.",
      });

      return;
    }

    setIsSubmitting(true);

    setStatus({
      type: "",
      message: "",
    });

    setBookingConfirmation(null);

    try {
      /*
      =====================================================
      PUBLIC APPOINTMENT
      =====================================================

      IMPORTANT:
      We intentionally do NOT send:

      - tenant_id
      - patient_id
      - source

      The backend resolves the tenant from the website
      hostname/origin, finds or creates the patient, and
      forces source = WEBSITE.
      */

      const response = await fetch(
        `${API_URL}/appointments/public`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim() || null,
            message: formData.message.trim() || null,
            gender: formData.gender,
            date_of_birth: formData.dateOfBirth,
            appointment_date: formData.appointmentDate,
            appointment_time: formData.appointmentTime,
            duration_minutes: 30,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        let errorMessage =
          "Unable to book your appointment. Please try again.";

        if (Array.isArray(data?.detail)) {
          errorMessage = data.detail
            .map(
              (error) =>
                error?.msg ||
                "Invalid information."
            )
            .join(" ");
        } else if (typeof data?.detail === "string") {
          errorMessage = data.detail;
        }

        throw new Error(errorMessage);
      }

      /*
      =====================================================
      SUCCESS CONFIRMATION
      =====================================================
      */

      setBookingConfirmation({
        patientName:
          data?.patient_name ||
          formData.name.trim(),

        appointmentDate:
          data?.appointment_date ||
          formData.appointmentDate,

        appointmentTime:
          data?.appointment_time ||
          formData.appointmentTime,
      });

      /*
      Clear the form after successful booking.
      The confirmation information is stored separately
      so it remains visible after the form is cleared.
      */
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
        gender: "",
        dateOfBirth: "",
        appointmentDate: "",
        appointmentTime: "",
      });
    } catch (error) {
      console.error(
        "Public appointment booking failed:",
        error
      );

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

  const cleanPhoneForLink = phone
    ? phone.replace(/[^\d+]/g, "")
    : "";

  const cleanWhatsAppForLink = whatsapp
    ? whatsapp.replace(/\D/g, "")
    : "";

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-heading">
          <span className="contact-label">
            BOOK YOUR APPOINTMENT
          </span>

          <h2>
            Begin Your Journey
            <span> to Better Skin</span>
          </h2>

          <p>
            Ready to take the next step? Choose your
            preferred appointment date and time, and
            our clinic team will contact you to confirm
            your visit.
          </p>
        </div>

        <div className="contact-content">
          {/* =================================================
              CONTACT INFORMATION
          ================================================= */}

          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">⌖</div>

              <div>
                <h3>Visit Our Clinic</h3>
                <p>{address}</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">☎</div>

              <div>
                <h3>Call Us</h3>

                <a href={`tel:${cleanPhoneForLink}`}>
                  {phone}
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">✉</div>

              <div>
                <h3>Email</h3>

                <a href={`mailto:${email}`}>
                  {email}
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">◉</div>

              <div>
                <h3>WhatsApp</h3>

                <a
                  href={`https://wa.me/${cleanWhatsAppForLink}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {whatsapp}
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">◷</div>

              <div>
                <h3>Opening Hours</h3>
                <p>{openingHours}</p>
              </div>
            </div>
          </div>

          {/* =================================================
              APPOINTMENT FORM
          ================================================= */}

          <div className="contact-form-wrapper">
            {bookingConfirmation ? (
              /*
              =================================================
              BOOKING CONFIRMATION
              =================================================
              */

              <div className="booking-confirmation">
                <div className="booking-confirmation-icon">
                  ✓
                </div>

                <div className="booking-confirmation-heading">
                  <span>APPOINTMENT RECEIVED</span>

                  <h3>
                    Appointment Booked Successfully
                  </h3>

                  <p>
                    Thank you for choosing our clinic.
                    Your appointment details are below.
                  </p>
                </div>

                <div className="booking-details">
                  <div className="booking-detail">
                    <span>Patient</span>

                    <strong>
                      {bookingConfirmation.patientName}
                    </strong>
                  </div>

                  <div className="booking-detail">
                    <span>Date</span>

                    <strong>
                      {formatAppointmentDate(
                        bookingConfirmation.appointmentDate
                      )}
                    </strong>
                  </div>

                  <div className="booking-detail">
                    <span>Time</span>

                    <strong>
                      {formatAppointmentTime(
                        bookingConfirmation.appointmentTime
                      )}
                    </strong>
                  </div>
                </div>

                <p className="booking-confirmation-note">
                  Our clinic team will contact you if any
                  further confirmation is required.
                </p>

                <button
                  type="button"
                  className="contact-submit booking-new-button"
                  onClick={() => {
                    setBookingConfirmation(null);
                    setStatus({
                      type: "",
                      message: "",
                    });
                  }}
                >
                  Book Another Appointment
                </button>
              </div>
            ) : (
              <form
                className="contact-form"
                onSubmit={handleSubmit}
              >
                {/* NAME */}
                <div className="form-group">
                  <label htmlFor="name">
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* PHONE */}
                <div className="form-group">
                  <label htmlFor="phone">
                    Phone Number
                  </label>

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

                {/* EMAIL */}
                <div className="form-group">
                  <label htmlFor="email">
                    Email Address
                    <span> (Optional)</span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* GENDER */}
                <div className="form-group">
                  <label htmlFor="gender">
                    Gender
                  </label>

                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select gender
                    </option>

                    <option value="male">
                      Male
                    </option>

                    <option value="female">
                      Female
                    </option>

                    <option value="other">
                      Other
                    </option>
                  </select>
                </div>

                {/* DATE OF BIRTH */}
                <div className="form-group">
                  <label htmlFor="dateOfBirth">
                    Date of Birth
                  </label>

                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* APPOINTMENT DATE */}
                <div className="form-group">
                  <label htmlFor="appointmentDate">
                    Appointment Date
                  </label>

                  <input
                    id="appointmentDate"
                    name="appointmentDate"
                    type="date"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    required
                  />
                </div>

                {/* APPOINTMENT TIME */}
                <div className="form-group">
                  <label htmlFor="appointmentTime">
                    Preferred Appointment Time
                  </label>

                  <input
                    id="appointmentTime"
                    name="appointmentTime"
                    type="time"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* MESSAGE */}
                <div className="form-group">
                  <label htmlFor="message">
                    How Can We Help?
                    <span> (Optional)</span>
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Tell us what you would like to discuss..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                {/* ERROR STATUS */}
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

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="contact-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Booking..."
                    : "Book Appointment"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
