import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './MessagesPage.css';

export default function MessagesPage({ currentUser }) {
  const [connections, setConnections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchConnections = async () => {
      try {
        const requestsRef = collection(db, "connectionRequests");
        // Query for requests where the user is either the mentee OR the mentor, and status is accepted
        const menteeQuery = query(requestsRef, where("menteeId", "==", currentUser.uid), where("status", "==", "accepted"));
        const mentorQuery = query(requestsRef, where("mentorId", "==", currentUser.uid), where("status", "==", "accepted"));
        
        const [menteeSnapshot, mentorSnapshot] = await Promise.all([getDocs(menteeQuery), getDocs(mentorQuery)]);
        
        const userConnections = [];
        menteeSnapshot.forEach(doc => userConnections.push(doc.data()));
        mentorSnapshot.forEach(doc => userConnections.push(doc.data()));
        
        setConnections(userConnections);
      } catch (error) {
        console.error("Error fetching connections:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnections();
  }, [currentUser]);

  if (isLoading) {
    return <div className="messages-container"><p>Loading connections...</p></div>;
  }

  return (
    <div className="messages-container">
      <h1 className="messages-title">My Connections</h1>
      {connections.length > 0 ? (
        <div className="connections-list">
          {connections.map(conn => {
            const otherUserId = currentUser.uid === conn.mentorId ? conn.menteeId : conn.mentorId;
            const otherUserName = currentUser.uid === conn.mentorId ? conn.menteeName : conn.mentorName;
            const chatId = [conn.mentorId, conn.menteeId].sort().join('_');

            return (
              <Link to={`/chat/${chatId}`} key={chatId} className="connection-card">
                <img 
                  src={`https://api.dicebear.com/8.x/initials/svg?seed=${otherUserName}`} 
                  alt={otherUserName} 
                  className="connection-avatar" 
                />
                <p className="connection-name">{otherUserName}</p>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="no-connections-message">You haven't made any connections yet.</p>
      )}
    </div>
  );
}