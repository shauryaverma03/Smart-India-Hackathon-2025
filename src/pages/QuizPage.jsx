import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, getFirestore } from "firebase/firestore";
import "./QuizPage.css";

const quizQuestions = [
  {
    question: "Which subjects do you enjoy studying the most in school?",
    options: [
      "Mathematics",
      "Science (Physics/Biology/Chemistry)",
      "Social Studies/History/Geography",
      "Languages/Literature",
      "Business/Accounts",
      "Computer Science",
      "Art/Music/Sports",
    ],
  },
  {
    question: "Which activity excites you the most?",
    options: [
      "Conducting experiments",
      "Solving puzzles/math problems",
      "Writing stories/poems",
      "Organizing events",
      "Helping others with their problems",
      "Creating art/music",
      "Starting a small business or shop",
    ],
  },
  {
    question: "How do you feel about numbers and calculations?",
    options: [
      "I enjoy them and find them easy.",
      "I’m okay with them, but not my favorite.",
      "I find them difficult or boring.",
    ],
  },
  {
    question: "Are you comfortable using computers or learning new technology?",
    options: [
      "Yes, very comfortable",
      "Somewhat comfortable",
      "Not comfortable",
    ],
  },
  {
    question: "Do you enjoy working with your hands (craft, repair, cooking, etc.)?",
    options: [
      "Yes, very much",
      "Sometimes",
      "Not really",
    ],
  },
  {
    question: "Do you prefer working alone or in a team?",
    options: [
      "Alone",
      "In a team",
      "Both, depending on the task",
    ],
  },
  {
    question: "Do you like creative tasks such as drawing, acting, or music?",
    options: [
      "Yes, very much",
      "Sometimes",
      "Not at all",
    ],
  },
  {
    question: "What is your dream job or career?",
    options: [
      "Doctor/Engineer/Scientist/Researcher",
      "Teacher/Professor/Writer/Journalist",
      "Artist/Performer/Designer",
      "Businessperson/Accountant/Banker",
      "Government job (civil services, police, etc.)",
      "Social worker/Counselor",
    ],
  },
  {
    question: "What is more important to you in a future job?",
    options: [
      "Good salary",
      "Job stability (permanent job)",
      "Flexibility/Creativity",
      "Helping others",
      "Opportunity to start my own business",
    ],
  },
  {
    question: "Are you interested in pursuing higher studies after your degree?",
    options: [
      "Yes, definitely",
      "Maybe",
      "No, I want to start working",
    ],
  },
  {
    question: "How important is it for you to study in your hometown/district?",
    options: [
      "Very important",
      "Somewhat important",
      "Not important, willing to move",
    ],
  },
  {
    question: "If you had to choose, which project would you like to do the most?",
    options: [
      "Build a model of a bridge (Science/Engineering)",
      "Write and direct a play (Arts)",
      "Plan a budget for a small event (Commerce)",
      "Repair a bicycle or cook a new recipe (Vocational)",
    ],
  },
];

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(quizQuestions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [slide, setSlide] = useState("in");
  const [showCheck, setShowCheck] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  // Handle dropdown select
  const handleOptionSelect = (event) => {
    const newAnswers = [...answers];
    newAnswers[current] = event.target.value;
    setAnswers(newAnswers);
  };

  // Animate to next/prev question
  const animateSlide = (direction, cb) => {
    setSlide(direction === "next" ? "out-left" : "out-right");
    timeoutRef.current = setTimeout(() => {
      cb();
      setSlide(direction === "next" ? "in-right" : "in-left");
      setTimeout(() => setSlide("in"), 300);
    }, 300);
  };

  const handleNext = () => {
    if (current < quizQuestions.length - 1) {
      animateSlide("next", () => setCurrent((c) => c + 1));
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      animateSlide("prev", () => setCurrent((c) => c - 1));
    }
  };

  // Submit quiz, set quizCompleted in Firestore, then redirect
  const handleSubmit = async () => {
    setShowCheck(true);
    setSubmitError("");
    setTimeout(async () => {
      try {
        const auth = getAuth();
        const db = getFirestore();
        const user = auth.currentUser;
        if (!user) {
          setShowCheck(false);
          setSubmitError("You must be logged in to submit the quiz.");
          return;
        }
        await updateDoc(doc(db, "users", user.uid), { quizCompleted: true });
        setSubmitted(true);

        setTimeout(() => {
          navigate("/dashboard");
        }, 1200); // 1.2s after completion, redirect to dashboard
      } catch (err) {
        setShowCheck(false);
        setSubmitError(
          "Could not update quiz completion. Please try again or check your connection."
        );
        console.error("Could not update quizCompleted in Firestore", err);
      }
    }, 1400); // show checkmark animation for 1.4s
  };

  // Clear timeouts on unmount
  React.useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const progress = Math.round(((current + 1) / quizQuestions.length) * 100);

  if (submitted) {
    return (
      <div className="quiz-bg">
        <div className="quiz-container">
          <div className="quiz-card quiz-card-animate">
            <div className="quiz-check-wrap">
              <svg className="quiz-check" viewBox="0 0 60 60">
                <circle className="quiz-check-bg" cx="30" cy="30" r="28" />
                <path className="quiz-check-mark" d="M19 31l7 7 14-15" />
              </svg>
            </div>
            <h2 style={{ color: "#1976d2", marginBottom: 8 }}>Quiz Completed!</h2>
            <p style={{ fontSize: 16, color: "#48426d" }}>
              Thank you for submitting the quiz.<br />You'll soon receive personalized guidance and recommendations.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-bg">
      {/* floating quiz icon */}
      <div className="quiz-floaticon">
        <svg width="54" height="54" fill="none" viewBox="0 0 54 54">
          <circle cx="27" cy="27" r="27" fill="#fff" opacity="0.16"/>
          <circle cx="27" cy="27" r="19" fill="#fbc2eb" opacity="0.55"/>
          <circle cx="27" cy="27" r="13" fill="#a18cd1" opacity="0.9"/>
          <text x="50%" y="56%" textAnchor="middle" fill="#fff" fontSize="22px" fontWeight="bold" dy=".3em">?</text>
        </svg>
      </div>
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="quiz-header">
            <span className="quiz-title">Career Guidance Quiz</span>
            <span className="quiz-progressbar">
              <span className="quiz-progress-label">{current + 1} / {quizQuestions.length}</span>
              <span className="quiz-bar-outer">
                <span className="quiz-bar-inner" style={{width: `${progress}%`}} />
              </span>
            </span>
          </div>
          {/* Show error if any */}
          {submitError && (
            <div style={{ color: "red", marginBottom: 12 }}>{submitError}</div>
          )}
          <div className={`quiz-question-outer slide-${slide}`}>
            <div key={current} className="quiz-question-inner">
              <div className="quiz-question">{quizQuestions[current].question}</div>
              <div className="quiz-dropdown-wrap">
                <select
                  className="quiz-dropdown"
                  value={answers[current]}
                  onChange={handleOptionSelect}
                >
                  <option value="" disabled>Select an option</option>
                  {quizQuestions[current].options.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
                <span className="quiz-dropdown-arrow">&#9662;</span>
              </div>
            </div>
          </div>
          <div className="quiz-controls">
            <button
              className="quiz-btn quiz-btn-secondary"
              onClick={handlePrev}
              disabled={current === 0}
            >
              Previous
            </button>
            {current < quizQuestions.length - 1 ? (
              <button
                className="quiz-btn"
                onClick={handleNext}
                disabled={answers[current] === ""}
              >
                Next
              </button>
            ) : (
              <button
                className="quiz-btn quiz-btn-green"
                onClick={handleSubmit}
                disabled={answers[current] === ""}
              >
                {showCheck ? (
                  <span className="quiz-btn-loader"></span>
                ) : (
                  "Submit"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}