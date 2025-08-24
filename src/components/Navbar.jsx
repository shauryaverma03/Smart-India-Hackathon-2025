import React, { useState } from "react";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import "./Navbar.css";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="wf-navbar">
      <div className="wf-logo">
        <img src="/logo.png" alt="CareerFlow Logo" className="hero-logo" />
        <span className="wf-logo-title">CareerFlow</span>
      </div>
      {/* Hamburger for mobile */}
      <button
        className="wf-nav-hamburger"
        aria-label="Open menu"
        onClick={() => setMobileOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>
      {/* Normal nav links/actions for desktop */}
      <div className="wf-nav-links">
        <div className="wf-nav-dropdown">Platform <FaChevronDown /></div>
        <div className="wf-nav-dropdown">Solutions <FaChevronDown /></div>
        <div className="wf-nav-dropdown">Resources <FaChevronDown /></div>
        <a href="#">Enterprise</a>
        <a href="#">Pricing</a>
      </div>
      <div className="wf-nav-actions">
        <a href="/login" className="wf-nav-link">Log in</a>
        <a href="/signup" className="wf-nav-link">Sign up</a>
        <a href="/contact" className="wf-nav-link">Contact</a>
        <a href="/career-test" className="wf-nav-btn">Get started — it's free</a>
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
      <a href="/login" className="wf-navbar-mobile-footer-btn">Log in</a>
      <button className="wf-navbar-mobile-footer-main">Get started — it's free</button>
    </div>
  </div>
)}
    </nav>
  );
}