import React, { useState } from 'react';
import InputSource from './FileUpload';
import LoadingSpinner from './LoadingSpinner';
import { parsePdfText, parsePdfFromUrl } from '../services/pdfParser';
import { fetchTranscript } from '../services/youtubeService';
import { generateEducationalContent } from '../services/geminiService';
import { EducationalContent } from '../types';

interface HomeProps {
  onProcessingStart: () => void;
  onProcessingComplete: (sourceName: string, originalText: string, content: EducationalContent) => void;
  onProcessingError: (error: string) => void;
}


const Home: React.FC<HomeProps> = ({ onProcessingStart, onProcessingComplete, onProcessingError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const processContent = async (sourceName: string, textPromise: Promise<string>) => {
    setIsProcessing(true);
    onProcessingStart();
    
    try {
        const text = await textPromise;
        setLoadingMessage('Generating insights with AI...');
        const generatedContent = await generateEducationalContent(text);
        onProcessingComplete(sourceName, text, generatedContent);
    } catch (err: any) {
        onProcessingError(err.message || 'An unknown error occurred.');
    } finally {
        setIsProcessing(false);
        setLoadingMessage('');
    }
  };

  const handleFileUpload = (uploadedFile: File) => {
    setLoadingMessage('Parsing your document...');
    processContent(uploadedFile.name, parsePdfText(uploadedFile));
  };
  
  const handleUrlSubmit = (url: string) => {
    setLoadingMessage('Downloading and parsing document...');
    const name = url.split('/').pop()?.split('?')[0] || url;
    processContent(name, parsePdfFromUrl(url));
  };

  const handleYoutubeSubmit = (url: string) => {
    setLoadingMessage('Fetching YouTube transcript...');
    processContent(url, fetchTranscript(url));
  };

  if (isProcessing) {
    return <LoadingSpinner message={loadingMessage} />;
  }
  
  return <InputSource onFileUpload={handleFileUpload} onUrlSubmit={handleUrlSubmit} onYoutubeSubmit={handleYoutubeSubmit} isProcessing={isProcessing} />;
};

export default Home;