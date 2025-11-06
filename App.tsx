import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import HowItWorks from './components/HowItWorks';
import About from './components/About';
import Dashboard from './components/Dashboard';
import HistoryPanel from './components/HistoryPanel';
import SharePage from './components/SharePage';
import MenuIcon from './components/icons/MenuIcon';
import XIcon from './components/icons/XIcon';
import SunIcon from './components/icons/SunIcon';
import MoonIcon from './components/icons/MoonIcon';
import FeedbackIcon from './components/icons/FeedbackIcon';
import FeedbackModal from './components/FeedbackModal';
import Watermark from './components/Watermark';
import BotIcon from './components/icons/BotIcon';
import Chatbot from './components/Chatbot';
import { EducationalContent, HistoryItem } from './types';

type View = 'home' | 'how' | 'about' | 'share';
type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
};

const getInitialView = (): View => {
  const hash = window.location.hash;
  if (hash.startsWith('#share/')) return 'share';
  const view = hash.slice(1);
  if (view === 'how' || view === 'about') return view;
  return 'home';
};

function App() {
  const [activeView, setActiveView] = useState<View>(getInitialView());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme());
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Theme effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Load history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('studyHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
        if (parsedHistory.length > 0) {
           setActiveHistoryId(parsedHistory[parsedHistory.length - 1].id);
        }
      }
    } catch (e) { console.error("Failed to load history", e); }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('studyHistory', JSON.stringify(history));
    } catch (e) { console.error("Failed to save history", e); }
  }, [history]);
  
  // URL hash change listener
  useEffect(() => {
    const handleHashChange = () => setActiveView(getInitialView());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleProcessingStart = () => setError(null);
  const handleProcessingError = (errorMessage: string) => {
    setError(errorMessage);
    setActiveHistoryId(null);
  };
  const handleProcessingComplete = (sourceName: string, originalText: string, content: EducationalContent) => {
    const newItem: HistoryItem = {
      id: new Date().toISOString(),
      sourceName,
      originalText,
      content,
      createdAt: new Date().toISOString(),
    };
    setHistory(prev => [...prev, newItem]);
    setActiveHistoryId(newItem.id);
    setError(null);
  };
  const handleSelectHistoryItem = (id: string) => {
    setActiveHistoryId(id);
    setError(null);
  };
  const handleStartNewSession = () => {
    setActiveHistoryId(null);
    setError(null);
  };

  if (activeView === 'share') {
    return <SharePage />;
  }
  
  const renderStudyZone = () => {
    const activeItem = history.find(item => item.id === activeHistoryId);
    if (error) {
       return (
          <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-xl font-bold">An Error Occurred</h3>
            <p className="mt-2">{error}</p>
            <button onClick={handleStartNewSession} className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700">Try Again</button>
          </div>
       );
    }
    if (activeItem) {
      return (
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          <HistoryPanel history={history} activeId={activeHistoryId} onSelectItem={handleSelectHistoryItem} onStartNew={handleStartNewSession} />
          <main className="flex-1 min-w-0">
             <Dashboard historyItem={activeItem} />
          </main>
        </div>
      );
    }
    return <Home onProcessingStart={handleProcessingStart} onProcessingComplete={handleProcessingComplete} onProcessingError={handleProcessingError} />;
  };
  
  const renderActiveView = () => {
    switch (activeView) {
      case 'how': return <HowItWorks />;
      case 'about': return <About />;
      case 'home':
      default: return renderStudyZone();
    }
  };
  
  const NavLink: React.FC<{ view: View; children: React.ReactNode; isMobile?: boolean }> = ({ view, children, isMobile = false }) => {
    const isActive = activeView === view;
    const handleClick = () => isMobile && setIsMobileMenuOpen(false);
    const baseClasses = "font-semibold leading-6 transition-colors";
    const activeClasses = "text-indigo-600 dark:text-indigo-400";
    const inactiveClasses = "text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400";
    const mobileClasses = "block rounded-lg py-2 px-3 text-base text-left";
    const desktopClasses = "text-sm";
    const href = view === 'home' ? '#' : `#${view}`;

    return <a href={href} onClick={handleClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${isMobile ? mobileClasses : desktopClasses}`}>{children}</a>;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans flex flex-col">
      {isFeedbackModalOpen && <FeedbackModal onClose={() => setIsFeedbackModalOpen(false)} />}
      <Watermark />
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5"><h1 className="text-2xl font-extrabold tracking-tight"><span className="text-indigo-600">Neo</span><span className="text-gray-800 dark:text-white">Tutor</span><span className="text-gray-400 dark:text-gray-500">AI</span></h1></a>
          </div>
          <div className="flex lg:hidden"><button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300" onClick={() => setIsMobileMenuOpen(true)}><span className="sr-only">Open main menu</span><MenuIcon className="h-6 w-6" aria-hidden="true" /></button></div>
          <div className="hidden lg:flex lg:gap-x-12"><NavLink view="home">Study Zone</NavLink><NavLink view="how">How It Works</NavLink><NavLink view="about">About</NavLink></div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button onClick={handleThemeToggle} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Toggle theme">
              {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {isMobileMenuOpen && (
            <div className="lg:hidden" role="dialog" aria-modal="true">
                <div className="fixed inset-0 z-50" />
                <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:sm:ring-gray-700">
                    <div className="flex items-center justify-between">
                         <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="-m-1.5 p-1.5"><h1 className="text-2xl font-extrabold tracking-tight"><span className="text-indigo-600">Neo</span><span className="text-gray-800 dark:text-white">Tutor</span><span className="text-gray-400 dark:text-gray-500">AI</span></h1></a>
                        <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}><span className="sr-only">Close menu</span><XIcon className="h-6 w-6" aria-hidden="true" /></button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-700">
                            <div className="space-y-2 py-6"><NavLink view="home" isMobile={true}>Study Zone</NavLink><NavLink view="how" isMobile={true}>How It Works</NavLink><NavLink view="about" isMobile={true}>About</NavLink></div>
                             <div className="py-6">
                                <button onClick={handleThemeToggle} className="w-full flex items-center justify-start gap-3 rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
                                    {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                                    <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </header>
      
      <main className="flex-grow">
        {activeView === 'home' && (<div className="text-center py-10 px-4 sm:px-6 lg:px-8"><h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Your Personal AI Study Assistant</h2><p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">Transform any document, link, or video into summaries, flashcards, and quizzes to supercharge your learning.</p></div>)}
        <div className="py-10 px-4 sm:px-6 lg:px-8"><div className="max-w-7xl mx-auto flex items-start justify-center">{renderActiveView()}</div></div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
             <button onClick={() => setIsFeedbackModalOpen(true)} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 flex items-center gap-2">
                <FeedbackIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Feedback</span>
             </button>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">&copy; {new Date().getFullYear()} NeoTutor AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {!isChatbotOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-transform transform hover:scale-110"
            aria-label="Open AI Chatbot"
          >
            <BotIcon className="w-6 h-6" />
          </button>
        </div>
      )}

      {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
    </div>
  );
}

export default App;
