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
import CoursesPage from "./pages/CoursesPage"; // ✅ 1. IMPORT THE COURSES PAGE
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth"; // ✅ 2. IMPORT AUTH LISTENER
import { doc, getDoc } from "firebase/firestore";
import LoadingScreen from "./components/LoadingScreen";
import "./App.css";
import "./HomePage.css";

// This component is fine, no changes needed here.
function RequireQuizCompleted({ children }) {
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
  
  // ✅ 3. ADD STATE TO MANAGE USER AND LOADING STATUS
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ✅ 4. ADD EFFECT TO LISTEN FOR AUTH CHANGES
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Set user to the user object or null
      setAuthLoading(false); // Auth check is complete
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Show a loading screen while Firebase checks auth status
  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<AuthPage type="signup" />} />
        
        {/* ✅ 5. ADD THE NEW ROUTE FOR COURSES and pass currentUser prop */}
        <Route 
          path="/courses" 
          element={<CoursesPage currentUser={currentUser} />} 
        />
        
        <Route path="/quiz" element={<QuizPage />} />

        {/* These protected routes are fine, no changes needed */}
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
      </Routes>
    </div>
  );
}