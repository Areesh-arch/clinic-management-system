import { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

function QuestionForm({ onSave, onCancel }) {
  const [question, setQuestion] = useState("");

  const [options, setOptions] = useState([
    "",
    "",
    "",
    "",
  ]);

  const [correctAnswer, setCorrectAnswer] = useState(0);

  const handleOptionChange = (index, value) => {
    setOptions((previous) =>
      previous.map((option, optionIndex) =>
        optionIndex === index ? value : option
      )
    );
  };

  const addOption = () => {
    if (options.length >= 6) {
      return;
    }

    setOptions((previous) => [
      ...previous,
      "",
    ]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) {
      return;
    }

    setOptions((previous) =>
      previous.filter(
        (_, optionIndex) => optionIndex !== index
      )
    );

    if (correctAnswer >= index) {
      setCorrectAnswer(
        Math.max(0, correctAnswer - 1)
      );
    }
  };

  const handleSubmit = () => {
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    if (options.some((option) => !option.trim())) {
      alert("Please complete every answer option.");
      return;
    }

    onSave({
      question: question.trim(),
      options: options.map((option) =>
        option.trim()
      ),
      correctAnswer,
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
        >
          ×
        </button>
      </div>

      <div className="cms-field">
        <label>Question</label>

        <textarea
          value={question}
          onChange={(event) =>
            setQuestion(event.target.value)
          }
          placeholder="e.g. How often does your skin feel dry?"
          rows={4}
        />
      </div>

      <div className="cms-quiz-options">
        <div className="cms-quiz-options-header">
          <div>
            <strong>Answer Options</strong>

            <span>
              Select the correct answer.
            </span>
          </div>

          <button
            type="button"
            className="cms-secondary-button"
            onClick={addOption}
          >
            <FiPlus />
            Add Option
          </button>
        </div>

        {options.map((option, index) => (
          <div
            className="cms-quiz-option"
            key={index}
          >
            <input
              type="radio"
              name="correctAnswer"
              checked={correctAnswer === index}
              onChange={() =>
                setCorrectAnswer(index)
              }
            />

            <input
              type="text"
              value={option}
              onChange={(event) =>
                handleOptionChange(
                  index,
                  event.target.value
                )
              }
              placeholder={`Option ${index + 1}`}
            />

            {options.length > 2 && (
              <button
                type="button"
                className="cms-icon-button danger"
                onClick={() =>
                  removeOption(index)
                }
              >
                <FiTrash2 />
              </button>
            )}
          </div>
        ))}
      </div>

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
          Save Question
        </button>
      </div>
    </div>
  );
}

export default QuestionForm;