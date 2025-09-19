import React from "react";

export default function AccountSection({ user }) {
  return (
    <div>
      <h2>Account Settings</h2>
      <p>Manage your account details here.</p>
      <div style={{ marginTop: 16 }}>
        <div><b>Email:</b> {user?.email || "your-email@example.com"}</div>
      </div>
    </div>
  );
}