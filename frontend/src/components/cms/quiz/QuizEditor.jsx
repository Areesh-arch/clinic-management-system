import { useState } from "react";
import {
  FiHelpCircle,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

import QuestionForm from "./QuestionForm";

function QuizEditor() {
  const [questions, setQuestions] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const addQuestion = (question) => {
    setQuestions((previous) => [
      {
        id: Date.now(),
        ...question,
      },
      ...previous,
    ]);

    setShowForm(false);
  };

  const deleteQuestion = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmed) {
      return;
    }

    setQuestions((previous) =>
      previous.filter(
        (question) => question.id !== id
      )
    );
  };

  return (
    <div className="cms-editor-body">
      <div className="cms-section-toolbar">
        <div>
          <h3>Skin Quiz</h3>

          <p>
            Manage questions used by your public website skin
            quiz.
          </p>
        </div>

        <button
          type="button"
          className="cms-primary-button"
          onClick={() => setShowForm(true)}
        >
          <FiPlus />
          Add Question
        </button>
      </div>

      {showForm && (
        <QuestionForm
          onSave={addQuestion}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="cms-results-list">
        {questions.length === 0 ? (
          <div className="cms-empty-state">
            <div className="cms-empty-icon">
              <FiHelpCircle />
            </div>

            <h3>No quiz questions yet</h3>

            <p>
              Add questions that visitors can answer through
              your skin quiz.
            </p>

            <button
              type="button"
              className="cms-primary-button"
              onClick={() => setShowForm(true)}
            >
              <FiPlus />
              Add Question
            </button>
          </div>
        ) : (
          questions.map((question, index) => (
            <article
              className="cms-content-card"
              key={question.id}
            >
              <div className="cms-content-card-icon">
                <FiHelpCircle />
              </div>

              <div className="cms-content-card-main">
                <span className="cms-result-label">
                  QUESTION {index + 1}
                </span>

                <h3>{question.question}</h3>

                <p>
                  {question.options.length} answer options
                </p>
              </div>

              <div className="cms-content-card-actions">
                <button
                  type="button"
                  className="cms-icon-button danger"
                  title="Delete"
                  onClick={() =>
                    deleteQuestion(question.id)
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

export default QuizEditor;