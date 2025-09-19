// src/pages/settingsections/HistoryPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { db } from '../../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import './HistoryPage.css';

const HistoryItem = ({ conversation }) => {
  const navigate = useNavigate(); // Hook for navigation
  const timestamp = conversation.createdAt?.toDate();
  const formattedDate = timestamp ? timestamp.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : 'No date';

  const handleHistoryClick = () => {
    // Navigate to the DreamFlow page and pass the messages array in the state
    navigate('/dashboard', { state: { loadHistory: conversation.messages, from: 'history' } });
  };

  return (
    // UPDATED: This div now handles navigation
    <div className="history-item" onClick={handleHistoryClick}>
      <div className="history-item-header">
        {/* UPDATED: Display the saved title */}
        <span>{conversation.title}</span>
        <span className="history-date">{formattedDate}</span>
      </div>
    </div>
  );
};

export default function HistoryPage({ currentUser }) {
  const [history, setHistory] =  useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const historyCollectionRef = collection(db, 'users', currentUser.uid, 'dreamflowHistory');
        const q = query(historyCollectionRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const historyData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistory(historyData);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [currentUser]);

  if (isLoading) {
    return <p>Loading conversation history...</p>;
  }

  return (
    <div className="history-page-container">
      <h2>DreamFlow AI Conversation History</h2>
      <p>Click on a conversation to view and continue it.</p>
      <div className="history-list">
        {history.length > 0 ? (
          history.map(conv => <HistoryItem key={conv.id} conversation={conv} />)
        ) : (
          <p>No conversation history found.</p>
        )}
      </div>
    </div>
  );
}