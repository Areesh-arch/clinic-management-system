import { useState } from "react";
import {
  FiUpload,
  FiImage,
  FiX,
} from "react-icons/fi";
import cmsService from "../../../services/cmsService";

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function BlogForm({
  onSave,
  onCancel,
  saving = false,
}) {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "",
    excerpt: "",
    content: "",
    featured_image_url: "",
    author_name: "",
    display_order: 0,
    is_published: true,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleTitleChange = (event) => {
    const title = event.target.value;

    setForm((previous) => ({
      ...previous,
      title,
      slug: createSlug(title),
    }));
  };

  // =========================================================
  // UPLOAD FEATURED IMAGE
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
        featured_image_url:
          result.image_url,
      }));

      setImagePreview(result.image_url);

      URL.revokeObjectURL(localPreview);
    } catch (error) {
      console.error(
        "Failed to upload blog image:",
        error
      );

      setImagePreview(
        form.featured_image_url || ""
      );

      alert(
        error.message ||
          "Failed to upload featured image."
      );
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  // =========================================================
  // REMOVE IMAGE
  // =========================================================

  const removeImage = () => {
    setForm((previous) => ({
      ...previous,
      featured_image_url: "",
    }));

    setImagePreview("");
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async () => {
    const title = form.title.trim();
    const slug = form.slug.trim();
    const category = form.category.trim();
    const excerpt = form.excerpt.trim();
    const content = form.content.trim();
    const featuredImageUrl =
      form.featured_image_url.trim();
    const authorName = form.author_name.trim();

    if (!title) {
      alert("Please enter an article title.");
      return;
    }

    if (title.length < 2) {
      alert(
        "Article title must contain at least 2 characters."
      );
      return;
    }

    if (!slug) {
      alert("Please enter an article slug.");
      return;
    }

    if (!content) {
      alert("Please enter article content.");
      return;
    }

    if (uploadingImage) {
      alert(
        "Please wait for the image upload to finish."
      );
      return;
    }

    const blogData = {
      title,
      slug,
      excerpt: excerpt || null,
      content: content || null,
      featured_image_url:
        featuredImageUrl || null,
      author_name: authorName || null,
      category: category || null,
      display_order:
        Number(form.display_order) || 0,
      is_published: Boolean(
        form.is_published
      ),
      published_at: form.is_published
        ? new Date().toISOString()
        : null,
    };

    await onSave(blogData);
  };

  return (
    <div className="cms-result-form">
      <div className="cms-result-form-header">
        <div>
          <span className="cms-editor-eyebrow">
            NEW ARTICLE
          </span>

          <h3>Create Blog Article</h3>
        </div>

        <button
          type="button"
          className="cms-close-button"
          onClick={onCancel}
          disabled={saving || uploadingImage}
        >
          ×
        </button>
      </div>

      {/* =================================================
          TITLE
      ================================================= */}

      <div className="cms-field">
        <label>Article Title</label>

        <input
          name="title"
          type="text"
          value={form.title}
          onChange={handleTitleChange}
          placeholder="e.g. How to Build a Healthy Skincare Routine"
          disabled={saving}
        />
      </div>

      {/* =================================================
          SLUG
      ================================================= */}

      <div className="cms-field">
        <label>URL Slug</label>

        <input
          name="slug"
          type="text"
          value={form.slug}
          onChange={handleChange}
          placeholder="healthy-skincare-routine"
          disabled={saving}
        />

        <small>
          This will be used in the public website URL.
        </small>
      </div>

      {/* =================================================
          CATEGORY
      ================================================= */}

      <div className="cms-field">
        <label>Category</label>

        <input
          name="category"
          type="text"
          value={form.category}
          onChange={handleChange}
          placeholder="e.g. Skincare"
          disabled={saving}
        />
      </div>

      {/* =================================================
          AUTHOR
      ================================================= */}

      <div className="cms-field">
        <label>Author Name</label>

        <input
          name="author_name"
          type="text"
          value={form.author_name}
          onChange={handleChange}
          placeholder="e.g. Dr. Sarah Ahmed"
          disabled={saving}
        />
      </div>

      {/* =================================================
          FEATURED IMAGE UPLOAD
      ================================================= */}

      <div className="cms-field">
        <label>Featured Picture</label>

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
                maxWidth: "520px",
              }}
            >
              <img
                src={imagePreview}
                alt="Blog featured preview"
                style={{
                  width: "100%",
                  height: "240px",
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
                disabled={
                  saving || uploadingImage
                }
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
              htmlFor="blog-image-upload"
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
                  : "Upload Featured Picture"}
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
            id="blog-image-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            disabled={saving || uploadingImage}
            style={{ display: "none" }}
          />

          {imagePreview && (
            <label
              htmlFor="blog-image-upload"
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
            </label>
          )}
        </div>
      </div>

      {/* =================================================
          EXCERPT
      ================================================= */}

      <div className="cms-field">
        <label>Short Description</label>

        <textarea
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          placeholder="Short introduction shown on the blog card..."
          rows={4}
          disabled={saving}
        />
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="cms-field">
        <label>Article Content</label>

        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Write the complete article..."
          rows={10}
          disabled={saving}
        />
      </div>

      {/* =================================================
          DISPLAY ORDER
      ================================================= */}

      <div className="cms-field">
        <label>Display Order</label>

        <input
          name="display_order"
          type="number"
          min="0"
          value={form.display_order}
          onChange={handleChange}
          disabled={saving}
        />
      </div>

      {/* =================================================
          PUBLISH
      ================================================= */}

      <label className="cms-publish-toggle">
        <input
          type="checkbox"
          checked={form.is_published}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              is_published:
                event.target.checked,
            }))
          }
          disabled={saving}
        />

        <span>
          <strong>Publish article</strong>

          <small>
            Published articles will be visible on your public
            website.
          </small>
        </span>
      </label>

      {/* =================================================
          ACTIONS
      ================================================= */}

      <div className="cms-form-actions">
        <button
          type="button"
          className="cms-secondary-button"
          onClick={onCancel}
          disabled={saving || uploadingImage}
        >
          Cancel
        </button>

        <button
          type="button"
          className="cms-primary-button"
          onClick={handleSubmit}
          disabled={saving || uploadingImage}
        >
          {saving
            ? "Saving..."
            : "Save Article"}
        </button>
      </div>
    </div>
  );
}

export default BlogForm;