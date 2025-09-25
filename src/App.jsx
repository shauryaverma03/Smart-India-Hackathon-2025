import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthPage from "./pages/AuthPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import HeroSection from "./components/HeroSection";
<<<<<<< HEAD
import TaskReminder from "./pages/TaskReminder"; // ✅ NEW Import
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
=======
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { auth } from "./firebase";
>>>>>>> removed the quizpage
import LoadingScreen from "./components/LoadingScreen";
import "./App.css";
import "./HomePage.css";

<<<<<<< HEAD
// ✅ Route guard (unchanged)
function RequireQuizCompleted({ children }) {
=======
// Only check if user is authenticated, nothing else.
function RequireAuth({ children }) {
>>>>>>> removed the quizpage
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <LoadingScreen />;
  return children;
}

export default function App() {
  return (
    <Routes>
<<<<<<< HEAD
      {/* ✅ Home Route */}
      <Route path="/" element={<HeroSection />} />

      {/* Auth Routes */}
=======
      <Route path="/" element={<HeroSection />} />
>>>>>>> removed the quizpage
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<AuthPage type="signup" />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/chat/:chatId"
        element={
          <RequireAuth>
            <ChatPage />
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth>
            <Settings />
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />
<<<<<<< HEAD
      <Route path="/quiz" element={<QuizPage />} />

      {/* ✅ New Task Reminder Route */}
      <Route path="/task-reminder" element={<TaskReminder />} />
=======
      {/* No /quiz route at all */}
>>>>>>> removed the quizpage
    </Routes>
  );
}