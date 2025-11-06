import React, { useState } from 'react';
import { EducationalContent, DashboardView, HistoryItem, SharePayload } from '../types';
import BookOpenIcon from './icons/BookOpenIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import CardsIcon from './icons/CardsIcon';
import QuizIcon from './icons/QuizIcon';
import DownloadIcon from './icons/DownloadIcon';
import ShareIcon from './icons/ShareIcon';
import Flashcard from './Flashcard';
import Quiz from './Quiz';
import ShareModal from './ShareModal';

interface DashboardProps {
  historyItem: HistoryItem;
}

const TABS: { id: DashboardView; name: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'summary', name: 'Summary', icon: BookOpenIcon },
  { id: 'concepts', name: 'Key Concepts', icon: LightbulbIcon },
  { id: 'flashcards', name: 'Flashcards', icon: CardsIcon },
  { id: 'quiz', name: 'Quiz', icon: QuizIcon },
];

const Dashboard: React.FC<DashboardProps> = ({ historyItem }) => {
  const { content, sourceName } = historyItem;
  const [activeView, setActiveView] = useState<DashboardView>('summary');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [sharePayload, setSharePayload] = useState<SharePayload | null>(null);

  React.useEffect(() => {
    setActiveView('summary');
    setFlashcardIndex(0);
  }, [content]);

  const handleNextFlashcard = () => {
    setFlashcardIndex((prev) => (prev + 1) % content.flashcards.length);
  };

  const handlePrevFlashcard = () => {
    setFlashcardIndex((prev) => (prev - 1 + content.flashcards.length) % content.flashcards.length);
  };

  const handleShare = (view: DashboardView, data: any) => {
    setSharePayload({ sourceName, view, data });
  };

  const handleExport = () => {
    const { summary, keyConcepts, flashcards, quiz } = content;
    let markdownContent = `# Study Guide for ${sourceName}\n\n`;
    markdownContent += `## Summary\n\n${summary}\n\n`;
    markdownContent += `## Key Concepts\n\n`;
    keyConcepts.forEach(concept => {
      markdownContent += `### ${concept.concept}\n${concept.explanation}\n\n`;
    });
    markdownContent += `## Flashcards\n\n---\n\n`;
    flashcards.forEach((card, index) => {
      markdownContent += `**Term ${index + 1}:** ${card.term}\n\n**Definition ${index + 1}:** ${card.definition}\n\n---\n\n`;
    });
    markdownContent += `## Quiz\n\n`;
    quiz.forEach((item, index) => {
      markdownContent += `**Question ${index + 1}:** ${item.question}\n`;
      if (item.type === 'MCQ' && item.options) {
        item.options.forEach(option => markdownContent += `  - ${option}\n`);
      } else if (item.type === 'T/F') {
        markdownContent += `  - True\n  - False\n`;
      }
      markdownContent += `\n**Answer:** ${item.answer}\n\n`;
    });

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sourceName.replace(/\.[^/.]+$/, '')}_study_guide.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const renderContent = () => {
    const sharedPanelClasses = "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md relative";
    const ShareButton = ({ onClick }: { onClick: () => void }) => (
      <button onClick={onClick} title="Share this section" className="absolute top-4 right-4 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
        <ShareIcon className="w-5 h-5" />
      </button>
    );

    switch (activeView) {
      case 'summary':
        return (
          <div className={sharedPanelClasses}>
            <ShareButton onClick={() => handleShare('summary', content.summary)} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Summary</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{content.summary}</p>
          </div>
        );
      case 'concepts':
        return (
          <div className={sharedPanelClasses}>
            <ShareButton onClick={() => handleShare('concepts', content.keyConcepts)} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Key Concepts</h2>
            <ul className="space-y-4">
              {content.keyConcepts.map((concept, index) => (
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
          <div className="relative">
             <ShareButton onClick={() => handleShare('flashcards', content.flashcards)} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Flashcards</h2>
            <Flashcard flashcard={content.flashcards[flashcardIndex]} />
            <div className="flex justify-between items-center mt-6">
              <button onClick={handlePrevFlashcard} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold">&larr; Previous</button>
              <span className="text-gray-600 dark:text-gray-300">{flashcardIndex + 1} / {content.flashcards.length}</span>
              <button onClick={handleNextFlashcard} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold">Next &rarr;</button>
            </div>
          </div>
        );
      case 'quiz':
        return (
          <div className="relative">
            <ShareButton onClick={() => handleShare('quiz', content.quiz)} />
            <Quiz quizItems={content.quiz} />
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="w-full">
      {sharePayload && <ShareModal payload={sharePayload} onClose={() => setSharePayload(null)} />}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate" title={sourceName}>{sourceName}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Study Tools</p>
        <nav className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex-grow flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === tab.id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <DownloadIcon className="w-5 h-5" />
            <span>Export Materials</span>
          </button>
        </div>
      </div>
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
