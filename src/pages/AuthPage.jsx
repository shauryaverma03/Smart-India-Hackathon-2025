import React from "react";
import { Link } from "react-router-dom";
import "./AuthPage.css";

export default function AuthPage({ type }) {
  const isSignup = type === "signup";
  return (
    <div className="auth-root-fullscreen">
      <div className="auth-left">
        <div className="auth-card-slider">
          <div className="auth-card auth-card-active">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"
              alt="Card1"
              className="auth-card-img"
            />
            <div className="auth-card-content">
              <h3>Build Muscle. Burn Calories. Get Results.</h3>
              <div className="auth-card-cost">$6M</div>
              <div className="auth-card-cost-desc">REDUCTION IN DEV COSTS</div>
            </div>
          </div>
          <div className="auth-card">
            <img
              src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
              alt="Card2"
              className="auth-card-img"
            />
            <div className="auth-card-content">
              <h3>10X</h3>
              <div className="auth-card-cost-desc">FASTER LAUNCHES</div>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-box">
          <img
            src="/logo.png"
            alt="Logo"
            className="auth-logo"
            style={{ height: 38, marginBottom: 18 }}
          />
          <h2 className="auth-title">Welcome to CareerFlow</h2>
          <button className="auth-google-btn">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google"
              width={20}
              height={20}
              style={{ marginRight: 8 }}
            />
            {isSignup ? "Sign up with Google" : "Log in with Google"}
          </button>
          <div className="auth-divider">
            <span>or</span>
          </div>
          <input
            type="email"
            className="auth-input"
            placeholder="Work email address"
          />
          <button className="auth-continue-btn">
            {isSignup ? "Continue" : "Log in"}
          </button>
          <p className="auth-policy">
            Signing up for a CareerFlow account means you agree to the{" "}
            <a href="/">Privacy Policy</a> and{" "}
            <a href="/">Terms of Service</a>.
          </p>
          <p className="auth-login-link">
            {isSignup ? (
              <>Already have an account? <Link to="/login">Log in</Link></>
            ) : (
              <>Don't have an account? <Link to="/signup">Sign up</Link></>
            )}
          </p>
          <div className="auth-enterprise-box">
            <span>
              <span role="img" aria-label="lock" style={{ marginRight: 5 }}>🔒</span>
              Building an Enterprise site?
            </span>
            <button className="auth-sales-btn">Contact sales</button>
          </div>
        </div>
      </div>
    </div>
  );
}