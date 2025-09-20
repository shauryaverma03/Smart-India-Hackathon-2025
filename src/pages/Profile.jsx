import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profileDetails, setProfileDetails] = useState({
    bio: "",
    skills: "",
    linkedin: "",
    github: "",
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        setUser(null);
        return;
      }
      setUser({
        name: u.displayName || "",
        email: u.email || "",
        avatar: u.photoURL || "",
        uid: u.uid,
      });

      try {
        const userDoc = await getDoc(doc(db, "users", u.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfileDetails({
            bio: data.bio || "",
            skills: data.skills || "",
            linkedin: data.linkedin || "",
            github: data.github || "",
          });
        }
      } catch {
        // Use defaults if Firestore is not set
      }
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="profile-fullpage-root">
          <div className="profile-fullpage-card medium">
            <p style={{ fontSize: "1.3rem", color: "#666" }}>
              Please <a href="/login">log in</a> to view your profile.
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-fullpage-root">
        <div className="profile-fullpage-card medium">
          <img
            src={user.avatar || "/avatar-placeholder.png"}
            alt={user.name}
            className="profile-fullpage-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/avatar-placeholder.png";
            }}
          />
          <h1 className="profile-fullpage-name">{user.name || "No Name Set"}</h1>
          <p className="profile-fullpage-email">{user.email}</p>
          <div className="profile-fullpage-divider" />

          <div className="profile-details-table">
            <div>
              <span className="profile-detail-label">Bio:</span>
              <span className="profile-detail-value">
                {profileDetails.bio || <span className="profile-detail-placeholder">No bio set</span>}
              </span>
            </div>
            <div>
              <span className="profile-detail-label">Skills:</span>
              <span className="profile-detail-value">
                {profileDetails.skills || <span className="profile-detail-placeholder">No skills added</span>}
              </span>
            </div>
            <div>
              <span className="profile-detail-label">LinkedIn:</span>
              <span className="profile-detail-value">
                {profileDetails.linkedin ? (
                  <a href={profileDetails.linkedin} target="_blank" rel="noopener noreferrer">
                    {profileDetails.linkedin}
                  </a>
                ) : (
                  <span className="profile-detail-placeholder">Not provided</span>
                )}
              </span>
            </div>
            <div>
              <span className="profile-detail-label">GitHub:</span>
              <span className="profile-detail-value">
                {profileDetails.github ? (
                  <a href={profileDetails.github} target="_blank" rel="noopener noreferrer">
                    {profileDetails.github}
                  </a>
                ) : (
                  <span className="profile-detail-placeholder">Not provided</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}