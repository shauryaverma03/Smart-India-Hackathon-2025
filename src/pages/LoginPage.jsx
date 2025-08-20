import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const cardRef = useRef(null);

  // Fade-in animation for the card
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.classList.add("auth-login-card-animate");
    }
  }, []);

  return (
    <div className="auth-login-root">
      <div className="auth-login-left">
        {/* Animated diagonal grid background */}
        <svg className="auth-login-bg-svg" width="100%" height="100%" viewBox="0 0 600 800" preserveAspectRatio="none">
          {/* Diagonal lines */}
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1={i * 80}
              y1={0}
              x2={0}
              y2={i * 80}
              stroke="#444"
              strokeWidth="1"
              style={{ opacity: 0.6, transition: "opacity 1.8s cubic-bezier(.4,.2,0,1)", transitionDelay: `${i * 0.1}s` }}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <line
              key={"r" + i}
              x1={600}
              y1={i * 80}
              x2={i * 80}
              y2={800}
              stroke="#444"
              strokeWidth="1"
              style={{ opacity: 0.6, transition: "opacity 1.8s cubic-bezier(.4,.2,0,1)", transitionDelay: `${i * 0.13}s` }}
            />
          ))}
        </svg>
        {/* Card */}
        <div className="auth-login-card" ref={cardRef}>
          <img
            src="/logo192.png"
            alt="CareerFlow"
            style={{height:36, marginBottom:18}}
          />
          <h2 className="auth-login-card-title">
            Unlock your future<br />with AI-powered career advice
          </h2>
          <div className="auth-login-card-desc">
            Personalized guidance for Indian students.<br />
            Discover your strengths, find the perfect path,<br />
            and get expert recommendations—just for you.
          </div>
          <a className="auth-login-register-btn" href="/career-test">
            Take the free Career Test <span style={{marginLeft:4}}>↗</span>
          </a>
        </div>
      </div>
      <div className="auth-login-right">
        <div className="auth-login-form-box">
          <img
            src="/logo192.png"
            alt="Logo"
            className="auth-login-logo"
            style={{ height: 38, marginBottom: 18 }}
          />
          <h2 className="auth-login-title">Log in to your account</h2>
          <button className="auth-login-oauth-btn">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google"
              width={20}
              height={20}
              style={{ marginRight: 8 }}
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
              type="password"
              className="auth-login-input"
              placeholder="Password"
            />
            <button className="auth-login-eye-btn" tabIndex={-1}>
              <span role="img" aria-label="Show">👁️</span>
            </button>
          </div>
          <div className="auth-login-row">
            <a href="#" className="auth-login-forgot-link">Forgot your password?</a>
          </div>
          <button className="auth-login-continue-btn">Continue</button>
          <p className="auth-login-signup-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
          <p className="auth-login-optimize-link">
            <a href="#" style={{color:"#4f75f9"}}>Sign in to CareerFlow Optimize</a>
          </p>
        </div>
      </div>
    </div>
  );
}