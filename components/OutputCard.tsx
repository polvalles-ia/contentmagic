
import React, { useState, ReactNode } from 'react';
import { useToast } from '../hooks/useToast';
import { CopyIcon, CheckIcon } from './icons';

interface OutputCardProps {
  icon: ReactNode;
  title: string;
  content: string;
}

const OutputCard: React.FC<OutputCardProps> = ({ icon, title, content }) => {
  const [copied, setCopied] = useState(false);
  const showToast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400">{icon}</span>
          <h3 className="font-semibold">{title}</h3>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1 text-sm px-2 py-1 rounded-md transition-colors ${
            copied
              ? 'bg-brand-accent text-white'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-4 flex-grow overflow-y-auto max-h-60">
        <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};

export default OutputCard;
