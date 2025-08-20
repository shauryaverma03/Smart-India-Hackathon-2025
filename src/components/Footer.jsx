import React from "react";
import {
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";
import { motion } from "framer-motion"; // Import Framer Motion
import "./Footer.css";

export default function Footer() {
  return (
    <motion.footer
      className="careerflow-footer"
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.7 }}
    >
      <div className="footer-main">
        <div className="footer-col footer-logo">
          <span className="footer-logo-text"><b>CareerFlow</b></span>
        </div>
        <div className="footer-col footer-center">
          <div>
            Built with <span className="footer-heart">♥</span>
          </div>
          <div>in India for the world</div>
        </div>
        <div className="footer-col footer-contact">
          <div><b>Contact</b></div>
          <a href="mailto:shauryaverma036@gmail.com" className="footer-contact-link">shauryaverma036@gmail.com</a>
          <div className="footer-social">
            <motion.a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              whileHover={{ scale: 1.25, rotate: 8, color: "#e53935" }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <FaLinkedin />
            </motion.a>
            <motion.a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              whileHover={{ scale: 1.25, rotate: 8, color: "#e53935" }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <FaTwitter />
            </motion.a>
            <motion.a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              whileHover={{ scale: 1.25, rotate: 8, color: "#e53935" }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <FaInstagram />
            </motion.a>
            <motion.a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              whileHover={{ scale: 1.25, rotate: 8, color: "#e53935" }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <FaGithub />
            </motion.a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} CareerFlow. All rights reserved.
      </div>
    </motion.footer>
  );
}