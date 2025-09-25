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
import TaskReminder from "./pages/TaskReminder"; // ✅ NEW Import
import { Routes, Route, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import LoadingScreen from "./components/LoadingScreen";
import "./App.css";
import "./HomePage.css";

// Only check if user is authenticated, nothing else.
function RequireAuth({ children }) {
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
      <Route path="/" element={<HeroSection />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<AuthPage type="signup" />} />
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
    </Routes>
  );
}