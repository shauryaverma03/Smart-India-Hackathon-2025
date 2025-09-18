import React, { useState } from "react";
import "./ResumeAnalyserPage.css"; // Import the stylesheet

/**
 * Parses a text summary that uses markdown-style double asterisks for headings
 * and converts it into a formatted HTML list.
 * @param {string} text - The raw text summary from the backend.
 * @returns {string} An HTML string representing an unordered list.
 */
function formatProfileSummary(text) {
  if (!text) return "";

  const sectionRegex = /(\*\*.*?\*\*)/g;
  const parts = text.split(sectionRegex).filter(part => part);

  let html = "<ul class='summary-list'>";
  
  if (parts.length > 0 && !parts[0].startsWith('**')) {
    html += `<li>${parts.shift().trim()}</li>`;
  }

  for (let i = 0; i < parts.length; i += 2) {
    const heading = parts[i]?.replace(/\*\*/g, '');
    const content = parts[i + 1];
    
    if (heading && content && content.trim()) {
      const cleanedContent = content.trim().replace(/^[:\s*]+/, '');
      html += `<li class='summary-list-item'><strong>${heading}</strong> ${cleanedContent}</li>`;
    }
  }

  // Fallback for plain text
  if (html === "<ul class='summary-list'>") {
    html += `<li>${text}</li>`;
  }
  
  html += "</ul>";
  return html;
}

export default function ResumeAnalyserPage() {
  // --- STATE MANAGEMENT ---
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handles the form submission, sends data to the backend, and updates the state.
   */
  const handleAnalyse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    if (!resumeFile || !jobDescription) {
      setError("Please upload a resume and enter a job description.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_description", jobDescription);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:5000";
      const response = await fetch(`${backendUrl}/api/analyse_resume`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        let resultObj = data.result;
        try {
          resultObj = JSON.parse(data.result);
        } catch (e) {
          // Fallback if result is not a JSON string
        }
        setResult(resultObj);
      } else {
        setError(data.error || "An unknown error occurred.");
      }
    } catch (err) {
      setError("Failed to connect to the analysis service. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renders the analysis result in a highly structured and visually appealing format.
   * @param {object | string} resultData - The result from the backend.
   */
  function renderResult(resultData) {
    if (
      typeof resultData === "object" &&
      resultData !== null &&
      "JD Match" in resultData &&
      "MissingKeywords" in resultData &&
      "Profile Summary" in resultData
    ) {
      const matchPercentage = parseInt(resultData["JD Match"], 10) || 0;
      return (
        <div className="result-container">
          {/* Card 1: JD Match Score */}
          <div className="result-card">
            <h3 className="result-card-title">✅ Job Description Match</h3>
            <div className="jd-match-content">
              <span className="jd-match-score">{matchPercentage}%</span>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${matchPercentage}%` }} 
                />
              </div>
            </div>
          </div>
          
          {/* Card 2: Missing Keywords */}
          <div className="result-card">
            <h3 className="result-card-title">🔑 Missing Keywords</h3>
            <p className="keywords-description">
              Consider adding these terms to your resume to improve your ATS score.
            </p>
            <div className="keywords-container">
              {Array.isArray(resultData["MissingKeywords"]) && resultData["MissingKeywords"].length > 0
                ? resultData["MissingKeywords"].map((kw, idx) => (
                    <span key={idx} className="keyword-tag">{kw}</span>
                  ))
                : <span className="no-keywords-message">Excellent! No critical keywords are missing.</span>
              }
            </div>
          </div>
          
          {/* Card 3: Profile Summary & Recommendations */}
          <div className="result-card">
            <h3 className="result-card-title">📝 AI-Powered Recommendations</h3>
            <div
              className="summary-content"
              dangerouslySetInnerHTML={{ __html: formatProfileSummary(resultData["Profile Summary"]) }}
            />
          </div>
        </div>
      );
    }
    
    // Fallback for unexpected or plain text results.
    return (
      <div className="result-card raw-response-card">
        <h3 className="result-card-title">Raw Server Response</h3>
        <pre className="raw-response-pre">
          {typeof resultData === "string" ? resultData : JSON.stringify(resultData, null, 2)}
        </pre>
      </div>
    );
  }

  // --- COMPONENT RENDER ---
  return (
    <div className="analyser-container">
      <div className="analyser-card fade-in">
        <h2 className="analyser-title">Resume Analyser</h2>
        <p className="analyser-subtitle">
          Get instant, AI-driven feedback on how well your resume matches a job description.
        </p>

        <form onSubmit={handleAnalyse}>
          <div className="form-group">
            <label htmlFor="resume" className="form-label">
              1. Upload Your Resume (PDF):
            </label>
            <input
              type="file"
              id="resume"
              className="file-input"
              accept="application/pdf"
              onChange={e => setResumeFile(e.target.files[0])}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="jd" className="form-label">
              2. Paste Job Description:
            </label>
            <textarea
              id="jd"
              rows={8}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              className="jd-textarea"
              required
            />
          </div>
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Analysing..." : "✨ Analyse My Resume"}
          </button>
        </form>

        {error && (
          <div className="error-message">{error}</div>
        )}
        
        {result && renderResult(result)}
      </div>
    </div>
  );
}