
import React, { useState, useRef, useCallback } from 'react';
import { processAudio } from '../services/geminiService';
import { AudioAnalysis } from '../types';
import OutputCard from './OutputCard';
import SkeletonLoader from './SkeletonLoader';
import { useToast } from '../hooks/useToast';
import { RecordIcon, StopIcon, UploadIcon, MicIcon, SummaryIcon, KeypointsIcon, TitleIcon } from './icons';

type RecordingState = 'idle' | 'recording' | 'stopped';

const AudioProcessor: React.FC = () => {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<AudioAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const showToast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            if (!file.type.startsWith('audio/')) {
                showToast('Please upload a valid audio file.', 'error');
                return;
            }
            setAudioFile(file);
            setAnalysis(null);
            showToast(`File "${file.name}" selected.`, 'info');
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioFile = new File([audioBlob], "recording.webm", { type: "audio/webm" });
                setAudioFile(audioFile);
                stream.getTracks().forEach(track => track.stop());
                showToast('Recording finished.', 'success');
            };

            mediaRecorderRef.current.start();
            setRecordingState('recording');
            setAudioFile(null);
            setAnalysis(null);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            showToast('Could not access microphone. Please check permissions.', 'error');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recordingState === 'recording') {
            mediaRecorderRef.current.stop();
            setRecordingState('idle');
        }
    };
    
    const handleProcess = useCallback(async () => {
        if (!audioFile || isLoading) return;
        setIsLoading(true);
        setAnalysis(null);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(audioFile);
            reader.onloadend = async () => {
                const base64Audio = (reader.result as string).split(',')[1];
                try {
                    const result = await processAudio(base64Audio, audioFile.type);
                    setAnalysis(result);
                    showToast('Audio processed successfully!', 'success');
                } catch(e) {
                    console.error('Error processing audio:', e);
                    showToast('Failed to process audio. Please try again.', 'error');
                } finally {
                    setIsLoading(false);
                }
            };
        } catch (error) {
            console.error('Error reading audio file:', error);
            showToast('Could not read audio file.', 'error');
            setIsLoading(false);
        }
    }, [audioFile, isLoading, showToast]);
    
    const analysisSections = analysis ? [
      { title: 'Transcription', icon: <MicIcon />, content: analysis.transcription },
      { title: 'Summary', icon: <SummaryIcon />, content: analysis.summary },
      { title: 'Key Points', icon: <KeypointsIcon />, content: analysis.key_points.map(p => `- ${p}`).join('\n') },
      { title: 'Title Suggestion', icon: <TitleIcon />, content: analysis.title_suggestion },
    ] : [];

    return (
        <div className="flex flex-col items-center w-full animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-brand-primary-start to-brand-primary-end">
                Audio Content Processor
            </h1>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-8 max-w-2xl">
                Record your voice or upload an audio file. AI will transcribe it, summarize it, and pull out key insights for you.
            </p>

            <div className="w-full max-w-3xl bg-light-surface dark:bg-dark-surface p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recordingState !== 'recording' ? (
                        <button onClick={startRecording} className="flex items-center justify-center gap-2 p-4 font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                            <RecordIcon /> Record Audio
                        </button>
                    ) : (
                        <button onClick={stopRecording} className="flex items-center justify-center gap-2 p-4 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition">
                            <StopIcon /> Stop Recording
                        </button>
                    )}

                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 p-4 font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                        <UploadIcon /> Upload Audio File
                    </button>
                    <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files)} className="hidden" accept="audio/*" />
                </div>
                {audioFile && <p className="text-center mt-4 text-sm text-green-500">Selected: {audioFile.name}</p>}

                <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
                    <button
                        onClick={handleProcess}
                        disabled={!audioFile || isLoading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-brand-primary-start to-brand-primary-end rounded-lg shadow-md hover:scale-105 transform transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                                Processing...
                            </>
                        ) : 'Process Audio with AI'}
                    </button>
                </div>
            </div>

            <div className="w-full mt-12">
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => <SkeletonLoader key={i} />)}
                    </div>
                )}
                {analysis && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

export default AudioProcessor;
