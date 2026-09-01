import { useState } from "react";

function BlogForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    published: true,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      alert("Please enter an article title.");
      return;
    }

    if (!form.content.trim()) {
      alert("Please enter article content.");
      return;
    }

    onSave({
      ...form,
      title: form.title.trim(),
      category: form.category.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
    });
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
        >
          ×
        </button>
      </div>

      <div className="cms-field">
        <label>Article Title</label>

        <input
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. How to Build a Healthy Skincare Routine"
        />
      </div>

      <div className="cms-field">
        <label>Category</label>

        <input
          name="category"
          type="text"
          value={form.category}
          onChange={handleChange}
          placeholder="e.g. Skincare"
        />
      </div>

      <div className="cms-field">
        <label>Short Description</label>

        <textarea
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          placeholder="Short introduction shown on the blog card..."
          rows={4}
        />
      </div>

      <div className="cms-field">
        <label>Article Content</label>

        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Write the complete article..."
          rows={10}
        />
      </div>

      <label className="cms-publish-toggle">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              published: event.target.checked,
            }))
          }
        />

        <span>
          <strong>Publish article</strong>

          <small>
            Published articles will be visible on your public
            website.
          </small>
        </span>
      </label>

      <div className="cms-form-actions">
        <button
          type="button"
          className="cms-secondary-button"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="button"
          className="cms-primary-button"
          onClick={handleSubmit}
        >
          Save Article
        </button>
      </div>
    </div>
  );
}

export default BlogForm;