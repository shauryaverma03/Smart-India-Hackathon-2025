import React, { useState } from "react";

// Helper: converts markdown and newlines to HTML
function formatProfileSummary(text) {
  // Bold (**text**)
  let html = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Numbered lists
  html = html.replace(/(\d+)\. /g, '<br><span style="font-weight:bold;color:#1976d2;">$1.</span> ');
  // Bullets (- or *)
  html = html.replace(/[\n\r]- (.+)/g, '<li>$1</li>');
  // New paragraphs for double line breaks
  html = html.replace(/\n{2,}/g, '</p><p>');
  // Single newlines to <br>
  html = html.replace(/\n/g, "<br>");
  // Wrap in <p> if not already
  if (!html.startsWith("<p>")) html = `<p>${html}</p>`;
  // Remove empty <li>s and fix list starts
  html = html.replace(/<li><\/li>/g, "");
  html = html.replace(/(<li>.+?<\/li>)/gs, "<ul>$1</ul>");
  return html;
}

export default function ResumeAnalyserPage() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    if (!resumeFile || !jobDescription) {
      setError("Please upload a resume and enter job description.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_description", jobDescription);

    try {
      // Use environment variable for backend URL, fallback to localhost for local dev
      const backendUrl =
        process.env.REACT_APP_BACKEND_URL ||
        "http://127.0.0.1:5000";
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
          // If not JSON, just use as is
        }
        setResult(resultObj);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to connect to backend: " + err.message);
    }
    setLoading(false);
  };

  function renderResult(result) {
    if (
      typeof result === "object" &&
      result !== null &&
      "JD Match" in result &&
      "MissingKeywords" in result &&
      "Profile Summary" in result
    ) {
      return (
        <div style={{marginTop: 24}}>
          <h4>Analysis Result</h4>
          <div style={{margin: "8px 0"}}>
            <b>JD Match:</b>{" "}
            <span style={{
              fontSize: 22,
              color: "#2196f3",
              fontWeight: 600,
              padding: "2px 8px",
              background: "#e3f2fd",
              borderRadius: "12px"
            }}>
              {result["JD Match"]}%
            </span>
          </div>
          <div style={{margin: "8px 0"}}>
            <b>Missing Keywords:</b>
            <div style={{display: "flex", flexWrap: "wrap", gap: "6px", margin: "6px 0"}}>
              {Array.isArray(result["MissingKeywords"])
                ? result["MissingKeywords"].map((kw, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: "#f0f0f0",
                        color: "#333",
                        borderRadius: "8px",
                        padding: "3px 10px",
                        fontSize: 14,
                        margin: "2px 0"
                      }}
                    >
                      {kw}
                    </span>
                  ))
                : <span style={{color: "#777"}}>None</span>
              }
            </div>
          </div>
          <div style={{margin: "8px 0"}}>
            <b>Profile Summary:</b>
            <div
              style={{
                whiteSpace: "normal",
                background: "#f8f8fa",
                padding: 14,
                borderRadius: 7,
                border: "1px solid #e0e0e0",
                marginTop: 6,
                fontSize: 15,
                lineHeight: 1.7,
                fontFamily: "inherit",
                color: "#262626"
              }}
              dangerouslySetInnerHTML={{
                __html: formatProfileSummary(result["Profile Summary"])
              }}
            />
          </div>
        </div>
      );
    }
    // fallback to JSON or string
    return (
      <pre style={{background: "#f3f3f3", padding: 12, borderRadius: 6, whiteSpace: "pre-wrap"}}>
        {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
      </pre>
    );
  }

  return (
    <div className="dashboard-center">
      <div className="dashboard-card fade-in" style={{maxWidth: 660, width: "100%"}}>
        <h2 style={{marginBottom: 20}}>Resume Analyser</h2>
        <form onSubmit={handleAnalyse}>
          <div style={{marginBottom: 14}}>
            <label htmlFor="resume" style={{fontWeight: 500, display: "block"}}>Upload Resume (PDF):</label>
            <input
              type="file"
              id="resume"
              accept="application/pdf"
              onChange={e => setResumeFile(e.target.files[0])}
              required
              style={{marginTop: 6}}
            />
          </div>
          <div style={{margin: "18px 0"}}>
            <label htmlFor="jd" style={{fontWeight: 500, display: "block"}}>Job Description:</label>
            <textarea
              id="jd"
              rows={5}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              style={{width: "100%", marginTop: 6, fontFamily: "inherit", padding: 8, borderRadius: 6, border: "1px solid #ccc"}}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#1976d2",
              color: "white",
              padding: "10px 24px",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Analysing..." : "Analyse Resume"}
          </button>
        </form>
        {error && (
          <div style={{ color: "red", marginTop: 18 }}>{error}</div>
        )}
        {result && (
          <div style={{marginTop: 24}}>
            {renderResult(result)}
          </div>
        )}
      </div>
    </div>
  );
}