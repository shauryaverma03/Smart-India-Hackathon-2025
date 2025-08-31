import React, { useState, useEffect } from 'react';
import './MentorCard.css';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export default function MentorCard({ mentor, currentUser }) {
  // Add 'pending' and 'accepted' to the list of possible statuses
  const [requestStatus, setRequestStatus] = useState('idle'); // idle, loading, pending, accepted

  useEffect(() => {
    if (!currentUser || !mentor || !mentor.uid) return;

    const requestsRef = collection(db, "connectionRequests");
    // --- FIX: The query now correctly checks for the mentor's Login ID (uid) ---
    const q = query(requestsRef, 
      where("menteeId", "==", currentUser.uid),
      where("mentorId", "==", mentor.uid)
    );

    getDocs(q).then(querySnapshot => {
      if (!querySnapshot.empty) {
        // A request exists, so we get its status ('pending' or 'accepted')
        const requestData = querySnapshot.docs[0].data();
        setRequestStatus(requestData.status);
      }
    });
  }, [currentUser, mentor]);

  const handleConnect = async () => {
    if (!currentUser) {
      alert("Please log in to connect with mentors.");
      return;
    }

    setRequestStatus('loading');
    try {
      await addDoc(collection(db, "connectionRequests"), {
        menteeId: currentUser.uid,
        menteeName: currentUser.displayName || currentUser.email,
        mentorId: mentor.uid,
        mentorName: mentor.fullName,
        status: 'pending', // A new request is always 'pending'
        createdAt: new Date()
      });
      setRequestStatus('pending'); // Update status to 'pending' after sending
    } catch (error) {
      console.error("Error sending connection request: ", error);
      alert("Failed to send connection request. Please try again.");
      setRequestStatus('idle');
    }
  };

  const getButtonText = () => {
    switch(requestStatus) {
      case 'loading':
        return 'Sending...';
      case 'pending':
        return 'Request Sent';
      case 'accepted':
        return 'Connected'; // <-- FIX: Added this new state
      default:
        return 'Connect';
    }
  };

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