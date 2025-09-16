// src/components/MessageList.jsx

import React from 'react';
import ChatMessage from './ChatMessage.jsx';
import './MessageList.css'; 

function MessageList({ messages, isLoading }) {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <ChatMessage key={message.id} sender={message.sender} text={message.text} />
      ))}
      {isLoading && (
        <div className="message-item bot">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageList;