// This is the permanent URL for your live bot on the server.
const API_URL = 'https://sachin21112004-dreamflow-ai.hf.space/counsel';

/**
 * Connects to the bot's streaming API and calls a function for each chunk of data received.
 * @param {string} userInput - The message from the user.
 * @param {string} sessionId - The unique ID for the current chat session.
 * @param {(chunk: string) => void} onChunkReceived - A function to call with each piece of the response text.
 * @param {(error: Error) => void} onError - A function to call if an error occurs.
 * @param {() => void} onStreamEnd - An optional function to call when the entire stream is finished.
 */
export async function streamBotResponse(userInput, sessionId, onChunkReceived, onError, onStreamEnd) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userInput, session_id: sessionId }),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        if (onStreamEnd) onStreamEnd();
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      onChunkReceived(chunk);
    }
  } catch (error) {
    console.error('Error connecting to the bot:', error);
    onError(error);
    if (onStreamEnd) onStreamEnd();
  }
}