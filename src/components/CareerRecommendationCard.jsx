import React from 'react';

// This component receives the parsed JSON data and renders it
function CareerRecommendationCard({ data }) {
  if (!data) return null;

  return (
    <div className="career-card">
      <h2>{data.recommendation_title || "Career Recommendation"}</h2>
      
      <div className="card-section">
        <h3><strong>1. Role Overview</strong></h3>
        <p>{data.role_overview}</p>
      </div>

      <div className="card-section">
        <h3><strong>2. Fit Analysis</strong></h3>
        <p>{data.fit_analysis}</p>
      </div>

      <div className="card-section">
        <h3><strong>3. Required Skills</strong></h3>
        <ul className="skills-list">
          {data.required_skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>

      <div className="card-section">
        <h3><strong>4. Education Path</strong></h3>
        <p>{data.education_path}</p>
      </div>

      <div className="card-section">
        <h3><strong>5. Career Ladder</strong></h3>
        <p>{data.career_ladder}</p>
      </div>
      
      <div className="card-section">
        <h3><strong>6. Market Insights</strong></h3>
        <p>{data.market_insights}</p>
      </div>

      <div className="card-section">
        <h3><strong>7. Action Plan</strong></h3>
        <table className="action-plan-table">
          <thead>
            <tr>
              <th>Step</th>
              <th>Description</th>
              <th>Timeline</th>
            </tr>
          </thead>
          <tbody>
            {data.action_plan.map((item) => (
              <tr key={item.step}>
                <td>{item.step}</td>
                <td>{item.description}</td>
                <td>{item.timeline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card-section">
        <h3><strong>8. Alternative Careers</strong></h3>
        <ul>
          {data.alternative_careers.map((alt, index) => (
            <li key={index}>{alt}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CareerRecommendationCard;