import React from "react";
import "./AuthPage.css";

// You can use a <video> or Lottie here for animation.
// For now, this is a placeholder image/video.
export default function AuthPage() {
  return (
    <div className="auth-root">
      <div className="auth-left">
        {/* Replace src with your animated video or Lottie */}
        <video
          className="auth-video"
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Example: <Lottie animationData={...} /> */}
      </div>
      <div className="auth-right">
        <div className="auth-form-box">
          <img
            src="https://assets-global.website-files.com/5d3ac7b7c1a6b93c9e2a9c6e/5e4019d2d9a1d47102dca0e9_webflow-logo.svg"
            alt="Logo"
            className="auth-logo"
            style={{ height: 38, marginBottom: 18 }}
          />
          <h2 className="auth-title">Welcome to CareerFlow</h2>
          <button className="auth-google-btn">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" width={20} style={{ marginRight: 8 }} />
            Sign up with Google
          </button>
          <div className="auth-divider">
            <span>or</span>
          </div>
          <input
            type="email"
            className="auth-input"
            placeholder="Work email address"
          />
          <button className="auth-continue-btn">Continue</button>
          <p className="auth-policy">
            Signing up for a CareerFlow account means you agree to the <a href="/">Privacy Policy</a> and <a href="/">Terms of Service</a>.
          </p>
          <p className="auth-login-link">
            Already have an account? <a href="/login">Log in</a>
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