import { useEffect, useState } from "react";
import {
  FiInfo,
  FiRotateCcw,
  FiSave,
  FiUpload,
  FiX,
} from "react-icons/fi";

import cmsService from "../../../services/cmsService";

const INITIAL_HOME_PAGE = {
  eyebrow: "AESTHETIC & DERMATOLOGY",
  heading: "Your Skin. Your Confidence.",
  description:
    "Personalised dermatology and aesthetic care designed around your individual skin goals.",
  image_url: null,
};

function HomepageEditor() {
  const [homepage, setHomepage] = useState(INITIAL_HOME_PAGE);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // LOAD EXISTING HOMEPAGE SETTINGS
  // =====================================================

  useEffect(() => {
    const loadHomepage = async () => {
      try {
        const data = await cmsService.getSiteSettings();

        if (data) {
          setHomepage({
            eyebrow:
              data.homepage_eyebrow ??
              INITIAL_HOME_PAGE.eyebrow,

            heading:
              data.homepage_title ??
              INITIAL_HOME_PAGE.heading,

            description:
              data.homepage_description ??
              INITIAL_HOME_PAGE.description,

            image_url:
              data.homepage_image_url ?? null,
          });
        }
      } catch (error) {
        console.log(
          "Homepage settings not found yet:",
          error.message
        );
      } finally {
        setLoading(false);
      }
    };

    loadHomepage();
  }, []);

  // =====================================================
  // TEXT FIELD CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setHomepage((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // IMAGE SELECT
  // =====================================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Allowed image types
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Invalid image type. Please choose a JPG, PNG, or WEBP image."
      );

      event.target.value = "";
      return;
    }

    // Maximum 10 MB
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Image size must not exceed 10 MB.");

      event.target.value = "";
      return;
    }

    // Remove old preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Create new local preview
    const newPreviewUrl =
      URL.createObjectURL(file);

    setSelectedImage(file);
    setPreviewUrl(newPreviewUrl);
  };

  // =====================================================
  // REMOVE SELECTED IMAGE
  // =====================================================

  const handleRemoveSelectedImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(null);
    setPreviewUrl(null);

    const input =
      document.getElementById(
        "homepage-image"
      );

    if (input) {
      input.value = "";
    }
  };

  // =====================================================
  // RESET
  // =====================================================

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(null);
    setPreviewUrl(null);

    setHomepage(INITIAL_HOME_PAGE);

    const input =
      document.getElementById(
        "homepage-image"
      );

    if (input) {
      input.value = "";
    }
  };

  // =====================================================
  // SAVE HOMEPAGE
  // =====================================================

  const handleSave = async () => {
    if (!homepage.heading.trim()) {
      alert("Please enter a main heading.");
      return;
    }

    setSaving(true);

    try {
      // Start with the existing image URL
      let imageUrl = homepage.image_url;

      // -------------------------------------------------
      // UPLOAD NEW IMAGE
      // -------------------------------------------------

      if (selectedImage) {
        const uploadedImage =
          await cmsService.uploadImage(
            selectedImage
          );

        imageUrl =
          uploadedImage?.image_url || null;

        if (!imageUrl) {
          throw new Error(
            "Image uploaded but no image URL was returned."
          );
        }
      }

      // -------------------------------------------------
      // SAVE HOMEPAGE SETTINGS
      // -------------------------------------------------

      await cmsService.saveSiteSettings({
        homepage_eyebrow:
          homepage.eyebrow.trim() || null,

        homepage_title:
          homepage.heading.trim(),

        homepage_description:
          homepage.description.trim() || null,

        homepage_image_url:
          imageUrl || null,
      });

      // Update local state
      setHomepage((previous) => ({
        ...previous,
        image_url: imageUrl,
      }));

      // Remove temporary preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedImage(null);
      setPreviewUrl(null);

      const input =
        document.getElementById(
          "homepage-image"
        );

      if (input) {
        input.value = "";
      }

      alert(
        "Homepage content saved successfully."
      );
    } catch (error) {
      console.error(
        "Homepage save failed:",
        error
      );

      alert(
        error.message ||
          "Failed to save homepage content."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // CONVERT IMAGE URL TO BACKEND URL
  // =====================================================

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return null;
    }

    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      return imageUrl;
    }

    return `http://127.0.0.1:8000${imageUrl}`;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="cms-editor-body">
        <div className="cms-information-box">
          <div className="cms-information-icon">
            <FiInfo />
          </div>

          <div>
            <strong>
              Loading homepage...
            </strong>

            <p>
              Loading your current homepage
              settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // CURRENT IMAGE
  // =====================================================

  const currentImage =
    previewUrl ||
    getImageUrl(homepage.image_url);

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="cms-editor-body">
      {/* =================================================
          INFORMATION
      ================================================= */}

      <div className="cms-information-box">
        <div className="cms-information-icon">
          <FiInfo />
        </div>

        <div>
          <strong>
            Homepage content
          </strong>

          <p>
            These fields control the main
            introduction displayed on your
            public clinic website.
          </p>
        </div>
      </div>

      <div className="cms-form">

        {/* =================================================
            EYEBROW
        ================================================= */}

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

        {/* =================================================
            MAIN HEADING
        ================================================= */}

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

        {/* =================================================
            DESCRIPTION
        ================================================= */}

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

        {/* =================================================
            HOMEPAGE IMAGE
        ================================================= */}

        <div className="cms-field">
          <label>
            Homepage Image
          </label>

          <div className="cms-image-upload">

            {/* FILE CHOOSER BUTTON */}

            <label
              htmlFor="homepage-image"
              className="cms-image-upload-button"
            >
              <FiUpload />

              {selectedImage
                ? "Choose Different Image"
                : "Choose Image"}
            </label>

            {/* HIDDEN FILE INPUT */}

            <input
              id="homepage-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              hidden
            />

            <p className="cms-image-help">
              JPG, PNG or WEBP. Maximum size:
              10 MB.
            </p>
          </div>

          {/* =================================================
              IMAGE PREVIEW
          ================================================= */}

          {currentImage && (
            <div className="cms-image-preview">

              <img
                src={currentImage}
                alt="Homepage preview"
              />

              {/* REMOVE BUTTON */}

              {selectedImage && (
                <button
                  type="button"
                  className="cms-image-remove-button"
                  onClick={
                    handleRemoveSelectedImage
                  }
                  title="Remove selected image"
                >
                  <FiX />
                </button>
              )}
            </div>
          )}
        </div>

        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <div className="cms-form-actions">

          <button
            type="button"
            className="cms-secondary-button"
            onClick={handleReset}
            disabled={saving}
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

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default HomepageEditor;