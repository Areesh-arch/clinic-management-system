import { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiGrid,
} from "react-icons/fi";

const INITIAL_TREATMENTS = [
  {
    id: 1,
    name: "Acne Treatment",
    description:
      "Personalised treatment plans for acne and acne-related concerns.",
    category: "Medical Dermatology",
    published: true,
  },
  {
    id: 2,
    name: "Chemical Peels",
    description:
      "Professional peels designed to improve skin texture and tone.",
    category: "Aesthetic",
    published: true,
  },
];

function TreatmentsEditor({ onStatsChange }) {
  const [treatments, setTreatments] = useState(
    INITIAL_TREATMENTS
  );

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    published: true,
  });

  useEffect(() => {
    onStatsChange?.({
      treatments: treatments.length,
    });
  }, [treatments, onStatsChange]);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      category: "",
      published: true,
    });

    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (treatment) => {
    setForm({
      name: treatment.name,
      description: treatment.description,
      category: treatment.category,
      published: treatment.published,
    });

    setEditingId(treatment.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      alert("Please enter a treatment name.");
      return;
    }

    if (editingId) {
      setTreatments((previous) =>
        previous.map((treatment) =>
          treatment.id === editingId
            ? {
                ...treatment,
                ...form,
              }
            : treatment
        )
      );
    } else {
      setTreatments((previous) => [
        {
          id: Date.now(),
          ...form,
        },
        ...previous,
      ]);
    }

    resetForm();
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this treatment?"
    );

    if (!confirmed) {
      return;
    }

    setTreatments((previous) =>
      previous.filter((treatment) => treatment.id !== id)
    );
  };

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
        >
          <FiPlus />
          Add Treatment
        </button>
      </div>

      {showForm && (
        <div className="cms-result-form">
          <div className="cms-result-form-header">
            <div>
              <span className="cms-editor-eyebrow">
                {editingId ? "EDIT TREATMENT" : "NEW TREATMENT"}
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
            >
              ×
            </button>
          </div>

          <div className="cms-field">
            <label>Treatment Name</label>

            <input
              type="text"
              value={form.name}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  name: event.target.value,
                }))
              }
              placeholder="e.g. Acne Treatment"
            />
          </div>

          <div className="cms-field">
            <label>Category</label>

            <input
              type="text"
              value={form.category}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  category: event.target.value,
                }))
              }
              placeholder="e.g. Medical Dermatology"
            />
          </div>

          <div className="cms-field">
            <label>Description</label>

            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  description: event.target.value,
                }))
              }
              placeholder="Describe this treatment..."
              rows={5}
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
              <strong>Publish on website</strong>

              <small>
                Published treatments will appear on the public
                website.
              </small>
            </span>
          </label>

          <div className="cms-form-actions">
            <button
              type="button"
              className="cms-secondary-button"
              onClick={resetForm}
            >
              Cancel
            </button>

            <button
              type="button"
              className="cms-primary-button"
              onClick={handleSave}
            >
              {editingId ? "Update Treatment" : "Save Treatment"}
            </button>
          </div>
        </div>
      )}

      <div className="cms-results-list">
        {treatments.length === 0 ? (
          <div className="cms-empty-state">
            <div className="cms-empty-icon">
              <FiGrid />
            </div>

            <h3>No treatments yet</h3>

            <p>
              Add treatments that you want visitors to see on
              your website.
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
                  {treatment.category || "TREATMENT"}
                </span>

                <h3>{treatment.name}</h3>

                <p>
                  {treatment.description ||
                    "No description added."}
                </p>
              </div>

              <div className="cms-content-card-actions">
                <span
                  className={
                    treatment.published
                      ? "cms-published"
                      : "cms-unpublished"
                  }
                >
                  {treatment.published
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