import React, { useState } from "react";
import {
  MdPeople,
  MdStyle,
  MdWork,
  MdGroups,
  MdEvent,
  MdDescription,
  MdSettings,
} from "react-icons/md";
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

const DEFAULT_USER = {
  name: "Shaurya",
  avatarUrl: "/avatar-placeholder.png",
};

export default function Dashboard({ user = DEFAULT_USER }) {
  const [activeIndex, setActiveIndex] = useState(4);

  function handleSidebarSelect(idx) {
    setActiveIndex(idx);
    // Optionally connect navigation here!
  }

  return (
    <div className="dashboard-root">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo-row">
          <img
            src="/logo.png"
            alt="CareerFlow Logo"
            className="dashboard-logo"
          />
          <span className="dashboard-title">CareerFlow</span>
        </div>
        <nav className="dashboard-menu">
          {SIDEBAR_MENU.map((item, idx) => (
            <button
              key={item.name}
              className={`dashboard-menu-btn${activeIndex === idx ? " active" : ""}`}
              onClick={() => handleSidebarSelect(idx)}
              tabIndex={0}
            >
              <span className="dashboard-menu-icon">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header-right">
            <span className="dashboard-welcome">
              Welcome, {user.name}
            </span>
            <span className="dashboard-avatar">
              <img
                src={user.avatarUrl}
                alt="User avatar"
                className="dashboard-avatar-img"
              />
            </span>
          </div>
        </header>
        <section className="dashboard-content-row">
          <div className="dashboard-center">
            <div className="dashboard-card dashboard-community-card fade-in">
              <h2>Welcome to the Community</h2>
              <p className="dashboard-community-desc">
                Please login to view and create posts
              </p>
              <button className="dashboard-login-btn">
                Login
              </button>
            </div>
          </div>
          <div className="dashboard-right">
            <div className="dashboard-card dashboard-notifications-card fade-in">
              <h3>Notifications</h3>
              <div className="dashboard-notifications-empty">
                No notifications yet
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}