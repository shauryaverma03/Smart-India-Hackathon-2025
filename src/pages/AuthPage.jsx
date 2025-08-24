// src/pages/AuthPage/AuthPage.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AuthPage.css";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Notification from "../components/Notification";

// Card data for animation
const cards = [
  {
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    title: "Build Muscle. Burn Calories. Get Results.",
    cost: "$6M",
    desc: "REDUCTION IN DEV COSTS",
  },
  {
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    title: "10X",
    cost: "",
    desc: "FASTER LAUNCHES",
  },
  {
    img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=400&q=80",
    title: "99.99%",
    cost: "",
    desc: "UPTIME GUARANTEE",
  },
];

export default function AuthPage({ type }) {
  const isSignup = type === "signup";
  const [active, setActive] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Automatically cycle to next card every 3 seconds
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % cards.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const showNotificationWithDelay = (message = "Welcome to CareerFlow!", duration = 4000) => {
    setShowNotification(true);
    
    // Auto-hide after duration with smooth exit animation
    setTimeout(() => {
      const notification = document.querySelector('.notification');
      if (notification) {
        notification.classList.add('hide');
        // Remove from DOM after animation completes
        setTimeout(() => setShowNotification(false), 500);
      }
    }, duration);
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in: ", result.user);
      
      // Show enhanced notification with success message
      showNotificationWithDelay(
        isSignup 
          ? "🎉 Account created successfully! Welcome to CareerFlow!" 
          : "✅ Successfully logged in! Welcome back!"
      );

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);

    } catch (error) {
      console.error("Error during Google sign-in: ", error);
      
      // Show error notification
      showNotificationWithDelay("❌ Sign-in failed. Please try again.", 3000);
    }
  };

  return (
    <div className="auth-root-fullscreen">
      <Notification 
        message={
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ marginRight: '8px', fontSize: '1.1em' }}>
              {isSignup ? '🎉' : '✅'}
            </span>
            {isSignup 
              ? "Account created successfully! Welcome to CareerFlow!" 
              : "Successfully logged in! Welcome back!"
            }
          </span>
        } 
        show={showNotification} 
      />

      {/* Left side with animated cards (desktop/laptop view) */}
      <div className="auth-left">
        <div className="auth-card-slider">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`auth-card ${
                idx === active
                  ? "auth-card-active"
                  : idx === (active + 1) % cards.length
                  ? "auth-card-next"
                  : "auth-card-inactive"
              }`}
            >
              <img src={card.img} alt={`Card${idx + 1}`} className="auth-card-img" />
              <div className="auth-card-content">
                <h3>{card.title}</h3>
                {card.cost && <div className="auth-card-cost">{card.cost}</div>}
                <div className="auth-card-cost-desc">{card.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: Signup/Login form */}
      <div className="auth-right">
        <div className="auth-form-box">
          <Link to="/">
            <img
              src="/logo.png"
              alt="Logo"
              className="auth-logo"
              style={{ height: 38, marginBottom: 18, cursor: "pointer" }}
            />
          </Link>
          <h2 className="auth-title">
            {isSignup ? "Join CareerFlow Today" : "Welcome Back to CareerFlow"}
          </h2>
          <p className="auth-subtitle" style={{ 
            color: '#666', 
            marginBottom: '24px', 
            fontSize: '0.95rem',
            textAlign: 'center' 
          }}>
            {isSignup 
              ? "Start your personalized career journey with AI-powered guidance" 
              : "Continue your career development journey"
            }
          </p>

          <button className="auth-google-btn" onClick={handleGoogleSignIn}>
            <img
              src="https://www.citypng.com/public/uploads/preview/google-logo-icon-gsuite-hd-701751694791470gzbayltphh.png"
              alt="Google"
              width={20}
              height={20}
              style={{ marginRight: 8, verticalAlign: "middle" }}
            />
            {isSignup ? "Sign up with Google" : "Continue with Google"}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <input
            type="email"
            className="auth-input"
            placeholder={isSignup ? "Work email address" : "Email address"}
          />

          {isSignup && (
            <input
              type="text"
              className="auth-input"
              placeholder="Full name"
              style={{ marginTop: '12px' }}
            />
          )}

          <button className="auth-continue-btn">
            {isSignup ? "Create Account" : "Sign In"}
          </button>

          {isSignup && (
            <p className="auth-terms" style={{ 
              fontSize: '0.8rem', 
              color: '#888', 
              textAlign: 'center', 
              marginTop: '16px',
              lineHeight: '1.4'
            }}>
              By signing up, you agree to our{' '}
              <a href="/terms" style={{ color: '#667eea' }}>Terms of Service</a> and{' '}
              <a href="/privacy" style={{ color: '#667eea' }}>Privacy Policy</a>
            </p>
          )}

          <p className="auth-login-link">
            {isSignup ? (
              <>Already have an account? <Link to="/login">Sign in</Link></>
            ) : (
              <>New to CareerFlow? <Link to="/signup">Create account</Link></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
