import React, { useState, useCallback } from 'react';
import UploadIcon from './icons/UploadIcon';
import YouTubeIcon from './icons/YouTubeIcon';
import LinkIcon from './icons/LinkIcon';

interface InputSourceProps {
  onFileUpload: (file: File) => void;
  onUrlSubmit: (url: string) => void;
  onYoutubeSubmit: (url: string) => void;
  isProcessing: boolean;
}

type InputMode = 'upload' | 'youtube' | 'url';

const InputSource: React.FC<InputSourceProps> = ({ onFileUpload, onUrlSubmit, onYoutubeSubmit, isProcessing }) => {
  const [mode, setMode] = useState<InputMode>('upload');
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    if (mode === 'upload' && selectedFile) {
      onFileUpload(selectedFile);
    } else if (mode === 'youtube' && url) {
      onYoutubeSubmit(url);
    } else if (mode === 'url' && url) {
      onUrlSubmit(url);
    }
  };

  const TabButton: React.FC<{
    targetMode: InputMode;
    icon: React.ReactNode;
    label: string;
  }> = ({ targetMode, icon, label }) => (
    <button
      type="button"
      onClick={() => setMode(targetMode)}
      className={`flex-1 p-3 flex items-center justify-center gap-2 rounded-t-lg font-semibold transition-colors ${
        mode === targetMode
          ? 'bg-white dark:bg-gray-800 text-indigo-600'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex">
        <TabButton targetMode="upload" icon={<UploadIcon className="w-5 h-5" />} label="Upload PDF" />
        <TabButton targetMode="youtube" icon={<YouTubeIcon className="w-5 h-5" />} label="YouTube Video" />
        <TabButton targetMode="url" icon={<LinkIcon className="w-5 h-5" />} label="Document Link" />
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-b-xl shadow-lg">
        {mode === 'upload' && (
          <div>
            <form
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 ${
                dragActive ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10' : 'border-gray-300 dark:border-gray-600'
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onSubmit={handleSubmit}
            >
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
              <label htmlFor="file-upload" className="mt-4 block">
                <span className="text-lg font-semibold text-indigo-600 cursor-pointer hover:underline">
                  Choose a file
                </span>
                <span className="mt-1 block text-sm text-gray-500"> or drag and drop</span>
              </label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={isProcessing}
              />
              <p className="mt-2 text-xs text-gray-500">PDF up to 50MB</p>
            </form>
            {selectedFile && (
              <div className="mt-6 text-center">
                <p className="text-md text-gray-700 dark:text-gray-300">
                  Selected file: <span className="font-semibold">{selectedFile.name}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {(mode === 'youtube' || mode === 'url') && (
          <form onSubmit={handleSubmit}>
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {mode === 'youtube' ? 'YouTube Video URL' : 'Public PDF Document URL'}
            </label>
            <input
              type="url"
              id="url-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={mode === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://example.com/document.pdf'}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={isProcessing}
            />
             {mode === 'youtube' && <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Feature is experimental and requires videos to have English captions.</p>}
             {mode === 'url' && <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">The link must point directly to a PDF file and the server must allow cross-origin requests (CORS).</p>}
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            disabled={isProcessing || (mode === 'upload' && !selectedFile) || (mode !== 'upload' && !url)}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            {isProcessing ? 'Processing...' : 'Generate Study Materials'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputSource;