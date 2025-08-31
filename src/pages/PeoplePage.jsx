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
      <p className="page-subtitle">Connect with peers and experts. Share your knowledge or find the guidance you need.</p>
      <div className="choice-container">
        <div className="choice-card" onClick={() => onChoice('becomeMentor')}>
          <MdOutlinePersonAddAlt className="choice-icon" />
          <h2>Become a Mentor</h2>
          <p>Share your experience and guide the next generation of professionals in your field.</p>
        </div>
        <div className="choice-card" onClick={() => onChoice('findMentor')}>
          <MdOutlineScreenSearchDesktop className="choice-icon" />
          <h2>Find a Mentor</h2>
          <p>Get guidance from experienced professionals to accelerate your career growth.</p>
        </div>
      </div>
    </>
  );
};

// Component for the multi-step mentor application form
const BecomeMentorForm = ({ onBack, currentUser }) => {
  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', jobTitle: '', company: '', experience: '', industry: '', linkedinUrl: '',
    expertise: '', mentorshipTopics: '', communicationPref: '', availability: '', menteeExpectation: '',
    careerChallenge: '', careerAchievement: '', influentialResource: '', motivation: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Error: You must be logged in to submit an application.");
      return;
    }
    setIsSubmitting(true);
    let profilePictureUrl = '';
    if (imageFile) {
      const storageRef = ref(storage, `profilePictures/${currentUser.uid}/${imageFile.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, imageFile);
        profilePictureUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Error uploading image: ", error);
        alert("There was an error uploading your profile picture.");
        setIsSubmitting(false);
        return;
      }
    }
    try {
      await addDoc(collection(db, "mentors"), { 
        ...formData,
        profilePictureUrl: profilePictureUrl,
        uid: currentUser.uid,
        createdAt: new Date() 
      });
      alert("Application submitted successfully!");
      onBack();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("There was an error submitting your application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button onClick={onBack} className="back-button">← Back to Choices</button>
      <h1 className="page-title">Mentor Application</h1>
      <div className="mentor-form-container">
        <div className="progress-bar" data-step={step}>
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>Professional</div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>Mentorship</div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>Journey</div>
        </div>
        <form className="mentor-form" onSubmit={handleSubmit}>
          {step === 1 && <div className="form-step"> <h2 className="form-step-title">Step 1: Professional Background</h2> <div className="form-group"><label>Full Name</label><input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required /></div> <div className="form-group"><label>Current Job Title</label><input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} required /></div> <div className="form-group"><label>Company</label><input type="text" name="company" value={formData.company} onChange={handleInputChange} required /></div> <div className="form-group"><label>Years of Professional Experience</label><input type="number" name="experience" value={formData.experience} onChange={handleInputChange} required /></div> <div className="form-group"><label>Industry</label><input type="text" name="industry" value={formData.industry} onChange={handleInputChange} placeholder="e.g., Technology, Finance, Healthcare" required /></div> <div className="form-group"><label>LinkedIn Profile URL</label><input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleInputChange} placeholder="https://linkedin.com/in/your-profile" /></div> </div>}
          {step === 2 && <div className="form-step"> <h2 className="form-step-title">Step 2: Mentorship Details</h2> <div className="form-group"><label>Primary Areas of Expertise</label><textarea name="expertise" rows="3" value={formData.expertise} onChange={handleInputChange} placeholder="e.g., React, Product Management, UI/UX" required></textarea></div> <div className="form-group"><label>What topics are you most passionate about mentoring in?</label><textarea name="mentorshipTopics" rows="3" value={formData.mentorshipTopics} onChange={handleInputChange} placeholder="e.g., Career Transitions, Interview Prep, Leadership Skills" required></textarea></div> <div className="form-group"><label>Preferred Communication Style</label><input type="text" name="communicationPref" value={formData.communicationPref} onChange={handleInputChange} placeholder="e.g., Video calls, Email, Messaging app" required /></div> <div className="form-group"><label>General Availability</label><input type="text" name="availability" value={formData.availability} onChange={handleInputChange} placeholder="e.g., Weekday evenings, 2 hours/month" required /></div> <div className="form-group"><label>What do you expect from a mentee?</label><textarea name="menteeExpectation" rows="2" value={formData.menteeExpectation} onChange={handleInputChange} placeholder="e.g., Comes prepared to meetings, open to feedback" required></textarea></div> </div>}
          {step === 3 && <div className="form-step"> <h2 className="form-step-title">Step 3: Your Journey</h2> <div className="form-group"><label htmlFor="profilePicture">Profile Picture</label><input id="profilePicture" type="file" accept="image/png, image/jpeg" onChange={handleImageChange} /></div> <div className="form-group"><label>Describe your biggest career challenge and how you overcame it.</label><textarea name="careerChallenge" rows="4" value={formData.careerChallenge} onChange={handleInputChange} required></textarea></div> <div className="form-group"><label>What is your proudest professional achievement?</label><textarea name="careerAchievement" rows="3" value={formData.careerAchievement} onChange={handleInputChange} required></textarea></div> <div className="form-group"><label>Share a book, article, or resource that significantly influenced your career.</label><input type="text" name="influentialResource" value={formData.influentialResource} onChange={handleInputChange} /></div> <div className="form-group"><label>Briefly, why do you want to be a mentor on CareerFlow?</label><textarea name="motivation" rows="4" value={formData.motivation} onChange={handleInputChange} required></textarea></div> </div>}
          <div className="form-navigation">
            {step > 1 && <button type="button" className="back-button-form" onClick={prevStep} disabled={isSubmitting}>Back</button>}
            {step < 3 && <button type="button" className="next-button" onClick={nextStep} disabled={isSubmitting}>Next</button>}
            {step === 3 && <button type="submit" className="submit-button" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Application'}</button>}
          </div>
        </form>
      </div>
    </>
  );
};

// --- THIS IS THE FINAL CORRECTED VERSION WITH SEARCH AND FILTER ---
const FindMentorView = ({ onBack, currentUser }) => {
  const [allMentors, setAllMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('any');

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "mentors"));
        const mentorsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllMentors(mentorsList);
        setFilteredMentors(mentorsList);
      } catch (err) {
        setError("Failed to load mentors. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMentors();
  }, []);

  useEffect(() => {
    let mentors = [...allMentors];
    if (searchQuery) {
      mentors = mentors.filter(mentor => mentor.fullName.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (companyFilter) {
      mentors = mentors.filter(mentor => mentor.company.toLowerCase().includes(companyFilter.toLowerCase()));
    }
    if (experienceFilter !== 'any') {
      const [min, max] = experienceFilter.split('-').map(Number);
      mentors = mentors.filter(mentor => mentor.experience >= min && (max ? mentor.experience <= max : true));
    }
    setFilteredMentors(mentors);
  }, [searchQuery, companyFilter, experienceFilter, allMentors]);

  if (isLoading) return <p className="page-subtitle">Loading mentors...</p>;
  if (error) return <p className="page-subtitle error-message">{error}</p>;

  return (
    <>
      <button onClick={onBack} className="back-button">← Back to Choices</button>
      <h1 className="page-title">Find a Mentor</h1>
      <p className="page-subtitle">Search and filter to find the right professional for you.</p>

      <div className="filter-container">
        <input type="text" placeholder="Search by name..." className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <input type="text" placeholder="Filter by company..." className="search-input" value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} />
        <select className="filter-select" value={experienceFilter} onChange={(e) => setExperienceFilter(e.target.value)}>
          <option value="any">Any Experience</option>
          <option value="0-2">0-2 Years</option>
          <option value="3-5">3-5 Years</option>
          <option value="6-10">6-10 Years</option>
          <option value="10-">10+ Years</option>
        </select>
      </div>

      {filteredMentors.length > 0 ? (
        <div className="mentors-grid">
          {filteredMentors.map(mentor => (
            <MentorCard key={mentor.id} mentor={mentor} currentUser={currentUser} />
          ))}
        </div>
      ) : (
        <p className="no-requests-message">No mentors found matching your criteria.</p>
      )}
    </>
  );
};

// This is the main component that controls which view is shown
export default function PeoplePage({ userName, currentUser }) {
  const [view, setView] = useState('initial');
  const handleChoice = (choice) => { setView(choice); };
  
  const renderCurrentView = () => {
    switch (view) {
      case 'becomeMentor':
        return <BecomeMentorForm onBack={() => setView('initial')} currentUser={currentUser} />;
      case 'findMentor':
        return <FindMentorView onBack={() => setView('initial')} currentUser={currentUser} />;
      case 'initial':
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