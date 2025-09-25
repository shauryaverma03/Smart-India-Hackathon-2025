// The public URL for your hosted backend, now pointing to the correct route.
const API_URL = 'https://quiz-backend-production-51ee.up.railway.app/api/quiz';
const REQUEST_TIMEOUT = 15000; // 15 seconds

/**
 * Creates a structured error response object for the UI.
 * @param {string} message - The error message for the user.
 * @param {Error|null} originalError - The original error object for logging.
 * @returns {{error: string}}
 */
const createErrorResponse = (message, originalError = null) => {
  if (originalError) {
    console.error(`[API Error]: ${message}`, originalError);
  }
  return { error: message };
};

/**
 * Handles all communication with your live AI backend for the career quiz.
 * @param {object} answers - The current set of answers from the quiz.
 * @returns {Promise<object>} - A promise that resolves to the next question object,
 * a completion object, or a structured error object.
 */
export const getNextAiQuestion = async (answers) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status >= 500) {
        return createErrorResponse('The AI server is currently unavailable. Please try again later.');
      } else {
        return createErrorResponse(`An unexpected error occurred (Status: ${response.status}).`);
      }
    }

    return await response.json();

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      return createErrorResponse('The server is taking too long to respond. Please check your connection and try again.');
    }
    return createErrorResponse('Could not connect to the AI server. Please check your internet connection.', error);
  }
};