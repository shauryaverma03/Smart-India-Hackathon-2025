import React from "react";
import { FaChevronDown } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="wf-navbar">
      <div className="wf-logo">
        <img src="/logo192.png" alt="logo" style={{height:32}} />
        <span className="wf-logo-title">CareerFlow</span>
      </div>
      <div className="wf-nav-links">
        <div className="wf-nav-dropdown">Platform <FaChevronDown /></div>
        <div className="wf-nav-dropdown">Solutions <FaChevronDown /></div>
        <div className="wf-nav-dropdown">Resources <FaChevronDown /></div>
        <a href="#">Enterprise</a>
        <a href="#">Pricing</a>
      </div>
      <div className="wf-nav-actions">
        <a href="/login" className="wf-nav-link">Log in</a>
        <a href="/contact" className="wf-nav-link">Contact</a>
        <a href="/career-test" className="wf-nav-btn">Get started — it's free</a>
      </div>
    </nav>
  );
}