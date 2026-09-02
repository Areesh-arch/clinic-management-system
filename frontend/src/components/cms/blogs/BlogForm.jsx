import { useState } from "react";

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
          disabled={saving}
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
          FEATURED IMAGE
      ================================================= */}

      <div className="cms-field">
        <label>Featured Image URL</label>

        <input
          name="featured_image_url"
          type="text"
          value={form.featured_image_url}
          onChange={handleChange}
          placeholder="https://example.com/blog-image.jpg"
          disabled={saving}
        />
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
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="button"
          className="cms-primary-button"
          onClick={handleSubmit}
          disabled={saving}
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