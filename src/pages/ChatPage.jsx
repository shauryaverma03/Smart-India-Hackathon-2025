import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, where, getDocs, writeBatch, doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // <-- Import onAuthStateChanged
import './ChatPage.css';

export default function ChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  // --- THIS useEffect IS NOW CORRECTED ---
  useEffect(() => {
    const auth = getAuth();
    // Use onAuthStateChanged to wait for Firebase to confirm the user
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);

        // All message logic now goes INSIDE here
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
          const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setMessages(msgs);
          
          // Mark incoming messages as read
          const unreadMessages = msgs.filter(m => m.receiverId === user.uid && !m.isRead);
          if (unreadMessages.length > 0) {
            const batch = writeBatch(db);
            unreadMessages.forEach(message => {
              const msgRef = doc(db, 'chats', chatId, 'messages', message.id);
              batch.update(msgRef, { isRead: true });
            });
            batch.commit().catch(error => console.error("Error marking messages as read: ", error));
          }
        });

        // Return the cleanup function for the messages listener
        return () => unsubscribeMessages();
      } else {
        // Handle user being logged out
        setCurrentUser(null);
        setMessages([]);
      }
    });

    // Return the cleanup function for the auth listener
    return () => unsubscribeAuth();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !currentUser) return;

    const [user1, user2] = chatId.split('_');
    const receiverId = currentUser.uid === user1 ? user2 : user1;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
      text: newMessage,
      senderId: currentUser.uid,
      receiverId: receiverId,
      isRead: false,
      createdAt: new Date(),
    });
    setNewMessage('');
  };

  if (!currentUser) {
    return <p>Authenticating...</p>;
  }

  return (
    <div className="chat-page-container">
      <Link to="/dashboard" className="back-to-dash">← Back to Dashboard</Link>
      <div className="messages-display-area">
        {messages.map(msg => (
          <div key={msg.id} className={`message-bubble ${msg.senderId === currentUser.uid ? 'sent' : 'received'}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}