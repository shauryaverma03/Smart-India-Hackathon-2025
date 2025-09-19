import React, { useState } from "react";
import { MdGridView, MdViewList, MdWorkOutline } from "react-icons/md";

const JOB_CATEGORIES = ["All Jobs", "Internship", "Full-time", "Part-time", "Remote"];

export default function JobsPage() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [viewMode, setViewMode] = useState("list");

  return (
    <div className="jobs-container">
      <div className="jobs-card">
        {/* Header */}
        <div className="jobs-header">
          <div>
            <div className="jobs-title">Jobs</div>
            <div className="jobs-count">0 jobs available</div>
          </div>
          <div className="jobs-view-toggle">
            <button
              className={`jobs-view-btn ${viewMode === "grid" ? "active" : ""}`}
              aria-label="Grid View"
              onClick={() => setViewMode("grid")}
            >
              <MdGridView />
            </button>
            <button
              className={`jobs-view-btn ${viewMode === "list" ? "active" : ""}`}
              aria-label="List View"
              onClick={() => setViewMode("list")}
            >
              <MdViewList />
            </button>
          </div>
        </div>
        {/* Categories */}
        <div className="jobs-categories">
          {JOB_CATEGORIES.map((category, idx) => (
            <button
              key={category}
              className={`jobs-category-btn ${selectedCategory === idx ? "selected" : ""}`}
              onClick={() => setSelectedCategory(idx)}
            >
              {category}
            </button>
          ))}
        </div>
        {/* Jobs Empty State */}
        <div className="jobs-empty-state">
          <span className="jobs-empty-icon">
            <MdWorkOutline />
          </span>
          <div className="jobs-empty-title">Jobs coming soon</div>
          <div className="jobs-empty-desc">
            We're preparing exciting job opportunities for you. Check back soon for updates.
          </div>
        </div>
      </div>
      <style>{`
        .jobs-container {
          width: 100%;
          min-height: 78vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 30px;
          background: none;
        }
        .jobs-card {
          width: 100%;
          max-width: 820px;
          background: #fff;
          border-radius: 2.2rem;
          box-shadow: 0 2.5px 24px 0 #e9ecf7;
          padding: 44px 36px 44px 36px;
          margin: 0 auto 44px auto;
          min-height: 440px;
          display: flex;
          flex-direction: column;
          position: relative;
          animation: jobsPopIn 0.85s cubic-bezier(.23,1.23,.32,1);
        }
        @keyframes jobsPopIn {
          0% { transform: scale(0.96) translateY(35px); opacity: 0; }
          75% { transform: scale(1.02) translateY(-6px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .jobs-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .jobs-title {
          font-size: 2.3rem;
          font-weight: 400;
          color: #232942;
          letter-spacing: -1px;
          margin-bottom: 0;
          font-family: inherit;
          line-height: 1.1;
        }
        .jobs-count {
          font-size: 1.08rem;
          color: #b6bcd6;
          font-weight: 400;
          margin-top: 2px;
          font-family: inherit;
        }
        .jobs-view-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .jobs-view-btn {
          background: transparent;
          border: none;
          border-radius: 8px;
          padding: 7px 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          color: #bcc2d4;
          font-size: 22px;
          transition: background 0.14s, color 0.14s, transform 0.13s;
        }
        .jobs-view-btn.active {
          background: #222548;
          color: #fff;
          box-shadow: 0 1px 5px #e1e6f9;
          transform: scale(1.07);
        }
        .jobs-categories {
          display: flex;
          gap: 12px;
          margin-bottom: 34px;
          flex-wrap: wrap;
        }
        .jobs-category-btn {
          font-weight: 400;
          font-size: 1.08rem;
          padding: 7px 20px;
          border-radius: 8px;
          border: 1.5px solid #e4e8f7;
          background: #fff;
          color: #232942;
          cursor: pointer;
          transition: all 0.15s;
          margin-bottom: 4px;
          font-family: inherit;
        }
        .jobs-category-btn.selected {
          background: #232942;
          color: #fff;
          border-color: #232942;
          box-shadow: 0 2px 8px #e9ecf7;
          transform: scale(1.06);
        }
        .jobs-empty-state {
          margin-top: 68px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .jobs-empty-icon {
          color: #e4e8f7;
          font-size: 55px;
          margin-bottom: 6px;
          animation: jobsIconBounce 1.5s infinite alternate cubic-bezier(0.65,0,0.35,1);
        }
        @keyframes jobsIconBounce {
          0% { transform: translateY(0);}
          100% { transform: translateY(-8px);}
        }
        .jobs-empty-title {
          font-weight: 600;
          font-size: 1.32rem;
          color: #232847;
          margin-bottom: 4px;
          font-family: inherit;
        }
        .jobs-empty-desc {
          color: #b6bcd6;
          font-size: 1.06rem;
          font-weight: 400;
          text-align: center;
          max-width: 340px;
          font-family: inherit;
        }
        @media (max-width: 600px) {
          .jobs-card {
            padding: 26px 8vw 32px 8vw;
            min-height: 360px;
          }
          .jobs-title {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
}