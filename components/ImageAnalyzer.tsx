
import React, { useState, useCallback, useRef } from 'react';
import { analyzeImage } from '../services/geminiService';
import { ImageAnalysis } from '../types';
import OutputCard from './OutputCard';
import SkeletonLoader from './SkeletonLoader';
import { useToast } from '../hooks/useToast';
import { UploadIcon, DescriptionIcon, HashtagIcon, AccessibilityIcon, LightbulbIcon, EmotionIcon, PaletteIcon } from './icons';

const ImageAnalyzer: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const showToast = useToast();

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        showToast('Please upload a valid image file.', 'error');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAnalysis(null);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageFile || !imagePreview || isLoading) return;
    setIsLoading(true);
    setAnalysis(null);
    try {
      const base64Image = imagePreview.split(',')[1];
      const result = await analyzeImage(base64Image, imageFile.type);
      setAnalysis(result);
      showToast('Image analyzed successfully!', 'success');
    } catch (error) {
      console.error('Error analyzing image:', error);
      showToast('Failed to analyze image. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, imagePreview, isLoading, showToast]);
  
  const analysisSections = analysis ? [
      { title: 'Detailed Description', icon: <DescriptionIcon />, content: analysis.description },
      { title: 'Instagram Caption', icon: <HashtagIcon />, content: analysis.instagram_caption },
      { title: 'Relevant Hashtags', icon: <HashtagIcon />, content: analysis.hashtags.join(' ') },
      { title: 'Accessibility Alt Text', icon: <AccessibilityIcon />, content: analysis.alt_text },
      { title: 'Improvement Suggestions', icon: <LightbulbIcon />, content: analysis.suggestions },
      { title: 'Dominant Emotion', icon: <EmotionIcon />, content: analysis.emotion },
      { title: 'Color Palette', icon: <PaletteIcon />, content: analysis.colors.join(', ') },
  ] : [];

  return (
    <div className="flex flex-col items-center w-full animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-brand-primary-start to-brand-primary-end">
        Image Content Analyzer
      </h1>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-8 max-w-2xl">
        Upload an image and let AI generate detailed descriptions, engaging captions, relevant hashtags, and more.
      </p>

      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors duration-300 ${isDragging ? 'border-brand-primary-end bg-slate-100 dark:bg-slate-800' : 'border-slate-300 dark:border-slate-700'}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            accept="image/*"
          />
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="max-h-64 w-auto object-contain rounded-lg shadow-md" />
          ) : (
            <>
              <UploadIcon />
              <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-brand-primary-start">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-slate-400">PNG, JPG, WEBP, etc.</p>
            </>
          )}
        </div>
        <div className="flex flex-col justify-center items-start bg-light-surface dark:bg-dark-surface p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
           <h2 className="text-xl font-semibold mb-4">Ready to Analyze</h2>
           <p className="text-slate-500 dark:text-slate-400 mb-6">Once you've uploaded an image, click the button below to unleash the power of AI analysis.</p>
           <button
            onClick={handleAnalyze}
            disabled={!imageFile || isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-brand-primary-start to-brand-primary-end rounded-lg shadow-md hover:scale-105 transform transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              'Analyze with AI'
            )}
          </button>
        </div>
      </div>
      
      <div className="w-full mt-12">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 7 }).map((_, i) => <SkeletonLoader key={i} />)}
          </div>
        )}
        {analysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysisSections.map((section, i) => (
                    <div key={section.title} style={{ animationDelay: `${i * 100}ms` }} className="animate-fade-in">
                        <OutputCard title={section.title} icon={section.icon} content={section.content} />
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ImageAnalyzer;
