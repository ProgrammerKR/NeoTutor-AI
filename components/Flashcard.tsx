
import React, { useState } from 'react';
import { Flashcard as FlashcardType } from '../types';

interface FlashcardProps {
  flashcard: FlashcardType;
}

const Flashcard: React.FC<FlashcardProps> = ({ flashcard }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-full h-64 perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-700 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of card */}
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">{flashcard.term}</h3>
        </div>

        {/* Back of card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-6 bg-indigo-100 dark:bg-indigo-900 rounded-xl shadow-lg border border-indigo-200 dark:border-indigo-700">
          <p className="text-lg text-center text-gray-700 dark:text-gray-200">{flashcard.definition}</p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
