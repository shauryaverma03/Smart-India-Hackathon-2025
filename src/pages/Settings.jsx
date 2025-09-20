// src/pages/Settings.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdSettings,
  MdNotifications,
  MdPerson,
  MdApps,
  MdDataUsage,
  MdAccountBox,
  MdLogout,
  MdHistory, // --- 1. IMPORT HISTORY ICON ---
} from "react-icons/md";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import "./Settings.css";
import { quizQuestions } from "../quizData";
import HistoryPage from './settingsSections/HistoryPage'; // --- 1. IMPORT HISTORY PAGE ---

// --- Notification Toast Component ---
function SettingsToast({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(onClose, 2200);
      return () => clearTimeout(timeout);
    }
  }, [show, onClose]);
  if (!show) return null;
  return (
    <div className="settings-toast">
      <span>{message}</span>
    </div>
  );
}

// --- 2. ADD HISTORY TO THE MENU ---
const SECTIONS = [
  { key: "general", label: "General", icon: <MdSettings /> },
  { key: "notifications", label: "Notifications", icon: <MdNotifications /> },
  { key: "personalization", label: "Personalization", icon: <MdPerson /> },
  { key: "connected-apps", label: "Connected Apps", icon: <MdApps /> },
  { key: "data-controls", label: "Quiz Answers", icon: <MdDataUsage /> },
  { key: "history", label: "Conversation History", icon: <MdHistory /> }, // Added here
  { key: "account", label: "Account", icon: <MdAccountBox /> },
];

// --- Section Components ---
function GeneralSection({ userData, onSave, loading }) {
  const [language, setLanguage] = useState(userData.language || "en");
  const [timezone, setTimezone] = useState(userData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);

  const handleSave = async () => {
    await onSave({ language, timezone });
  };

  return (
    <div>
      <h2>General Settings</h2>
      <div className="settings-field">
        <label>Language</label>
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="en">English</option>
        </select>
      </div>
      <div className="settings-field">
        <label>Time Zone</label>
        <select value={timezone} onChange={e => setTimezone(e.target.value)}>
          <option value="Asia/Kolkata">India Standard Time (IST)</option>
          <option value="UTC">Coordinated Universal Time (UTC)</option>
        </select>
      </div>
      <button disabled={loading} onClick={handleSave}>Save</button>
    </div>
  );
}

function NotificationsSection({ userData, onSave, loading }) {
  const [emailUpdates, setEmailUpdates] = useState(userData.emailUpdates ?? true);
  const [messageNotify, setMessageNotify] = useState(userData.messageNotify ?? true);
  const [communityAlerts, setCommunityAlerts] = useState(userData.communityAlerts ?? false);

  const handleSave = async () => {
    await onSave({ emailUpdates, messageNotify, communityAlerts });
  };

  return (
    <div>
      <h2>Notifications</h2>
      <div className="settings-field">
        <label>
          <input type="checkbox" checked={emailUpdates} onChange={e => setEmailUpdates(e.target.checked)} />
          Email me about important updates
        </label>
      </div>
      <div className="settings-field">
        <label>
          <input type="checkbox" checked={messageNotify} onChange={e => setMessageNotify(e.target.checked)} />
          Notify me about new messages
        </label>
      </div>
      <div className="settings-field">
        <label>
          <input type="checkbox" checked={communityAlerts} onChange={e => setCommunityAlerts(e.target.checked)} />
          Community & job alerts
        </label>
      </div>
      <button disabled={loading} onClick={handleSave}>Save</button>
    </div>
  );
}

function PersonalizationSection({ userData, onSave, loading }) {
  const [bio, setBio] = useState(userData.bio || "");
  const [skills, setSkills] = useState(userData.skills || "");

  const handleSave = async () => {
    await onSave({ bio, skills });
  };

  return (
    <div>
      <h2>Personalization</h2>
      <div className="settings-field">
        <label>Bio</label>
        <input
          type="text"
          placeholder="Write a short bio..."
          value={bio}
          onChange={e => setBio(e.target.value)}
        />
      </div>
      <div className="settings-field">
        <label>Your Skills</label>
        <input
          type="text"
          placeholder="e.g. React, Python, Communication"
          value={skills}
          onChange={e => setSkills(e.target.value)}
        />
      </div>
      <button disabled={loading} onClick={handleSave}>Save</button>
    </div>
  );
}

function ConnectedAppsSection({ userData, onSave, loading }) {
  const [linkedin, setLinkedin] = useState(userData.linkedin || "");
  const [github, setGithub] = useState(userData.github || "");

  const handleSave = async () => {
    await onSave({ linkedin, github });
  };

  return (
    <div>
      <h2>Connected Apps</h2>
      <div className="settings-field">
        <label>LinkedIn Profile URL</label>
        <input
          type="url"
          placeholder="https://linkedin.com/in/your-profile"
          value={linkedin}
          onChange={e => setLinkedin(e.target.value)}
        />
      </div>
      <div className="settings-field">
        <label>GitHub Profile URL</label>
        <input
          type="url"
          placeholder="https://github.com/yourusername"
          value={github}
          onChange={e => setGithub(e.target.value)}
        />
      </div>
      <button disabled={loading} onClick={handleSave}>Save</button>
    </div>
  );
}

// --- Main Quiz Section, using shared quizQuestions structure ---
function QuizAnswersSection({ userData, onSave, loading }) {
  // Firestore format: quizAnswers: { q1: ..., q2: ..., ... }
  const storedAnswers = userData.quizAnswers || {};

  // Build local state in the same format as QuizPage's `answers` array
  const [answers, setAnswers] = useState(
    quizQuestions.map((q, i) => {
      const ans = storedAnswers[`q${i + 1}`];
      if (q.type === "multi") return Array.isArray(ans) ? ans : [];
      if (q.type === "text") return ans || "";
      return typeof ans === "string" ? ans : "";
    })
  );

  useEffect(() => {
    setAnswers(
      quizQuestions.map((q, i) => {
        const ans = storedAnswers[`q${i + 1}`];
        if (q.type === "multi") return Array.isArray(ans) ? ans : [];
        if (q.type === "text") return ans || "";
        return typeof ans === "string" ? ans : "";
      })
    );
    // eslint-disable-next-line
  }, [userData.quizAnswers]);

  const handleSingleSelect = (idx, value) => {
    setAnswers((prev) => {
      const n = [...prev];
      n[idx] = value;
      return n;
    });
  };

  const handleMultiSelect = (idx, option, max) => {
    setAnswers((prev) => {
      const old = prev[idx] || [];
      let next;
      if (old.includes(option)) {
        next = old.filter((v) => v !== option);
      } else {
        if (old.length >= max) return prev;
        next = [...old, option];
      }
      const n = [...prev];
      n[idx] = next;
      return n;
    });
  };

  const handleTextChange = (idx, value) => {
    setAnswers((prev) => {
      const n = [...prev];
      n[idx] = value;
      return n;
    });
  };

  const handleSave = async () => {
    const answersObj = {};
    quizQuestions.forEach((q, i) => {
      answersObj[`q${i + 1}`] = answers[i];
    });
    await onSave({ quizAnswers: answersObj });
  };

  return (
    <div>
      <h2>Your Quiz Answers</h2>
      <div className="quiz-answers-list">
        {quizQuestions.map((q, idx) => (
          <div className="settings-field" key={q.question}>
            <label>{q.question}</label>
            {q.type === "single" && (
              <select
                value={answers[idx]}
                onChange={e => handleSingleSelect(idx, e.target.value)}
              >
                <option value="">Select an option</option>
                {q.options.map((option, i) => (
                  <option value={option} key={i}>{option}</option>
                ))}
              </select>
            )}
            {q.type === "multi" && (
              <div className="quiz-checkbox-group">
                {q.options.map((option, i) => (
                  <label key={i} style={{marginRight: 16}}>
                    <input
                      type="checkbox"
                      checked={(answers[idx] || []).includes(option)}
                      onChange={() => handleMultiSelect(idx, option, q.max || 99)}
                      disabled={
                        !(answers[idx] || []).includes(option) &&
                        (answers[idx] || []).length >= (q.max || 99)
                      }
                    />
                    {option}
                  </label>
                ))}
                {q.helper && (
                  <div className="quiz-multi-helper" style={{fontSize:12,color:"#888"}}>{q.helper}</div>
                )}
              </div>
            )}
            {q.type === "text" && (
              <textarea
                value={answers[idx]}
                onChange={e => handleTextChange(idx, e.target.value)}
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
        ))}
      </div>
      <button disabled={loading} onClick={handleSave}>Save</button>
    </div>
  );
}

function AccountSection({ userData, onSave, loading }) {
  const [displayName, setDisplayName] = useState(userData.displayName || "");
  const [email] = useState(userData.email || "");

  const handleSave = async () => {
    await onSave({ displayName });
  };

  return (
    <div>
      <h2>Account Info</h2>
      <div className="settings-field">
        <label>Name</label>
        <input
          type="text"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
        />
      </div>
      <div className="settings-field">
        <label>Email</label>
        <input type="email" value={email} disabled />
      </div>
      <button disabled={loading} onClick={handleSave}>Save</button>
    </div>
  );
}
// --- Main Settings Page ---
export default function Settings({ currentUser }) {
  const [selected, setSelected] = useState(null);
  const [userData, setUserData] = useState(currentUser || {});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" }); // <--- Add toast state
  const user = currentUser;
  const navigate = useNavigate();

  // Fetch user data from Firestore (remains unchanged)
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        setUserData({ ...snap.data(), displayName: user.displayName, email: user.email, photoURL: user.photoURL });
      } else {
        setUserData({ displayName: user.displayName, email: user.email, photoURL: user.photoURL });
      }
    };
    fetchUserData();
  }, [user]);

  // Save section data to Firestore (remains unchanged)
  const handleSectionSave = async (data) => {
    if (!user) return;
    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, data, { merge: true });
      setUserData((prev) => ({ ...prev, ...data }));
      setToast({ show: true, message: "Saved!" }); // <--- Show toast on success
    } catch (e) {
      setToast({ show: true, message: "Error saving data: " + e.message });
    }
    setLoading(false);
  };

  // Logout function (remains unchanged)
  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setLoading(false);
      navigate("/login");
    } catch (e) {
      setLoading(false);
      setToast({ show: true, message: "Error logging out: " + e.message });
    }
  };

  // --- 3. ADD HISTORY TO THE SWITCH CASE ---
  let SectionComponent = null;
  switch (selected) {
    case "general":
      SectionComponent = <GeneralSection userData={userData} onSave={handleSectionSave} loading={loading} />;
      break;
    case "notifications":
      SectionComponent = <NotificationsSection userData={userData} onSave={handleSectionSave} loading={loading} />;
      break;
    case "personalization":
      SectionComponent = <PersonalizationSection userData={userData} onSave={handleSectionSave} loading={loading} />;
      break;
    case "connected-apps":
      SectionComponent = <ConnectedAppsSection userData={userData} onSave={handleSectionSave} loading={loading} />;
      break;
    case "data-controls":
      SectionComponent = <QuizAnswersSection userData={userData} onSave={handleSectionSave} loading={loading} />;
      break;
    case "history": // Added case for history
      SectionComponent = <HistoryPage currentUser={user} />;
      break;
    case "account":
      SectionComponent = <AccountSection userData={userData} onSave={handleSectionSave} loading={loading} />;
      break;
    default:
      SectionComponent = null;
  }

  function getInitial(name, email) {
    if (name && name.length > 0) return name[0].toUpperCase();
    if (email && email.length > 0) return email[0].toUpperCase();
    return "?";
  }

  return (
    <div className="slide-settings-root">
      <SettingsToast message={toast.message} show={toast.show} onClose={() => setToast({ show: false, message: "" })} />
      <div className={`settings-slider ${selected ? "show-details" : ""}`}>
        {/* MENU PANEL (remains unchanged) */}
        <div className="settings-menu-panel">
          <div className="settings-profile-centered">
            {userData.photoURL ? (
              <img src={userData.photoURL} alt="Profile" className="settings-profile-photo-lg" />
            ) : (
              <div className="settings-profile-photo-lg settings-profile-initials">
                {getInitial(userData.displayName, userData.email)}
              </div>
            )}
            <div className="settings-profile-name-lg">{userData.displayName || "Your Name"}</div>
            <div className="settings-profile-email-lg">{userData.email || "your@email.com"}</div>
          </div>
          <div className="settings-menu-list">
            {SECTIONS.map((item) => (
              <button
                key={item.key}
                className="settings-menu-list-btn"
                onClick={() => setSelected(item.key)}
              >
                <span className="settings-menu-list-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <div className="settings-logout-row">
            <button
              className="settings-logout-btn"
              onClick={handleLogout}
              disabled={loading}
            >
              <MdLogout style={{marginRight: 6, verticalAlign: "middle"}} />
              Logout
            </button>
          </div>
        </div>
        {/* DETAILS PANEL (now includes history) */}
        <div className="settings-details-panel">
          <button className="settings-back-btn" onClick={() => setSelected(null)}>
            <MdArrowBack size={28} />
          </button>
          <div className="settings-details-content">{SectionComponent}</div>
        </div>
      </div>
    </div>
  );
}