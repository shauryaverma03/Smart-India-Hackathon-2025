import React, { useEffect, useState } from "react";
import {
  MdPeople,
  MdStyle,
  MdWork,
  MdGroups,
  MdEvent,
  MdDescription,
  MdSettings,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const SIDEBAR_MENU = [
  { name: "People", icon: <MdPeople /> },
  { name: "Style", icon: <MdStyle /> },
  { name: "Jobs", icon: <MdWork /> },
  { name: "Community", icon: <MdGroups /> },
  { name: "Events", icon: <MdEvent /> },
  { name: "Resume Builder", icon: <MdDescription /> },
  { name: "Settings", icon: <MdSettings /> },
];

// Utility to get first letter from name/email
function getInitial(name, email) {
  if (name && name.length > 0) return name[0].toUpperCase();
  if (email && email.length > 0) return email[0].toUpperCase();
  return "?";
}

export default function Dashboard() {
  const [activeIndex, setActiveIndex] = useState(4);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userAvatar, setUserAvatar] = useState(""); // empty if none
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserName(user.displayName || "");
        setUserEmail(user.email || "");
        setUserAvatar(user.photoURL && user.photoURL.trim() !== "" ? user.photoURL : "");
      } else {
        setIsLoggedIn(false);
        setUserName("");
        setUserEmail("");
        setUserAvatar("");
      }
    });
    return () => unsubscribe();
  }, []);

  function handleSidebarSelect(idx) {
    setActiveIndex(idx);
    setSidebarOpen(false);
  }

  function handleSidebarToggle() {
    setSidebarOpen((open) => !open);
  }

  function handleLogoClick() {
    navigate("/");
    setSidebarOpen(false);
  }

  function handleLoginRedirect() {
    navigate("/login");
  }

  return (
    <div className="dashboard-root">
      {/* Mobile sidebar overlay */}
      <div
        className={`dashboard-sidebar-overlay${sidebarOpen ? " open" : ""}`}
        onClick={handleSidebarToggle}
      />
      <aside className={`dashboard-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="dashboard-logo-row" onClick={handleLogoClick}>
          <img src="/logo.png" alt="CareerFlow Logo" className="dashboard-logo" />
          <span className="dashboard-title">CareerFlow</span>
          <button className="dashboard-sidebar-close" onClick={handleSidebarToggle} aria-label="Close sidebar">
            <MdClose size={22} />
          </button>
        </div>
        <nav className="dashboard-menu">
          {SIDEBAR_MENU.map((item, idx) => (
            <button
              key={item.name}
              className={`dashboard-menu-btn${activeIndex === idx ? " active" : ""}`}
              onClick={() => handleSidebarSelect(idx)}
              tabIndex={0}
              disabled={!isLoggedIn}
            >
              <span className={`dashboard-menu-icon${activeIndex === idx ? " active" : ""}`}>{item.icon}</span>
              <span className={`dashboard-menu-label${activeIndex === idx ? " active" : ""}`}>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header-mobile-left">
            <button className="dashboard-menu-toggle" onClick={handleSidebarToggle} aria-label="Open sidebar">
              <MdMenu size={28} />
            </button>
            <div className="dashboard-header-logo-brand" onClick={handleLogoClick}>
              <img src="/logo.png" alt="CareerFlow Logo" className="dashboard-header-logo" />
              <span className="dashboard-header-title">CareerFlow</span>
            </div>
          </div>
          <div className="dashboard-header-right">
            {isLoggedIn && (
              <>
                <span className="dashboard-welcome">
                  Welcome, <strong>{userName || userEmail}</strong>
                </span>
                <span className="dashboard-avatar">
                  {/* If userAvatar exists, show image. Else, show initial as fallback */}
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="User avatar"
                      className="dashboard-avatar-img"
                      onError={e => { e.target.onerror=null; e.target.src="/avatar-placeholder.png"; }}
                    />
                  ) : (
                    <span className="dashboard-avatar-initial">
                      {getInitial(userName, userEmail)}
                    </span>
                  )}
                </span>
              </>
            )}
          </div>
        </header>
        <section className="dashboard-content-row">
          <div className="dashboard-center">
            <div className="dashboard-card dashboard-community-card fade-in">
              {isLoggedIn ? (
                <>
                  <h2>Welcome to the Community</h2>
                  <p className="dashboard-community-desc">
                    You are logged in. Start exploring features!
                  </p>
                </>
              ) : (
                <>
                  <h2>Welcome to CareerFlow!</h2>
                  <p className="dashboard-community-desc">
                    Please log in to access your dashboard, connect with the community, and unlock amazing career features!
                  </p>
                  <button className="dashboard-login-btn" onClick={handleLoginRedirect}>
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
          {isLoggedIn && (
            <div className="dashboard-right">
              <div className="dashboard-card dashboard-notifications-card fade-in">
                <h3>Notifications</h3>
                <div className="dashboard-notifications-empty">
                  No notifications yet
                </div>
              </div>
              <div className="dashboard-card dashboard-tips-card fade-in">
                <h3>Career Tips</h3>
                <ul className="dashboard-tips-list">
                  <li>✨ Keep your resume updated!</li>
                  <li>🤝 Network with professionals.</li>
                  <li>🚀 Explore new job opportunities.</li>
                </ul>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}