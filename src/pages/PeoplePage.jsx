import React, { useState, useEffect } from 'react';
import './PeoplePage.css';
import { MdOutlinePersonAddAlt, MdOutlineScreenSearchDesktop } from "react-icons/md";
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import MentorCard from '../components/MentorCard';

// Component for the initial two choices
const InitialChoiceView = ({ onChoice }) => {
  return (
    <>
      <h1 className="page-title">Join our Professional Network</h1>
      <p className="page-subtitle">
        Connect with peers and experts. Share your knowledge or find the guidance you need.
      </p>
      
      <div className="choice-container">
        <div className="choice-card" onClick={() => onChoice('becomeMentor')}>
          <MdOutlinePersonAddAlt className="choice-icon" />
          <h3>Become a Mentor</h3>
          <p>Share your experience and guide the next generation of professionals in your field.</p>
        </div>
        
        <div className="choice-card" onClick={() => onChoice('findMentor')}>
          <MdOutlineScreenSearchDesktop className="choice-icon" />
          <h3>Find a Mentor</h3>
          <p>Get guidance from experienced professionals to accelerate your career growth.</p>
        </div>
      </div>
    </>
  );
};

// Component for finding mentors
const FindMentorView = ({ onBack, currentUser }) => {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const mentorsCollection = collection(db, 'mentors');
        const mentorSnapshot = await getDocs(mentorsCollection);
        const mentorList = mentorSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMentors(mentorList);
        setFilteredMentors(mentorList);
      } catch (err) {
        setError('Failed to load mentors. Please try again.');
        console.error('Error fetching mentors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  useEffect(() => {
    let filtered = mentors;
    
    if (searchTerm) {
      filtered = filtered.filter(mentor =>
        mentor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (industryFilter) {
      filtered = filtered.filter(mentor =>
        mentor.industry === industryFilter
      );
    }
    
    setFilteredMentors(filtered);
  }, [searchTerm, industryFilter, mentors]);

  if (loading) return <div className="loading-message">Loading mentors...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <button className="back-button" onClick={onBack}>← Back to Choices</button>
      
      <h1 className="page-title">Find Your Mentor</h1>
      <p className="page-subtitle">
        Search and filter to find the right professional for you.
      </p>
      
      <div className="filter-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search mentors by name, title, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          className="filter-select"
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
        >
          <option value="">All Industries</option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
          <option value="Marketing">Marketing</option>
          <option value="Consulting">Consulting</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="mentors-grid">
        {filteredMentors.length > 0 ? (
          filteredMentors.map(mentor => (
            <MentorCard key={mentor.id} mentor={mentor} currentUser={currentUser} />
          ))
        ) : (
          <p className="no-results">No mentors found matching your criteria.</p>
        )}
      </div>
    </>
  );
};

// Component for becoming a mentor
const BecomeMentorView = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [formData, setFormData] = useState({
    // Step 1: Professional Background
    fullName: '',
    currentTitle: '',
    company: '',
    industry: '',
    experience: '',
    
    // Step 2: Expertise & Skills
    skills: '',
    expertise: '',
    achievements: '',
    
    // Step 3: Mentorship Approach
    availability: '',
    mentorshipStyle: '',
    motivation: '',
    targetAudience: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'mentors'), {
        ...formData,
        createdAt: new Date(),
        status: 'pending'
      });
      alert('Application submitted successfully! We will review it and get back to you.');
      onBack();
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = (step) => {
    switch (step) {
      case 1: return 'Professional Background';
      case 2: return 'Expertise & Experience';
      case 3: return 'Mentorship Approach';
      default: return 'Application Form';
    }
  };

  const getStepDescription = (step) => {
    switch (step) {
      case 1: return 'Tell us about your professional journey and current role to help mentees understand your expertise.';
      case 2: return 'Share your key skills, areas of expertise, and notable achievements in your field.';
      case 3: return 'Describe your mentorship style, availability, and what motivates you to mentor others.';
      default: return '';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Current Job Title</label>
              <input
                type="text"
                value={formData.currentTitle}
                onChange={(e) => handleInputChange('currentTitle', e.target.value)}
                placeholder="e.g., Senior Software Engineer, Marketing Manager"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Current company or organization"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Industry</label>
              <select
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                required
              >
                <option value="">Select your industry</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Marketing">Marketing</option>
                <option value="Consulting">Consulting</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Years of Experience</label>
              <select
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                required
              >
                <option value="">Select experience level</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5-10 years">5-10 years</option>
                <option value="10-15 years">10-15 years</option>
                <option value="15+ years">15+ years</option>
              </select>
            </div>
          </>
        );
        
      case 2:
        return (
          <>
            <div className="form-group">
              <label>Key Skills</label>
              <textarea
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="List your key professional skills (e.g., JavaScript, Project Management, Data Analysis)"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Areas of Expertise</label>
              <textarea
                value={formData.expertise}
                onChange={(e) => handleInputChange('expertise', e.target.value)}
                placeholder="Describe your areas of expertise and specialization"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Notable Achievements</label>
              <textarea
                value={formData.achievements}
                onChange={(e) => handleInputChange('achievements', e.target.value)}
                placeholder="Share some of your professional achievements or projects you're proud of"
                required
              />
            </div>
          </>
        );
        
      case 3:
        return (
          <>
            <div className="form-group">
              <label>Availability</label>
              <select
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                required
              >
                <option value="">Select your availability</option>
                <option value="1-2 hours/week">1-2 hours per week</option>
                <option value="2-4 hours/week">2-4 hours per week</option>
                <option value="4-6 hours/week">4-6 hours per week</option>
                <option value="Flexible">Flexible schedule</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Mentorship Style</label>
              <textarea
                value={formData.mentorshipStyle}
                onChange={(e) => handleInputChange('mentorshipStyle', e.target.value)}
                placeholder="Describe your mentorship approach and communication style"
                required
              />
            </div>
            
            <div className="form-group">
              <label>What motivates you to mentor others?</label>
              <textarea
                value={formData.motivation}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                placeholder="Share your motivation for becoming a mentor"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Target Audience</label>
              <textarea
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder="Describe the type of mentees you'd like to work with"
                required
              />
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="mentor-application-container">
      <button className="back-button" onClick={onBack}>← Back to Choices</button>
      
      <div className="mentor-form-container">
        {/* Professional Mentorship Journey Progress */}
        <div className="mentorship-journey-container">
          <h2 className="mentorship-journey-title">Professional Mentorship Journey</h2>
          
          <div className="step-progress-container">
            <div className="step-progress-bar" data-current-step={currentStep}>
              {[1, 2, 3].map((step) => (
                <div key={step} className={`step-item ${step <= currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}>
                  <div className={`step-circle ${step <= currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}>
                    {step < currentStep ? '✓' : step}
                  </div>
                  <span className="step-label">{getStepTitle(step)}</span>
                </div>
              ))}
            </div>
            
            <div className="current-step-description">
              <h4>Step {currentStep}: {getStepTitle(currentStep)}</h4>
              <p>{getStepDescription(currentStep)}</p>
            </div>
          </div>
        </div>

        {/* Form Content - REMOVED DUPLICATE TITLE */}
        <div className="form-content">
          {renderStepContent()}
          
          <div className="form-navigation">
            <button
              className="nav-button secondary"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </button>
            
            {currentStep === totalSteps ? (
              <button
                className="nav-button primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            ) : (
              <button
                className="nav-button primary"
                onClick={handleNext}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// This is the main component that controls which view is shown
export default function PeoplePage({ userName, currentUser }) {
  const [view, setView] = useState('initial');

  const handleChoice = (choice) => {
    setView(choice);
  };

  const renderCurrentView = () => {
    switch (view) {
      case 'becomeMentor':
        return <BecomeMentorView onBack={() => setView('initial')} />;
      case 'findMentor':
        return <FindMentorView onBack={() => setView('initial')} currentUser={currentUser} />;
      default:
        return <InitialChoiceView onChoice={handleChoice} />;
    }
  };

  return (
    <div className="people-page-container">
      {renderCurrentView()}
    </div>
  );
}
