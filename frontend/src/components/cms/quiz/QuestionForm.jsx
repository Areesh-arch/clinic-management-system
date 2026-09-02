import { useState } from "react";

function QuestionForm({ onSave, onCancel, saving = false }) {
  const [form, setForm] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "A",
    explanation: "",
    display_order: 0,
    is_active: true,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!form.question.trim()) {
      alert("Please enter a question.");
      return;
    }

    if (form.question.trim().length < 5) {
      alert("Question must be at least 5 characters long.");
      return;
    }

    if (!form.option_a.trim()) {
      alert("Please enter option A.");
      return;
    }

    if (!form.option_b.trim()) {
      alert("Please enter option B.");
      return;
    }

    if (!form.option_c.trim()) {
      alert("Please enter option C.");
      return;
    }

    if (!form.option_d.trim()) {
      alert("Please enter option D.");
      return;
    }

    onSave({
      question: form.question.trim(),
      option_a: form.option_a.trim(),
      option_b: form.option_b.trim(),
      option_c: form.option_c.trim(),
      option_d: form.option_d.trim(),
      correct_option: form.correct_option,
      explanation: form.explanation.trim() || null,
      display_order: Number(form.display_order) || 0,
      is_active: form.is_active,
    });
  };

  return (
    <div className="cms-result-form">
      <div className="cms-result-form-header">
        <div>
          <span className="cms-editor-eyebrow">
            NEW QUESTION
          </span>

          <h3>Add Skin Quiz Question</h3>
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

      {/* QUESTION */}

      <div className="cms-field">
        <label>Question</label>

        <textarea
          name="question"
          value={form.question}
          onChange={handleChange}
          placeholder="e.g. How often does your skin feel dry?"
          rows={4}
          disabled={saving}
        />
      </div>

      {/* ANSWER OPTIONS */}

      <div className="cms-quiz-options">
        <div className="cms-quiz-options-header">
          <div>
            <strong>Answer Options</strong>

            <span>
              Select the correct answer.
            </span>
          </div>
        </div>

        {[
          ["A", "option_a"],
          ["B", "option_b"],
          ["C", "option_c"],
          ["D", "option_d"],
        ].map(([letter, fieldName]) => (
          <div
            className="cms-quiz-option"
            key={fieldName}
          >
            <input
              type="radio"
              name="correct_option"
              value={letter}
              checked={
                form.correct_option === letter
              }
              onChange={handleChange}
              disabled={saving}
            />

            <span
              style={{
                minWidth: "24px",
                fontWeight: 600,
              }}
            >
              {letter}
            </span>

            <input
              type="text"
              name={fieldName}
              value={form[fieldName]}
              onChange={handleChange}
              placeholder={`Option ${letter}`}
              disabled={saving}
            />
          </div>
        ))}
      </div>

      {/* EXPLANATION */}

      <div className="cms-field">
        <label>Explanation</label>

        <textarea
          name="explanation"
          value={form.explanation}
          onChange={handleChange}
          placeholder="Optional explanation for the correct answer..."
          rows={4}
          disabled={saving}
        />
      </div>

      {/* DISPLAY ORDER */}

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

      {/* ACTIVE */}

      <label className="cms-publish-toggle">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              is_active: event.target.checked,
            }))
          }
          disabled={saving}
        />

        <span>
          <strong>Active question</strong>

          <small>
            Active questions will be available on the
            public website skin quiz.
          </small>
        </span>
      </label>

      {/* ACTIONS */}

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
          {saving ? "Saving..." : "Save Question"}
        </button>
      </div>
    </div>
  );
}

export default QuestionForm;
