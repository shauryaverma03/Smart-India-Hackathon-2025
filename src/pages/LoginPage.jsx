// src/pages/LoginPage/LoginPage.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./LoginPage.css";
import { auth } from "../firebase";
// 1. IMPORT THE 'sendPasswordResetEmail' FUNCTION
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail // New import
} from "firebase/auth";
import Notification from "../components/Notification";

export default function LoginPage() {
  const [hover, setHover] = useState(false);
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // 2. ADD STATE TO MANAGE THE VIEW ('login' or 'forgotPassword')
  const [view, setView] = useState('login');

  // State for notifications and form inputs
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setTimeout(() => setShow(true), 20);
  }, []);

  // Reusable notification function
  const showNotificationWithMessage = (message, duration = 5000) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), duration);
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      showNotificationWithMessage("✅ Successfully signed in with Google!");
      setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
    } catch (error) {
      console.error("Error during Google sign-in: ", error);
      showNotificationWithMessage("❌ Google Sign-In failed. Please try again.");
    }
  };

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      showNotificationWithMessage("❌ Please enter both email and password.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showNotificationWithMessage("✅ Welcome back!");
      setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
    } catch (error) {
      console.error("Error signing in:", error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        showNotificationWithMessage("❌ Invalid email or password.");
      } else {
        showNotificationWithMessage("❌ Sign-in failed. Please try again.");
      }
    }
  };

  // 3. CREATE THE FUNCTION TO HANDLE PASSWORD RESET
  const handlePasswordReset = async () => {
    if (!email) {
      showNotificationWithMessage("❌ Please enter your email address.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showNotificationWithMessage("✅ Password reset link sent! Check your inbox.");
      setView('login'); // Switch back to the login view
    } catch (error) {
      console.error("Error sending password reset email:", error);
      if (error.code === 'auth/user-not-found') {
        showNotificationWithMessage("❌ No account found with that email address.");
      } else {
        showNotificationWithMessage("❌ Failed to send reset link. Please try again.");
      }
    }
  };

  return (
    <div className="auth-login-root">
      <Notification message={notificationMessage} show={showNotification} />
      <div
        className="auth-login-left"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className={`auth-login-card${show ? " show" : ""}${hover ? " hovered" : ""}`}>
          <Link to="/">
            <img src="/logo.png" alt="CareerFlow" style={{ height: 36, marginBottom: 18 }}/>
          </Link>
          <h2 className="auth-login-card-title">Personalized Career Advisor</h2>
          <div className="auth-login-card-desc">
            India’s most trusted AI career guidance.<br />
            Discover your path with expert, unbiased advice.
          </div>
          <a className={`auth-login-register-btn${hover ? " hovered" : ""}`} href="/career-test">
            Take the free Career Test <span style={{ marginLeft: 4 }}>↗</span>
          </a>
        </div>
      </div>
      <div className="auth-login-right">
        <div className={`auth-login-form-box${show ? " show" : ""}`}>
          <Link to="/">
            <img src="/logo.png" alt="Logo" className="auth-login-logo" style={{ height: 38, marginBottom: 18 }}/>
          </Link>

          {/* 4. USE CONDITIONAL RENDERING TO SWITCH FORMS */}
          {view === 'login' ? (
            // =================== LOGIN VIEW ===================
            <>
              <h2 className="auth-login-title">Log in to your account</h2>
              <button className="auth-login-oauth-btn" onClick={handleGoogleSignIn}>
                <img src="https://www.citypng.com/public/uploads/preview/google-logo-icon-gsuite-hd-701751694791470gzbayltphh.png" alt="Google" width={20} height={20} style={{ marginRight: 8 }}/>
                Continue with Google
              </button>
              <div className="auth-login-divider"><span>or</span></div>
              <input
                type="email"
                className="auth-login-input"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="auth-login-password-row">
                <input
                  type={showPassword ? "text" : "password"}
                  className="auth-login-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="auth-login-eye-btn" tabIndex={-1} type="button" onClick={() => setShowPassword((v) => !v)}>
                  {/* Eye SVG icons */}
                </button>
              </div>
              <div className="auth-login-row">
                <a href="#" className="auth-login-forgot-link" onClick={(e) => { e.preventDefault(); setView('forgotPassword'); }}>
                  Forgot your password?
                </a>
              </div>
              <button className="auth-login-continue-btn" onClick={handleEmailSignIn}>Continue</button>
              <p className="auth-login-signup-link">
                Don't have an account? <Link to="/signup">Sign up</Link>
              </p>
            </>
          ) : (
            // =================== FORGOT PASSWORD VIEW ===================
            <>
              <h2 className="auth-login-title">Reset Your Password</h2>
              <p style={{color: '#666', fontSize: '0.95rem', marginBottom: '20px'}}>
                Enter your email address and we will send you a link to reset your password.
              </p>
              <input
                type="email"
                className="auth-login-input"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="auth-login-continue-btn" onClick={handlePasswordReset}>
                Send Reset Link
              </button>
              <p className="auth-login-signup-link">
                <a href="#" className="auth-login-forgot-link" onClick={(e) => { e.preventDefault(); setView('login'); }}>
                  ← Back to Login
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}