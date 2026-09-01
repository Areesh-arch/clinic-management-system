import { useState } from "react";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiSave,
} from "react-icons/fi";

const INITIAL_CONTACT = {
  phone: "",
  email: "",
  address: "",
  consultationText: "",
  openingHours: "",
};

function ContactEditor() {
  const [contact, setContact] = useState(
    INITIAL_CONTACT
  );

  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setContact((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 400)
      );

      alert(
        "Contact information saved successfully."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cms-editor-body">
      <div className="cms-information-box">
        <div className="cms-information-icon">
          <FiPhone />
        </div>

        <div>
          <strong>Contact information</strong>

          <p>
            Manage the contact and consultation information
            displayed on your public clinic website.
          </p>
        </div>
      </div>

      <div className="cms-form">
        <div className="cms-field">
          <label>
            <FiPhone />
            Phone Number
          </label>

          <input
            name="phone"
            type="text"
            value={contact.phone}
            onChange={handleChange}
            placeholder="+92 XXX XXXXXXX"
          />
        </div>

        <div className="cms-field">
          <label>
            <FiMail />
            Email Address
          </label>

          <input
            name="email"
            type="email"
            value={contact.email}
            onChange={handleChange}
            placeholder="clinic@example.com"
          />
        </div>

        <div className="cms-field">
          <label>
            <FiMapPin />
            Clinic Address
          </label>

          <textarea
            name="address"
            value={contact.address}
            onChange={handleChange}
            placeholder="Enter your clinic address..."
            rows={4}
          />
        </div>

        <div className="cms-field">
          <label>
            <FiClock />
            Opening Hours
          </label>

          <input
            name="openingHours"
            type="text"
            value={contact.openingHours}
            onChange={handleChange}
            placeholder="Mon - Sat: 10:00 AM - 8:00 PM"
          />
        </div>

        <div className="cms-field">
          <label>Consultation Message</label>

          <textarea
            name="consultationText"
            value={contact.consultationText}
            onChange={handleChange}
            placeholder="Message displayed beside your consultation CTA..."
            rows={5}
          />
        </div>

        <div className="cms-form-actions">
          <button
            type="button"
            className="cms-primary-button"
            onClick={handleSave}
            disabled={saving}
          >
            <FiSave />

            {saving
              ? "Saving..."
              : "Save Contact Information"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactEditor;