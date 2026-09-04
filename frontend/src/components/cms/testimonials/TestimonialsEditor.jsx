import { useEffect, useState } from "react";
import {
  FiEdit3,
  FiMessageSquare,
  FiPlus,
  FiStar,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import { apiRequest } from "../../../services/api";

const EMPTY_FORM = {
  patient_name: "",
  feedback: "",
  rating: 5,
  display_order: 0,
  is_active: true,
};

function TestimonialsEditor() {
  const [testimonials, setTestimonials] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(
        "/cms/testimonials/"
      );

      setTestimonials(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Failed to load testimonials:",
        err
      );

      setError(
        err.message ||
          "Unable to load patient feedback."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
    setFormOpen(true);
  };

  const openEditForm = (testimonial) => {
    setEditingId(testimonial.id);

    setForm({
      patient_name:
        testimonial.patient_name || "",
      feedback:
        testimonial.feedback || "",
      rating:
        testimonial.rating || 5,
      display_order:
        testimonial.display_order || 0,
      is_active:
        testimonial.is_active ?? true,
    });

    setError("");
    setSuccess("");
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) {
      return;
    }

    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : name === "rating" ||
              name === "display_order"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        patient_name:
          form.patient_name.trim(),
        feedback:
          form.feedback.trim(),
        rating: Number(form.rating),
        display_order:
          Number(form.display_order),
        is_active: Boolean(form.is_active),
      };

      if (!payload.patient_name) {
        throw new Error(
          "Please enter the patient name."
        );
      }

      if (!payload.feedback) {
        throw new Error(
          "Please enter the patient feedback."
        );
      }

      if (editingId) {
        await apiRequest(
          `/cms/testimonials/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );

        setSuccess(
          "Patient feedback updated successfully."
        );
      } else {
        await apiRequest(
          "/cms/testimonials/",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );

        setSuccess(
          "Patient feedback added successfully."
        );
      }

      await loadTestimonials();

      setFormOpen(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error(
        "Failed to save testimonial:",
        err
      );

      setError(
        err.message ||
          "Unable to save patient feedback."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (testimonial) => {
    const confirmed = window.confirm(
      `Delete the feedback from ${testimonial.patient_name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await apiRequest(
        `/cms/testimonials/${testimonial.id}`,
        {
          method: "DELETE",
        }
      );

      setTestimonials((previous) =>
        previous.filter(
          (item) =>
            item.id !== testimonial.id
        )
      );

      setSuccess(
        "Patient feedback deleted successfully."
      );
    } catch (err) {
      console.error(
        "Failed to delete testimonial:",
        err
      );

      setError(
        err.message ||
          "Unable to delete patient feedback."
      );
    }
  };

  const toggleActive = async (testimonial) => {
    try {
      setError("");
      setSuccess("");

      const updated = await apiRequest(
        `/cms/testimonials/${testimonial.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            is_active:
              !testimonial.is_active,
          }),
        }
      );

      setTestimonials((previous) =>
        previous.map((item) =>
          item.id === testimonial.id
            ? updated
            : item
        )
      );

      setSuccess(
        updated.is_active
          ? "Feedback is now visible on the website."
          : "Feedback has been hidden from the website."
      );
    } catch (err) {
      console.error(
        "Failed to update testimonial status:",
        err
      );

      setError(
        err.message ||
          "Unable to update feedback status."
      );
    }
  };

  const renderStars = (rating) => {
    return (
      <span
        style={{
          display: "inline-flex",
          gap: "3px",
          color: "#B7954B",
        }}
        aria-label={`${rating} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map(
          (star) => (
            <FiStar
              key={star}
              size={15}
              fill={
                star <= rating
                  ? "currentColor"
                  : "none"
                }
            />
          )
        )}
      </span>
    );
  };

  return (
    <div className="cms-editor-body">
      <div className="cms-section-toolbar">
        <div>
          <span className="cms-editor-eyebrow">
            PATIENT FEEDBACK
          </span>

          <h3>
            Testimonials
          </h3>

          <p>
            Add and manage patient feedback
            displayed on your public website.
          </p>
        </div>

        <button
          type="button"
          className="cms-primary-button"
          onClick={openCreateForm}
        >
          <FiPlus />
          Add Feedback
        </button>
      </div>

      {error && (
        <div
          className="cms-content-card"
          style={{
            marginBottom: "16px",
            borderLeft:
              "4px solid #b94a48",
            color: "#8f3030",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="cms-content-card"
          style={{
            marginBottom: "16px",
            borderLeft:
              "4px solid #527a62",
            color: "#315d4b",
          }}
        >
          {success}
        </div>
      )}

      {formOpen && (
        <div
          className="cms-content-card"
          style={{
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div>
              <span className="cms-editor-eyebrow">
                {editingId
                  ? "EDIT FEEDBACK"
                  : "NEW FEEDBACK"}
              </span>

              <h3>
                {editingId
                  ? "Edit Patient Feedback"
                  : "Add Patient Feedback"}
              </h3>
            </div>

            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              aria-label="Close form"
              style={{
                border: "none",
                background:
                  "transparent",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="cms-result-form">
              <div className="cms-field">
                <label htmlFor="patient_name">
                  Patient Name
                </label>

                <input
                  id="patient_name"
                  name="patient_name"
                  type="text"
                  value={
                    form.patient_name
                  }
                  onChange={handleChange}
                  placeholder="e.g. Sarah Ahmed"
                  maxLength={255}
                  required
                />
              </div>

              <div className="cms-field">
                <label htmlFor="rating">
                  Rating
                </label>

                <select
                  id="rating"
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                >
                  <option value={5}>
                    5 Stars
                  </option>

                  <option value={4}>
                    4 Stars
                  </option>

                  <option value={3}>
                    3 Stars
                  </option>

                  <option value={2}>
                    2 Stars
                  </option>

                  <option value={1}>
                    1 Star
                  </option>
                </select>
              </div>

              <div className="cms-field">
                <label htmlFor="display_order">
                  Display Order
                </label>

                <input
                  id="display_order"
                  name="display_order"
                  type="number"
                  min="0"
                  value={
                    form.display_order
                  }
                  onChange={handleChange}
                />
              </div>

              <div className="cms-field">
                <label htmlFor="feedback">
                  Patient Feedback
                </label>

                <textarea
                  id="feedback"
                  name="feedback"
                  value={form.feedback}
                  onChange={handleChange}
                  placeholder="Write the patient's feedback..."
                  rows={5}
                  required
                />
              </div>

              <label
                className="cms-publish-toggle"
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="is_active"
                  checked={
                    form.is_active
                  }
                  onChange={handleChange}
                />

                <span>
                  Display this feedback
                  on the website
                </span>
              </label>
            </div>

            <div className="cms-form-actions">
              <button
                type="button"
                className="cms-secondary-button"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="cms-primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Feedback"
                    : "Save Feedback"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="cms-empty-state">
          <FiMessageSquare />

          <h3>
            Loading patient feedback...
          </h3>
        </div>
      ) : testimonials.length ===
        0 ? (
        <div className="cms-empty-state">
          <FiMessageSquare />

          <h3>
            No patient feedback yet
          </h3>

          <p>
            Add your first testimonial
            to display patient experiences
            on the public website.
          </p>

          <button
            type="button"
            className="cms-primary-button"
            onClick={openCreateForm}
          >
            <FiPlus />
            Add First Feedback
          </button>
        </div>
      ) : (
        <div className="cms-results-list">
          {testimonials.map(
            (testimonial) => (
              <article
                key={testimonial.id}
                className="cms-content-card"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "flex-start",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "10px",
                        flexWrap:
                          "wrap",
                        marginBottom:
                          "8px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                        }}
                      >
                        {
                          testimonial.patient_name
                        }
                      </h3>

                      {renderStars(
                        testimonial.rating
                      )}

                      <span
                        style={{
                          fontSize:
                            "12px",
                          fontWeight:
                            600,
                          padding:
                            "4px 8px",
                          borderRadius:
                            "999px",
                          background:
                            testimonial.is_active
                              ? "#e8f1eb"
                              : "#f1f1f1",
                          color:
                            testimonial.is_active
                              ? "#315d4b"
                              : "#777",
                        }}
                      >
                        {testimonial.is_active
                          ? "VISIBLE"
                          : "HIDDEN"}
                      </span>
                    </div>

                    <p
                      style={{
                        margin:
                          "10px 0",
                        lineHeight:
                          1.7,
                        color:
                          "#555",
                      }}
                    >
                      “
                      {
                        testimonial.feedback
                      }
                      ”
                    </p>

                    <small
                      style={{
                        color:
                          "#888",
                      }}
                    >
                      Display order:{" "}
                      {
                        testimonial.display_order
                      }
                    </small>
                  </div>

                  <div
                    style={{
                      display:
                        "flex",
                      gap: "8px",
                      flexShrink: 0,
                    }}
                  >
                    <button
                      type="button"
                      className="cms-secondary-button"
                      onClick={() =>
                        openEditForm(
                          testimonial
                        )
                      }
                      title="Edit feedback"
                    >
                      <FiEdit3 />
                    </button>

                    <button
                      type="button"
                      className="cms-secondary-button"
                      onClick={() =>
                        toggleActive(
                          testimonial
                        )
                      }
                      title={
                        testimonial.is_active
                          ? "Hide feedback"
                          : "Show feedback"
                      }
                    >
                      {testimonial.is_active
                        ? "Hide"
                        : "Show"}
                    </button>

                    <button
                      type="button"
                      className="cms-secondary-button"
                      onClick={() =>
                        handleDelete(
                          testimonial
                        )
                      }
                      title="Delete feedback"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default TestimonialsEditor;