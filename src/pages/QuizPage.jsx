import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import "./QuizPage.css";

// Quiz questions data structure
const quizQuestions = [
  {
    question: "What is your current educational status?",
    type: "single",
    options: [
      "Completed Class 10",
      "Completing Class 10 this year",
      "Completed Class 12",
      "Completing Class 12 this year",
      "Pursuing graduation",
      "Other",
    ],
  },
  {
    question: "Which subjects do you enjoy or perform well in? (Select up to 3)",
    type: "multi",
    max: 3,
    options: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Computer Science / IT",
      "History / Civics",
      "Geography",
      "Economics / Business Studies / Accountancy",
      "Languages & Literature",
      "Fine / Performing Arts",
      "Physical Education / Sports",
      "Other",
    ],
    helper: "Choose up to 3 options",
  },
  {
    question: "Which degree do you plan to pursue after Class 12?",
    type: "single",
    options: [
      "Engineering (BTech/BE)",
      "Medical (MBBS/BDS/Paramedical)",
      "Science (BSc/BCA etc.)",
      "Commerce (BCom/CA/CS/CFA etc.)",
      "Management (BBA/BMS etc.)",
      "Law (LLB/Integrated Law)",
      "Design/Fine Arts",
      "Humanities (BA/BSW etc.)",
      "Skilled Trades / Vocational",
      "Not sure yet",
      "Other",
    ],
    helper: "Select the closest option. Choose “Other” if not listed.",
  },
  {
    question: "Which career fields interest you the most? (Select all that apply)",
    type: "multi",
    max: 99,
    options: [
      "Engineering & Technology",
      "Medical & Healthcare",
      "Science & Research",
      "Business & Management",
      "Commerce, Banking & Finance",
      "Civil Services & Government",
      "Law & Legal Services",
      "Education & Teaching",
      "Creative Arts, Media & Design",
      "Social Work & Community",
      "Defense & Armed Forces",
      "Skilled Trades & Vocational",
      "Not sure yet",
      "Other",
    ],
  },
  {
    question: "What entrance exams are you planning to prepare for? (Select all that apply)",
    type: "multi",
    max: 99,
    options: [
      "JEE Main/Advanced",
      "NEET",
      "CUET",
      "State engineering entrance",
      "State medical entrance",
      "CLAT (Law)",
      "Design (NIFT/NID/UCEED)",
      "Management (CAT/XAT/MAT)",
      "UPSC / State PSC",
      "Banking / SSC / Railways",
      "None at present",
      "Other",
    ],
  },
  {
    question: "What factors matter most when choosing a college/course? (Select top 2)",
    type: "multi",
    max: 2,
    options: [
      "Job placements",
      "College reputation / ranking",
      "Affordable fees / scholarships",
      "Location near home",
      "Curriculum & specializations",
      "Faculty quality",
      "Facilities / labs / hostels",
      "Internships & practical exposure",
      "Other",
    ],
    helper: "Pick up to 2 options",
  },
  {
    question: "What is your family's monthly income range?",
    type: "single",
    options: [
      "Below ₹25,000",
      "₹25,000 - ₹50,000",
      "₹50,000 - ₹1,00,000",
      "Above ₹1,00,000",
      "Prefer not to say",
    ],
  },
  {
    question: "What are your strongest skills? (Select up to 3)",
    type: "multi",
    max: 3,
    options: [
      "Problem-solving & analytical thinking",
      "Communication (verbal/written)",
      "Leadership & teamwork",
      "Creativity & innovation",
      "Technical / computer skills",
      "Research & analysis",
      "Practical / mechanical abilities",
      "People skills & empathy",
      "Other",
    ],
    helper: "Choose up to 3 options",
  },
  {
    question: "What constraints or challenges might affect your education? (Select all that apply)",
    type: "multi",
    max: 99,
    options: [
      "Financial limitations",
      "Limited colleges nearby",
      "Family responsibilities",
      "Health issues",
      "Language barriers",
      "No significant constraints",
      "Other",
    ],
  },
  {
    question: "What are your long-term career goals? (Optional)",
    type: "text",
    placeholder: "Your answer (optional)",
  },
];

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(
    quizQuestions.map((q) => (q.type === "multi" ? [] : ""))
  );
  const [submitted, setSubmitted] = useState(false);
  const [slide, setSlide] = useState("in");
  const [showCheck, setShowCheck] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [user, setUser] = useState(null); // Track logged-in user
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  // Keep track of login state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => {
      unsubscribe();
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSingleSelect = (event) => {
    const newAnswers = [...answers];
    newAnswers[current] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleMultiSelect = (option) => {
    const max = quizQuestions[current].max || 99;
    const prev = answers[current] || [];
    let nextArr;
    if (prev.includes(option)) {
      nextArr = prev.filter((v) => v !== option);
    } else {
      if (prev.length >= max) return;
      nextArr = [...prev, option];
    }
    const newAnswers = [...answers];
    newAnswers[current] = nextArr;
    setAnswers(newAnswers);
  };

  const handleTextChange = (event) => {
    const newAnswers = [...answers];
    newAnswers[current] = event.target.value;
    setAnswers(newAnswers);
  };

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

  const isAnswered = () => {
    const ans = answers[current];
    const q = quizQuestions[current];
    if (q.type === "single") return !!ans;
    if (q.type === "multi") return (ans && ans.length > 0);
    return true; // Text is optional
  };

  const handleSubmit = async () => {
    setShowCheck(true);
    setSubmitError("");
    setTimeout(async () => {
      try {
        if (!user) {
          setShowCheck(false);
          setSubmitError("You must be logged in to submit the quiz.");
          return;
        }
        const db = getFirestore();
        // Build answers as an object instead of array
const answersObj = {};
quizQuestions.forEach((q, i) => {
  answersObj[`q${i+1}`] = answers[i];
});

await setDoc(doc(db, "users", user.uid), {
  quizCompleted: true,
  quizAnswers: answersObj,
  quizSubmittedAt: new Date().toISOString()
}, { merge: true });
        setSubmitted(true);

        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      } catch (err) {
        setShowCheck(false);
        setSubmitError("Could not update quiz completion. Please try again or check your connection.");
        console.error("FIRESTORE ERROR:", err);
      }
    }, 1400);
  };

  React.useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const progress = Math.round(((current + 1) / quizQuestions.length) * 100);

  // Add skip handler
  const handleSkip = () => {
    const newAnswers = [...answers];
    if (quizQuestions[current].type === "multi") {
      newAnswers[current] = [];
    } else {
      newAnswers[current] = "";
    }
    setAnswers(newAnswers);
    handleNext();
  };

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

  const q = quizQuestions[current];

  return (
    <div className="quiz-bg">
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
          {submitError && (
            <div style={{ color: "red", marginBottom: 12 }}>{submitError}</div>
          )}
          <div className={`quiz-question-outer slide-${slide}`}>
            <div className="quiz-question-inner">
              <div className="quiz-question">{q.question}</div>
              {q.type === "multi" && q.helper && (
                <div className="quiz-multi-helper">{q.helper}</div>
              )}
              {q.type === "single" && (
                <div className="quiz-dropdown-wrap">
                  <select
                    className="quiz-dropdown"
                    value={answers[current]}
                    onChange={handleSingleSelect}
                  >
                    <option value="" disabled>Select an option</option>
                    {q.options.map((option, idx) => (
                      <option key={idx} value={option}>{option}</option>
                    ))}
                  </select>
                  <span className="quiz-dropdown-arrow">&#9662;</span>
                </div>
              )}
              {q.type === "multi" && (
                <div className="quiz-checkbox-group">
                  {q.options.map((option, idx) => (
                    <label key={idx} className="quiz-checkbox-label">
                      <input
                        type="checkbox"
                        checked={(answers[current] || []).includes(option)}
                        onChange={() => handleMultiSelect(option)}
                        disabled={
                          !((answers[current] || []).includes(option)) &&
                          (answers[current] || []).length >= q.max
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}
              {q.type === "text" && (
                <textarea
                  className="quiz-textarea"
                  value={answers[current]}
                  onChange={handleTextChange}
                  placeholder={q.placeholder || "Your answer"}
                  rows={3}
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    border: "1.5px solid #dbeafe",
                    fontSize: "1rem",
                    padding: "10px 12px",
                    marginBottom: 14,
                    marginTop: 2,
                    background: "#f8fafc",
                  }}
                />
              )}
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
            {/* Add Skip button except for 10th question (index 9) */}
            {current !== 9 && (
              <button
                className="quiz-btn quiz-btn-skip"
                onClick={handleSkip}
                style={{marginRight: 8}}
              >
                Skip
              </button>
            )}
            {current < quizQuestions.length - 1 ? (
              <button
                className="quiz-btn"
                onClick={handleNext}
                disabled={!isAnswered()}
              >
                Next
              </button>
            ) : (
              <button
                className="quiz-btn quiz-btn-green"
                onClick={handleSubmit}
                disabled={!isAnswered()}
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