import React, { useState, useEffect } from 'react';
import './MentorCard.css';
import { db } from '../firebase';
import { collection, doc, addDoc, query, where, getDocs, writeBatch, serverTimestamp } from 'firebase/firestore';

export default function MentorCard({ mentor, currentUser }) {
  const [requestStatus, setRequestStatus] = useState('idle'); // idle, loading, pending, accepted

  // This useEffect hook correctly checks if a request already exists. No changes needed here.
  useEffect(() => {
    if (!currentUser || !mentor || !mentor.uid) return;

    const requestsRef = collection(db, "connectionRequests");
    const q = query(requestsRef, 
      where("menteeId", "==", currentUser.uid),
      where("mentorId", "==", mentor.uid)
    );

    getDocs(q).then(querySnapshot => {
      if (!querySnapshot.empty) {
        const requestData = querySnapshot.docs[0].data();
        setRequestStatus(requestData.status);
      }
    });
  }, [currentUser, mentor]);

  // THIS FUNCTION IS NOW CORRECTED
  const handleConnect = async () => {
    if (!currentUser) {
      alert("Please log in to connect with mentors.");
      return;
    }

    setRequestStatus('loading');
    try {
      // Use a batch to perform multiple writes at once
      const batch = writeBatch(db);

      // 1. Create the connection request document
      const requestRef = doc(collection(db, "connectionRequests"));
      batch.set(requestRef, {
        menteeId: currentUser.uid,
        menteeName: currentUser.displayName || currentUser.email,
        mentorId: mentor.uid,
        mentorName: mentor.fullName,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // 2. THIS IS THE FIX: Create the notification document FOR THE MENTOR
      const notificationRef = doc(collection(db, "notifications"));
      batch.set(notificationRef, {
        userId: mentor.uid, // <-- Notifies the MENTOR
        message: `${currentUser.displayName || "A new mentee"} would like to connect with you.`,
        isRead: false,
        createdAt: serverTimestamp()
      });
      
      // Commit both writes to the database
      await batch.commit();

      setRequestStatus('pending'); // Update button status after sending
      
    } catch (error) {
      console.error("Error sending connection request: ", error);
      alert("Failed to send connection request. Please try again.");
      setRequestStatus('idle');
    }
  };

  // This helper function is correct. No changes needed.
  const getButtonText = () => {
    switch(requestStatus) {
      case 'loading': return 'Sending...';
      case 'pending': return 'Request Sent';
      case 'accepted': return 'Connected';
      default: return 'Connect';
    }
  };

  // The JSX is correct. No changes needed.
  return (
    <div className="mentor-card">
      <div className="mentor-card-header">
        <img src={mentor.profilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${mentor.fullName}`} alt={mentor.fullName} className="mentor-avatar" />
        <div className="mentor-info">
          <h3 className="mentor-name">{mentor.fullName}</h3>
          <p className="mentor-title">{`${mentor.jobTitle} @ ${mentor.company}`}</p>
        </div>
      </div>
      <div className="mentor-card-body">
        <p className="ai-rationale-label">✍️ From the Mentor</p>
        <p className="ai-rationale-text">{mentor.motivation}</p>
      </div>
      <div className="mentor-card-footer">
        <button 
          className="connect-btn"
          onClick={handleConnect}
          disabled={requestStatus !== 'idle'}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
}