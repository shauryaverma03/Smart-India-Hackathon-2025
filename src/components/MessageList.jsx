// src/components/MessageList.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import './MessageList.css';

function MessageList({ messages }) {
  return (
    <div className="message-list">
      {messages.map((msg) => (
        <div key={msg.id} className={`message-container ${msg.sender}`}>
          {msg.sender === 'bot' && (
            <div className="avatar">
              <img src="/generated-image.png" alt="DreamFlow AI" />
            </div>
          )}
          <div className="message-bubble">
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessageList;