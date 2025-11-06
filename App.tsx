
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Header from './components/Header';
import TextGenerator from './components/TextGenerator';
import ImageAnalyzer from './components/ImageAnalyzer';
import AudioProcessor from './components/AudioProcessor';
import ChatAssistant from './components/ChatAssistant';
import { ToastProvider } from './context/ToastContext';
import { ChatIcon } from './components/icons';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('contentmagic_theme') as Theme | null;
    const initialTheme = savedTheme ? savedTheme : 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('contentmagic_theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newTheme;
    });
  }, []);

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
  }, []);

  return (
    <ToastProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col">
          <Header currentTheme={theme} toggleTheme={toggleTheme} />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<TextGenerator />} />
              <Route path="/image" element={<ImageAnalyzer />} />
              <Route path="/audio" element={<AudioProcessor />} />
            </Routes>
          </main>
          <button
            onClick={toggleChat}
            className="fixed bottom-6 right-6 z-40 bg-gradient-to-br from-brand-primary-start to-brand-primary-end text-white p-4 rounded-full shadow-lg hover:scale-110 transform transition-transform duration-200"
            aria-label="Toggle AI Assistant"
          >
            <ChatIcon />
          </button>
          <ChatAssistant isOpen={isChatOpen} onClose={toggleChat} />
          <Footer />
        </div>
      </HashRouter>
    </ToastProvider>
  );
};

const Footer: React.FC = () => (
  <footer className="w-full text-center p-4 text-xs text-slate-500 dark:text-slate-400">
    Powered by Gemini AI. &copy; {new Date().getFullYear()} ContentMagic AI.
  </footer>
);


export default App;
