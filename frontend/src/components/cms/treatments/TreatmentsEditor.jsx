import { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiGrid,
  FiUpload,
  FiImage,
  FiX,
} from "react-icons/fi";
import cmsService from "../../../services/cmsService";

function TreatmentsEditor({ onStatsChange }) {
  const [treatments, setTreatments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    short_description: "",
    description: "",
    image_url: "",
    display_order: 0,
    is_active: true,
  });

  const [imagePreview, setImagePreview] = useState("");

  // =========================================================
  // LOAD TREATMENTS
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const loadTreatments = async () => {
      try {
        setLoading(true);

        const data = await cmsService.getServices();

        if (mounted) {
          setTreatments(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to load treatments:", error);

        if (mounted) {
          alert(
            error.message || "Failed to load treatments."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadTreatments();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================================================
  // UPDATE CMS SUMMARY STATS
  // =========================================================

  useEffect(() => {
    onStatsChange?.({
      treatments: treatments.length,
    });
  }, [treatments, onStatsChange]);

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      short_description: "",
      description: "",
      image_url: "",
      display_order: 0,
      is_active: true,
    });

    setImagePreview("");
    setEditingId(null);
    setShowForm(false);
    setUploadingImage(false);
  };

  // =========================================================
  // OPEN ADD FORM
  // =========================================================

  const openAddForm = () => {
    setForm({
      name: "",
      slug: "",
      short_description: "",
      description: "",
      image_url: "",
      display_order: treatments.length,
      is_active: true,
    });

    setImagePreview("");
    setEditingId(null);
    setShowForm(true);
  };

  // =========================================================
  // OPEN EDIT FORM
  // =========================================================

  const openEditForm = (treatment) => {
    const existingImage = treatment.image_url || "";

    setForm({
      name: treatment.name || "",
      slug: treatment.slug || "",
      short_description:
        treatment.short_description || "",
      description: treatment.description || "",
      image_url: existingImage,
      display_order: treatment.display_order ?? 0,
      is_active: treatment.is_active ?? true,
    });

    setImagePreview(existingImage);
    setEditingId(treatment.id);
    setShowForm(true);
  };

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // AUTO-GENERATE SLUG
  // =========================================================

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (event) => {
    const value = event.target.value;

    setForm((previous) => ({
      ...previous,
      name: value,
      ...(editingId
        ? {}
        : {
            slug: generateSlug(value),
          }),
    }));
  };

  // =========================================================
  // UPLOAD IMAGE
  // =========================================================

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Please upload a JPG, PNG, or WEBP image."
      );

      event.target.value = "";
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Image size must be 10 MB or less.");

      event.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);

      // Local preview while uploading
      const localPreview =
        URL.createObjectURL(file);

      setImagePreview(localPreview);

      const result =
        await cmsService.uploadImage(file);

      if (!result?.image_url) {
        throw new Error(
          "Image upload succeeded but no image URL was returned."
        );
      }

      setForm((previous) => ({
        ...previous,
        image_url: result.image_url,
      }));

      setImagePreview(result.image_url);

      URL.revokeObjectURL(localPreview);
    } catch (error) {
      console.error(
        "Failed to upload treatment image:",
        error
      );

      setImagePreview(form.image_url || "");

      alert(
        error.message ||
          "Failed to upload treatment image."
      );
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  // =========================================================
  // REMOVE SELECTED IMAGE
  // =========================================================

  const removeImage = () => {
    setForm((previous) => ({
      ...previous,
      image_url: "",
    }));

    setImagePreview("");
  };

  // =========================================================
  // SAVE / UPDATE TREATMENT
  // =========================================================

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert("Please enter a treatment name.");
      return;
    }

    if (form.name.trim().length < 2) {
      alert(
        "Treatment name must be at least 2 characters long."
      );
      return;
    }

    if (!form.slug.trim()) {
      alert("Please enter a treatment slug.");
      return;
    }

    if (form.slug.trim().length < 2) {
      alert(
        "Treatment slug must be at least 2 characters long."
      );
      return;
    }

    if (uploadingImage) {
      alert("Please wait for the image upload to finish.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        short_description:
          form.short_description.trim() || null,
        description:
          form.description.trim() || null,
        image_url:
          form.image_url.trim() || null,
        display_order:
          Number(form.display_order) || 0,
        is_active: form.is_active,
      };

      if (editingId) {
        const updatedTreatment =
          await cmsService.updateService(
            editingId,
            payload
          );

        setTreatments((previous) =>
          previous.map((treatment) =>
            treatment.id === editingId
              ? updatedTreatment
              : treatment
          )
        );
      } else {
        const createdTreatment =
          await cmsService.createService(payload);

        setTreatments((previous) => [
          createdTreatment,
          ...previous,
        ]);
      }

      resetForm();
    } catch (error) {
      console.error(
        "Failed to save treatment:",
        error
      );

      alert(
        error.message || "Failed to save treatment."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE TREATMENT
  // =========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this treatment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await cmsService.deleteService(id);

      setTreatments((previous) =>
        previous.filter(
          (treatment) => treatment.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete treatment:",
        error
      );

      alert(
        error.message || "Failed to delete treatment."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="cms-editor-body">
      <div className="cms-section-toolbar">
        <div>
          <h3>Website Treatments</h3>

          <p>
            Manage the treatments and services displayed on
            your public clinic website.
          </p>
        </div>

        <button
          type="button"
          className="cms-primary-button"
          onClick={openAddForm}
          disabled={loading || saving}
        >
          <FiPlus />
          Add Treatment
        </button>
      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      {showForm && (
        <div className="cms-result-form">
          <div className="cms-result-form-header">
            <div>
              <span className="cms-editor-eyebrow">
                {editingId
                  ? "EDIT TREATMENT"
                  : "NEW TREATMENT"}
              </span>

              <h3>
                {editingId
                  ? "Edit Treatment"
                  : "Add Treatment"}
              </h3>
            </div>

            <button
              type="button"
              className="cms-close-button"
              onClick={resetForm}
              disabled={saving || uploadingImage}
            >
              ×
            </button>
          </div>

          {/* NAME */}

          <div className="cms-field">
            <label>Treatment Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleNameChange}
              placeholder="e.g. Acne Treatment"
              disabled={saving}
            />
          </div>

          {/* SLUG */}

          <div className="cms-field">
            <label>Slug</label>

            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="e.g. acne-treatment"
              disabled={saving}
            />

            <small>
              Used in the website URL.
            </small>
          </div>

          {/* SHORT DESCRIPTION */}

          <div className="cms-field">
            <label>Short Description</label>

            <input
              type="text"
              name="short_description"
              value={form.short_description}
              onChange={handleChange}
              placeholder="Short description for treatment cards..."
              maxLength={500}
              disabled={saving}
            />
          </div>

          {/* DESCRIPTION */}

          <div className="cms-field">
            <label>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe this treatment..."
              rows={5}
              disabled={saving}
            />
          </div>

          {/* =================================================
              TREATMENT IMAGE UPLOAD
          ================================================= */}

          <div className="cms-field">
            <label>Treatment Picture</label>

            <div
              style={{
                border: "1px dashed #b4935a",
                borderRadius: "14px",
                padding: "16px",
                background: "#fffdf8",
              }}
            >
              {imagePreview ? (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "420px",
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Treatment preview"
                    style={{
                      width: "100%",
                      height: "220px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      display: "block",
                    }}
                    onError={() => {
                      setImagePreview("");
                    }}
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={saving || uploadingImage}
                    title="Remove image"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      width: "34px",
                      height: "34px",
                      border: "none",
                      borderRadius: "50%",
                      background: "#173B32",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="treatment-image-upload"
                  style={{
                    minHeight: "150px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor:
                      saving || uploadingImage
                        ? "not-allowed"
                        : "pointer",
                    color: "#173B32",
                    textAlign: "center",
                  }}
                >
                  <FiImage size={32} />

                  <strong>
                    {uploadingImage
                      ? "Uploading picture..."
                      : "Upload Treatment Picture"}
                  </strong>

                  <small>
                    JPG, PNG or WEBP • Maximum 10 MB
                  </small>

                  {!uploadingImage && (
                    <span
                      className="cms-primary-button"
                      style={{
                        marginTop: "6px",
                        display: "inline-flex",
                      }}
                    >
                      <FiUpload />
                      Choose Picture
                    </span>
                  )}
                </label>
              )}

              <input
                id="treatment-image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={saving || uploadingImage}
                style={{ display: "none" }}
              />

              {imagePreview && (
                <label
                  htmlFor="treatment-image-upload"
                  style={{
                    marginTop: "12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    cursor:
                      saving || uploadingImage
                        ? "not-allowed"
                        : "pointer",
                    color: "#173B32",
                    fontWeight: 600,
                  }}
                >
                  <FiUpload />
                  {uploadingImage
                    ? "Uploading..."
                    : "Change Picture"}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    disabled={
                      saving || uploadingImage
                    }
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>
          </div>

          {/* DISPLAY ORDER */}

          <div className="cms-field">
            <label>Display Order</label>

            <input
              type="number"
              name="display_order"
              min="0"
              value={form.display_order}
              onChange={handleChange}
              disabled={saving}
            />
          </div>

          {/* ACTIVE */}

          <label className="cms-publish-toggle">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  is_active:
                    event.target.checked,
                }))
              }
              disabled={saving}
            />

            <span>
              <strong>
                Publish on website
              </strong>

              <small>
                Active treatments will appear on the
                public website.
              </small>
            </span>
          </label>

          {/* ACTIONS */}

          <div className="cms-form-actions">
            <button
              type="button"
              className="cms-secondary-button"
              onClick={resetForm}
              disabled={saving || uploadingImage}
            >
              Cancel
            </button>

            <button
              type="button"
              className="cms-primary-button"
              onClick={handleSave}
              disabled={saving || uploadingImage}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Treatment"
                : "Save Treatment"}
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          TREATMENTS LIST
      ===================================================== */}

      <div className="cms-results-list">
        {loading ? (
          <div className="cms-empty-state">
            <div className="cms-empty-icon">
              <FiGrid />
            </div>

            <h3>Loading treatments...</h3>

            <p>
              Loading treatments from your clinic database.
            </p>
          </div>
        ) : treatments.length === 0 ? (
          <div className="cms-empty-state">
            <div className="cms-empty-icon">
              <FiGrid />
            </div>

            <h3>No treatments yet</h3>

            <p>
              Add treatments that you want visitors to see
              on your website.
            </p>

            <button
              type="button"
              className="cms-primary-button"
              onClick={openAddForm}
            >
              <FiPlus />
              Add Treatment
            </button>
          </div>
        ) : (
          treatments.map((treatment) => (
            <article
              className="cms-content-card"
              key={treatment.id}
            >
              <div className="cms-content-card-main">
                <span className="cms-result-label">
                  TREATMENT
                </span>

                <h3>{treatment.name}</h3>

                {treatment.short_description && (
                  <p>
                    {treatment.short_description}
                  </p>
                )}

                {treatment.description && (
                  <p>
                    {treatment.description}
                  </p>
                )}

                <small>
                  Slug: {treatment.slug}
                </small>
              </div>

              <div className="cms-content-card-actions">
                <span
                  className={
                    treatment.is_active
                      ? "cms-published"
                      : "cms-unpublished"
                  }
                >
                  {treatment.is_active
                    ? "Published"
                    : "Draft"}
                </span>

                <button
                  type="button"
                  className="cms-icon-button"
                  title="Edit"
                  onClick={() =>
                    openEditForm(treatment)
                  }
                  disabled={
                    deletingId === treatment.id ||
                    saving
                  }
                >
                  <FiEdit3 />
                </button>

                <button
                  type="button"
                  className="cms-icon-button danger"
                  title="Delete"
                  onClick={() =>
                    handleDelete(treatment.id)
                  }
                  disabled={
                    deletingId === treatment.id ||
                    saving
                  }
                >
                  <FiTrash2 />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default TreatmentsEditor;