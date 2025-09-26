import React, { useState } from 'react';
import './ScholarshipPage.css';

const ScholarshipPage = () => {
  const [formData, setFormData] = useState({
    collegeName: '',
    course: '',
    location: '',
    gpa: '',
    category: '',
    budget: ''
  });
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const searchScholarships = async () => {
    if (!formData.collegeName || !formData.course) {
      setError('Please fill in college name and course');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/search-scholarships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.scholarships) {
        setScholarships(data.scholarships);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError('Failed to search scholarships. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScholarship = (scholarship) => {
    // Implement save functionality
    console.log('Saving scholarship:', scholarship);
  };

  const handleApplyScholarship = (scholarship) => {
    // Open application link
    if (scholarship.link && scholarship.link !== '#') {
      window.open(scholarship.link, '_blank');
    }
  };

  return (
    <div className="scholarship-container">
      <div className="scholarship-header">
        <h1>🎓 Scholarship Finder</h1>
        <p>Find personalized scholarship opportunities powered by AI research</p>
      </div>

      <div className="scholarship-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="collegeName">College/University Name *</label>
            <input
              type="text"
              id="collegeName"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleInputChange}
              placeholder="e.g., IIT Delhi, DU, etc."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="course">Course/Field of Study *</label>
            <select 
              id="course"
              name="course" 
              value={formData.course} 
              onChange={handleInputChange}
              required
            >
              <option value="">Select Course</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Medicine">Medicine</option>
              <option value="Business">Business</option>
              <option value="Arts">Arts</option>
              <option value="Science">Science</option>
              <option value="Law">Law</option>
              <option value="Commerce">Commerce</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City/State"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gpa">GPA/Percentage</label>
            <input
              type="text"
              id="gpa"
              name="gpa"
              value={formData.gpa}
              onChange={handleInputChange}
              placeholder="e.g., 8.5 CGPA or 85%"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select 
              id="category"
              name="category" 
              value={formData.category} 
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              <option value="Merit-based">Merit-based</option>
              <option value="Need-based">Need-based</option>
              <option value="Minority">Minority</option>
              <option value="Sports">Sports</option>
              <option value="Research">Research</option>
              <option value="Women">Women in STEM</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="budget">Annual Budget Needed</label>
            <select 
              id="budget"
              name="budget" 
              value={formData.budget} 
              onChange={handleInputChange}
            >
              <option value="">Select Range</option>
              <option value="Under 50000">Under ₹50,000</option>
              <option value="50000-100000">₹50,000 - ₹1,00,000</option>
              <option value="100000-200000">₹1,00,000 - ₹2,00,000</option>
              <option value="Above 200000">Above ₹2,00,000</option>
            </select>
          </div>
        </div>

        <button 
          className="search-btn"
          onClick={searchScholarships}
          disabled={loading}
          type="button"
        >
          {loading ? '🔍 Searching...' : '🚀 Find Scholarships'}
        </button>

        {error && <div className="error-message" role="alert">{error}</div>}
      </div>

      {scholarships.length > 0 && (
        <div className="results-section">
          <h2>🎯 Scholarship Results ({scholarships.length} found)</h2>
          <div className="scholarships-grid">
            {scholarships.map((scholarship, index) => (
              <div key={`scholarship-${index}`} className="scholarship-card">
                <h3>{scholarship.name || 'Scholarship Opportunity'}</h3>
                <div className="scholarship-details">
                  <p><strong>Amount:</strong> {scholarship.amount || 'Amount varies'}</p>
                  <p><strong>Eligibility:</strong> {scholarship.eligibility || 'Check official website'}</p>
                  <p><strong>Deadline:</strong> {scholarship.deadline || 'Check official website'}</p>
                  {scholarship.description && (
                    <p className="description">{scholarship.description}</p>
                  )}
                </div>
                <div className="scholarship-actions">
                  <button 
                    className="apply-btn"
                    onClick={() => handleApplyScholarship(scholarship)}
                    type="button"
                  >
                    Apply Now
                  </button>
                  <button 
                    className="save-btn"
                    onClick={() => handleSaveScholarship(scholarship)}
                    type="button"
                  >
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScholarshipPage;
