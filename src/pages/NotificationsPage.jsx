import React, { useState, useEffect } from 'react';
import './NotificationsPage.css';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, writeBatch } from 'firebase/firestore';
import { MdCheckCircle } from "react-icons/md";
import { formatTimeAgo } from '../utils/formatters'; // <-- IMPORT THE HELPER FUNCTION

export default function NotificationsPage({ currentUser }) {
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    
    const fetchAndMarkNotifications = async () => {
      const notificationsRef = collection(db, "notifications");
      const qNotifications = query(notificationsRef, where("userId", "==", currentUser.uid));
      const notificationsSnapshot = await getDocs(qNotifications);
      const userNotifications = notificationsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate()); // Sort by most recent
        
      setNotifications(userNotifications);

      const unreadNotifications = userNotifications.filter(n => !n.isRead);
      if (unreadNotifications.length > 0) {
        const batch = writeBatch(db);
        unreadNotifications.forEach(notification => {
          const notificationRef = doc(db, "notifications", notification.id);
          batch.update(notificationRef, { isRead: true });
        });
        await batch.commit();
      }
    };

    const fetchRequests = async () => {
        const requestsRef = collection(db, "connectionRequests");
        const q = query(requestsRef, where("mentorId", "==", currentUser.uid), where("status", "==", "pending"));
        const snapshot = await getDocs(q);
        const fetchedRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(fetchedRequests);
    };

    Promise.all([fetchRequests(), fetchAndMarkNotifications()]).finally(() => setIsLoading(false));

  }, [currentUser]);

  const handleRequest = async (requestId, newStatus) => {
    try {
      const requestDocRef = doc(db, "connectionRequests", requestId);
      await updateDoc(requestDocRef, { status: newStatus });

      const originalRequest = requests.find(req => req.id === requestId);

      if (newStatus === 'accepted') {
        await addDoc(collection(db, "notifications"), {
          userId: originalRequest.menteeId,
          message: `${currentUser.displayName || currentUser.email} has accepted your connection request.`,
          isRead: false,
          createdAt: new Date(),
        });

        const chatId = [originalRequest.mentorId, originalRequest.menteeId].sort().join('_');
        const messagesRef = collection(db, "chats", chatId, "messages");
        
        await addDoc(messagesRef, {
          text: "Hello! I've accepted your connection request. I'm looking forward to connecting with you.",
          senderId: currentUser.uid,
          receiverId: originalRequest.menteeId, // It's good practice to add this
          isRead: false, // For chat notifications
          createdAt: new Date()
        });
      }
      
      setRequests(currentRequests => currentRequests.filter(req => req.id !== requestId));
      
    } catch (error) {
      console.error("Error updating request:", error);
      alert("Failed to update the request. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="notifications-container"><div className="loading-spinner"></div><p>Loading notifications...</p></div>;
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
                  {formatTimeAgo(notification.createdAt)}
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