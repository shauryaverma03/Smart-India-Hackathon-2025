import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth, storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./ResumeBuilder.css";

export default function ResumeBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  
  const [resume, setResume] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
    coreSkills: [],
    experience: [{ 
      company: "", 
      role: "", 
      location: "",
      start: "", 
      end: "", 
      current: false,
      description: ""
    }],
    education: [{ 
      school: "", 
      degree: "", 
      field: "",
      location: "",
      start: "", 
      end: "",
      gpa: "",
      honors: ""
    }],
    projects: [{ 
      title: "", 
      description: "", 
      technologies: "",
      link: "",
      github: "",
      duration: ""
    }],
    technicalSkills: {
      languages: [],
      frameworks: [],
      databases: [],
      tools: [],
      cloud: []
    },
    certifications: [{
      name: "",
      issuer: "",
      date: "",
      id: "",
      link: ""
    }],
    languages: [{
      name: "",
      proficiency: ""
    }],
    volunteer: [{
      organization: "",
      role: "",
      start: "",
      end: "",
      description: ""
    }],
    awards: [{
      title: "",
      issuer: "",
      date: "",
      description: ""
    }],
    publications: [{
      title: "",
      publisher: "",
      date: "",
      link: ""
    }],
    interests: []
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  const previewRef = useRef();
  const fileInputRef = useRef();

  const steps = [
    {
      id: "template",
      title: "Choose Template",
      subtitle: "Select your professional design",
      icon: "🎨",
      fields: []
    },
    {
      id: "personal",
      title: "Personal Information",
      subtitle: "Your contact details and photo",
      icon: "👤",
      fields: ["name", "title", "email", "phone", "location"]
    },
    {
      id: "links",
      title: "Professional Links",
      subtitle: "Your online presence",
      icon: "🔗",
      fields: ["linkedin", "github", "portfolio"]
    },
    {
      id: "summary",
      title: "Professional Summary",
      subtitle: "Your career elevator pitch",
      icon: "📝",
      fields: ["summary"]
    },
    {
      id: "experience",
      title: "Work Experience",
      subtitle: "Your professional journey",
      icon: "💼",
      fields: ["experience"]
    },
    {
      id: "education",
      title: "Education",
      subtitle: "Your academic background",
      icon: "🎓",
      fields: ["education"]
    },
    {
      id: "projects",
      title: "Projects",
      subtitle: "Showcase your work",
      icon: "🚀",
      fields: ["projects"]
    },
    {
      id: "skills",
      title: "Technical Skills",
      subtitle: "Your expertise areas",
      icon: "⚡",
      fields: ["technicalSkills"]
    },
    {
      id: "certifications",
      title: "Certifications",
      subtitle: "Professional credentials",
      icon: "🏅",
      fields: ["certifications"]
    },
    {
      id: "additional",
      title: "Additional Info",
      subtitle: "Languages, awards, publications",
      icon: "📋",
      fields: ["languages", "volunteer", "awards", "publications", "interests"]
    },
    {
      id: "preview",
      title: "Preview & Download",
      subtitle: "Review and export your resume",
      icon: "✨",
      fields: []
    }
  ];

  const templates = [
    {
      id: "modern",
      name: "Modern Professional",
      description: "Clean, ATS-friendly design perfect for tech roles",
      accent: "#2563eb",
      layout: "single-column",
      style: "minimal"
    },
    {
      id: "executive", 
      name: "Executive",
      description: "Sophisticated layout for senior positions",
      accent: "#1f2937",
      layout: "two-column",
      style: "professional"
    },
    {
      id: "creative",
      name: "Creative Professional", 
      description: "Visually striking for creative industries",
      accent: "#7c3aed",
      layout: "sidebar",
      style: "colorful"
    },
    {
      id: "academic",
      name: "Academic & Research",
      description: "Traditional format for academic roles",
      accent: "#059669",
      layout: "classic",
      style: "traditional"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  // Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      setError("");
      
      if (user) {
        fetchResume(user);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchResume = async (user) => {
    if (!user) return;
    
    try {
      const docRef = doc(db, "resumes", user.uid);
      const snap = await getDoc(docRef);
      
      if (snap.exists()) {
        const resumeData = snap.data();
        setResume(prev => ({
          ...prev,
          ...resumeData
        }));
        if (resumeData.template) setSelectedTemplate(resumeData.template);
        if (resumeData.profileImageUrl) setProfileImageUrl(resumeData.profileImageUrl);
      }
    } catch (err) {
      console.error("Error fetching resume:", err);
    }
  };

  // Progress calculation
  useEffect(() => {
    const totalSteps = steps.length - 1;
    const completedCount = completedSteps.size;
    setProgress((completedCount / totalSteps) * 100);
  }, [completedSteps, steps.length]);

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setResume(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNestedChange = (section, index, field, value) => {
    setResume(prev => {
      const updated = [...prev[section]];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [section]: updated };
    });
  };

  const handleSkillsChange = (category, value) => {
    const skills = value.split(',').map(skill => skill.trim()).filter(Boolean);
    setResume(prev => ({
      ...prev,
      technicalSkills: {
        ...prev.technicalSkills,
        [category]: skills
      }
    }));
  };

  const handleArrayChange = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    setResume(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const addItem = (section, template) => {
    setResume(prev => ({
      ...prev,
      [section]: [...prev[section], { ...template }]
    }));
  };

  const removeItem = (section, index) => {
    setResume(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !currentUser) return;

    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB.");
      return;
    }

    setUploading(true);
    try {
      const imageRef = ref(storage, `profile-images/${currentUser.uid}/${Date.now()}`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      setProfileImageUrl(downloadURL);
      setSuccess("Image uploaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to upload image.");
    }
    setUploading(false);
  };

  // Navigation
  const [[page, direction], setPage] = useState([0, 0]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setPage([currentStep + 1, 1]);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setPage([currentStep - 1, -1]);
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex) => {
    const direction = stepIndex > currentStep ? 1 : -1;
    setPage([stepIndex, direction]);
    setCurrentStep(stepIndex);
  };

  // Save & Download
  const handleSave = async () => {
    if (!currentUser) {
      setError("Please sign in to save.");
      return;
    }

    setSaving(true);
    try {
      const resumeData = {
        ...resume,
        template: selectedTemplate,
        profileImageUrl,
        lastUpdated: new Date().toISOString()
      };
      
      await setDoc(doc(db, "resumes", currentUser.uid), resumeData);
      setSuccess("Resume saved successfully! 🎉");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to save resume.");
    }
    setSaving(false);
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false
      });
      
      const pdf = new jsPDF("p", "pt", "a4");
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 595;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${resume.name || 'Professional_Resume'}_${selectedTemplate}.pdf`);
      setSuccess("Resume downloaded successfully! 📄");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Download failed.");
    }
  };

  // Render methods
  const renderTemplateSelection = () => (
    <motion.div 
      className="template-selection"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="templates-grid">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
            onClick={() => setSelectedTemplate(template.id)}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="template-preview">
              <div 
                className={`template-mockup ${template.layout}`}
                style={{ '--accent': template.accent }}
              >
                <div className="mock-header" style={{ backgroundColor: template.accent }}></div>
                <div className="mock-content">
                  <div className="mock-line long"></div>
                  <div className="mock-line medium"></div>
                  <div className="mock-line short"></div>
                  <div className="mock-sidebar">
                    <div className="mock-line short"></div>
                    <div className="mock-line medium"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="template-info">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <div className="template-features">
                <span className="feature-tag">{template.layout}</span>
                <span className="feature-tag">{template.style}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderPersonalInfo = () => (
    <motion.div 
      className="form-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="profile-upload-section" variants={itemVariants}>
        <div className="image-container">
          {profileImageUrl ? (
            <motion.img 
              src={profileImageUrl} 
              alt="Profile" 
              className="profile-image"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          ) : (
            <motion.div 
              className="profile-placeholder"
              whileHover={{ scale: 1.05 }}
            >
              <span>📷</span>
              <p>Add Photo</p>
            </motion.div>
          )}
        </div>
        <div className="upload-controls">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <motion.button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="upload-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {uploading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ⏳
              </motion.span>
            ) : (
              "📷 Upload Photo"
            )}
          </motion.button>
          <small>Professional headshot recommended</small>
        </div>
      </motion.div>

      <div className="form-grid">
        {[
          { name: "name", label: "Full Name *", placeholder: "John Doe", type: "text" },
          { name: "title", label: "Professional Title *", placeholder: "Senior Software Engineer", type: "text" },
          { name: "email", label: "Email *", placeholder: "john@example.com", type: "email" },
          { name: "phone", label: "Phone", placeholder: "+1 (555) 123-4567", type: "tel" },
          { name: "location", label: "Location", placeholder: "San Francisco, CA", type: "text" }
        ].map((field, index) => (
          <motion.div 
            key={field.name}
            className="input-group"
            variants={itemVariants}
            custom={index}
          >
            <label>{field.label}</label>
            <motion.input
              type={field.type}
              name={field.name}
              value={resume[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              whileFocus={{ 
                scale: 1.02,
                boxShadow: "0 0 20px rgba(37, 99, 235, 0.3)"
              }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderLinks = () => (
    <motion.div 
      className="form-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="form-grid">
        {[
          { name: "linkedin", label: "LinkedIn Profile", placeholder: "https://linkedin.com/in/johndoe", icon: "💼" },
          { name: "github", label: "GitHub Profile", placeholder: "https://github.com/johndoe", icon: "🐱" },
          { name: "portfolio", label: "Portfolio Website", placeholder: "https://johndoe.com", icon: "🌐" }
        ].map((field, index) => (
          <motion.div 
            key={field.name}
            className="input-group"
            variants={itemVariants}
            custom={index}
          >
            <label>
              <span>{field.icon}</span>
              {field.label}
            </label>
            <motion.input
              type="url"
              name={field.name}
              value={resume[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              whileFocus={{ 
                scale: 1.02,
                boxShadow: "0 0 20px rgba(37, 99, 235, 0.3)"
              }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderSummary = () => (
    <motion.div 
      className="form-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="input-group" variants={itemVariants}>
        <label>Professional Summary *</label>
        <motion.textarea
          name="summary"
          value={resume.summary}
          onChange={handleChange}
          rows={6}
          placeholder="Write a compelling 2-3 sentence summary highlighting your key achievements, expertise, and career goals. Focus on what makes you unique and valuable to employers..."
          whileFocus={{ 
            scale: 1.02,
            boxShadow: "0 0 20px rgba(37, 99, 235, 0.3)"
          }}
        />
        <small>💡 Tip: Keep it concise but impactful. Mention your years of experience, key skills, and career objectives.</small>
      </motion.div>
    </motion.div>
  );

  const renderExperience = () => (
    <motion.div 
      className="form-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {resume.experience.map((exp, index) => (
          <motion.div
            key={index}
            className="list-item experience-item"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, height: 0 }}
            layout
          >
            <div className="item-header">
              <h4>💼 Experience {index + 1}</h4>
              {resume.experience.length > 1 && (
                <motion.button
                  type="button"
                  onClick={() => removeItem("experience", index)}
                  className="remove-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ❌ Remove
                </motion.button>
              )}
            </div>
            
            <div className="form-grid">
              {[
                { field: "company", label: "Company Name *", placeholder: "Google Inc.", type: "text" },
                { field: "role", label: "Job Title *", placeholder: "Senior Software Engineer", type: "text" },
                { field: "location", label: "Location", placeholder: "Mountain View, CA", type: "text" },
                { field: "start", label: "Start Date", placeholder: "Jan 2023", type: "text" },
                { field: "end", label: "End Date", placeholder: "Present", type: "text" }
              ].map((field) => (
                <div key={field.field} className="input-group">
                  <label>{field.label}</label>
                  <input
                    type={field.type}
                    value={exp[field.field]}
                    onChange={(e) => handleNestedChange("experience", index, field.field, e.target.value)}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
            
            <div className="input-group">
              <label>Job Description & Key Achievements</label>
              <textarea
                value={exp.description}
                onChange={(e) => handleNestedChange("experience", index, "description", e.target.value)}
                rows={4}
                placeholder="• Led development of scalable microservices architecture serving 1M+ users&#10;• Improved system performance by 40% through optimization and caching strategies&#10;• Mentored team of 5 junior developers and conducted technical interviews&#10;• Implemented CI/CD pipeline reducing deployment time by 60%"
              />
              <small>💡 Use bullet points and quantify your achievements with numbers and percentages</small>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      <motion.button
        type="button"
        onClick={() => addItem("experience", { 
          company: "", 
          role: "", 
          location: "",
          start: "", 
          end: "", 
          description: ""
        })}
        className="add-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ➕ Add Work Experience
      </motion.button>
    </motion.div>
  );

  const renderEducation = () => (
    <motion.div 
      className="form-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {resume.education.map((edu, index) => (
          <motion.div
            key={index}
            className="list-item education-item"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, height: 0 }}
            layout
          >
            <div className="item-header">
              <h4>🎓 Education {index + 1}</h4>
              {resume.education.length > 1 && (
                <motion.button
                  type="button"
                  onClick={() => removeItem("education", index)}
                  className="remove-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ❌ Remove
                </motion.button>
              )}
            </div>
            
            <div className="form-grid">
              {[
                { field: "school", label: "Institution Name *", placeholder: "Stanford University" },
                { field: "degree", label: "Degree *", placeholder: "Master of Science" },
                { field: "field", label: "Field of Study", placeholder: "Computer Science" },
                { field: "location", label: "Location", placeholder: "Stanford, CA" },
                { field: "start", label: "Start Year", placeholder: "2020" },
                { field: "end", label: "Graduation Year", placeholder: "2022" }
              ].map((field) => (
                <div key={field.field} className="input-group">
                  <label>{field.label}</label>
                  <input
                    type="text"
                    value={edu[field.field]}
                    onChange={(e) => handleNestedChange("education", index, field.field, e.target.value)}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
            
            <div className="form-grid">
              <div className="input-group">
                <label>GPA (Optional)</label>
                <input
                  type="text"
                  value={edu.gpa}
                  onChange={(e) => handleNestedChange("education", index, "gpa", e.target.value)}
                  placeholder="3.8/4.0"
                />
              </div>
              <div className="input-group">
                <label>Honors & Awards</label>
                <input
                  type="text"
                  value={edu.honors}
                  onChange={(e) => handleNestedChange("education", index, "honors", e.target.value)}
                  placeholder="Magna Cum Laude, Dean's List"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      <motion.button
        type="button"
        onClick={() => addItem("education", { 
          school: "", 
          degree: "", 
          field: "",
          location: "",
          start: "", 
          end: "",
          gpa: "",
          honors: ""
        })}
        className="add-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ➕ Add Education
      </motion.button>
    </motion.div>
  );

  const renderProjects = () => (
    <motion.div 
      className="form-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {resume.projects.map((project, index) => (
          <motion.div
            key={index}
            className="list-item project-item"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, height: 0 }}
            layout
          >
            <div className="item-header">
              <h4>🚀 Project {index + 1}</h4>
              {resume.projects.length > 1 && (
                <motion.button
                  type="button"
                  onClick={() => removeItem("projects", index)}
                  className="remove-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ❌ Remove
                </motion.button>
              )}
            </div>
            
            <div className="form-grid">
              {[
                { field: "title", label: "Project Title *", placeholder: "E-commerce Platform" },
                { field: "duration", label: "Duration", placeholder: "3 months" },
                { field: "link", label: "Live Demo URL", placeholder: "https://myproject.com" },
                { field: "github", label: "GitHub Repository", placeholder: "https://github.com/user/repo" }
              ].map((field) => (
                <div key={field.field} className="input-group">
                  <label>{field.label}</label>
                  <input
                    type={field.field.includes('link') || field.field.includes('github') ? "url" : "text"}
                    value={project[field.field]}
                    onChange={(e) => handleNestedChange("projects", index, field.field, e.target.value)}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
            
            <div className="form-grid">
              <div className="input-group">
                <label>Technologies Used</label>
                <input
                  type="text"
                  value={project.technologies}
                  onChange={(e) => handleNestedChange("projects", index, "technologies", e.target.value)}
                  placeholder="React, Node.js, MongoDB, AWS, Docker"
                />
                <small>Separate technologies with commas</small>
              </div>
            </div>
            
            <div className="input-group">
              <label>Project Description & Impact</label>
              <textarea
                value={project.description}
                onChange={(e) => handleNestedChange("projects", index, "description", e.target.value)}
                rows={4}
                placeholder="Built a full-stack e-commerce platform with real-time inventory management, payment processing, and user authentication. Achieved 99.9% uptime and handled 10,000+ concurrent users. Increased client revenue by 35% through improved user experience."
              />
              <small>💡 Focus on the problem solved, technologies used, and measurable impact</small>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      <motion.button
        type="button"
        onClick={() => addItem("projects", { 
          title: "", 
          description: "", 
          technologies: "",
          link: "",
          github: "",
          duration: ""
        })}
        className="add-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ➕ Add Project
      </motion.button>
    </motion.div>
  );

  const renderTechnicalSkills = () => (
    <motion.div 
      className="form-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="skills-categories">
        {[
          { key: "languages", label: "Programming Languages", icon: "💻", placeholder: "JavaScript, Python, Java, TypeScript, C++" },
          { key: "frameworks", label: "Frameworks & Libraries", icon: "⚛️", placeholder: "React, Node.js, Express, Django, Spring Boot" },
          { key: "databases", label: "Databases", icon: "🗄️", placeholder: "MongoDB, PostgreSQL, MySQL, Redis, Elasticsearch" },
          { key: "tools", label: "Tools & Technologies", icon: "🛠️", placeholder: "Git, Docker, Kubernetes, Jenkins, Webpack" },
          { key: "cloud", label: "Cloud & DevOps", icon: "☁️", placeholder: "AWS, Azure, GCP, Terraform, CI/CD" }
        ].map((category, index) => (
          <motion.div 
            key={category.key}
            className="skill-category"
            variants={itemVariants}
            custom={index}
          >
            <label>
              <span>{category.icon}</span>
              {category.label}
            </label>
            <motion.input
              type="text"
              value={resume.technicalSkills[category.key].join(", ")}
              onChange={(e) => handleSkillsChange(category.key, e.target.value)}
              placeholder={category.placeholder}
              whileFocus={{ 
                scale: 1.02,
                boxShadow: "0 0 20px rgba(37, 99, 235, 0.3)"
              }}
            />
            <small>Separate skills with commas</small>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderCertifications = () => (
    <motion.div 
      className="form-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {resume.certifications.map((cert, index) => (
          <motion.div
            key={index}
            className="list-item certification-item"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, height: 0 }}
            layout
          >
            <div className="item-header">
              <h4>🏅 Certification {index + 1}</h4>
              {resume.certifications.length > 1 && (
                <motion.button
                  type="button"
                  onClick={() => removeItem("certifications", index)}
                  className="remove-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ❌ Remove
                </motion.button>
              )}
            </div>
            
            <div className="form-grid">
              {[
                { field: "name", label: "Certification Name *", placeholder: "AWS Certified Solutions Architect" },
                { field: "issuer", label: "Issuing Organization *", placeholder: "Amazon Web Services" },
                { field: "date", label: "Issue Date", placeholder: "Dec 2023" },
                { field: "id", label: "Credential ID", placeholder: "AWS-ASA-12345" },
                { field: "link", label: "Verification Link", placeholder: "https://aws.amazon.com/verification" }
              ].map((field) => (
                <div key={field.field} className="input-group">
                  <label>{field.label}</label>
                  <input
                    type={field.field === "link" ? "url" : "text"}
                    value={cert[field.field]}
                    onChange={(e) => handleNestedChange("certifications", index, field.field, e.target.value)}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      <motion.button
        type="button"
        onClick={() => addItem("certifications", {
          name: "",
          issuer: "",
          date: "",
          id: "",
          link: ""
        })}
        className="add-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ➕ Add Certification
      </motion.button>
    </motion.div>
  );

  const renderAdditional = () => (
    <motion.div 
      className="form-section additional-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Languages */}
      <motion.div className="additional-category" variants={itemVariants}>
        <h3>🌍 Languages</h3>
        <AnimatePresence>
          {resume.languages.map((lang, index) => (
            <motion.div
              key={index}
              className="additional-item"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              layout
            >
              <div className="form-grid">
                <div className="input-group">
                  <label>Language</label>
                  <input
                    type="text"
                    value={lang.name}
                    onChange={(e) => handleNestedChange("languages", index, "name", e.target.value)}
                    placeholder="English"
                  />
                </div>
                <div className="input-group">
                  <label>Proficiency</label>
                  <select
                    value={lang.proficiency}
                    onChange={(e) => handleNestedChange("languages", index, "proficiency", e.target.value)}
                  >
                    <option value="">Select Level</option>
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                  </select>
                </div>
                {resume.languages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem("languages", index)}
                    className="remove-btn small"
                  >
                    Remove
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => addItem("languages", { name: "", proficiency: "" })}
          className="add-btn small"
        >
          ➕ Add Language
        </button>
      </motion.div>

      {/* Awards */}
      <motion.div className="additional-category" variants={itemVariants}>
        <h3>🏆 Awards & Achievements</h3>
        <AnimatePresence>
          {resume.awards.map((award, index) => (
            <motion.div
              key={index}
              className="additional-item"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              layout
            >
              <div className="form-grid">
                <div className="input-group">
                  <label>Award Title</label>
                  <input
                    type="text"
                    value={award.title}
                    onChange={(e) => handleNestedChange("awards", index, "title", e.target.value)}
                    placeholder="Employee of the Year"
                  />
                </div>
                <div className="input-group">
                  <label>Issuing Organization</label>
                  <input
                    type="text"
                    value={award.issuer}
                    onChange={(e) => handleNestedChange("awards", index, "issuer", e.target.value)}
                    placeholder="Tech Corp"
                  />
                </div>
                <div className="input-group">
                  <label>Date</label>
                  <input
                    type="text"
                    value={award.date}
                    onChange={(e) => handleNestedChange("awards", index, "date", e.target.value)}
                    placeholder="Dec 2023"
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea
                  value={award.description}
                  onChange={(e) => handleNestedChange("awards", index, "description", e.target.value)}
                  placeholder="Recognized for outstanding performance and leadership in Q4 2023"
                  rows={2}
                />
              </div>
              {resume.awards.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem("awards", index)}
                  className="remove-btn small"
                >
                  Remove
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => addItem("awards", { title: "", issuer: "", date: "", description: "" })}
          className="add-btn small"
        >
          ➕ Add Award
        </button>
      </motion.div>

      {/* Interests */}
      <motion.div className="additional-category" variants={itemVariants}>
        <h3>🎯 Interests & Hobbies</h3>
        <div className="input-group">
          <label>Personal Interests</label>
          <input
            type="text"
            value={resume.interests.join(", ")}
            onChange={(e) => handleArrayChange("interests", e.target.value)}
            placeholder="Photography, Hiking, Open Source Contributing, Chess, Cooking"
          />
          <small>Separate interests with commas. Keep it professional and relevant.</small>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderPreview = () => {
    const currentTemplate = templates.find(t => t.id === selectedTemplate);
    
    return (
      <motion.div 
        className="preview-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="preview-actions" variants={itemVariants}>
          <motion.button 
            onClick={handleSave} 
            disabled={saving || !currentUser} 
            className="save-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {saving ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ⏳
              </motion.span>
            ) : (
              "💾 Save Resume"
            )}
          </motion.button>
          
          <motion.button 
            onClick={handleDownload} 
            className="download-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📄 Download PDF
          </motion.button>
          
          <div className="template-info-preview">
            <span>Template: <strong>{currentTemplate?.name}</strong></span>
          </div>
        </motion.div>
        
        <motion.div 
          className={`resume-preview template-${selectedTemplate}`} 
          ref={previewRef}
          variants={itemVariants}
          style={{ '--accent-color': currentTemplate?.accent }}
        >
          {selectedTemplate === 'modern' && renderModernTemplate()}
          {selectedTemplate === 'executive' && renderExecutiveTemplate()}
          {selectedTemplate === 'creative' && renderCreativeTemplate()}
          {selectedTemplate === 'academic' && renderAcademicTemplate()}
        </motion.div>
      </motion.div>
    );
  };

  // Template-specific render methods
  const renderModernTemplate = () => (
    <div className="modern-template">
      <div className="resume-header modern-header">
        <div className="header-content">
          <h1>{resume.name || "Your Name"}</h1>
          <h2>{resume.title || "Professional Title"}</h2>
          <div className="contact-info">
            {resume.email && <span>📧 {resume.email}</span>}
            {resume.phone && <span>📱 {resume.phone}</span>}
            {resume.location && <span>📍 {resume.location}</span>}
          </div>
          <div className="links">
            {resume.linkedin && <a href={resume.linkedin}>LinkedIn</a>}
            {resume.github && <a href={resume.github}>GitHub</a>}
            {resume.portfolio && <a href={resume.portfolio}>Portfolio</a>}
          </div>
        </div>
        {profileImageUrl && (
          <img src={profileImageUrl} alt="Profile" className="profile-photo modern-photo" />
        )}
      </div>
      
      {resume.summary && (
        <div className="resume-section">
          <h3>Professional Summary</h3>
          <p>{resume.summary}</p>
        </div>
      )}
      
      {resume.experience.some(exp => exp.company || exp.role) && (
        <div className="resume-section">
          <h3>Experience</h3>
          {resume.experience.map((exp, index) => (
            <div key={index} className="experience-entry modern-entry">
              <div className="entry-header">
                <div className="title-company">
                  <h4>{exp.role}</h4>
                  <span className="company">{exp.company}</span>
                </div>
                <div className="date-location">
                  <span className="dates">{exp.start} - {exp.end}</span>
                  {exp.location && <span className="location">{exp.location}</span>}
                </div>
              </div>
              {exp.description && <div className="description">{exp.description}</div>}
            </div>
          ))}
        </div>
      )}
      
      {resume.projects.some(proj => proj.title) && (
        <div className="resume-section">
          <h3>Projects</h3>
          {resume.projects.map((proj, index) => (
            <div key={index} className="project-entry modern-entry">
              <div className="entry-header">
                <h4>{proj.title}</h4>
                {proj.duration && <span className="duration">{proj.duration}</span>}
              </div>
              {proj.technologies && <div className="technologies">{proj.technologies}</div>}
              {proj.description && <p>{proj.description}</p>}
              <div className="project-links">
                {proj.link && <a href={proj.link}>🌐 Demo</a>}
                {proj.github && <a href={proj.github}>🐱 Code</a>}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="two-column-section">
        <div className="left-column">
          {resume.education.some(edu => edu.school || edu.degree) && (
            <div className="resume-section">
              <h3>Education</h3>
              {resume.education.map((edu, index) => (
                <div key={index} className="education-entry">
                  <h4>{edu.degree}</h4>
                  <span className="school">{edu.school}</span>
                  <span className="dates">{edu.start} - {edu.end}</span>
                  {edu.gpa && <span className="gpa">GPA: {edu.gpa}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="right-column">
          {Object.values(resume.technicalSkills).some(skills => skills.length > 0) && (
            <div className="resume-section">
              <h3>Technical Skills</h3>
              <div className="skills-modern">
                {Object.entries(resume.technicalSkills).map(([category, skills]) => (
                  skills.length > 0 && (
                    <div key={category} className="skill-category-display">
                      <strong>{category.charAt(0).toUpperCase() + category.slice(1)}:</strong>
                      <span>{skills.join(", ")}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderExecutiveTemplate = () => (
    <div className="executive-template">
      <div className="executive-header">
        <div className="main-info">
          <h1>{resume.name || "Your Name"}</h1>
          <h2>{resume.title || "Professional Title"}</h2>
          {resume.summary && <p className="executive-summary">{resume.summary}</p>}
        </div>
        <div className="contact-sidebar">
          {profileImageUrl && (
            <img src={profileImageUrl} alt="Profile" className="profile-photo executive-photo" />
          )}
          <div className="contact-details">
            {resume.email && <div>📧 {resume.email}</div>}
            {resume.phone && <div>📱 {resume.phone}</div>}
            {resume.location && <div>📍 {resume.location}</div>}
            {resume.linkedin && <div><a href={resume.linkedin}>💼 LinkedIn</a></div>}
          </div>
        </div>
      </div>
      
      <div className="executive-body">
        <div className="main-content">
          {resume.experience.some(exp => exp.company || exp.role) && (
            <div className="resume-section">
              <h3>Professional Experience</h3>
              {resume.experience.map((exp, index) => (
                <div key={index} className="experience-entry executive-entry">
                  <div className="entry-header">
                    <h4>{exp.role} | {exp.company}</h4>
                    <span className="dates">{exp.start} - {exp.end}</span>
                  </div>
                  {exp.location && <div className="location">{exp.location}</div>}
                  {exp.description && <div className="description">{exp.description}</div>}
                </div>
              ))}
            </div>
          )}
          
          {resume.projects.some(proj => proj.title) && (
            <div className="resume-section">
              <h3>Key Projects & Initiatives</h3>
              {resume.projects.map((proj, index) => (
                <div key={index} className="project-entry executive-entry">
                  <h4>{proj.title}</h4>
                  {proj.description && <p>{proj.description}</p>}
                  {proj.technologies && <div className="technologies">Technologies: {proj.technologies}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="sidebar-content">
          {resume.education.some(edu => edu.school || edu.degree) && (
            <div className="resume-section">
              <h3>Education</h3>
              {resume.education.map((edu, index) => (
                <div key={index} className="education-entry executive-edu">
                  <h4>{edu.degree}</h4>
                  <div className="school">{edu.school}</div>
                  <div className="dates">{edu.start} - {edu.end}</div>
                </div>
              ))}
            </div>
          )}
          
          {resume.certifications.some(cert => cert.name) && (
            <div className="resume-section">
              <h3>Certifications</h3>
              {resume.certifications.map((cert, index) => (
                <div key={index} className="cert-entry">
                  <div className="cert-name">{cert.name}</div>
                  <div className="cert-issuer">{cert.issuer}</div>
                  <div className="cert-date">{cert.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCreativeTemplate = () => (
    <div className="creative-template">
      <div className="creative-sidebar">
        {profileImageUrl && (
          <img src={profileImageUrl} alt="Profile" className="profile-photo creative-photo" />
        )}
        <div className="sidebar-content">
          <h1>{resume.name || "Your Name"}</h1>
          <h2>{resume.title || "Professional Title"}</h2>
          
          <div className="contact-section">
            <h3>Contact</h3>
            {resume.email && <div>📧 {resume.email}</div>}
            {resume.phone && <div>📱 {resume.phone}</div>}
            {resume.location && <div>📍 {resume.location}</div>}
            {resume.linkedin && <div><a href={resume.linkedin}>LinkedIn</a></div>}
            {resume.github && <div><a href={resume.github}>GitHub</a></div>}
            {resume.portfolio && <div><a href={resume.portfolio}>Portfolio</a></div>}
          </div>
          
          {Object.values(resume.technicalSkills).some(skills => skills.length > 0) && (
            <div className="skills-section">
              <h3>Skills</h3>
              {Object.entries(resume.technicalSkills).map(([category, skills]) => (
                skills.length > 0 && (
                  <div key={category} className="skill-group">
                    <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                    <div className="skill-tags">
                      {skills.map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="creative-main">
        {resume.summary && (
          <div className="resume-section creative-summary">
            <h3>About Me</h3>
            <p>{resume.summary}</p>
          </div>
        )}
        
        {resume.experience.some(exp => exp.company || exp.role) && (
          <div className="resume-section">
            <h3>Experience</h3>
            {resume.experience.map((exp, index) => (
              <div key={index} className="experience-entry creative-entry">
                <div className="timeline-dot"></div>
                <div className="entry-content">
                  <h4>{exp.role}</h4>
                  <div className="company-date">
                    <span className="company">{exp.company}</span>
                    <span className="dates">{exp.start} - {exp.end}</span>
                  </div>
                  {exp.description && <div className="description">{exp.description}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {resume.projects.some(proj => proj.title) && (
          <div className="resume-section">
            <h3>Featured Projects</h3>
            <div className="projects-grid">
              {resume.projects.map((proj, index) => (
                <div key={index} className="project-card">
                  <h4>{proj.title}</h4>
                  {proj.description && <p>{proj.description}</p>}
                  {proj.technologies && (
                    <div className="project-tech">
                      {proj.technologies.split(',').map((tech, idx) => (
                        <span key={idx} className="tech-tag">{tech.trim()}</span>
                      ))}
                    </div>
                  )}
                  <div className="project-links">
                    {proj.link && <a href={proj.link}>View Live</a>}
                    {proj.github && <a href={proj.github}>View Code</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {resume.education.some(edu => edu.school || edu.degree) && (
          <div className="resume-section">
            <h3>Education</h3>
            {resume.education.map((edu, index) => (
              <div key={index} className="education-entry creative-edu">
                <h4>{edu.degree}</h4>
                <div className="school-info">
                  <span className="school">{edu.school}</span>
                  <span className="dates">{edu.start} - {edu.end}</span>
                </div>
                {edu.gpa && <div className="gpa">GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderAcademicTemplate = () => (
    <div className="academic-template">
      <div className="academic-header">
        <h1>{resume.name || "Your Name"}</h1>
        <h2>{resume.title || "Professional Title"}</h2>
        <div className="contact-info academic-contact">
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
        </div>
        <div className="academic-links">
          {resume.linkedin && <a href={resume.linkedin}>LinkedIn Profile</a>}
          {resume.github && <a href={resume.github}>Research Repository</a>}
          {resume.portfolio && <a href={resume.portfolio}>Academic Portfolio</a>}
        </div>
      </div>
      
      {resume.summary && (
        <div className="resume-section">
          <h3>Research Interests & Summary</h3>
          <p>{resume.summary}</p>
        </div>
      )}
      
      {resume.education.some(edu => edu.school || edu.degree) && (
        <div className="resume-section">
          <h3>Education</h3>
          {resume.education.map((edu, index) => (
            <div key={index} className="education-entry academic-edu">
              <div className="degree-header">
                <h4>{edu.degree} in {edu.field}</h4>
                <span className="dates">{edu.start} - {edu.end}</span>
              </div>
              <div className="institution">{edu.school}, {edu.location}</div>
              {edu.gpa && <div className="academic-details">GPA: {edu.gpa}</div>}
              {edu.honors && <div className="academic-details">Honors: {edu.honors}</div>}
            </div>
          ))}
        </div>
      )}
      
      {resume.experience.some(exp => exp.company || exp.role) && (
        <div className="resume-section">
          <h3>Professional & Research Experience</h3>
          {resume.experience.map((exp, index) => (
            <div key={index} className="experience-entry academic-entry">
              <div className="position-header">
                <h4>{exp.role}</h4>
                <span className="dates">{exp.start} - {exp.end}</span>
              </div>
              <div className="institution">{exp.company}, {exp.location}</div>
              {exp.description && <div className="description academic-desc">{exp.description}</div>}
            </div>
          ))}
        </div>
      )}
      
      {resume.publications && resume.publications.some(pub => pub.title) && (
        <div className="resume-section">
          <h3>Publications</h3>
          {resume.publications.map((pub, index) => (
            <div key={index} className="publication-entry">
              <div className="pub-title">{pub.title}</div>
              <div className="pub-details">{pub.publisher}, {pub.date}</div>
              {pub.link && <div className="pub-link"><a href={pub.link}>View Publication</a></div>}
            </div>
          ))}
        </div>
      )}
      
      {resume.projects.some(proj => proj.title) && (
        <div className="resume-section">
          <h3>Research Projects</h3>
          {resume.projects.map((proj, index) => (
            <div key={index} className="project-entry academic-project">
              <h4>{proj.title}</h4>
              {proj.duration && <div className="project-duration">Duration: {proj.duration}</div>}
              {proj.description && <p>{proj.description}</p>}
              {proj.technologies && <div className="methodologies">Methodologies: {proj.technologies}</div>}
            </div>
          ))}
        </div>
      )}
      
      {resume.certifications.some(cert => cert.name) && (
        <div className="resume-section">
          <h3>Certifications & Licenses</h3>
          {resume.certifications.map((cert, index) => (
            <div key={index} className="cert-entry academic-cert">
              <div className="cert-name">{cert.name}</div>
              <div className="cert-details">{cert.issuer}, {cert.date}</div>
              {cert.id && <div className="cert-id">ID: {cert.id}</div>}
            </div>
          ))}
        </div>
      )}
      
      {Object.values(resume.technicalSkills).some(skills => skills.length > 0) && (
        <div className="resume-section">
          <h3>Technical Competencies</h3>
          <div className="academic-skills">
            {Object.entries(resume.technicalSkills).map(([category, skills]) => (
              skills.length > 0 && (
                <div key={category} className="skill-category-academic">
                  <strong>{category.charAt(0).toUpperCase() + category.slice(1)}:</strong>
                  <span>{skills.join(", ")}</span>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case "template": return renderTemplateSelection();
      case "personal": return renderPersonalInfo();
      case "links": return renderLinks();
      case "summary": return renderSummary();
      case "experience": return renderExperience();
      case "education": return renderEducation();
      case "projects": return renderProjects();
      case "skills": return renderTechnicalSkills();
      case "certifications": return renderCertifications();
      case "additional": return renderAdditional();
      case "preview": return renderPreview();
      default: return <div>Step content loading...</div>;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <motion.div 
          className="spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p>Loading Resume Builder...</p>
      </div>
    );
  }

  return (
    <div className="resume-builder-root">
      <motion.div 
        className="builder-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
        >
          ✨ Resume Builder CarrerFlow
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Create your professional resume with advanced AI-powered features
        </motion.p>
        
        <motion.div 
          className="progress-container"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="progress-bar">
            <motion.div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span>{Math.round(progress)}% Complete</span>
        </motion.div>
      </motion.div>

      <motion.div 
        className="step-navigation"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className={`step-indicator ${index === currentStep ? 'active' : ''} ${completedSteps.has(index) ? 'completed' : ''}`}
            onClick={() => goToStep(index)}
            variants={itemVariants}
            custom={index}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span 
              className="step-icon"
              animate={completedSteps.has(index) ? {
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              } : {}}
              transition={{ duration: 0.5 }}
            >
              {step.icon}
            </motion.span>
            <div className="step-info">
              <span className="step-title">{step.title}</span>
              <span className="step-number">{index + 1}/{steps.length}</span>
            </div>
            {completedSteps.has(index) && (
              <motion.div
                className="completion-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                ✓
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          className="step-content"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
        >
          <motion.div 
            className="step-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2>{steps[currentStep].title}</h2>
            <p>{steps[currentStep].subtitle}</p>
          </motion.div>
          
          <div className="form-content">
            {renderStepContent()}
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div 
        className="navigation-buttons"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {currentStep > 0 && (
          <motion.button 
            onClick={prevStep} 
            className="nav-btn prev"
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Previous
          </motion.button>
        )}
        
        <div className="center-info">
          <span className="step-counter">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        
        {currentStep < steps.length - 1 && (
          <motion.button 
            onClick={nextStep} 
            className="nav-btn next"
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            Next →
          </motion.button>
        )}
      </motion.div>

      <AnimatePresence>
        {(success || error) && (
          <motion.div 
            className={`message ${success ? 'success' : 'error'}`}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span>{success || error}</span>
            <motion.button 
              onClick={() => { setSuccess(""); setError(""); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
