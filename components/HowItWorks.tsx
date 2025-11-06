import React from 'react';
import Step1Icon from './icons/Step1Icon';
import Step2Icon from './icons/Step2Icon';
import Step3Icon from './icons/Step3Icon';

const HowItWorks: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">How It Works</h2>
        <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl">
          Transform your study materials in three simple steps.
        </p>
      </div>

      <div className="mt-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="pt-6">
            <div className="flow-root bg-gray-100 dark:bg-gray-800 rounded-lg px-6 pb-8 h-full">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <Step1Icon className="h-6 w-6 text-white" />
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">1. Input Your Material</h3>
                <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                  Start by uploading a PDF, pasting a YouTube video URL, or providing a direct link to a document. NeoTutor AI accepts various formats to fit your study needs.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-gray-100 dark:bg-gray-800 rounded-lg px-6 pb-8 h-full">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <Step2Icon className="h-6 w-6 text-white" />
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">2. Let AI Work Its Magic</h3>
                <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                  Our advanced AI, powered by Google's Gemini model, analyzes the text to identify key information and generate a comprehensive set of study materials.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-gray-100 dark:bg-gray-800 rounded-lg px-6 pb-8 h-full">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <Step3Icon className="h-6 w-6 text-white" />
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">3. Accelerate Your Learning</h3>
                <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                  Instantly access a custom dashboard with summaries, flashcards, and quizzes. Plus, dive deeper by asking the AI follow-up questions in the interactive chat to clarify doubts and solidify your understanding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
