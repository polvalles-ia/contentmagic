
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { chatWithAI } from '../services/geminiService';
import { ChatMessage } from '../types';
import { SendIcon, CloseIcon, UserIcon, BotIcon } from './icons';

interface ChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = useCallback(async (prompt?: string) => {
    const messageText = prompt || input;
    if (messageText.trim() === '' || isLoading) return;
    
    const userMessage: ChatMessage = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMessage];
      const response = await chatWithAI(messageText, history);
      const botMessage: ChatMessage = { role: 'model', text: response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  const suggestedPrompts = [
    "Dame 5 ideas de posts sobre marketing digital",
    "Mejora este texto: 'Nuestro nuevo producto es muy bueno.'",
    "¿Qué hashtags uso para el nicho de comida saludable?",
    "Analiza el tono de este contenido: '¡No te pierdas nuestra increíble oferta!'"
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-light-surface dark:bg-dark-surface shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold">AI Assistant</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <CloseIcon />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center"><BotIcon /></div>}
              <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-gradient-to-r from-brand-primary-start to-brand-primary-end text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-800 rounded-bl-none'}`}>
                 <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
               {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center"><UserIcon /></div>}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center"><BotIcon /></div>
              <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-none">
                 <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                 </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {messages.length === 0 && (
          <div className="p-4 space-y-2">
            <p className="text-sm text-center text-slate-500 dark:text-slate-400">Try a suggestion:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedPrompts.map(prompt => (
                <button key={prompt} onClick={() => handleSend(prompt)} className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                  {prompt.substring(0, 30)}...
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask for help..."
              className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary-end focus:border-transparent transition"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={input.trim() === '' || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-md bg-gradient-to-r from-brand-primary-start to-brand-primary-end text-white disabled:opacity-50"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ChatAssistant;
