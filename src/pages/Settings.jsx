import React, { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase";
import { signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./Settings.css";

export default function Settings({ currentUser }) {
  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    photoURL: "",
    bio: "",
    location: "",
    phone: "",
    linkedin: "",
    github: "",
  });
  const [initialProfile, setInitialProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Load user info from Firebase Auth & Firestore
  useEffect(() => {
    async function fetchProfile() {
      if (!currentUser) return;
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const data = userDoc.exists() ? userDoc.data() : {};
      const combined = {
        displayName: currentUser.displayName || "",
        email: currentUser.email || "",
        photoURL: currentUser.photoURL || "/avatar-placeholder.png",
        bio: data.bio || "",
        location: data.location || "",
        phone: data.phone || "",
        linkedin: data.linkedin || "",
        github: data.github || "",
      };
      setProfile(combined);
      setInitialProfile(combined);
    }
    fetchProfile();
  }, [currentUser]);

  // Check for unsaved changes
  function hasChanges() {
    if (!initialProfile) return false;
    return Object.keys(profile).some(
      (k) => profile[k] !== (initialProfile[k] || "")
    );
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSuccess("");
    setError("");
  }

  async function handleSave(e) {
    if (e) e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      // Update Firebase Auth (displayName, photoURL)
      await updateProfile(auth.currentUser, {
        displayName: profile.displayName,
        photoURL: profile.photoURL,
      });
      // Update Firestore
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          bio: profile.bio,
          location: profile.location,
          phone: profile.phone,
          linkedin: profile.linkedin,
          github: profile.github,
        },
        { merge: true }
      );
      setInitialProfile({ ...profile });
      setEditMode(false);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Error updating profile. Please try again.");
    }
    setSaving(false);
  }

  function handleEdit() {
    setEditMode(true);
    setSuccess("");
    setError("");
  }

  function handleCancel() {
    setProfile({ ...initialProfile });
    setEditMode(false);
    setSuccess("");
    setError("");
  }

  async function handleSignOut() {
    await signOut(auth);
    window.location.href = "/login";
  }

  // Floating save button for UX
  function FloatingSave() {
    if (!editMode || !hasChanges()) return null;
    return (
      <button
        className="floating-save-btn"
        onClick={handleSave}
        disabled={saving}
        type="button"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    );
  }

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>
      <form
        className="settings-form"
        onSubmit={handleSave}
        autoComplete="off"
      >
        <section className="settings-section">
          <h3>Profile</h3>
          <div className="settings-profile-row">
            <img
              src={profile.photoURL || "/avatar-placeholder.png"}
              alt="Profile"
              className="settings-avatar"
            />
            {editMode && (
              <div className="settings-profile-fields">
                <label>
                  Photo URL
                  <input
                    type="text"
                    name="photoURL"
                    value={profile.photoURL}
                    onChange={handleChange}
                    disabled={saving}
                    placeholder="Paste image url"
                  />
                  <span className="settings-profile-tip">
                    Tip: Use a direct image URL (from Google, GitHub, etc.)
                  </span>
                </label>
              </div>
            )}
          </div>
          <div className="settings-profile-fields">
            <label>
              Name
              <input
                type="text"
                name="displayName"
                value={profile.displayName}
                onChange={handleChange}
                disabled={!editMode || saving}
                required
                autoFocus={editMode}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={profile.email}
                disabled
              />
            </label>
            <label>
              Short Bio
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                disabled={!editMode || saving}
                placeholder="Tell us something about yourself..."
              />
            </label>
          </div>
          <div className="settings-profile-grid">
            <label>
              Location
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                disabled={!editMode || saving}
                placeholder="City, Country"
              />
            </label>
            <label>
              Phone
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!editMode || saving}
                placeholder="Phone number"
              />
            </label>
          </div>
          <div className="settings-profile-grid">
            <label>
              LinkedIn
              <input
                type="text"
                name="linkedin"
                value={profile.linkedin}
                onChange={handleChange}
                disabled={!editMode || saving}
                placeholder="LinkedIn profile url"
              />
            </label>
            <label>
              GitHub
              <input
                type="text"
                name="github"
                value={profile.github}
                onChange={handleChange}
                disabled={!editMode || saving}
                placeholder="GitHub profile url"
              />
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h3>Account</h3>
          <button
            type="button"
            className="signout-btn"
            onClick={handleSignOut}
            disabled={saving}
          >
            Sign Out
          </button>
        </section>

        <div className="settings-actions">
          {!editMode ? (
            <button
              type="button"
              className="edit-btn"
              onClick={handleEdit}
              disabled={saving}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="save-btn"
                disabled={saving || !hasChanges()}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            </>
          )}
        </div>
        {success && <div className="settings-success">{success}</div>}
        {error && <div className="settings-error">{error}</div>}
      </form>
    </div>
  );
}