import React from "react";
import "./LoadingScreen.css";

export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="loading-screen-root">
      <div className="loading-spinner" />
      <div className="loading-message">{message}</div>
    </div>
  );
}