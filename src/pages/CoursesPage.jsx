import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { MdOutlineSchool, MdSearch } from "react-icons/md";
import "./CoursesPage.css";

const API_BASE_URL = "https://courses-backend-production-e28c.up.railway.app";

// --- Sub-components (No Changes) ---
const CourseCardSkeleton = () => (
  <div className="course-item-card is-loading">
    <div className="skeleton skeleton-image"></div>
    <div className="course-item-details">
      <div className="skeleton skeleton-provider"></div>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-desc"></div>
      <div className="skeleton skeleton-button"></div>
    </div>
  </div>
);

const CourseCard = ({ course }) => (
  <div className="course-item-card">
    <div className="course-item-image-wrapper">
      <img
        src={course.image_240x135 || "/courses/placeholder.jpg"}
        alt={course.title}
        className="course-item-image"
      />
    </div>
    <div className="course-item-details">
      <div>
        <span className="course-item-provider">
          {course.visible_instructors?.[0]?.title || "Udemy"}
        </span>
        <h3 className="course-item-title">{course.title}</h3>
      </div>
      <a
        href={`https://www.udemy.com${course.url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="course-item-apply-btn"
      >
        View Course
      </a>
    </div>
  </div>
);

// --- Main Page Component (Corrected) ---
export default function CoursesPage({ currentUser }) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log("CoursesPage useEffect triggered. currentUser:", currentUser);

    if (!currentUser) {
      setError("Please log in to view your recommended courses.");
      setIsLoading(false);
      return;
    }

    const fetchRecommendedCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        let interests = [];
        let fetchedUserName = currentUser.displayName || ""; 

        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          fetchedUserName = userData?.name || fetchedUserName;
          interests = userData?.quizResults?.interests || [];
          console.log("Firestore data found:", { name: fetchedUserName, interests });
        } else {
          console.warn("No user document found in Firestore.");
        }
        
        setUserName(fetchedUserName);

        // ✅ --- THIS IS THE LOGIC THAT WAS CHANGED --- ✅
        let apiUrl = "";
        if (interests.length > 0) {
          // If user has interests, fetch personalized courses
          const interestsQuery = interests.join(",");
          apiUrl = `${API_BASE_URL}/api/courses?interests=${interestsQuery}`;
          console.log("Fetching PERSONALIZED courses from API:", apiUrl);
        } else {
          // If user has NO interests, fetch default courses
          apiUrl = `${API_BASE_URL}/api/courses`;
          console.log("User has no interests. Fetching DEFAULT courses from API:", apiUrl);
        }

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API response received:", data);

        setCourses(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error("Error fetching course data:", err);
        setError("Could not load course data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendedCourses();
  }, [currentUser]);

  const filteredCourses = courses.filter((course) => {
    const query = searchQuery.toLowerCase();
    return (course.title || "").toLowerCase().includes(query);
  });

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 6 }).map((_, index) => (
        <CourseCardSkeleton key={index} />
      ));
    }
    if (error) {
      return <div className="courses-error-state">{error}</div>;
    }
    if (filteredCourses.length === 0) {
      return (
        <div className="courses-empty-state">
          <MdOutlineSchool className="courses-empty-icon" />
          <h3 className="courses-empty-title">No Courses Found</h3>
          <p className="courses-empty-desc">
            We couldn't find any courses matching your criteria at the moment.
          </p>
        </div>
      );
    }
    return filteredCourses.map((course) => (
      <CourseCard key={course.id} course={course} />
    ));
  };

  return (
    <div className="courses-container">
      <div className="courses-card">
        <div className="courses-header">
          <div>
            <h1 className="courses-title">Explore Courses</h1>
            <p className="courses-subtitle">
              {userName
                ? `Find the next step in your professional journey, ${userName}.`
                : "Courses recommended just for you."}
            </p>
          </div>
        </div>
        <div className="courses-controls">
          <div className="courses-search-bar" style={{ width: "100%" }}>
            <MdSearch className="courses-search-icon" />
            <input
              type="text"
              placeholder="Search recommended courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading || error || courses.length === 0}
            />
          </div>
        </div>
        <div className="courses-grid">{renderContent()}</div>
      </div>
    </div>
  );
}