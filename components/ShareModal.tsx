import React, { useState, useEffect } from 'react';
import { SharePayload } from '../types';
import XIcon from './icons/XIcon';

interface ShareModalProps {
  payload: SharePayload;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ payload, onClose }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const encodedPayload = btoa(JSON.stringify(payload));
      const url = `${window.location.origin}${window.location.pathname}#share/${encodedPayload}`;
      setShareUrl(url);
    } catch (error) {
      console.error("Failed to create share link:", error);
      setShareUrl('Could not generate link.');
    }
  }, [payload]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Share Study Materials</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Anyone with this link will be able to view this content.</p>
        <div className="mt-4">
          <label htmlFor="share-link" className="sr-only">Shareable Link</label>
          <input
            id="share-link"
            type="text"
            readOnly
            value={shareUrl}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300"
          />
        </div>
        <div className="mt-4">
          <button
            onClick={handleCopy}
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
