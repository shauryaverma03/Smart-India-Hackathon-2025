import React, { useState, useEffect } from 'react';
import './NotificationsPage.css';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, writeBatch } from 'firebase/firestore';
import { MdCheckCircle, MdInfo } from "react-icons/md"; // Import icons

// Helper function to format time ("5 minutes ago", "2 hours ago", etc.)
function formatTimeAgo(firestoreTimestamp) {
  const date = firestoreTimestamp.toDate();
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export default function NotificationsPage({ currentUser }) {
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    
    const fetchAndMarkNotifications = async () => {
      // --- Fetch notifications for the current user ---
      const notificationsRef = collection(db, "notifications");
      const qNotifications = query(notificationsRef, where("userId", "==", currentUser.uid));
      const notificationsSnapshot = await getDocs(qNotifications);
      const userNotifications = notificationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(userNotifications);

      // --- "Mark as Read" Logic ---
      const unreadNotifications = userNotifications.filter(n => !n.isRead);
      if (unreadNotifications.length > 0) {
        const batch = writeBatch(db);
        unreadNotifications.forEach(notification => {
          const notificationRef = doc(db, "notifications", notification.id);
          batch.update(notificationRef, { isRead: true });
        });
        await batch.commit(); // Commit all updates at once
      }
    };

    const fetchRequests = async () => {
      // ... (This function remains the same)
    };

    Promise.all([fetchRequests(), fetchAndMarkNotifications()]).finally(() => setIsLoading(false));

  }, [currentUser]);

  // ... (handleRequest function remains the same)
  // ... in src/pages/NotificationsPage.jsx
// Make sure you have `doc` and `addDoc` imported from "firebase/firestore"

  const handleRequest = async (requestId, newStatus) => {
    try {
      const requestDocRef = doc(db, "connectionRequests", requestId);
      await updateDoc(requestDocRef, { status: newStatus });

      const originalRequest = requests.find(req => req.id === requestId);

      if (newStatus === 'accepted') {
        // --- THIS IS THE NEW LOGIC ---

        // 1. Create a notification for the mentee (as before)
        await addDoc(collection(db, "notifications"), {
          userId: originalRequest.menteeId,
          message: `${currentUser.displayName || currentUser.email} has accepted your connection request.`,
          isRead: false,
          createdAt: new Date(),
        });

        // 2. Create the chat room and send the first message
        const chatId = [originalRequest.mentorId, originalRequest.menteeId].sort().join('_');
        const messagesRef = collection(db, "chats", chatId, "messages");
        
        await addDoc(messagesRef, {
          text: "Hello! I've accepted your connection request. I'm looking forward to connecting with you.",
          senderId: currentUser.uid, // The mentor is the sender
          createdAt: new Date()
        });
        
        // -----------------------------
      }
      
      setRequests(currentRequests => currentRequests.filter(req => req.id !== requestId));
      
    } catch (error) {
      console.error("Error updating request:", error);
      alert("Failed to update the request. Please try again.");
    }
  };



  if (isLoading) {
    return <div className="notifications-container"><p>Loading notifications...</p></div>;
  }

  return (
    <div className="notifications-container">
      <h1 className="notifications-title">Notifications</h1>
      
      <h2 className="notifications-subtitle">Connection Requests</h2>
      {requests.length > 0 ? (
        <div className="requests-list">
          {requests.map(request => (
            <div key={request.id} className="request-card">
              <p className="request-text"><strong>{request.menteeName}</strong> would like to connect with you.</p>
              <div className="request-actions">
                <button className="accept-btn" onClick={() => handleRequest(request.id, 'accepted')}>Accept</button>
                <button className="decline-btn" onClick={() => handleRequest(request.id, 'declined')}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-requests-message">You have no pending connection requests.</p>
      )}

      {/* --- REDESIGNED NOTIFICATION SECTION --- */}
      <h2 className="notifications-subtitle" style={{marginTop: '40px'}}>Updates</h2>
      {notifications.length > 0 ? (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div key={notification.id} className="notification-card">
              <MdCheckCircle className="notification-icon" />
              <div className="notification-content">
                <p className="notification-text">{notification.message}</p>
                <span className="notification-timestamp">
                  {formatTimeAgo(notification.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
         <p className="no-requests-message">You have no new updates.</p>
      )}
    </div>
  );
}