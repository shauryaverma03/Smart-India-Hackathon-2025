import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthPage from "./pages/AuthPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import QuizPage from "./pages/QuizPage";
import Settings from "./pages/Settings"; // <-- Add this import
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import "./HomePage.css";

// Route guard for dashboard and chat (add more as needed)
function RequireQuizCompleted({ children }) {
  const [loading, setLoading] = useState(true);
  const [allow, setAllow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkQuiz = async () => {
      const user = auth.currentUser;
      if (!user) {
        // Not logged in, redirect to login
        navigate("/login");
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
    };
    checkQuiz();
    // Only check on mount, not on rerenders
    // eslint-disable-next-line
  }, []);

  if (loading) return <div>Loading...</div>;
  return allow ? children : null;
}

export default function App() {
  const location = useLocation();
  // Hide Navbar/Footer on fullscreen pages
  const fullscreenRoutes = ["/login", "/signup", "/dashboard", "/quiz"];
  const isFullscreen = fullscreenRoutes.some((r) =>
    location.pathname.startsWith(r)
  );

  return (
    <Routes>
      {/* Homepage: WITH Navbar and Footer */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <main className="main-hero">
              <section className="hero-content">
                <div className="hero-overline">MORE THAN AN AI CAREER ADVISOR</div>
                <h1 className="hero-heading">
                  Discover your<br />
                  perfect career path
                </h1>
                <p className="hero-subtext">
                  With our AI-powered platform, you can explore, analyze, and optimize your career journey. 
                  Get personalized guidance, skill gap analysis, and curated resources—built just for Indian students.
                </p>
                <a href="/signup" className="hero-btn">Start building</a>
              </section>
            </main>
            <Footer />
          </>
        }
      />
      {/* Login page: FULLSCREEN, NO Navbar/Footer */}
      <Route path="/login" element={<LoginPage />} />
      {/* Signup page: FULLSCREEN, NO Navbar/Footer */}
      <Route path="/signup" element={<AuthPage type="signup" />} />
      {/* Dashboard page: Require quiz completed */}
      <Route
        path="/dashboard"
        element={
          <RequireQuizCompleted>
            <Dashboard />
          </RequireQuizCompleted>
        }
      />
      {/* ChatPage: Require quiz completed */}
      <Route
        path="/chat/:chatId"
        element={
          <RequireQuizCompleted>
            <ChatPage />
          </RequireQuizCompleted>
        }
      />
      {/* Settings page: Require quiz completed */}
      <Route
        path="/settings"
        element={
          <RequireQuizCompleted>
            <Settings />
          </RequireQuizCompleted>
        }
      />
      {/* QuizPage: FULLSCREEN, NO Navbar/Footer */}
      <Route path="/quiz" element={<QuizPage />} />
    </Routes>
  );
}