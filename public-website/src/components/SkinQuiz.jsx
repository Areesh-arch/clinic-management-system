import { useEffect, useState } from "react";

import "../styles/skinQuiz.css";

/* =========================================================
   DEFAULT QUIZ
   Shown only when CMS has no quiz questions.
   CMS questions automatically override these.
   ========================================================= */

const DEFAULT_QUESTIONS = [
  {
    id: "default-question-1",
    question: "What is your main skin concern?",
    option_a: "Acne & breakouts",
    option_b: "Pigmentation & dark spots",
    option_c: "Fine lines & ageing",
    option_d: "Dryness & sensitivity",
  },
  {
    id: "default-question-2",
    question: "How would you describe your skin?",
    option_a: "Oily",
    option_b: "Dry",
    option_c: "Combination",
    option_d: "Sensitive",
  },
  {
    id: "default-question-3",
    question: "What would you most like to improve?",
    option_a: "Skin clarity",
    option_b: "Skin tone",
    option_c: "Skin texture",
    option_d: "Overall radiance",
  },
  {
    id: "default-question-4",
    question: "How often do you currently follow a skincare routine?",
    option_a: "Every day",
    option_b: "A few times a week",
    option_c: "Occasionally",
    option_d: "I do not have a routine",
  },
  {
    id: "default-question-5",
    question: "What would you prefer from your consultation?",
    option_a: "A treatment plan",
    option_b: "Skincare guidance",
    option_c: "Aesthetic recommendations",
    option_d: "A complete skin assessment",
  },
];

function normalizeQuestion(question, index) {
  return {
    id: question?.id ?? `question-${index + 1}`,
    question: question?.question ?? "",
    options: [
      question?.option_a,
      question?.option_b,
      question?.option_c,
      question?.option_d,
    ].filter(Boolean),
  };
}

function getRecommendation(answers, questions) {
  const firstQuestion = questions[0];

  const firstAnswer = firstQuestion
    ? answers[firstQuestion.id]
    : "";

  const answer = String(firstAnswer).toLowerCase();

  if (
    answer.includes("acne") ||
    answer.includes("breakout")
  ) {
    return {
      title: "Acne-Focused Consultation",
      text:
        "A personalised consultation can help identify the causes of your breakouts and determine the most suitable treatment approach for your skin.",
    };
  }

  if (
    answer.includes("pigmentation") ||
    answer.includes("dark spot")
  ) {
    return {
      title: "Pigmentation Consultation",
      text:
        "Your skin may benefit from a personalised pigmentation assessment and a treatment plan designed around your skin tone and concerns.",
    };
  }

  if (
    answer.includes("fine line") ||
    answer.includes("aging") ||
    answer.includes("ageing")
  ) {
    return {
      title: "Skin Rejuvenation Consultation",
      text:
        "A personalised assessment can help determine which rejuvenation treatments are best suited to your skin and aesthetic goals.",
    };
  }

  if (
    answer.includes("dryness") ||
    answer.includes("sensitivity") ||
    answer.includes("sensitive")
  ) {
    return {
      title: "Skin Health Consultation",
      text:
        "Understanding your skin barrier and sensitivity is an important first step toward creating a gentle and effective treatment plan.",
    };
  }

  return {
    title: "Skin Transformation Consultation",
    text:
      "A professional skin assessment can help identify the right combination of treatments for your individual skin concerns and goals.",
  };
}

export default function SkinQuiz({ questions = [] }) {
  /*
   * CMS has priority.
   * If CMS has questions, use them.
   * Otherwise use the built-in default quiz.
   */
  const cmsQuestions = Array.isArray(questions)
    ? questions
    : [];

  const sourceQuestions =
    cmsQuestions.length > 0
      ? cmsQuestions
      : DEFAULT_QUESTIONS;

  const normalizedQuestions = sourceQuestions
    .map(normalizeQuestion)
    .filter(
      (question) =>
        question.question &&
        question.options.length > 0
    );

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] = useState({});

  const [showResult, setShowResult] =
    useState(false);

  useEffect(() => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  }, [questions]);

  if (normalizedQuestions.length === 0) {
    return (
      <section
        className="skin-quiz"
        id="skin-quiz"
      >
        <div className="skin-quiz-container">
          <div className="skin-quiz-heading">
            <span className="skin-quiz-eyebrow">
              SKIN QUIZ
            </span>

            <h2>
              Discover What
              <em> Your Skin Needs.</em>
            </h2>

            <p>
              Take a short quiz to better understand
              your skin concerns and discover where
              to begin.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const question =
    normalizedQuestions[currentQuestion];

  const selectedAnswer =
    answers[question.id];

  const handleAnswer = (answer) => {
    setAnswers((previous) => ({
      ...previous,
      [question.id]: answer,
    }));
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      return;
    }

    if (
      currentQuestion <
      normalizedQuestions.length - 1
    ) {
      setCurrentQuestion(
        (previous) => previous + 1
      );

      return;
    }

    setShowResult(true);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (previous) => previous - 1
      );
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setShowResult(false);
  };

  const progress =
    ((currentQuestion + 1) /
      normalizedQuestions.length) *
    100;

  if (showResult) {
    const recommendation =
      getRecommendation(
        answers,
        normalizedQuestions
      );

    return (
      <section
        className="skin-quiz"
        id="skin-quiz"
      >
        <div className="skin-quiz-container">
          <div className="skin-quiz-heading">
            <span className="skin-quiz-eyebrow">
              YOUR SKIN JOURNEY
            </span>

            <h2>
              Your Skin,
              <em> Your Consultation.</em>
            </h2>

            <p>
              Based on your answers, we recommend
              beginning with a personalised
              consultation.
            </p>
          </div>

          <div className="quiz-result">
            <div className="quiz-result-mark">
              ✦
            </div>

            <span className="quiz-result-label">
              OUR RECOMMENDATION
            </span>

            <h3>
              {recommendation.title}
            </h3>

            <p>
              {recommendation.text}
            </p>

            <div className="quiz-result-actions">
              <a
                href="#contact"
                className="quiz-primary-button"
              >
                Book Consultation
              </a>

              <button
                type="button"
                onClick={handleRestart}
                className="quiz-secondary-button"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="skin-quiz"
      id="skin-quiz"
    >
      <div className="skin-quiz-container">
        <div className="skin-quiz-heading">
          <span className="skin-quiz-eyebrow">
            SKIN QUIZ
          </span>

          <h2>
            Discover What
            <em> Your Skin Needs.</em>
          </h2>

          <p>
            Take a short quiz to better understand
            your skin concerns and discover where
            to begin.
          </p>
        </div>

        <div className="quiz-card">
          <div className="quiz-progress">
            <div className="quiz-progress-top">
              <span>
                Question {currentQuestion + 1} of{" "}
                {normalizedQuestions.length}
              </span>

              <span>
                {Math.round(progress)}%
              </span>
            </div>

            <div className="quiz-progress-track">
              <div
                className="quiz-progress-fill"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          <div className="quiz-question">
            <span className="quiz-question-number">
              {String(
                currentQuestion + 1
              ).padStart(2, "0")}
            </span>

            <h3>
              {question.question}
            </h3>

            <div className="quiz-options">
              {question.options.map(
                (option, index) => (
                  <button
                    key={`${option}-${index}`}
                    type="button"
                    className={`quiz-option ${
                      selectedAnswer === option
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleAnswer(option)
                    }
                  >
                    <span>{option}</span>

                    <span className="quiz-option-arrow">
                      →
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          <div className="quiz-navigation">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="quiz-back-button"
            >
              ← Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="quiz-next-button"
            >
              {currentQuestion ===
              normalizedQuestions.length - 1
                ? "See Recommendation"
                : "Next Question"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}