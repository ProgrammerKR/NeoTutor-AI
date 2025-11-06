
import React from 'react';

interface LoadingSpinnerProps {
  message: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
