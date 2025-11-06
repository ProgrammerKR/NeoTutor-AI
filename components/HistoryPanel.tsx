import React, { useState } from 'react';
import { HistoryItem } from '../types';
import ClockIcon from './icons/ClockIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface HistoryPanelProps {
  history: HistoryItem[];
  activeId: string | null;
  onSelectItem: (id: string) => void;
  onStartNew: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, activeId, onSelectItem, onStartNew }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <aside className="w-full lg:w-1/4 lg:flex-shrink-0">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div 
          className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center lg:border-b-0 cursor-pointer lg:cursor-default"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Study History</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Revisit past sessions</p>
          </div>
          <ChevronDownIcon className={`w-6 h-6 text-gray-500 lg:hidden transform transition-transform ${isMobileOpen ? 'rotate-180' : ''}`} />
        </div>
        
        <div className={`p-4 ${isMobileOpen ? 'block' : 'hidden'} lg:block`}>
          <button 
            onClick={onStartNew}
            className="w-full mb-4 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-all duration-300"
          >
            + Start New Session
          </button>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">No sessions yet.</p>
            ) : (
              [...history].reverse().map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectItem(item.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeId === item.id 
                      ? 'bg-indigo-100 dark:bg-indigo-900/50' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">{item.sourceName}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default HistoryPanel;