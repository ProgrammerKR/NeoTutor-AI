import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat as GenAIChat } from "@google/genai";
import SendIcon from './icons/SendIcon';
import XIcon from './icons/XIcon';

interface ChatbotProps {
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const API_KEY = process.env.API_KEY;

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [chat, setChat] = useState<GenAIChat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
        if (!API_KEY) {
            console.error("API_KEY is not set.");
            setMessages([{ role: 'model', text: 'Error: API Key is not configured for the chatbot.' }]);
            return;
        }
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const chatSession = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are a friendly and helpful AI assistant named Neo. Your goal is to provide accurate and helpful information to users' general questions.`,
            },
        });
        setChat(chatSession);
        setMessages([
            { role: 'model', text: "Hello! I'm Neo, your AI assistant. How can I help you today?" }
        ]);
    };
    initChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chat) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await chat.sendMessageStream({ message: input });
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]); 

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { role: 'model', text: modelResponse };
            return newMessages;
        });
      }

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-16 sm:right-16 z-50 w-[calc(100%-2rem)] max-w-lg h-[70vh] max-h-[700px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col transition-transform duration-300 transform-gpu">
      <header className="flex items-center justify-between p-4 border-b dark:border-gray-700 flex-shrink-0">
         <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Assistant</h2>
         <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 rounded-full transition-colors">
            <XIcon className="w-6 h-6" />
         </button>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length-1].role === 'user' && (
             <div className="flex justify-start">
                <div className="max-w-lg p-3 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <footer className="p-4 border-t dark:border-gray-700 flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading || !chat}
            />
            <button type="submit" disabled={isLoading || !input.trim() || !chat} className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors">
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
      </footer>
    </div>
  );
};

export default Chatbot;
