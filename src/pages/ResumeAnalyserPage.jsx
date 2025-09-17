import React, { useState } from "react";

/**
 * Parses a text summary that uses markdown-style double asterisks for headings
 * (e.g., "**Strengths:** text...") and converts it into a formatted HTML list.
 * @param {string} text - The raw text summary from the backend.
 * @returns {string} An HTML string representing an unordered list.
 */
function formatProfileSummary(text) {
  if (!text) return "";

  const sectionRegex = /(\*\*.*?\*\*)/g;
  const parts = text.split(sectionRegex).filter(part => part);

  let html = "<ul style='padding-left:20px; margin: 0;'>";
  
  if (parts.length > 0 && !parts[0].startsWith('**')) {
    html += `<li>${parts.shift().trim()}</li>`;
  }

  for (let i = 0; i < parts.length; i += 2) {
    const heading = parts[i]?.replace(/\*\*/g, '');
    const content = parts[i + 1];
    
    if (heading && content && content.trim()) {
      const cleanedContent = content.trim().replace(/^[:\s*]+/, '');
      html += `<li style="margin-bottom: 10px;"><strong>${heading}</strong> ${cleanedContent}</li>`;
    }
  }

  if (html === "<ul style='padding-left:20px; margin: 0;'>") {
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
    // --- STYLES OBJECTS for cleaner JSX ---
    const cardStyle = {
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '16px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      textAlign: 'left'
    };

    const cardTitleStyle = {
      margin: '0 0 12px 0',
      fontSize: '18px',
      color: '#333',
    };
    
    // Check if the result is a structured object with the expected keys.
    if (
      typeof resultData === "object" &&
      resultData !== null &&
      "JD Match" in resultData &&
      "MissingKeywords" in resultData &&
      "Profile Summary" in resultData
    ) {
      const matchPercentage = parseInt(resultData["JD Match"], 10);
      return (
        <div style={{ marginTop: 24 }}>
          
          {/* Card 1: JD Match Score */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>✅ Job Description Match</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#1976d2' }}>
                {matchPercentage}%
              </span>
              <div style={{ flex: 1, backgroundColor: '#e0e0e0', borderRadius: '8px', height: '16px' }}>
                <div style={{ width: `${matchPercentage}%`, backgroundColor: '#1976d2', height: '100%', borderRadius: '8px', transition: 'width 0.5s ease-in-out' }} />
              </div>
            </div>
          </div>
          
          {/* Card 2: Missing Keywords */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>🔑 Missing Keywords</h3>
            <p style={{ marginTop: 0, marginBottom: '16px', color: '#666', fontSize: '14px' }}>
              Consider adding these terms to your resume to improve your ATS score.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {Array.isArray(resultData["MissingKeywords"]) && resultData["MissingKeywords"].length > 0
                ? resultData["MissingKeywords"].map((kw, idx) => (
                    <span key={idx} style={{ background: "#ffebee", color: "#c62828", borderRadius: "12px", padding: "5px 12px", fontSize: 14, fontWeight: 500 }}>
                      {kw}
                    </span>
                  ))
                : <span style={{ color: "#777" }}>Excellent! No critical keywords are missing.</span>
              }
            </div>
          </div>
          
          {/* Card 3: Profile Summary & Recommendations */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>📝 AI-Powered Recommendations</h3>
            <div
              style={{ whiteSpace: "normal", background: "#f8f9fa", padding: 16, borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 15, lineHeight: 1.7, color: "#262626" }}
              dangerouslySetInnerHTML={{ __html: formatProfileSummary(resultData["Profile Summary"]) }}
            />
          </div>
        </div>
      );
    }
    
    // Fallback for unexpected or plain text results.
    return (
      <div style={{ marginTop: 24, ...cardStyle }}>
        <h3 style={cardTitleStyle}>Raw Server Response</h3>
        <pre style={{ background: "#f3f3f3", padding: 12, borderRadius: 6, whiteSpace: "pre-wrap", textAlign: 'left', margin: 0 }}>
          {typeof resultData === "string" ? resultData : JSON.stringify(resultData, null, 2)}
        </pre>
      </div>
    );
  }

  // --- COMPONENT RENDER ---
  return (
    <div className="dashboard-center">
      <div className="dashboard-card fade-in" style={{ maxWidth: 700, width: "100%" }}>
        <h2 style={{ marginBottom: 10 }}>Resume Analyser</h2>
        <p style={{ marginBottom: 24, color: '#555' }}>
          Get instant, AI-driven feedback on how well your resume matches a job description.
        </p>

        <form onSubmit={handleAnalyse}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="resume" style={{ fontWeight: 500, display: "block", marginBottom: 8 }}>
              1. Upload Your Resume (PDF):
            </label>
            <input
              type="file"
              id="resume"
              accept="application/pdf"
              onChange={e => setResumeFile(e.target.files[0])}
              required
            />
          </div>
          
          <div style={{ margin: "24px 0" }}>
            <label htmlFor="jd" style={{ fontWeight: 500, display: "block", marginBottom: 8 }}>
              2. Paste Job Description:
            </label>
            <textarea
              id="jd"
              rows={8}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              style={{ width: "100%", fontFamily: "inherit", padding: 10, borderRadius: 6, border: "1px solid #ccc", boxSizing: 'border-box' }}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: "#1976d2", color: "white", padding: "12px 24px", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}
          >
            {loading ? "Analysing..." : "✨ Analyse My Resume"}
          </button>
        </form>

        {error && (
          <div style={{ color: "#d32f2f", backgroundColor: '#ffcdd2', marginTop: 20, padding: '10px 15px', borderRadius: '6px' }}>
            {error}
          </div>
        )}
        
        {result && (
          <div>
            {renderResult(result)}
          </div>
        )}
      </div>
    </div>
  );
}