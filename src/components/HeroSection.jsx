import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { auth } from "../firebase";
import heroVideo from "../assets/Video_Generation_for_Career_Flow.mp4";
import { motion } from "framer-motion";
import "./HeroSection.css";

const HeroSection = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleJourneyStart = () => {
    const user = auth.currentUser;
    navigate(user ? "/dashboard" : "/login");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Parallax effect for video/image
  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 20;
    const y = (e.clientY / innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  return (
    <>
      <Navbar />
      <main className="hero-container" onMouseMove={handleMouseMove}>
        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="website-name" variants={itemVariants}>
            CareerFlow
          </motion.div>

          <motion.h1 className="hero-main-heading" variants={itemVariants}>
            <span className="heading-accent">
              Guidance That Never Leaves You Halfway
            </span>
          </motion.h1>

          <div className="hero-grid">
            {/* Left content */}
            <motion.div
              className="hero-left-content"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.p className="hero-description" variants={itemVariants}>
                Your End-to-End Career Journey, Reimagined. CareerFlow is your
                integrated platform for the entire career lifecycle — from
                exploration and planning to execution and landing your dream
                job.
              </motion.p>

              <motion.div className="usp-tagline" variants={itemVariants}>
                A complete journey, not just advice. CareerFlow doesn't stop at
                suggesting careers — it guides students step by step, from
                exploring options to becoming job-ready.
              </motion.div>

              <motion.div className="usp-points" variants={containerVariants}>
                {[
                  {
                    title: "AI + Human Mentorship",
                    description:
                      "Blends AI-powered insights with real mentor guidance",
                    iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
                  },
                  {
                    title: "Resumes That Actually Work",
                    description: "ATS-optimized resumes with scoring system",
                    iconPath:
                      "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                  },
                  {
                    title: "Smart Progress Tracking",
                    description:
                      "Real-time monitoring with reminders and support",
                    iconPath:
                      "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
                  },
                  {
                    title: "Built for Every Student",
                    description: "Adapts to your journey from school to career",
                    iconPath:
                      "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                  },
                ].map((usp, index) => (
                  <motion.div
                    className="usp-point hover-3d"
                    key={index}
                    variants={itemVariants}
                    whileHover={{ rotateX: 5, rotateY: 5, scale: 1.03 }}
                  >
                    <svg
                      className="usp-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={usp.iconPath}
                      />
                    </svg>
                    <div className="usp-content">
                      <h4>{usp.title}</h4>
                      <p>{usp.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="model-promises"
                variants={containerVariants}
              >
                <h3>Our Model Promises</h3>
                <div className="promise-grid">
                  {[
                    "Clear career path with exact steps",
                    "Complete start-to-finish guidance",
                    "24/7 mentor and AI support",
                    "Higher employability with ATS resumes",
                  ].map((text, idx) => (
                    <motion.div
                      className="promise-item hover-3d"
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ rotateX: 3, rotateY: 3, scale: 1.02 }}
                    >
                      <div className="promise-dot"></div>
                      <span className="promise-text">{text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right content */}
            <motion.div
              className="hero-right-content-wrapper"
              style={{
                transform: `rotateY(${
                  mousePos.x
                }deg) rotateX(${-mousePos.y}deg)`,
              }}
            >
              <div className="hero-image-container">
                <div className="hero-image-wrapper">
                  <video
                    className="hero-video"
                    src={heroVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
              </div>

              <div className="cta-container">
                <Button
                  className="primary-button glow-button"
                  onClick={handleJourneyStart}
                >
                  Start Your Journey
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
};

export default HeroSection;
