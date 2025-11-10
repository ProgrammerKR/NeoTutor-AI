
import React, { useState } from 'react';
import { EducationalContent, DashboardView, HistoryItem, SharePayload } from '../types';
import BookOpenIcon from './icons/BookOpenIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import CardsIcon from './icons/CardsIcon';
import QuizIcon from './icons/QuizIcon';
import DownloadIcon from './icons/DownloadIcon';
import ShareIcon from './icons/ShareIcon';
import ChatBubbleIcon from './icons/ChatBubbleIcon';
import Flashcard from './Flashcard';
import QuizView from './QuizView';
import ShareModal from './ShareModal';
import Chat from './Chat';

interface DashboardProps {
  historyItem: HistoryItem;
}

const TABS: { id: DashboardView; name: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'summary', name: 'Summary', icon: BookOpenIcon },
  { id: 'concepts', name: 'Key Concepts', icon: LightbulbIcon },
  { id: 'flashcards', name: 'Flashcards', icon: CardsIcon },
  { id: 'quiz', name: 'Quiz', icon: QuizIcon },
  { id: 'chat', name: 'Ask AI', icon: ChatBubbleIcon },
];

const Dashboard: React.FC<DashboardProps> = ({ historyItem }) => {
  const { content, sourceName, originalText } = historyItem;
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
  
  const downloadMarkdown = (markdownContent: string, view: DashboardView | 'all') => {
    const fileNameSuffix = view === 'all' ? 'study_guide' : view;
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sourceName.replace(/\.[^/.]+$/, '')}_${fileNameSuffix}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportSummary = () => {
    const markdownContent = `# Summary for ${sourceName}\n\n${content.summary}`;
    downloadMarkdown(markdownContent, 'summary');
  };

  const handleExportConcepts = () => {
    let markdownContent = `# Key Concepts for ${sourceName}\n\n`;
    content.keyConcepts.forEach(concept => {
      markdownContent += `### ${concept.concept}\n${concept.explanation}\n\n`;
    });
    downloadMarkdown(markdownContent, 'concepts');
  };
  
  const handleExportFlashcards = () => {
    let markdownContent = `# Flashcards for ${sourceName}\n\n---\n\n`;
    content.flashcards.forEach((card, index) => {
      markdownContent += `**Term ${index + 1}:** ${card.term}\n\n**Definition ${index + 1}:** ${card.definition}\n\n---\n\n`;
    });
    downloadMarkdown(markdownContent, 'flashcards');
  };

  const handleExportQuiz = () => {
    let markdownContent = `# Quiz for ${sourceName}\n\n`;
    content.quiz.forEach((item, index) => {
      markdownContent += `**Question ${index + 1}:** ${item.question}\n`;
      if (item.type === 'MCQ' && item.options) {
        item.options.forEach(option => markdownContent += `  - ${option}\n`);
      } else if (item.type === 'T/F') {
        markdownContent += `  - True\n  - False\n`;
      }
      markdownContent += `\n**Answer:** ${item.answer}\n\n`;
    });
    downloadMarkdown(markdownContent, 'quiz');
  };

  const handleExportAll = () => {
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
    downloadMarkdown(markdownContent, 'all');
  };
  
  const renderContent = () => {
    const sharedPanelClasses = "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md relative";
    
    const ActionButtons = ({ onShare, onDownload }: { onShare: () => void, onDownload: () => void }) => (
      <div className="absolute top-4 right-4 flex gap-2">
        <button onClick={onDownload} title="Export this section" className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <DownloadIcon className="w-5 h-5" />
        </button>
        <button onClick={onShare} title="Share this section" className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <ShareIcon className="w-5 h-5" />
        </button>
      </div>
    );

    switch (activeView) {
      case 'summary':
        return (
          <div className={sharedPanelClasses}>
            <ActionButtons onShare={() => handleShare('summary', content.summary)} onDownload={handleExportSummary} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Summary</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{content.summary}</p>
          </div>
        );
      case 'concepts':
        return (
          <div className={sharedPanelClasses}>
            <ActionButtons onShare={() => handleShare('concepts', content.keyConcepts)} onDownload={handleExportConcepts} />
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
            <div className="absolute top-0 right-0 z-10 flex gap-2 p-2">
              <button onClick={handleExportFlashcards} title="Export Flashcards" className="p-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <DownloadIcon className="w-5 h-5" />
              </button>
              <button onClick={() => handleShare('flashcards', content.flashcards)} title="Share Flashcards" className="p-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <ShareIcon className="w-5 h-5" />
              </button>
            </div>
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
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              <button onClick={handleExportQuiz} title="Export Quiz" className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <DownloadIcon className="w-5 h-5" />
              </button>
              <button onClick={() => handleShare('quiz', content.quiz)} title="Share Quiz" className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <ShareIcon className="w-5 h-5" />
              </button>
            </div>
            <QuizView quizItems={content.quiz} />
          </div>
        );
      case 'chat':
        if (!originalText) {
          return (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
              <ChatBubbleIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">"Ask AI" is available for new study guides.</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                This feature needs the original document's text, which wasn't saved for older items in your history.
              </p>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Please process a new document to start a conversation with the AI.
              </p>
            </div>
          );
        }
        return <Chat documentText={originalText} />;
      default: return null;
    }
  };

  return (
    <div className="w-full">
      {sharePayload && <ShareModal payload={sharePayload} onClose={() => setSharePayload(null)} />}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate" title={sourceName}>{sourceName}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Study Tools</p>
        <div className="overflow-x-auto pb-2 -mx-2 px-2">
             <nav className="flex flex-nowrap gap-2">
              {TABS.map((tab) => {
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id)}
                    className={`flex-shrink-0 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeView === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleExportAll}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <DownloadIcon className="w-5 h-5" />
            <span>Export All Materials</span>
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
