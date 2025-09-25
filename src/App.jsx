import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthPage from "./pages/AuthPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import QuizPage from "./pages/QuizPage";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import HeroSection from "./components/HeroSection";
import TaskReminder from "./pages/TaskReminder"; // ✅ NEW Import
<<<<<<< HEAD
import { Routes, Route, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
=======
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
>>>>>>> Revert "removed the quizpage"
import LoadingScreen from "./components/LoadingScreen";
import "./App.css";
import "./HomePage.css";

<<<<<<< HEAD
// Only check if user is authenticated, nothing else.
function RequireAuth({ children }) {
=======
// ✅ Route guard (unchanged)
function RequireQuizCompleted({ children }) {
>>>>>>> Revert "removed the quizpage"
  const [loading, setLoading] = useState(true);
  const [allow, setAllow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/login");
        setLoading(false);
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists() || !userDoc.data().quizCompleted) {
          navigate("/quiz");
        } else {
          setAllow(true);
        }
      } catch (err) {
        navigate("/quiz");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <LoadingScreen />;
  return allow ? children : null;
}

export default function App() {
  const location = useLocation();
  const fullscreenRoutes = ["/login", "/signup", "/dashboard", "/quiz"];
  const isFullscreen = fullscreenRoutes.some((r) =>
    location.pathname.startsWith(r)
  );

  return (
    <Routes>
<<<<<<< HEAD
      <Route path="/" element={<HeroSection />} />
=======
      {/* ✅ Home Route */}
      <Route path="/" element={<HeroSection />} />

      {/* Auth Routes */}
>>>>>>> Revert "removed the quizpage"
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<AuthPage type="signup" />} />
      <Route
        path="/dashboard"
        element={
          <RequireQuizCompleted>
            <Dashboard />
          </RequireQuizCompleted>
        }
      />
      <Route
        path="/chat/:chatId"
        element={
          <RequireQuizCompleted>
            <ChatPage />
          </RequireQuizCompleted>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireQuizCompleted>
            <Settings />
          </RequireQuizCompleted>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireQuizCompleted>
            <Profile />
          </RequireQuizCompleted>
        }
      />
<<<<<<< HEAD
      {/* ✅ New Task Reminder Route */}
      <Route
        path="/task-reminder"
        element={
          <RequireAuth>
            <TaskReminder />
          </RequireAuth>
        }
      />
      {/* 🚫 No /quiz route at all */}
=======
      <Route path="/quiz" element={<QuizPage />} />

      {/* ✅ New Task Reminder Route */}
      <Route path="/task-reminder" element={<TaskReminder />} />
>>>>>>> Revert "removed the quizpage"
    </Routes>
  );
}
