import { useState } from "react";
import "../styles/skinQuiz.css";

const questions = [
  {
    id: "concern",
    question: "What is your main skin concern?",
    options: [
      "Acne & Breakouts",
      "Pigmentation & Dark Spots",
      "Fine Lines & Aging",
      "Dryness & Sensitivity",
      "Uneven Skin Texture",
    ],
  },
  {
    id: "skinType",
    question: "How would you describe your skin?",
    options: [
      "Oily",
      "Dry",
      "Combination",
      "Sensitive",
      "Normal",
      "Not Sure",
    ],
  },
  {
    id: "duration",
    question: "How long have you experienced this concern?",
    options: [
      "Less than 3 months",
      "3–6 months",
      "6–12 months",
      "More than a year",
    ],
  },
  {
    id: "experience",
    question: "Have you tried treatments for this concern before?",
    options: [
      "No, this is my first time",
      "Yes, with some improvement",
      "Yes, but the results were limited",
      "Yes, but the concern returned",
    ],
  },
];

function getRecommendation(answers) {
  const concern = answers.concern;

  if (concern === "Acne & Breakouts") {
    return {
      title: "Acne-Focused Consultation",
      text:
        "A personalised consultation can help identify the causes of your breakouts and determine the most suitable treatment approach for your skin.",
    };
  }

  if (concern === "Pigmentation & Dark Spots") {
    return {
      title: "Pigmentation Consultation",
      text:
        "Your skin may benefit from a personalised pigmentation assessment and a treatment plan designed around your skin tone and concerns.",
    };
  }

  if (concern === "Fine Lines & Aging") {
    return {
      title: "Skin Rejuvenation Consultation",
      text:
        "A personalised assessment can help determine which rejuvenation treatments are best suited to your skin and aesthetic goals.",
    };
  }

  if (concern === "Dryness & Sensitivity") {
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

export default function SkinQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const question = questions[currentQuestion];
  const selectedAnswer = answers[question.id];

  const handleAnswer = (answer) => {
    setAnswers((previous) => ({
      ...previous,
      [question.id]: answer,
    }));
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
      return;
    }

    setShowResult(true);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setShowResult(false);
  };

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  if (showResult) {
    const recommendation = getRecommendation(answers);

    return (
      <section className="skin-quiz" id="skin-quiz">
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
              Based on your answers, we recommend beginning
              with a personalised consultation.
            </p>
          </div>

          <div className="quiz-result">
            <div className="quiz-result-mark">✦</div>

            <span className="quiz-result-label">
              OUR RECOMMENDATION
            </span>

            <h3>{recommendation.title}</h3>

            <p>{recommendation.text}</p>

            <div className="quiz-result-actions">
              <a href="#contact" className="quiz-primary-button">
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
    <section className="skin-quiz" id="skin-quiz">
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
            Take a short quiz to better understand your skin
            concerns and discover where to begin.
          </p>
        </div>

        <div className="quiz-card">

          <div className="quiz-progress">
            <div className="quiz-progress-top">
              <span>
                Question {currentQuestion + 1} of{" "}
                {questions.length}
              </span>

              <span>
                {Math.round(progress)}%
              </span>
            </div>

            <div className="quiz-progress-track">
              <div
                className="quiz-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="quiz-question">
            <span className="quiz-question-number">
              0{currentQuestion + 1}
            </span>

            <h3>{question.question}</h3>

            <div className="quiz-options">
              {question.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`quiz-option ${
                    selectedAnswer === option
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleAnswer(option)}
                >
                  <span>{option}</span>

                  <span className="quiz-option-arrow">
                    →
                  </span>
                </button>
              ))}
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
              {currentQuestion === questions.length - 1
                ? "See My Result"
                : "Continue"}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}