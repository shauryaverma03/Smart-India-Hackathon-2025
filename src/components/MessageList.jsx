import React from 'react';
import CareerRecommendationCard from './CareerRecommendationCard';

const TypingIndicator = () => (
  <div className="message-bubble bot">
    <div className="typing-indicator">
      <span></span><span></span><span></span>
    </div>
  </div>
);

function MessageList({ messages, isLoading }) {
  return (
    <div className="message-list">
      {messages.map((msg) => {
        // If the message type is structured, render the special card
        if (msg.type === 'structured') {
          return <CareerRecommendationCard key={msg.id} data={msg.data} />;
        }
        // Otherwise, render a normal text bubble
        return (
          <div key={msg.id} className={`message-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        );
      })}
      {isLoading && <TypingIndicator />}
    </div>
  );
}

export default MessageList;