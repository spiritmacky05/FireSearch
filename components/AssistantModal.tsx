
import React, { useState, useRef, useEffect } from 'react';
import { Chat } from '@google/genai';
import { createGeneralAssistantSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssistantModal: React.FC<AssistantModalProps> = ({ isOpen, onClose }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chat) {
      try {
        const newChat = createGeneralAssistantSession();
        setChat(newChat);
        setMessages([{ role: 'model', text: '# Welcome to Super FC AI Expert Mode\nI am your advanced assistant for RA 9514. You can ask me anything about the Fire Code of the Philippines, specific occupancy requirements, or technical safety standards.\n\nHow can I help your inspection today?' }]);
      } catch (e) {
        console.error("Failed to init general chat", e);
      }
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || !chat) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const result = await chat.sendMessage({ message: userMsg });
      const responseText = result.text || "I couldn't generate a response.";
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error connecting to the expert assistant." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 h-10 w-10 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Super FC AI Expert Mode</h3>
              <p className="text-xs text-blue-200">Deep-dive RA 9514 Knowledge Base</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
              }`}>
                <div className={`markdown-body ${msg.role === 'user' ? 'user-message' : ''} text-sm sm:text-base leading-relaxed`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-4 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-100 shadow-2xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Ask anything about RA 9514 (e.g., 'What are the travel distance limits for schools?')"
              className="flex-grow px-5 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-slate-50 transition-all"
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="bg-blue-900 text-white px-6 py-3 rounded-xl hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 font-bold"
            >
              Send
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 text-center uppercase tracking-widest font-bold">
            Powered by Super FC AI Knowledge Engine
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssistantModal;
