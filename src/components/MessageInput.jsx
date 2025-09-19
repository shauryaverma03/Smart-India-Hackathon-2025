// src/components/MessageInput.jsx
import React, { useState } from 'react';
import './MessageInput.css';
import { MdSend } from 'react-icons/md';

function MessageInput({ onSendMessage, disabled }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="message-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Ask a career question..."
        disabled={disabled}
        aria-label="Chat input"
      />
      <button type="submit" className="send-button" disabled={disabled || !inputValue.trim()}>
        <MdSend />
      </button>
    </form>
  );
}

export default MessageInput;