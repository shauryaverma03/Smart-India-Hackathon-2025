import React, { useState, useEffect } from "react";
import { MdGridView, MdViewList, MdWorkOutline, MdLocationOn, MdBusiness } from "react-icons/md";
import "./JobsPage.css"; // Import the CSS file

const JOB_CATEGORIES = ["All Jobs", "Internship", "Full-time", "Part-time", "Remote"];
const BACKEND_URL = "https://job-backend-production-945e.up.railway.app";

export default function JobsPage() {
  // State for UI controls
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [viewMode, setViewMode] = useState("list");
  
  // State for handling data, loading, and errors
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to fetch data when the selected category changes
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      setJobs([]); // Clear previous jobs

      let query = JOB_CATEGORIES[selectedCategory];
      if (query === "All Jobs") {
        query = "Software Developer jobs in India"; // A good default query
      } else {
        query = `${query} jobs in India`;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/api/jobs?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setJobs(data || []); // Ensure data is an array to prevent errors
      } catch (e) {
        console.error("Failed to fetch jobs:", e);
        setError("Failed to load job opportunities. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [selectedCategory]); // Re-run the effect when the selectedCategory changes

  // Helper function to render the main content area
  const renderJobContent = () => {
    if (isLoading) {
      return <div className="jobs-loading-state">Loading job opportunities...</div>;
    }

    if (error) {
      return <div className="jobs-error-state">{error}</div>;
    }
    
    if (jobs.length === 0) {
      return (
        <div className="jobs-empty-state">
          <span className="jobs-empty-icon"><MdWorkOutline /></span>
          <div className="jobs-empty-title">No Jobs Found</div>
          <div className="jobs-empty-desc">
            There are no job openings for this category at the moment. Please check back later.
          </div>
        </div>
      );
    }
    
    // Renders the list of jobs
    return (
      <div className={`jobs-list-container ${viewMode}`}>
        {jobs.map((job) => (
          <div key={job.job_id} className="job-item-card">
            <div className="job-item-logo-wrapper">
              <img 
                src={job.employer_logo || 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png'} 
                alt={`${job.employer_name} logo`} 
                className="job-item-logo" 
              />
            </div>
            <div className="job-item-details">
              <h3 className="job-item-title">{job.job_title}</h3>
              <div className="job-item-company">
                <MdBusiness /> {job.employer_name}
              </div>
              <div className="job-item-location">
                <MdLocationOn /> {job.job_city || 'N/A'}, {job.job_country}
              </div>
            </div>
            <a href={job.job_apply_link} target="_blank" rel="noopener noreferrer" className="job-item-apply-btn">
              Apply
            </a>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="jobs-container">
      <div className="jobs-card">
        {/* Header */}
        <div className="jobs-header">
          <div>
            <div className="jobs-title">Jobs</div>
            <div className="jobs-count">
              {isLoading ? 'Searching...' : `${jobs.length} jobs available`}
            </div>
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
              disabled={isLoading}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Dynamic Job Content Area */}
        {renderJobContent()}
      </div>
    </div>
  );
}