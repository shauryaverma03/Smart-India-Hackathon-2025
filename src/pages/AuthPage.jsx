import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AuthPage.css";

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

  useEffect(() => {
    // Automatically cycle to next card every 3 seconds
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % cards.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="auth-root-fullscreen">
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
          <h2 className="auth-title">Welcome to CareerFlow</h2>
          <button className="auth-google-btn">
            <img
              src="https://www.citypng.com/public/uploads/preview/google-logo-icon-gsuite-hd-701751694791470gzbayltphh.png"
              alt="Google"
              width={20}
              height={20}
              style={{ marginRight: 8, verticalAlign: "middle" }}
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
          <p className="auth-login-link">
            {isSignup ? (
              <>Already have an account? <Link to="/login">Log in</Link></>
            ) : (
              <>Don't have an account? <Link to="/signup">Sign up</Link></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}