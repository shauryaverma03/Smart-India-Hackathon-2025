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

  // Your Railway backend URL
  const API_BASE_URL = 'https://scholarship-backend-production.up.railway.app';

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
      console.log('🔍 Searching scholarships with:', formData);
      
      const response = await fetch(`${API_BASE_URL}/api/search-scholarships`, {
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
      console.log('✅ API Response:', data);
      
      if (data.success && data.scholarships) {
        setScholarships(data.scholarships);
        if (data.scholarships.length === 0) {
          setError('No scholarships found for your criteria. Try adjusting your search parameters.');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('❌ Search error:', err);
      setError('Failed to search scholarships. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScholarship = (scholarship) => {
    try {
      const savedScholarships = JSON.parse(localStorage.getItem('savedScholarships') || '[]');
      if (!savedScholarships.find(s => s.name === scholarship.name)) {
        savedScholarships.push({ ...scholarship, savedAt: new Date().toISOString() });
        localStorage.setItem('savedScholarships', JSON.stringify(savedScholarships));
        alert('✅ Scholarship saved to your bookmarks!');
      } else {
        alert('📋 This scholarship is already in your bookmarks!');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save scholarship. Please try again.');
    }
  };

  const handleApplyScholarship = (scholarship) => {
    if (scholarship.link && scholarship.link !== '#' && scholarship.link !== 'https://scholarships.gov.in') {
      window.open(scholarship.link, '_blank');
    } else {
      // Fallback: Google search for the scholarship
      const searchQuery = encodeURIComponent(`${scholarship.name} application form 2025`);
      window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
    }
  };

  const clearForm = () => {
    setFormData({
      collegeName: '',
      course: '',
      location: '',
      gpa: '',
      category: '',
      budget: ''
    });
    setScholarships([]);
    setError('');
  };

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
    <div className="scholarship-container">
      {/* Header Section */}
      <div className="scholarship-header">
        <div className="header-content">
          <div className="header-icon">🎓</div>
          <h1 className="header-title">AI Scholarship Finder</h1>
          <p className="header-subtitle">
            Discover personalized scholarship opportunities powered by advanced AI research
          </p>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Scholarships</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">₹50Cr+</span>
              <span className="stat-label">Total Value</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">AI Search</span>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="scholarship-form">
        <div className="form-header">
          <h2>🔍 Find Your Perfect Scholarship</h2>
          <p>Fill in your details to get personalized scholarship recommendations</p>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="collegeName">
              <span className="label-icon">🏫</span>
              College/University Name *
            </label>
            <input
              type="text"
              id="collegeName"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleInputChange}
              placeholder="e.g., IIT Delhi, Anna University, DU"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="course">
              <span className="label-icon">📚</span>
              Course/Field of Study *
            </label>
            <select 
              id="course"
              name="course" 
              value={formData.course} 
              onChange={handleInputChange}
              required
              className="form-select"
            >
              <option value="">Select Your Course</option>
              <option value="Computer Science Engineering">Computer Science Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Electronics Engineering">Electronics Engineering</option>
              <option value="Chemical Engineering">Chemical Engineering</option>
              <option value="Medicine (MBBS)">Medicine (MBBS)</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Business Administration (MBA)">Business Administration (MBA)</option>
              <option value="Commerce">Commerce</option>
              <option value="Economics">Economics</option>
              <option value="Arts & Humanities">Arts & Humanities</option>
              <option value="Science (Physics/Chemistry/Math)">Science (PCM/PCB)</option>
              <option value="Law (LLB)">Law (LLB)</option>
              <option value="Architecture">Architecture</option>
              <option value="Design">Design</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">
              <span className="label-icon">📍</span>
              State/Region
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select State</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Delhi">Delhi</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Other">Other State</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="gpa">
              <span className="label-icon">📊</span>
              Academic Performance
            </label>
            <select
              id="gpa"
              name="gpa"
              value={formData.gpa}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select Performance Range</option>
              <option value="Above 9.0 CGPA">Excellent (9.0+ CGPA / 90%+)</option>
              <option value="8.0-9.0 CGPA">Very Good (8.0-9.0 CGPA / 80-90%)</option>
              <option value="7.0-8.0 CGPA">Good (7.0-8.0 CGPA / 70-80%)</option>
              <option value="6.0-7.0 CGPA">Average (6.0-7.0 CGPA / 60-70%)</option>
              <option value="Below 6.0 CGPA">Below Average (Below 60%)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">
              <span className="label-icon">🎯</span>
              Scholarship Category
            </label>
            <select 
              id="category"
              name="category" 
              value={formData.category} 
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">All Categories</option>
              <option value="Merit-based">Merit-based Scholarships</option>
              <option value="Need-based">Need-based Financial Aid</option>
              <option value="SC/ST/OBC">SC/ST/OBC Scholarships</option>
              <option value="Minority">Minority Scholarships</option>
              <option value="Women">Women in STEM</option>
              <option value="Sports">Sports Scholarships</option>
              <option value="Research">Research Fellowships</option>
              <option value="International">International Scholarships</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="budget">
              <span className="label-icon">💰</span>
              Annual Budget Needed
            </label>
            <select 
              id="budget"
              name="budget" 
              value={formData.budget} 
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select Budget Range</option>
              <option value="Under 1 lakh">Under ₹1,00,000</option>
              <option value="1-3 lakhs">₹1,00,000 - ₹3,00,000</option>
              <option value="3-5 lakhs">₹3,00,000 - ₹5,00,000</option>
              <option value="5-10 lakhs">₹5,00,000 - ₹10,00,000</option>
              <option value="Above 10 lakhs">Above ₹10,00,000</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button 
            className="search-btn primary"
            onClick={searchScholarships}
            disabled={loading}
            type="button"
          >
            {loading ? (
              <><span className="btn-spinner"></span>Searching AI Database...</>
            ) : (
              <><span className="btn-icon">🚀</span>Find My Scholarships</>
            )}
          </button>
          
          <button 
            className="search-btn secondary"
            onClick={clearForm}
            type="button"
          >
            <span className="btn-icon">🔄</span>Clear Form
          </button>
        </div>

        {error && (
          <div className="error-message" role="alert">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {scholarships.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <h2>🎯 Your Scholarship Matches</h2>
            <p>Found <strong>{scholarships.length}</strong> scholarships tailored for you</p>
          </div>
          
          <div className="scholarships-grid">
            {scholarships.map((scholarship, index) => (
              <div key={`scholarship-${index}`} className="scholarship-card">
                <div className="card-header">
                  <div className="scholarship-rank">#{index + 1}</div>
                  <div className="scholarship-type">
                    {scholarship.name.toLowerCase().includes('government') ? '🏛️ Govt' : 
                     scholarship.name.toLowerCase().includes('private') ? '🏢 Private' : 
                     '🎓 Academic'}
                  </div>
                </div>
                
                <h3 className="scholarship-title">{scholarship.name}</h3>
                
                <div className="scholarship-details">
                  <div className="detail-item">
                    <span className="detail-icon">💰</span>
                    <div>
                      <strong>Amount</strong>
                      <p>{scholarship.amount}</p>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">✅</span>
                    <div>
                      <strong>Eligibility</strong>
                      <p>{scholarship.eligibility}</p>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <div>
                      <strong>Deadline</strong>
                      <p>{scholarship.deadline}</p>
                    </div>
                  </div>
                </div>

                {scholarship.description && (
                  <div className="scholarship-description">
                    <p>{scholarship.description}</p>
                  </div>
                )}

                <div className="scholarship-actions">
                  <button 
                    className="action-btn primary"
                    onClick={() => handleApplyScholarship(scholarship)}
                    type="button"
                  >
                    <span className="btn-icon">🚀</span>
                    Apply Now
                  </button>
                  <button 
                    className="action-btn secondary"
                    onClick={() => handleSaveScholarship(scholarship)}
                    type="button"
                  >
                    <span className="btn-icon">💾</span>
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h3>🤖 AI is searching...</h3>
            <p>Finding the best scholarships for your profile</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScholarshipPage;
