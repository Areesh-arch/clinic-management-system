import { useState } from "react";
import { FiInfo, FiRotateCcw, FiSave } from "react-icons/fi";

const INITIAL_HOME_PAGE = {
  eyebrow: "AESTHETIC & DERMATOLOGY",
  heading: "Your Skin. Your Confidence.",
  description:
    "Personalised dermatology and aesthetic care designed around your individual skin goals.",
};

function HomepageEditor() {
  const [homepage, setHomepage] = useState(
    INITIAL_HOME_PAGE
  );

  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setHomepage((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setHomepage(INITIAL_HOME_PAGE);
  };

  const handleSave = async () => {
    if (!homepage.heading.trim()) {
      alert("Please enter a main heading.");
      return;
    }

    setSaving(true);

    try {
      // Backend integration will be connected here.
      await new Promise((resolve) =>
        setTimeout(resolve, 400)
      );

      alert("Homepage content saved successfully.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cms-editor-body">
      <div className="cms-information-box">
        <div className="cms-information-icon">
          <FiInfo />
        </div>

        <div>
          <strong>Homepage content</strong>

          <p>
            These fields control the main introduction displayed
            on your public clinic website.
          </p>
        </div>
      </div>

      <div className="cms-form">
        <div className="cms-field">
          <label htmlFor="homepage-eyebrow">
            Eyebrow
          </label>

          <input
            id="homepage-eyebrow"
            name="eyebrow"
            type="text"
            value={homepage.eyebrow}
            onChange={handleChange}
            placeholder="AESTHETIC & DERMATOLOGY"
          />
        </div>

        <div className="cms-field">
          <label htmlFor="homepage-heading">
            Main Heading
          </label>

          <input
            id="homepage-heading"
            name="heading"
            type="text"
            value={homepage.heading}
            onChange={handleChange}
            placeholder="Your Skin. Your Confidence."
          />
        </div>

        <div className="cms-field">
          <label htmlFor="homepage-description">
            Introduction
          </label>

          <textarea
            id="homepage-description"
            name="description"
            value={homepage.description}
            onChange={handleChange}
            placeholder="Write the introduction for your website..."
            rows={6}
          />
        </div>

        <div className="cms-form-actions">
          <button
            type="button"
            className="cms-secondary-button"
            onClick={handleReset}
          >
            <FiRotateCcw />
            Reset
          </button>

          <button
            type="button"
            className="cms-primary-button"
            onClick={handleSave}
            disabled={saving}
          >
            <FiSave />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomepageEditor;