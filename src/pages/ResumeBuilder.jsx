import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./ResumeBuilder.css";

export default function ResumeBuilder({ currentUser }) {
  const [resume, setResume] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
    education: [{ school: "", degree: "", start: "", end: "" }],
    experience: [{ company: "", role: "", start: "", end: "", description: "" }],
    projects: [{ title: "", description: "", link: "" }],
    skills: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const printRef = useRef();

  // Fetch resume when user is available
  useEffect(() => {
    async function fetchResume(user) {
      setLoading(true);
      try {
        if (!user) {
          setLoading(false);
          return;
        }
        const docRef = doc(db, "resumes", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) setResume(snap.data());
        setError(""); // Clear previous error if successful
      } catch (err) {
        setError("Error loading resume.");
      }
      setLoading(false);
    }
    // Use currentUser prop if passed, else use auth.currentUser
    const user = currentUser || auth.currentUser;
    fetchResume(user);
  }, [currentUser]);

  function handleChange(e) {
    setResume((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess("");
    setError("");
  }

  function handleListChange(section, idx, field, value) {
    setResume((prev) => {
      const updated = [...prev[section]];
      updated[idx][field] = value;
      return { ...prev, [section]: updated };
    });
    setSuccess("");
    setError("");
  }

  function addSectionItem(section, blank) {
    setResume((prev) => ({
      ...prev,
      [section]: [...prev[section], { ...blank }],
    }));
  }

  function removeSectionItem(section, idx) {
    setResume((prev) => {
      const updated = [...prev[section]];
      updated.splice(idx, 1);
      return { ...prev, [section]: updated };
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const user = currentUser || auth.currentUser;
      if (!user) throw new Error("Not signed in");
      await setDoc(doc(db, "resumes", user.uid), resume);
      setSuccess("Resume saved!");
      setError("");
    } catch (err) {
      setError("Save failed.");
    }
    setSaving(false);
  }

  function handlePrint() {
    window.print();
  }

  if (loading) return <div className="resume-builder-loading">Loading...</div>;

  return (
    <div className="resume-builder-root">
      <h2 className="resume-builder-title">Resume Builder</h2>
      <div className="resume-builder-actions">
        <button onClick={handleSave} disabled={saving} className="save-btn">
          {saving ? "Saving..." : "Save to Cloud"}
        </button>
        <button onClick={handlePrint} className="download-btn">
          Download as PDF
        </button>
        {success && <span className="success-msg">{success}</span>}
        {error && <span className="error-msg">{error}</span>}
      </div>
      <div className="resume-builder-form" ref={printRef}>
        {/* Personal Info */}
        <section>
          <h3>Personal Information</h3>
          <input name="name" value={resume.name} onChange={handleChange} placeholder="Full Name" />
          <input name="email" value={resume.email} onChange={handleChange} placeholder="Email" />
          <input name="phone" value={resume.phone} onChange={handleChange} placeholder="Phone" />
          <input name="location" value={resume.location} onChange={handleChange} placeholder="Location" />
          <input name="linkedin" value={resume.linkedin} onChange={handleChange} placeholder="LinkedIn URL" />
          <input name="github" value={resume.github} onChange={handleChange} placeholder="GitHub URL" />
          <input name="portfolio" value={resume.portfolio} onChange={handleChange} placeholder="Portfolio/Website URL" />
        </section>

        {/* Summary */}
        <section>
          <h3>Profile Summary</h3>
          <textarea name="summary" value={resume.summary} onChange={handleChange} placeholder="Brief summary about you" />
        </section>

        {/* Education */}
        <section>
          <h3>Education</h3>
          {resume.education.map((edu, idx) => (
            <div key={idx} className="list-section">
              <input
                value={edu.school}
                onChange={e => handleListChange("education", idx, "school", e.target.value)}
                placeholder="School/University"
              />
              <input
                value={edu.degree}
                onChange={e => handleListChange("education", idx, "degree", e.target.value)}
                placeholder="Degree"
              />
              <input
                value={edu.start}
                onChange={e => handleListChange("education", idx, "start", e.target.value)}
                placeholder="Start Year"
              />
              <input
                value={edu.end}
                onChange={e => handleListChange("education", idx, "end", e.target.value)}
                placeholder="End Year"
              />
              {resume.education.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeSectionItem("education", idx)}
                >Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addSectionItem("education", { school: "", degree: "", start: "", end: "" })}>
            + Add Education
          </button>
        </section>

        {/* Experience */}
        <section>
          <h3>Work Experience</h3>
          {resume.experience.map((exp, idx) => (
            <div key={idx} className="list-section">
              <input
                value={exp.company}
                onChange={e => handleListChange("experience", idx, "company", e.target.value)}
                placeholder="Company"
              />
              <input
                value={exp.role}
                onChange={e => handleListChange("experience", idx, "role", e.target.value)}
                placeholder="Role/Title"
              />
              <input
                value={exp.start}
                onChange={e => handleListChange("experience", idx, "start", e.target.value)}
                placeholder="Start Date"
              />
              <input
                value={exp.end}
                onChange={e => handleListChange("experience", idx, "end", e.target.value)}
                placeholder="End Date"
              />
              <textarea
                value={exp.description}
                onChange={e => handleListChange("experience", idx, "description", e.target.value)}
                placeholder="Description"
              />
              {resume.experience.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeSectionItem("experience", idx)}
                >Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addSectionItem("experience", { company: "", role: "", start: "", end: "", description: "" })}>
            + Add Experience
          </button>
        </section>

        {/* Projects */}
        <section>
          <h3>Projects</h3>
          {resume.projects.map((proj, idx) => (
            <div key={idx} className="list-section">
              <input
                value={proj.title}
                onChange={e => handleListChange("projects", idx, "title", e.target.value)}
                placeholder="Project Title"
              />
              <textarea
                value={proj.description}
                onChange={e => handleListChange("projects", idx, "description", e.target.value)}
                placeholder="Description"
              />
              <input
                value={proj.link}
                onChange={e => handleListChange("projects", idx, "link", e.target.value)}
                placeholder="Project Link (optional)"
              />
              {resume.projects.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeSectionItem("projects", idx)}
                >Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addSectionItem("projects", { title: "", description: "", link: "" })}>
            + Add Project
          </button>
        </section>

        {/* Skills */}
        <section>
          <h3>Skills</h3>
          <input
            name="skills"
            value={resume.skills}
            onChange={handleChange}
            placeholder="Comma separated (e.g. JavaScript, Python, React)"
          />
        </section>
      </div>
    </div>
  );
}