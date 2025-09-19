// src/pages/ChatPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { 
  collection, query, orderBy, onSnapshot, addDoc, 
  serverTimestamp, doc, getDoc, writeBatch 
} from 'firebase/firestore';
import { MdSend, MdArrowBack } from "react-icons/md";
import './ChatPage.css';

export default function ChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const currentUser = auth.currentUser;
  const messagesEndRef = useRef(null);

  // Effect to fetch the other user's data
  useEffect(() => {
    if (!chatId || !currentUser) return;

    const userIds = chatId.split('_');
    const otherUserId = userIds.find(id => id !== currentUser.uid);

    if (otherUserId) {
      const getUserData = async () => {
        const userDocRef = doc(db, 'users', otherUserId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setOtherUser(userDocSnap.data());
        } else {
          setOtherUser({ displayName: "User Not Found" });
        }
      };
      getUserData();
    }
  }, [chatId, currentUser]);

  // Effect to listen for new messages AND mark them as read
  useEffect(() => {
    if (!chatId || !currentUser) return;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);

      // --- Logic to mark incoming messages as read ---
      const unreadMessages = msgs.filter(m => m.receiverId === currentUser.uid && !m.isRead);
      if (unreadMessages.length > 0) {
        const batch = writeBatch(db);
        unreadMessages.forEach(message => {
          const msgRef = doc(db, 'chats', chatId, 'messages', message.id);
          batch.update(msgRef, { isRead: true });
        });
        batch.commit().catch(error => console.error("Error marking messages as read: ", error));
      }
    });

    return () => unsubscribe();
  }, [chatId, currentUser]);
  
  // Effect to scroll to the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- THIS IS THE CORRECTED FUNCTION ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !currentUser) return;

    // 1. Identify the receiver's ID
    const userIds = chatId.split('_');
    const receiverId = userIds.find(id => id !== currentUser.uid);

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
      text: newMessage,
      senderId: currentUser.uid,
      createdAt: serverTimestamp(),
      // 2. ADD THESE TWO FIELDS TO EVERY NEW MESSAGE
      receiverId: receiverId, 
      isRead: false,
    });
    setNewMessage('');
  };

  if (!currentUser) {
    return <p>Please log in to view messages.</p>;
  }

  return (
    <div className="chat-page-container">
      <div className="chat-header">
        <Link to="/dashboard" className="back-button">
          <MdArrowBack size={24} />
        </Link>
        <img 
          src={otherUser?.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${otherUser?.displayName || '?'}`} 
          alt="Avatar" 
          className="chat-header-avatar" 
        />
        <div className="chat-header-info">
          <h3>{otherUser ? otherUser.displayName : "Loading..."}</h3>
          <p>Online</p>
        </div>
      </div>

      <div className="messages-display-area">
        {messages.map(msg => (
          <div key={msg.id} className={`message-wrapper ${msg.senderId === currentUser.uid ? 'sent' : 'received'}`}>
            <div className="message-bubble">
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" aria-label="Send message">
          <MdSend size={20} />
        </button>
      </form>
    </div>
  );
}