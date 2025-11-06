import React from 'react';

const Watermark: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="text-xs text-gray-400 dark:text-gray-500 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-2 py-1 rounded-md">
        Created by ProgrammerKR
      </div>
    </div>
  );
};

export default Watermark;