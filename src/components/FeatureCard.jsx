import React from "react";

function FeatureCard({ title, icon, desc }) {
  return (
    <div className="feature-card">
      <div style={{ fontSize: "2.5rem", marginTop: "24px" }}>{icon}</div>
      <div className="feature-title">{title}</div>
      <div className="feature-desc">{desc}</div>
    </div>
  );
}

export default FeatureCard;