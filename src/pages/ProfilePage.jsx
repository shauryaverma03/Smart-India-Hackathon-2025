import React from "react";

export default function ProfilePage({ currentUser }) {
  if (!currentUser) return <div>Loading profile...</div>;

  return (
    <div>
      <h2>Your Profile</h2>
      <div>
        <strong>Name:</strong> {currentUser.displayName}
      </div>
      <div>
        <strong>Email:</strong> {currentUser.email}
      </div>
      {/* Add more profile info and editing options as needed */}
    </div>
  );
}