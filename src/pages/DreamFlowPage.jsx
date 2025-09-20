// src/pages/DreamFlowPage.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { streamBotResponse } from '../services/counselorService';
import MessageList from '../components/MessageList.jsx';
import MessageInput from '../components/MessageInput.jsx';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, doc, updateDoc, query, orderBy, getDocs, writeBatch, serverTimestamp } from 'firebase/firestore';
import './DreamFlowPage.css';

const HISTORY_LIMIT = 20;

export default function DreamFlowPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [welcomeAnimationComplete, setWelcomeAnimationComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const historyDocIdRef = useRef(null); // Ref to hold the ID of the loaded chat
  const messagesToSaveRef = useRef(messages);
  const isInitialized = useRef(false);
  const logoRef = useRef(null);
  const messageAreaRef = useRef(null);

  useEffect(() => {
    messagesToSaveRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    setSessionId(uuidv4());
    const historicalConversation = location.state?.loadHistory;

    if (historicalConversation) {
      setMessages(historicalConversation.messages);
      historyDocIdRef.current = historicalConversation.id; // Store the document ID
      setShowWelcomeScreen(false);
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      setShowWelcomeScreen(true);
      const animationSequence = async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (logoRef.current) logoRef.current.classList.add('logo-entrance');
        await new Promise(resolve => setTimeout(resolve, 2000));
        setWelcomeAnimationComplete(true);
      };
      animationSequence();
    }
  }, [location, navigate]);

  useEffect(() => {
    return () => {
      const currentMessages = messagesToSaveRef.current;
      const docIdToUpdate = historyDocIdRef.current;
      if (!currentUser || currentMessages.length <= 1) return;
      
      // Save only if it's a new chat (no docId) or a continued chat with new messages
      if (!docIdToUpdate || (docIdToUpdate && currentMessages.length > 0)) {
         saveConversationHistory(currentMessages, docIdToUpdate);
      }
    };
  }, [currentUser]);

  const saveConversationHistory = async (messagesToSave, docIdToUpdate) => {
    if (!currentUser) return;
    const historyCollectionRef = collection(db, 'users', currentUser.uid, 'dreamflowHistory');

    if (docIdToUpdate) {
      console.log("Updating existing conversation:", docIdToUpdate);
      const docRef = doc(historyCollectionRef, docIdToUpdate);
      try {
        await updateDoc(docRef, {
          messages: messagesToSave,
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        console.error("Error updating conversation:", error);
      }
    } else {
      console.log("Saving new conversation...");
      const userFirstMessage = messagesToSave.find(msg => msg.sender === 'user');
      const title = userFirstMessage ? userFirstMessage.text : 'Untitled Chat';
      try {
        await addDoc(historyCollectionRef, {
          title: title,
          messages: messagesToSave,
          createdAt: serverTimestamp()
        });
        const q = query(historyCollectionRef, orderBy('createdAt', 'asc'));
        const snapshot = await getDocs(q);
        if (snapshot.size > HISTORY_LIMIT) {
          const conversationsToDelete = snapshot.docs.slice(0, snapshot.size - HISTORY_LIMIT);
          const batch = writeBatch(db);
          conversationsToDelete.forEach(doc => batch.delete(doc.ref));
          await batch.commit();
        }
      } catch (error) {
        console.error("Error saving new conversation:", error);
      }
    }
  };
  
  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleStartChat = useCallback(() => {
    setShowWelcomeScreen(false);
    setMessages([
      { id: 'initial-bot-message', sender: 'bot', text: "🌟 Welcome to DreamFlow AI! I'm your intelligent career co-pilot. Share your skills, interests, or career goals, and let's discover your perfect career path together!" }
    ]);
  }, []);

  const handleSendMessage = useCallback(async (userInput) => {
    if (!userInput.trim()) return;
    const userMessage = { id: uuidv4(), sender: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);
    setIsLoading(true);
    const botMessagePlaceholder = { id: uuidv4(), sender: 'bot', text: '' };
    const onChunkReceived = (chunk) => {
      if (isThinking) setIsThinking(false);
      setMessages(prev => {
        const messageExists = prev.some(msg => msg.id === botMessagePlaceholder.id);
        if (!messageExists) {
          return [...prev, { ...botMessagePlaceholder, text: chunk }];
        }
        return prev.map(msg =>
          msg.id === botMessagePlaceholder.id ? { ...msg, text: msg.text + chunk } : msg
        );
      });
    };
    const onStreamEnd = () => { setIsLoading(false); setIsThinking(false); };
    const onError = (error) => {
      console.error("Streaming Error:", error);
      const errorMessage = { id: botMessagePlaceholder.id, sender: 'bot', text: "I apologize, but I encountered a temporary issue. Please try again!" };
      setMessages(prev => [...prev.filter(msg => msg.id !== userMessage.id), userMessage, errorMessage]);
      onStreamEnd();
    };
    streamBotResponse(userInput, sessionId, onChunkReceived, onError, onStreamEnd);
  }, [sessionId, isThinking]);
  
  return (
    <div className="dreamflow-app">
      {showWelcomeScreen ? (
        <div className="welcome-screen">
          <div className="background-animation">
            <div className="geometric-shapes">
              {[...Array(5)].map((_, i) => <div key={i} className={`shape shape-${i + 1}`}></div>)}
            </div>
          </div>
          <div className="welcome-content">
            <div className="hero-logo-section">
              <div className="logo-container">
                <img ref={logoRef} src="/generated-image.png" alt="DreamFlow AI" className="hero-logo" />
                <div className="logo-aura"></div>
              </div>
              {welcomeAnimationComplete && (
                <div className="title-system">
                  <h1 className="main-title">
                    <span className="title-part dream">Dream</span>
                    <span className="title-part flow">Flow</span>
                    <span className="title-part ai">AI</span>
                  </h1>
                  <p className="subtitle">Your Next-Generation AI Career Co-pilot</p>
                </div>
              )}
            </div>
            {welcomeAnimationComplete && (
              <div className="features-showcase">
                <div className="feature-grid">
                  <div className="feature-card">
                    <div className="feature-icon">🎯</div>
                    <h3>Precision Matching</h3>
                    <p>AI-powered career alignment</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">🚀</div>
                    <h3>Advanced Analytics</h3>
                    <p>Deep industry insights</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">💡</div>
                    <h3>Smart Recommendations</h3>
                    <p>Personalized growth paths</p>
                  </div>
                </div>
                <button className="ultimate-cta-button" onClick={handleStartChat}>
                  <div className="button-content">
                    <span className="button-text">Begin Your Journey</span>
                    <span className="button-arrow">→</span>
                  </div>
                </button>
              </div>
            )}
          </div>
          <div className="particle-system">
            {[...Array(12)].map((_, i) => <div key={i} className={`floating-particle particle-${i + 1}`}></div>)}
          </div>
        </div>
      ) : (
        <div className="chat-interface">
          <div className="chat-header">
            <div className="header-content">
              <div className="header-logo-section">
                <img src="/generated-image.png" alt="DreamFlow AI Logo" className="header-logo" />
                <div className="header-info">
                  <h2>DreamFlow <span className="ai-label">AI</span></h2>
                  <p>Advanced Career Intelligence</p>
                </div>
              </div>
              <div className="status-system">
                <div className="status-indicator">
                  <div className="status-pulse"></div>
                  <span>AI Online</span>
                </div>
              </div>
            </div>
          </div>
          <div ref={messageAreaRef} className="message-area">
            <MessageList messages={messages} />
            {isThinking && (
              <div className="typing-indicator">
                <div className="typing-avatar">
                  <img src="/generated-image.png" alt="AI is typing" />
                </div>
                <div className="typing-content">
                  <div className="typing-dots"><span></span><span></span><span></span></div>
                </div>
              </div>
            )}
          </div>
          <div className="input-section">
            <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      )}
    </div>
  );
}