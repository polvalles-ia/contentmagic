
import React, { useState, useCallback } from 'react';
import { generateTextVariations } from '../services/geminiService';
import { TextVariations } from '../types';
import OutputCard from './OutputCard';
import SkeletonLoader from './SkeletonLoader';
import { useToast } from '../hooks/useToast';
import { MagicWandIcon, TwitterIcon, LinkedInIcon, InstagramIcon, TikTokIcon, FacebookIcon, EmailIcon, BlogIcon, YouTubeIcon } from './icons';

const TextGenerator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [variations, setVariations] = useState<TextVariations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToast();

  const handleGenerate = useCallback(async () => {
    if (inputText.length < 50 || isLoading) return;
    setIsLoading(true);
    setVariations(null);
    try {
      const result = await generateTextVariations(inputText);
      setVariations(result);
      showToast('Content generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating text variations:', error);
      showToast('Failed to generate content. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading, showToast]);

  const socialPlatforms = variations ? [
    { name: 'Twitter', icon: <TwitterIcon />, content: variations.twitter },
    { name: 'LinkedIn', icon: <LinkedInIcon />, content: variations.linkedin },
    { name: 'Instagram', icon: <InstagramIcon />, content: variations.instagram },
    { name: 'TikTok Script', icon: <TikTokIcon />, content: variations.tiktok },
    { name: 'Facebook', icon: <FacebookIcon />, content: variations.facebook },
    { name: 'Email Subject', icon: <EmailIcon />, content: variations.email_subject },
    { name: 'Email Body', icon: <EmailIcon />, content: variations.email_body },
    { name: 'Blog Intro', icon: <BlogIcon />, content: variations.blog_intro },
    { name: 'YouTube', icon: <YouTubeIcon />, content: variations.youtube },
  ] : [];

  return (
    <div className="flex flex-col items-center w-full animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-brand-primary-start to-brand-primary-end">
        Text Content Generator
      </h1>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-8 max-w-2xl">
        Write or paste your core message, and our AI will magically craft optimized versions for all your social platforms.
      </p>

      <div className="w-full max-w-3xl bg-light-surface dark:bg-dark-surface p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste or write your content here... (min. 50 characters)"
          className="w-full h-40 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary-end focus:border-transparent transition"
        />
        <div className="flex items-center justify-between mt-3">
          <p className={`text-sm ${inputText.length < 50 ? 'text-red-500' : 'text-green-500'}`}>
            {inputText.length} / 50 characters
          </p>
          <button
            onClick={handleGenerate}
            disabled={inputText.length < 50 || isLoading}
            className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-brand-primary-start to-brand-primary-end rounded-lg shadow-md hover:scale-105 transform transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <MagicWandIcon />
                Generate Magic
              </>
            )}
          </button>
        </div>
      </div>

      <div className="w-full mt-12">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonLoader key={i} />)}
          </div>
        )}
        {variations && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialPlatforms.map((platform, i) => (
              <div key={platform.name + i} style={{ animationDelay: `${i * 100}ms` }} className="animate-fade-in">
                <OutputCard
                  title={platform.name}
                  icon={platform.icon}
                  content={platform.content}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextGenerator;
