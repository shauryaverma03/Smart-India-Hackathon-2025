import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthPage from "./pages/AuthPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage"; // 1. Import the new ChatPage component
import { Routes, Route } from "react-router-dom";
import "./HomePage.css";

export default function App() {
  // 2. Remove the old hardcoded user object, as Dashboard now gets it from Firebase
  // const user = { name: "Shaurya" }; 

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
      
      {/* Dashboard page: FULLSCREEN, NO Navbar/Footer */}
      {/* 4. Remove the unused 'user' prop from the Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* 3. Add the new route for the ChatPage */}
      <Route path="/chat/:chatId" element={<ChatPage />} />
    </Routes>
  );
}