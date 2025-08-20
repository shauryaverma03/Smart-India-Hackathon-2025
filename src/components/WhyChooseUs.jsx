import React from "react";

const benefits = [
  "Truly personalized career paths (not generic advice)",
  "Real-time job market data for India",
  "Step-by-step skill roadmap",
  "Curated courses and resources",
  "Easy-to-use, modern, and interactive platform"
];

const WhyChooseUs = () => (
  <section className="why-choose-us">
    <h2>Why Choose Us?</h2>
    <ul>
      {benefits.map(b => <li key={b}>{b}</li>)}
    </ul>
  </section>
);

export default WhyChooseUs;