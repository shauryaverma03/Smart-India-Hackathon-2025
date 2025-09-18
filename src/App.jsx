import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthPage from "./pages/AuthPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import QuizPage from "./pages/QuizPage";
import Settings from "./pages/Settings";
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
    // eslint-disable-next-line
  }, []);

  if (loading) return <div>Loading...</div>;
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
      <Route path="/quiz" element={<QuizPage />} />
    </Routes>
  );
}