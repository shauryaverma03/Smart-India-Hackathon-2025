import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./HomePage.css";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="main-hero">
        <section className="hero-content">
          <div className="hero-overline">MORE THAN AN AI CAREER ADVISOR</div>
          <h1 className="hero-heading">
            Discover your<br />
            perfect career path
          </h1>
          <p className="hero-subtext">
            With our AI-powered platform, you can explore, analyze, and optimize your career journey. 
            Get personalized guidance, skill gap analysis, and curated resources—built just for Indian students.
          </p>
          <a href="/career-test" className="hero-btn">Start building</a>
        </section>
      </main>
      <Footer />
    </>
  );
}