import React from "react";
import "./SettingsModal.css";
import Settings from "../pages/Settings";

export default function SettingsModal({ open, onClose, currentUser }) {
  if (!open) return null;
  const stop = (e) => e.stopPropagation();

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal-card" onClick={stop}>
        <button className="settings-modal-close" onClick={onClose} aria-label="Close settings">
          &times;
        </button>
        <Settings currentUser={currentUser} />
      </div>
    </div>
  );
}