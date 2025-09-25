import React, { useState, useEffect } from 'react';
import { getNextAiQuestion } from '../api/quizApi'; // Make sure this path is correct
import './QuizPage.css'; // Using Quiz.css as requested

const QuizPage = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect to fetch the very first question when the component mounts
  useEffect(() => {
    const startQuiz = async () => {
      setIsLoading(true);
      setError(null);
      // We start with an empty answers object to get the first question
      const response = await getNextAiQuestion({}); 
      if (response.error) {
        setError(response.error);
      } else {
        setCurrentQuestion(response);
      }
      setIsLoading(false);
    };
    startQuiz();
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = async () => {
    if (!selectedOption) return;

    setIsLoading(true);
    setError(null);
    
    // Add the latest answer to our answers state
    const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    setAnswers(newAnswers);
    
    // Call the AI with the complete history of answers
    const response = await getNextAiQuestion(newAnswers);
    
    setSelectedOption(null); // Reset selection for the next question

    if (response.error) {
      setError(response.error);
    } else if (response.quizComplete) {
      // The AI has signaled the quiz is over
      onComplete(newAnswers, response.summary); // Pass final answers and summary to the parent
    } else {
      // We received a new question
      setCurrentQuestion(response);
    }
    
    setIsLoading(false);
  };
  
  // --- Render Logic ---
  if (isLoading) {
    return <div className="quiz-status">🌀 Thinking...</div>;
  }

  if (error) {
    return <div className="quiz-status error">⚠️ Error: {error}</div>;
  }
  
  if (!currentQuestion) {
    return <div className="quiz-status">Could not load the quiz.</div>;
  }

  return (
    <div className="quiz-container">
      {/* This is where we take the 'text' from JSON and display it */}
      <h2>{currentQuestion.text}</h2>
      
      <div className="options-container">
        {/* Here we map over the 'options' array from JSON */}
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            className={`option-btn ${selectedOption === option ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
      
      <button 
        onClick={handleNext} 
        disabled={!selectedOption || isLoading}
        className="next-btn"
      >
        Next
      </button>
    </div>
  );
};

export default QuizPage;