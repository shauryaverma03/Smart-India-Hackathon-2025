import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaTimes, FaUser, FaCog, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileMenuRef = useRef();
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

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
    }
    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileMenu]);

  function getInitial(name, email) {
    if (name && name.length > 0) return name[0].toUpperCase();
    if (email && email.length > 0) return email[0].toUpperCase();
    return "?";
  }

  function handleProfileClick() {
    setShowProfileMenu((prev) => !prev);
  }

  function handleDashboard() {
    setShowProfileMenu(false);
    navigate("/dashboard");
  }

  function handleViewProfile() {
    setShowProfileMenu(false);
    navigate("/profile");
  }

  function handleSettings() {
    setShowProfileMenu(false);
    navigate("/dashboard?tab=settings");
  }

  function handleLogout() {
    setShowProfileMenu(false);
    const auth = getAuth();
    signOut(auth).then(() => {
      navigate("/");
    });
  }

  return (
    <nav className="wf-navbar">
      <div className="wf-logo">
        <img src="/logo.png" alt="CareerFlow Logo" className="hero-logo" />
        <span className="wf-logo-title">CareerFlow</span>
      </div>
      <button
        className="wf-nav-hamburger"
        aria-label="Open menu"
        onClick={() => setMobileOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>
      <div className="wf-nav-links">
        <div className="wf-nav-dropdown">Platform <FaChevronDown /></div>
        <div className="wf-nav-dropdown">Solutions <FaChevronDown /></div>
        <div className="wf-nav-dropdown">Resources <FaChevronDown /></div>
        <a href="#">Enterprise</a>
        <a href="#">Pricing</a>
      </div>
      <div className="wf-nav-actions">
        {!isLoggedIn ? (
          <>
            <a href="/login" className="wf-nav-link">Log in</a>
            <a href="/signup" className="wf-nav-link">Sign up</a>
            <a href="/signup" className="wf-nav-btn">Get started — it's free</a>
          </>
        ) : (
          <div className="wf-nav-profile-container" ref={profileMenuRef}>
            <div className="wf-nav-profile" tabIndex={0} style={{cursor:"pointer"}} onClick={handleProfileClick}>
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="User avatar"
                  className="wf-nav-profile-img"
                  onError={e => { e.target.onerror=null; e.target.src="/avatar-placeholder.png"; }}
                />
              ) : (
                <span className="wf-nav-profile-initial">{getInitial(userName, userEmail)}</span>
              )}
              <span className="wf-nav-profile-name">{userName || userEmail}</span>
              <FaChevronDown style={{marginLeft:6, fontSize:"0.95em"}} />
            </div>
            {showProfileMenu && (
              <div className="wf-nav-profile-menu">
                <button className="wf-nav-profile-menu-item" onClick={handleDashboard}>
                  <FaTachometerAlt style={{marginRight:8}} /> Dashboard
                </button>
                <button className="wf-nav-profile-menu-item" onClick={handleViewProfile}>
                  <FaUser style={{marginRight:8}} /> View Profile
                </button>
                <button className="wf-nav-profile-menu-item" onClick={handleSettings}>
                  <FaCog style={{marginRight:8}} /> Settings
                </button>
                <button className="wf-nav-profile-menu-item" onClick={handleLogout}>
                  <FaSignOutAlt style={{marginRight:8}} /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="wf-navbar-mobile-menu wf-navbar-mobile-menu--animate">
          <div className="wf-navbar-mobile-menu-header">
            <button
              className="wf-navbar-mobile-close"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <FaTimes size={28} />
            </button>
          </div>
          <a href="#" className="wf-navbar-mobile-link">
            Platform <FaChevronDown className="wf-navbar-mobile-chevron" />
          </a>
          <a href="#" className="wf-navbar-mobile-link">
            Solutions <FaChevronDown className="wf-navbar-mobile-chevron" />
          </a>
          <a href="#" className="wf-navbar-mobile-link">
            Resources <FaChevronDown className="wf-navbar-mobile-chevron" />
          </a>
          <a href="#" className="wf-navbar-mobile-link">Enterprise</a>
          <a href="#" className="wf-navbar-mobile-link">Pricing</a>
          <div className="wf-navbar-mobile-footer">
            {!isLoggedIn ? (
              <>
                <a href="/login" className="wf-navbar-mobile-footer-btn">Log in</a>
                <a href="/signup" className="wf-navbar-mobile-footer-btn">Sign up</a>
                <a href="/career-test" className="wf-navbar-mobile-footer-main">Get started — it's free</a>
              </>
            ) : (
              <div
                className="wf-navbar-mobile-footer-profile"
                tabIndex={0}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: "10px 0",
                  background: "#e6ebfa",
                  borderRadius: "10px",
                  fontWeight: 600,
                  color: "#2046c7",
                  flexDirection: "column"
                }}
              >
                <div style={{display:"flex",alignItems:"center",gap:"12px",justifyContent:"center",width:"100%"}}>
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="User avatar"
                      className="wf-navbar-mobile-footer-profile-img"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        background: "#f1f3f5"
                      }}
                      onError={e => { e.target.onerror=null; e.target.src="/avatar-placeholder.png"; }}
                    />
                  ) : (
                    <span
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "#dde6ff",
                        color: "#2046c7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        userSelect: "none"
                      }}
                    >{getInitial(userName, userEmail)}</span>
                  )}
                  <span style={{fontSize: "1.09rem"}}>{userName || userEmail}</span>
                </div>
                <button className="wf-navbar-mobile-footer-menu-btn" onClick={handleDashboard}>
                  <FaTachometerAlt style={{marginRight:8}} /> Dashboard
                </button>
                <button className="wf-navbar-mobile-footer-menu-btn" onClick={handleViewProfile}>
                  <FaUser style={{marginRight:8}} /> View Profile
                </button>
                <button className="wf-navbar-mobile-footer-menu-btn" onClick={handleSettings}>
                  <FaCog style={{marginRight:8}} /> Settings
                </button>
                <button className="wf-navbar-mobile-footer-menu-btn" onClick={handleLogout}>
                  <FaSignOutAlt style={{marginRight:8}} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}