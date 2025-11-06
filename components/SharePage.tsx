import React, { useState, useEffect } from 'react';
import { SharePayload, KeyConcept, Flashcard as FlashcardType, QuizItem } from '../types';
import Flashcard from './Flashcard';
import Watermark from './Watermark';

const SharePage: React.FC = () => {
  const [payload, setPayload] = useState<SharePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (!hash.startsWith('#share/')) {
        throw new Error('Invalid share link.');
      }
      const encodedData = hash.substring('#share/'.length);
      const decodedData = atob(encodedData);
      const parsedPayload = JSON.parse(decodedData) as SharePayload;
      setPayload(parsedPayload);
    } catch (e) {
      console.error('Failed to parse share data:', e);
      setError('The share link is invalid or corrupted. Please check the URL and try again.');
    }
  }, []);

  const renderSharedContent = () => {
    if (!payload) return null;

    switch (payload.view) {
      case 'summary':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Summary</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{payload.data as string}</p>
          </div>
        );
      case 'concepts':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Key Concepts</h2>
            <ul className="space-y-4">
              {(payload.data as KeyConcept[]).map((concept, index) => (
                <li key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                  <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{concept.concept}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{concept.explanation}</p>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'flashcards':
        return (
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Flashcards</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(payload.data as FlashcardType[]).map((card, index) => (
                <Flashcard key={index} flashcard={card} />
              ))}
            </div>
          </div>
        );
      case 'quiz':
        // Display quiz questions and answers in a read-only format
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quiz</h2>
            <div className="space-y-6">
              {(payload.data as QuizItem[]).map((item, index) => (
                <div key={index} className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{index + 1}. {item.question}</p>
                  {item.options && item.options.length > 0 && (
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {item.options.map(option => (
                        <li key={option} className={`text-gray-600 dark:text-gray-400 ${option === item.answer ? 'font-bold text-green-600 dark:text-green-400' : ''}`}>
                          {option} {option === item.answer ? '(Correct Answer)' : ''}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.type === 'T/F' && (
                     <p className="mt-2 font-bold text-green-600 dark:text-green-400">Correct Answer: {item.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
         <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-xl font-bold">Could Not Load Content</h3>
            <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!payload) {
    return (
       <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Watermark />
      <header className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-base font-semibold text-indigo-600">Shared from NeoTutor AI</h1>
        <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Study Guide for: <span className="text-indigo-700 dark:text-indigo-400">{payload.sourceName}</span>
        </p>
      </header>
      <main className="max-w-3xl mx-auto">
        {renderSharedContent()}
      </main>
      <footer className="max-w-3xl mx-auto mt-12 text-center">
        <a href="/" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
            Create Your Own Study Guide with NeoTutor AI
        </a>
        <p className="mt-6 text-center text-sm text-gray-400">&copy; {new Date().getFullYear()} NeoTutor AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SharePage;