import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const [hover, setHover] = useState(false);
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 20);
  }, []);

  return (
    <div className="auth-login-root">
      <div
        className="auth-login-left"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className={`auth-login-card${show ? " show" : ""}${hover ? " hovered" : ""}`}>
          <Link to="/">
            <img
              src="/logo192.png"
              alt="CareerFlow"
              style={{height:36, marginBottom:18, cursor: "pointer"}}
            />
          </Link>
          <h2 className="auth-login-card-title">
            Personalized Career Advisor
          </h2>
          <div className="auth-login-card-desc">
            India’s most trusted AI career guidance.<br />
            Discover your path with expert, unbiased advice.
          </div>
          <a
            className={`auth-login-register-btn${hover ? " hovered" : ""}`}
            href="/career-test"
          >
            Take the free Career Test <span style={{marginLeft:4}}>↗</span>
          </a>
        </div>
      </div>
      <div className="auth-login-right">
        <div className={`auth-login-form-box${show ? " show" : ""}`}>
          <Link to="/">
            <img
              src="/logo192.png"
              alt="Logo"
              className="auth-login-logo"
              style={{ height: 38, marginBottom: 18, cursor: "pointer" }}
            />
          </Link>
          <h2 className="auth-login-title">Log in to your account</h2>
          <button className="auth-login-oauth-btn">
            <img
              src="https://www.citypng.com/public/uploads/preview/google-logo-icon-gsuite-hd-701751694791470gzbayltphh.png"
              alt="Google"
              width={20}
              height={20}
              style={{ marginRight: 8, verticalAlign: "middle" }}
            />
            Continue with Google
          </button>
          <div className="auth-login-divider">
            <span>or</span>
          </div>
          <input
            type="text"
            className="auth-login-input"
            placeholder="Email address or username"
          />
          <div className="auth-login-password-row">
            <input
              type={showPassword ? "text" : "password"}
              className="auth-login-input"
              placeholder="Password"
            />
            <button
              className="auth-login-eye-btn"
              tabIndex={-1}
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((view) => !view)}
            >
              {showPassword ? (
                // eye open SVG
                <svg height="18" width="18" viewBox="0 0 24 24" style={{verticalAlign:"middle"}} fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              ) : (
                // eye closed SVG
                <svg height="18" width="18" viewBox="0 0 24 24" style={{verticalAlign:"middle"}} fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.73 21.73 0 0 1 5.06-7.06"/>
                  <path d="M1 1l22 22"/>
                  <path d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47"/>
                </svg>
              )}
            </button>
          </div>
          <div className="auth-login-row">
            <a href="#" className="auth-login-forgot-link">Forgot your password?</a>
          </div>
          <button className="auth-login-continue-btn">Continue</button>
          <p className="auth-login-signup-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}