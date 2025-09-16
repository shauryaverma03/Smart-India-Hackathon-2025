// src/components/ChatMessage.jsx

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Import the plugin for tables, etc.
import './ChatMessage.css';

// A simple avatar component for visual flair
function Avatar({ sender }) {
  const avatarClass = sender === 'user' ? 'user-avatar' : 'bot-avatar';
  const avatarIcon = sender === 'user' ? '👤' : '🤖';

  return (
    <div className={`avatar ${avatarClass}`}>
      {avatarIcon}
    </div>
  );
}

function ChatMessage({ sender, text }) {
  const messageClass = sender === 'user' ? 'user' : 'bot';

  return (
    <div className={`message-item ${messageClass}`}>
      <Avatar sender={sender} />
      <div className="message-content">
        {sender === 'bot' ? (
          // Use ReactMarkdown with the GFM plugin for enhanced formatting
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {text}
          </ReactMarkdown>
        ) : (
          // Render user messages as plain text inside a <p> tag
          <p>{text}</p>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;