import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { streamBotResponse } from '../services/counselorService';
import MessageList from '../components/MessageList.jsx';
import MessageInput from '../components/MessageInput.jsx';
import './DreamFlowPage.css';

function DreamFlowPage() {
  const [messages, setMessages] = React.useState([
    { id: 'initial-bot-message', sender: 'bot', text: 'Welcome to DreamFlow! Share your skills and interests, and let\'s find your dream job together.' }
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [sessionId, setSessionId] = React.useState('');

  React.useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  const handleSendMessage = (userInput) => {
    const userMessage = { id: uuidv4(), sender: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);

    const botMessagePlaceholder = { id: uuidv4(), sender: 'bot', text: '' };
    setMessages(prev => [...prev, botMessagePlaceholder]);
    
    let accumulatedChunk = '';
    let isJsonHandled = false;

    const onChunkReceived = (chunk) => {
      accumulatedChunk += chunk;
      // --- THIS IS THE SMART LOGIC ---
      // First, try to parse the entire accumulated response as JSON
      try {
        const jsonData = JSON.parse(accumulatedChunk);
        // If it's valid JSON, this is a structured career recommendation
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessagePlaceholder.id
              ? { ...msg, type: 'structured', data: jsonData }
              : msg
          )
        );
        isJsonHandled = true; // Stop processing as plain text
      } catch (e) {
        // If it's not valid JSON yet, it's a streaming text chunk.
        // We only update the text if we haven't already handled a JSON object.
        if (!isJsonHandled) {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === botMessagePlaceholder.id ? { ...msg, text: accumulatedChunk } : msg
            )
          );
        }
      }
    };

    const onStreamEnd = () => setIsLoading(false);

    const onError = () => {
      setIsLoading(false);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMessagePlaceholder.id ? { ...msg, text: "Sorry, something went wrong. Please try again." } : msg
        )
      );
    };

    streamBotResponse(userInput, sessionId, onChunkReceived, onError, onStreamEnd);
  };

  return (
    <div className="dreamflow-page-container">
      <div className="dreamflow-header">
        <h1>DreamFlow 🔮</h1>
        <p>Your AI-powered career co-pilot</p>
      </div>
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}

export default DreamFlowPage;