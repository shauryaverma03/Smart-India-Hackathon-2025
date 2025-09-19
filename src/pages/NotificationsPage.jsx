import React, { useState, useEffect } from 'react';
import './NotificationsPage.css';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, setDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { MdCheckCircle } from "react-icons/md";
import { formatTimeAgo } from '../utils/formatters'; // We will create this file next

export default function NotificationsPage({ currentUser }) {
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    
    // Fetches connection requests for the current user (as mentor)
    const fetchRequests = async () => {
      const requestsRef = collection(db, "connectionRequests");
      const q = query(requestsRef, where("mentorId", "==", currentUser.uid), where("status", "==", "pending"));
      const snapshot = await getDocs(q);
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    // Fetches all notifications and marks them as read
    const fetchAndMarkNotifications = async () => {
      const notificationsRef = collection(db, "notifications");
      const q = query(notificationsRef, where("userId", "==", currentUser.uid));
      const snapshot = await getDocs(q);
      
      const userNotifications = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0)); // Sort by most recent
        
      setNotifications(userNotifications);

      const unread = userNotifications.filter(n => !n.isRead);
      if (unread.length > 0) {
        const batch = writeBatch(db);
        unread.forEach(notification => {
          const notificationRef = doc(db, "notifications", notification.id);
          batch.update(notificationRef, { isRead: true });
        });
        await batch.commit();
      }
    };

    Promise.all([fetchRequests(), fetchAndMarkNotifications()]).finally(() => setIsLoading(false));

  }, [currentUser]);

  const handleRequest = async (requestId, newStatus) => {
    try {
      const batch = writeBatch(db);
      const originalRequest = requests.find(req => req.id === requestId);
      const requestDocRef = doc(db, "connectionRequests", requestId);

      // 1. Update the request status
      batch.update(requestDocRef, { status: newStatus });

      if (newStatus === 'accepted') {
        // 2. CRITICAL FIX: Create the parent chat document with a 'members' array
        const chatId = [originalRequest.mentorId, originalRequest.menteeId].sort().join('_');
        const chatDocRef = doc(db, "chats", chatId);
        batch.set(chatDocRef, {
          members: [originalRequest.mentorId, originalRequest.menteeId],
          createdAt: serverTimestamp()
        });

        // 3. Create a notification for the mentee (as requested)
        const notificationRef = doc(collection(db, "notifications")); // Auto-generate ID
        batch.set(notificationRef, {
          userId: originalRequest.menteeId,
          message: `${currentUser.displayName || currentUser.email} accepted your connection request.`,
          isRead: false,
          createdAt: serverTimestamp(),
        });
      }
      
      // Commit all database changes at once
      await batch.commit(); 
      
      // Update the UI immediately
      setRequests(currentRequests => currentRequests.filter(req => req.id !== requestId));

    } catch (error) {
      console.error("Error updating request:", error);
      alert("Failed to update the request. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="notifications-container">
        <div className="loading-spinner"></div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="notifications-container fade-in">
      <h1 className="notifications-title">Notifications</h1>
      
      <h2 className="notifications-subtitle">Connection Requests</h2>
      {requests.length > 0 ? (
        <div className="requests-list">
          {requests.map(request => (
            <div key={request.id} className="request-card">
              <p className="request-text"><strong>{request.menteeName || 'A user'}</strong> would like to connect with you.</p>
              <div className="request-actions">
                <button className="accept-btn" onClick={() => handleRequest(request.id, 'accepted')}>Accept</button>
                <button className="decline-btn" onClick={() => handleRequest(request.id, 'declined')}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-items-message">You have no pending connection requests.</p>
      )}

      <h2 className="notifications-subtitle" style={{marginTop: '40px'}}>Updates</h2>
      {notifications.length > 0 ? (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div key={notification.id} className="notification-card">
              <MdCheckCircle className="notification-icon" />
              <div className="notification-content">
                <p className="notification-text">{notification.message}</p>
                <span className="notification-timestamp">
                  {notification.createdAt ? formatTimeAgo(notification.createdAt) : 'just now'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-items-message">You have no new updates.</p>
      )}
    </div>
  );
}