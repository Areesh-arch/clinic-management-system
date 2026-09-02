import { useEffect, useState } from "react";
import {
  FiHelpCircle,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

import QuestionForm from "./QuestionForm";
import cmsService from "../../../services/cmsService";

function QuizEditor() {
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // =====================================================
  // LOAD QUESTIONS FROM DATABASE
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadQuestions = async () => {
      try {
        setLoading(true);

        const data = await cmsService.getQuizQuestions();

        if (mounted) {
          setQuestions(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error(
          "Failed to load quiz questions:",
          error
        );

        if (mounted) {
          alert(
            error.message ||
              "Failed to load quiz questions."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadQuestions();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // CREATE QUESTION
  // =====================================================

  const addQuestion = async (question) => {
    try {
      setSaving(true);

      const createdQuestion =
        await cmsService.createQuizQuestion({
          question: question.question,
          option_a: question.option_a,
          option_b: question.option_b,
          option_c: question.option_c,
          option_d: question.option_d,
          correct_option: question.correct_option,
          explanation: question.explanation || null,
          display_order:
            question.display_order ?? questions.length,
          is_active:
            question.is_active ?? true,
        });

      setQuestions((previous) => [
        createdQuestion,
        ...previous,
      ]);

      setShowForm(false);
    } catch (error) {
      console.error(
        "Failed to create quiz question:",
        error
      );

      alert(
        error.message ||
          "Failed to save quiz question."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE QUESTION
  // =====================================================

  const deleteQuestion = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await cmsService.deleteQuizQuestion(id);

      setQuestions((previous) =>
        previous.filter(
          (question) => question.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete quiz question:",
        error
      );

      alert(
        error.message ||
          "Failed to delete quiz question."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="cms-editor-body">
      <div className="cms-section-toolbar">
        <div>
          <h3>Skin Quiz</h3>

          <p>
            Manage questions used by your public website
            skin quiz.
          </p>
        </div>

        <button
          type="button"
          className="cms-primary-button"
          onClick={() => setShowForm(true)}
          disabled={saving}
        >
          <FiPlus />
          Add Question
        </button>
      </div>

      {showForm && (
        <QuestionForm
          onSave={addQuestion}
          onCancel={() => setShowForm(false)}
          saving={saving}
        />
      )}

      <div className="cms-results-list">
        {loading ? (
          <div className="cms-loading-state">
            Loading quiz questions...
          </div>
        ) : questions.length === 0 ? (
          <div className="cms-empty-state">
            <div className="cms-empty-icon">
              <FiHelpCircle />
            </div>

            <h3>No quiz questions yet</h3>

            <p>
              Add questions that visitors can answer
              through your skin quiz.
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
                  4 answer options
                </p>
              </div>

              <div className="cms-content-card-actions">
                <span
                  className={
                    question.is_active
                      ? "cms-published"
                      : "cms-unpublished"
                  }
                >
                  {question.is_active
                    ? "Active"
                    : "Inactive"}
                </span>

                <button
                  type="button"
                  className="cms-icon-button danger"
                  title="Delete"
                  disabled={
                    deletingId === question.id
                  }
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
