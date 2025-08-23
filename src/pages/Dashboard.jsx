import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-bg">
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-top">
            <div className="sidebar-logo">🟦 Alvance</div>
            <nav className="sidebar-nav">
              <Link to="/dashboard" className="sidebar-link active">
                <span>🏠</span> Dashboard
              </Link>
              <Link to="/explore-careers" className="sidebar-link">
                <span>🔎</span> Explore Careers
              </Link>
              <Link to="/skills" className="sidebar-link">
                <span>🧩</span> My Skills
              </Link>
              <Link to="/job-board" className="sidebar-link">
                <span>💼</span> Job Board
              </Link>
              <Link to="/learning" className="sidebar-link">
                <span>📚</span> Learning
              </Link>
              <Link to="/networking" className="sidebar-link">
                <span>🤝</span> Networking
              </Link>
              <Link to="/chat" className="sidebar-link">
                <span>💬</span> Chat
              </Link>
            </nav>
            <div className="sidebar-pro">
              <div className="pro-imgs">
                <span className="gem green"></span>
                <span className="gem yellow"></span>
                <span className="gem pink"></span>
              </div>
              <div className="pro-content">
                <div className="pro-title">Upgrade to Pro</div>
                <div className="pro-desc">
                  Get 1 month free and unlock all Pro features
                </div>
                <div className="pro-rating">4.9 out of 5 ⭐</div>
                <button className="pro-btn">Upgrade now</button>
              </div>
            </div>
          </div>
          <div className="sidebar-bottom">
            <Link to="/support" className="sidebar-link">
              <span>🛟</span> Support Center
            </Link>
            <Link to="/settings" className="sidebar-link">
              <span>⚙️</span> Settings
            </Link>
          </div>
        </aside>
        {/* Main Content */}
        <main className="dashboard-main">
          {/* Topbar */}
          <header className="dashboard-topbar">
            <input className="topbar-search" placeholder="Search" />
            <button className="topbar-ai-btn">AI Assistant ✨</button>
            <div className="topbar-icons">
              <span>🌞</span>
              <span>🔔</span>
              <span className="topbar-profile">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Profile"
                />
              </span>
            </div>
          </header>
          {/* Main panels */}
          <div className="dashboard-panels">
            <section className="panel-summary">
              <div className="panel-stat card">
                <div className="panel-header">
                  <span>Lessons took</span>
                  <button className="panel-details">Details</button>
                </div>
                <div className="panel-value">46 <span className="panel-up">↑ 7%</span></div>
                <div className="panel-label">Lessons completed</div>
              </div>
              <div className="panel-stat card">
                <div className="panel-header">
                  <span>Skill tracker</span>
                </div>
                <div className="panel-value">127h <span className="panel-up">↑ 12%</span></div>
                <div className="panel-label">Hours spent on classes</div>
              </div>
              <div className="panel-skills card">
                <div className="panel-header">
                  <span>Design</span>
                  <span className="skill-bar design"></span>
                  <span className="skill-percent">46%</span>
                </div>
                <div className="panel-header">
                  <span>Management</span>
                  <span className="skill-bar management"></span>
                  <span className="skill-percent">12%</span>
                </div>
                <div className="panel-header">
                  <span>Software</span>
                  <span className="skill-bar software"></span>
                  <span className="skill-percent">27%</span>
                </div>
                <div className="panel-link">view 5 more skills</div>
              </div>
            </section>
            <section className="panel-right">
              <div className="card calendar-card">
                <div className="calendar-top">
                  <button className="calendar-menu">☰</button>
                  <span className="calendar-month">Jun</span>
                </div>
                <div className="calendar-grid">
                  {/* Simplified calendar - you can add logic or a package for real dates! */}
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <span className="calendar-day calendar-head" key={i}>{d}</span>
                  ))}
                  {Array.from({ length: 30 }, (_, i) => (
                    <span
                      className={
                        "calendar-day" +
                        (i === 6 || i === 13 || i === 20 || i === 28 ? " calendar-active" : "")
                      }
                      key={i}
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
              </div>
              <div className="card upcoming-lessons">
                <div className="upcoming-title">Upcoming Lessons <span className="panel-link">View all</span></div>
                <div className="upcoming-card">
                  <img src="https://cdn-icons-png.flaticon.com/512/5968/5968705.png" alt="Figma" className="upcoming-img" />
                  <div>
                    <div className="upcoming-course">Figma Pro</div>
                    <div className="upcoming-desc">Real-world project-based learning</div>
                    <div className="upcoming-progress-bar">
                      <div className="upcoming-progress" style={{width: "62%"}}></div>
                    </div>
                    <div className="upcoming-progress-label">12 of 20 <span>62%</span></div>
                  </div>
                  <button className="upcoming-btn">Join lesson</button>
                </div>
              </div>
              <div className="card community-card">
                <div className="community-label">1350+ Members in our community</div>
                <div className="community-avatars">
                  {[1,2,3,4].map(i=>(
                    <img
                      key={i}
                      src={`https://randomuser.me/api/portraits/men/1${i}.jpg`}
                      className="community-avatar"
                      alt="Member"
                    />
                  ))}
                </div>
                <button className="community-join-btn">Join</button>
              </div>
            </section>
          </div>
          {/* Job feed / CV cards / Recommendations */}
          <div className="dashboard-row">
            <section className="dashboard-feed">
              <div className="card job-feed-card">
                <div className="job-title">Senior product designer</div>
                <div className="job-rate">$72-80/hr</div>
                <button className="job-apply-btn">Tap on card to apply</button>
              </div>
              <div className="card interview-card">
                <div className="interview-title">Try out our Mock Interview tool <span className="interview-offer">OFFER</span></div>
                <div className="interview-desc">Practice to handle interviews easily with no stress</div>
                <Link to="/schedule-interview" className="interview-schedule">Schedule</Link>
              </div>
              <div className="card upload-cv-card">
                <div className="upload-title">Upload your CV</div>
                <div className="upload-desc">We will review it and provide recommendations</div>
                <div className="upload-drop">Drag & Drop file here</div>
              </div>
            </section>
            <section className="dashboard-recommendations">
              <div className="recommend-title">Course Recommendations <span className="panel-link">View all</span></div>
              <div className="recommend-cards">
                <div className="card recommend-card figma">
                  <img src="https://cdn-icons-png.flaticon.com/512/5968/5968705.png" alt="Figma" className="recommend-img" />
                  <div>Figma Pro</div>
                  <small>Advanced prototyping techniques</small>
                  <div className="recommend-tags">
                    <span>#design</span>
                    <span>#advance</span>
                  </div>
                </div>
                <div className="card recommend-card ui">
                  <img src="https://cdn-icons-png.flaticon.com/512/5968/5968705.png" alt="UI" className="recommend-img" />
                  <div>UI Design</div>
                  <small>Design Interfaces that Engage</small>
                  <div className="recommend-tags">
                    <span>#design</span>
                    <span>#beginner</span>
                  </div>
                </div>
                <div className="card recommend-card sketch">
                  <img src="https://cdn.iconscout.com/icon/free/png-256/sketch-3521527-2945236.png" alt="Sketch" className="recommend-img" />
                  <div>Sketch Advance</div>
                  <small>Unleash Sketch's Power</small>
                  <div className="recommend-tags">
                    <span>#design</span>
                    <span>#advance</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}