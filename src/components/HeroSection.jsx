import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { auth } from "../firebase";
import heroVideo from "../assets/Video_Generation_for_Career_Flow.mp4";
import { motion, useAnimation, useInView } from "framer-motion";
import "./HeroSection.css";

const heroFeatures = [
  {
    title: "AI + Human Mentorship",
    description: "AI-powered insights, real mentor wisdom.",
    icon: (
      <svg
        width="32"
        height="32"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          d="M13 10V3L4 14h7v7l9-11h-7z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Resumes That Stand Out",
    description: "ATS-optimized, scored, and beautiful.",
    icon: (
      <svg
        width="32"
        height="32"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Smart Progress Tracking",
    description: "Realtime reminders, visual milestones.",
    icon: (
      <svg
        width="32"
        height="32"
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Built for Every Student",
    description: "From school to dream job, we adapt.",
    icon: (
      <svg
        width="32"
        height="32"
        fill="none"
        stroke="#f59e42"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];
const promises = [
  "Clear path, exact steps",
  "Start-to-finish guidance",
  "24/7 mentor & AI support",
  "Higher employability with ATS",
];

// Reusable FeatureCard component
const FeatureCard = ({ feature }) => (
  <motion.div
    className="hero-feature-card"
    variants={{ hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0 } }}
    whileHover={{ scale: 1.045, boxShadow: "0 4px 32px var(--accent-glow)" }}
    transition={{ type: "spring", stiffness: 250, damping: 20 }}
  >
    <span className="feature-icon">{feature.icon}</span>
    <div>
      <span className="feature-title">{feature.title}</span>
      <span className="feature-desc">{feature.description}</span>
    </div>
  </motion.div>
);

const HeroSection = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  const handleJourneyStart = () => {
    const user = auth.currentUser;
    navigate(user ? "/dashboard" : "/login");
  };

  const listVariants = {
    visible: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.15 },
    },
    hidden: { opacity: 0 },
  };

  const itemVariants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -20 },
  };

  return (
    <>
      <Navbar />
      <div className="hero-bg-particles">{/* ... particles ... */}</div>
      <main className="hero-main-container" ref={ref}>
        {/* Left Section */}
        <motion.section
          className="hero-left"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, x: -60 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
        >
          <motion.h2
            className="hero-brand"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
          ></motion.h2>
          <motion.h1
            className="hero-headline"
            variants={{
              hidden: { y: 40, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
          >
            Guidance That{" "}
            <span className="headline-gradient">Never Leaves You</span>
            <span className="headline-unique">
              Halfway
              <svg
                className="headline-underline"
                width="160"
                height="20"
                viewBox="0 0 160 20"
              >
                <path
                  d="M5 15 Q80 0 155 15"
                  stroke="#7c3aed"
                  strokeWidth="4"
                  fill="none"
                />
              </svg>
            </span>
          </motion.h1>
          <motion.p
            className="hero-desc"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
          >
            Your End-to-End Career Journey, Reimagined. CareerFlow is your
            integrated platform for the entire career lifecycle — from
            exploration and planning to execution and landing your dream job.
          </motion.p>
          <motion.div
            className="hero-blur tagline-glass"
            variants={{
              hidden: { scale: 0.97, opacity: 0 },
              visible: { scale: 1, opacity: 1 },
            }}
          >
            A complete journey, not just advice. CareerFlow guides you step by
            step, from exploring options to becoming job-ready.
          </motion.div>

          <motion.div
            className="hero-feature-list"
            variants={{ visible: { transition: { staggerChildren: 0.13 } } }}
          >
            {heroFeatures.map((feat) => (
              <FeatureCard feature={feat} key={feat.title} />
            ))}
          </motion.div>
        </motion.section>

        {/* Right Section */}
        <motion.section
          className="hero-right"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, x: 60 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { delay: 0.3, type: "spring", stiffness: 80 },
            },
          }}
        >
          <motion.div
            className="hero-video-glow"
            initial={{ transform: "rotateX(25deg) rotateY(-35deg) scale(0.9)" }}
            animate={{ transform: "rotateX(12deg) rotateY(-28deg) scale(1.1)" }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.4,
            }}
          >
            <div className="hero-video-card">
              <video
                className="hero-video"
                src={heroVideo}
                autoPlay
                loop
                muted
                playsInline
                style={{ borderRadius: "1.25rem" }}
                aria-hidden="true"
              />
            </div>
          </motion.div>

          <motion.div
            className="hero-promises-glass"
            initial="hidden"
            animate="visible"
            variants={listVariants}
            transition={{ delay: 0.8 }}
          >
            <h4>Our Model Promises</h4>
            <motion.ul className="promises-list" variants={listVariants}>
              {promises.map((p, i) => (
                <motion.li key={i} variants={itemVariants}>
                  {p}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            className="hero-cta"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Button
              className="primary-button neon-glow"
              onClick={handleJourneyStart}
            >
              Start Your Journey
            </Button>
          </motion.div>
        </motion.section>
      </main>
      <Footer />
    </>
  );
};

export default HeroSection;
