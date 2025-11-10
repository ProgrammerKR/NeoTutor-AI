
import React, { useState, useMemo } from 'react';
import { QuizItem } from '../types';

interface QuizViewProps {
  quizItems: QuizItem[];
}

const QuizView: React.FC<QuizViewProps> = ({ quizItems }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizItems[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizItems.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const score = useMemo(() => {
    return quizItems.reduce((acc, item, index) => {
      return userAnswers[index] === item.answer ? acc + 1 : acc;
    }, 0);
  }, [quizItems, userAnswers]);

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Quiz Completed!</h2>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
          Your Score: <span className="font-extrabold text-indigo-600">{score}</span> / {quizItems.length}
        </p>
        <div className="mt-8 space-y-4 text-left">
          {quizItems.map((item, index) => (
            <div key={index} className="p-4 rounded-md border">
              <p className="font-semibold">{index + 1}. {item.question}</p>
              <p className={`mt-2 ${userAnswers[index] === item.answer ? 'text-green-600' : 'text-red-600'}`}>
                Your answer: {userAnswers[index] || 'Not answered'}
              </p>
              {userAnswers[index] !== item.answer && (
                <p className="text-green-700">Correct answer: {item.answer}</p>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={restartQuiz}
          className="mt-8 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Question {currentQuestionIndex + 1} of {quizItems.length}</h3>
      </div>
      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{currentQuestion.question}</h4>
      
      <div className="space-y-4">
        {(currentQuestion.options && currentQuestion.options.length > 0 ? currentQuestion.options : ['True', 'False']).map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = currentQuestion.answer === option;
          const showFeedback = selectedAnswer !== undefined;
          
          let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-colors duration-200 ";
          if (showFeedback) {
            if (isSelected && isCorrect) buttonClass += "bg-green-100 border-green-500 text-green-800";
            else if (isSelected && !isCorrect) buttonClass += "bg-red-100 border-red-500 text-red-800";
            else if (isCorrect) buttonClass += "bg-green-100 border-green-500 text-green-800";
            else buttonClass += "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200";
          } else {
             buttonClass += isSelected ? "bg-indigo-100 border-indigo-500" : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600";
          }
          
          return (
            <button
              key={option}
              onClick={() => handleAnswerSelect(option)}
              disabled={selectedAnswer !== undefined}
              className={buttonClass}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selectedAnswer && (
        <div className="mt-6 text-right">
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
          >
            {currentQuestionIndex < quizItems.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizView;
