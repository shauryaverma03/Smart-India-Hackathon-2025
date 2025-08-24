import React from "react";
import "./Notification.css";

function Notification({ message, show }) {
  return show ? (
    <div className={`notification show`}>
      {message}
    </div>
  ) : null;
}
export default Notification;
