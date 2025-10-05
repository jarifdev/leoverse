'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { useStore } from '@/lib/store';

const CHATBOT_API_URL = 'https://nr-test.onrender.com/api/rag';

export default function AIAssistant({ isOpen, onClose }) {
  const { user, isAuthenticated } = useStore();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your LEOVERSE AI assistant. Ask me anything about space missions, satellites, orbital mechanics, or sustainability!\n\n⏱️ Note: The first message may take up to 30 seconds as the AI service wakes up. Subsequent messages will be much faster!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message to chat
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);

    setIsLoading(true);

    try {
      // Call the RAG chatbot API using fetch
      const response = await fetch(CHATBOT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage
        }),
        signal: AbortSignal.timeout(120000) // 2 minute timeout
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      
      // Extract answer from response (RAG API returns {ok: true, answer: "...", apod: {...}})
      let botContent = '';
      if (data.answer && data.answer.result) {
        botContent = data.answer.result;
      } else if (data.answer) {
        botContent = typeof data.answer === 'string' ? data.answer : JSON.stringify(data.answer);
      } else if (data.response) {
        botContent = data.response;
      } else if (data.message) {
        botContent = data.message;
      } else {
        botContent = 'I apologize, but I couldn\'t generate a response. Please try again.';
      }

      // Add bot response to chat (with optional APOD data)
      const botMessage = {
        role: 'assistant',
        content: botContent,
        timestamp: new Date(),
        apod: data.apod || null // Include APOD image data if present
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Mark that first message succeeded
      if (isFirstMessage) {
        setIsFirstMessage(false);
      }

    } catch (error) {
      console.error('Chatbot API error:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name
      });
      
      // Add error message with more details
      let errorContent = 'I apologize, but I\'m having trouble connecting right now.';
      
      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        errorContent = 'Request timed out. The AI service may be waking up (first request can take up to 2 minutes). Please try again.';
      } else if (error.message.includes('status')) {
        errorContent = `API Error: ${error.message}. Please try again in a moment.`;
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorContent = 'Unable to reach the AI service. Please check your internet connection or try again later.';
      }
      
      const errorMessage = {
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Chat cleared! How can I help you?',
        timestamp: new Date()
      }
    ]);
  };

  // Only show if user is authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

    return (
      <>      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] bg-space-dark border-2 border-blue-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <FaRobot className="text-2xl text-white" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">LEOVERSE AI</h3>
                  <p className="text-xs text-blue-100">Space Mission Assistant</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="text-white/70 hover:text-white text-sm px-2 py-1 rounded hover:bg-white/10 transition-colors"
                  title="Clear chat"
                >
                  Clear
                </button>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  aria-label="Close chat"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-space-dark to-black">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                        : message.isError
                        ? 'bg-red-900/30 text-red-300 border border-red-500/30'
                        : 'bg-space-blue/50 text-gray-100 border border-blue-500/20'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <FaRobot className="text-blue-400 text-sm" />
                        <span className="text-xs text-blue-300 font-semibold">AI Assistant</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    
                    {/* Display APOD Image if present */}
                    {message.apod && (
                      <div className="mt-3 border border-blue-500/30 rounded-lg overflow-hidden bg-space-blue/30">
                        <img 
                          src={message.apod.url || message.apod.hdurl} 
                          alt={message.apod.title || 'Astronomy Picture of the Day'}
                          className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(message.apod.hdurl || message.apod.url, '_blank')}
                          loading="lazy"
                        />
                        <div className="p-3 bg-space-dark/50">
                          <p className="text-xs font-semibold text-blue-300 mb-1">
                            {message.apod.title}
                          </p>
                          {message.apod.date && (
                            <p className="text-xs text-gray-400">
                              📅 {new Date(message.apod.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          )}
                          <button
                            onClick={() => window.open(message.apod.hdurl || message.apod.url, '_blank')}
                            className="mt-2 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            <span>View HD Image</span>
                            <span className="text-[10px]">🔗</span>
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs opacity-50 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-space-blue/50 border border-blue-500/20 rounded-2xl px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <FaSpinner className="animate-spin text-blue-400" />
                        <span className="text-sm text-gray-300">
                          {isFirstMessage ? 'Waking up AI service...' : 'AI is thinking...'}
                        </span>
                      </div>
                      {isFirstMessage && (
                        <p className="text-xs text-gray-400">
                          ⏱️ First request may take up to 30 seconds
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-space-dark border-t border-blue-500/30">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about space..."
                  className="flex-1 bg-space-blue/30 border border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className={`px-4 py-3 rounded-xl transition-all ${
                    inputMessage.trim() && !isLoading
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                  aria-label="Send message"
                >
                  <FaPaperPlane />
                </button>
              </div>
              
              {/* Suggested Questions */}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setInputMessage('What are the different orbital paths?')}
                  className="text-xs bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full transition-colors"
                  disabled={isLoading}
                >
                  Orbital Paths?
                </button>
                <button
                  type="button"
                  onClick={() => setInputMessage('Explain space sustainability')}
                  className="text-xs bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full transition-colors"
                  disabled={isLoading}
                >
                  Sustainability?
                </button>
                <button
                  type="button"
                  onClick={() => setInputMessage('What is space debris?')}
                  className="text-xs bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full transition-colors"
                  disabled={isLoading}
                >
                  Space Debris?
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
