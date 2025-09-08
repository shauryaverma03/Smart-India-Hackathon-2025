import React, { useState } from 'react'; // 1. Import React and useState

// The component takes the onSend function as a prop from DreamFlowPage
function MessageInput({ onSend }) {
  const [input, setInput] = useState('');

  // This function handles the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-form">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a career question..."
      />
      <button type="submit" disabled={!input.trim()}>
        Send
      </button>
    </form>
  );
}

export default MessageInput; // 2. Export the component so it can be imported elsewhere