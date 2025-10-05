'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa';
import axios from 'axios';

export default function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your LEOVERSE AI Assistant. I can help you choose the best components for your mission, explain sustainability concepts, and optimize your spacecraft design. What would you like to know?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { user, selectedCountry, totalBudget, spentBudget, selectedComponents } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Prepare context for AI
      const context = {
        country: selectedCountry?.name,
        budget: totalBudget,
        spent: spentBudget,
        remaining: totalBudget - spentBudget,
        components: selectedComponents.map(c => ({
          name: c.name,
          category: c.category,
          cost: c.cost,
          si_impact: c.si_impact
        }))
      };

      // Get AI API URL from environment
      const aiApiUrl = process.env.NEXT_PUBLIC_AI_API_URL;

      let assistantMessage;

      if (aiApiUrl && aiApiUrl !== 'YOUR_AI_API_URL_HERE') {
        // Use actual AI API
        const response = await axios.post(aiApiUrl, {
          message: userMessage,
          context: context
        });
        
        assistantMessage = response.data.response || response.data.message;
      } else {
        // Fallback to rule-based responses
        assistantMessage = getSmartResponse(userMessage, context);
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: assistantMessage 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I\'m having trouble connecting right now. Let me provide some general advice: Focus on components with high SI scores (above 8.0) to maximize sustainability. Balance your budget across all four categories: propulsion, communication, power, and structure.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Rule-based fallback responses
  const getSmartResponse = (message, context) => {
    const lowerMessage = message.toLowerCase();

    // Budget-related questions
    if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('afford')) {
      return `You have ${context.remaining.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })} remaining out of your ${context.budget.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })} budget. I recommend allocating roughly: 30% for propulsion, 20% for communication, 30% for power, and 20% for structure. Focus on high SI-impact components within your range!`;
    }

    // SI Score questions
    if (lowerMessage.includes('si') || lowerMessage.includes('sustainability') || lowerMessage.includes('score')) {
      return `The Sustainability Index (SI) measures how environmentally friendly and long-term viable your mission is. Components with SI scores above 8.5 are excellent choices. Currently, solar panels and ion thrusters have the highest SI ratings. Aim for an overall SI score above 70 for a good mission!`;
    }

    // Component recommendations
    if (lowerMessage.includes('recommend') || lowerMessage.includes('best') || lowerMessage.includes('which')) {
      if (lowerMessage.includes('propulsion')) {
        return `For propulsion, I recommend the Solar Sail (SI: 9.5, $8K) if you want maximum sustainability, or the Ion Thruster X200 (SI: 8.5, $15K) for a good balance of performance and sustainability.`;
      }
      if (lowerMessage.includes('power')) {
        return `For power systems, Advanced Solar Cells (SI: 9.5, $15K) offer the best sustainability. Solar Panel Array (SI: 9.0, $10K) is also excellent and more budget-friendly. Avoid RTG unless absolutely necessary for deep space missions.`;
      }
      if (lowerMessage.includes('communication')) {
        return `For communication, the Laser Communication System (SI: 9.0, $20K) offers high bandwidth and good sustainability. For tighter budgets, the X-Band Transceiver (SI: 7.0, $12K) is reliable.`;
      }
      if (lowerMessage.includes('structure')) {
        return `For structure, the Inflatable Module (SI: 9.0, $10K) provides excellent space efficiency and sustainability. Carbon Fiber Composite (SI: 8.5, $15K) is great for strength with lower weight.`;
      }
      
      // General recommendation
      return `Based on your ${context.country} mission with $${(context.remaining/1000).toFixed(0)}K remaining, I suggest prioritizing components with SI scores above 8.0. Ensure you have at least one component from each category. Would you like specific recommendations for any category?`;
    }

    // Category-specific help
    if (lowerMessage.includes('category') || lowerMessage.includes('categories')) {
      const hasAll = ['propulsion', 'communication', 'power', 'structure'].every(
        cat => context.components.some(c => c.category === cat)
      );
      if (hasAll) {
        return `Great job! You have components from all four categories. This balanced approach will help your mission score higher.`;
      } else {
        const missing = ['propulsion', 'communication', 'power', 'structure'].filter(
          cat => !context.components.some(c => c.category === cat)
        );
        return `You're missing components from: ${missing.join(', ')}. I recommend adding at least one from each category for a balanced mission.`;
      }
    }

    // Country-specific advice
    if (lowerMessage.includes('country') || lowerMessage.includes(context.country?.toLowerCase())) {
      return `As ${context.country}, your space program has unique characteristics. Focus on cost-effective solutions with high sustainability scores. Consider partnering with international suppliers for advanced technology while maintaining budget efficiency.`;
    }

    // Default helpful response
    return `Great question! Here are some key tips for your mission:
    
1. **Balance is key**: Include components from all four categories
2. **Sustainability first**: Choose components with SI scores above 8.0
3. **Budget wisely**: Try to stay under 80% of your budget for bonus points
4. **High SI components**: Solar sails, advanced solar cells, and laser communications are top choices

What specific aspect would you like help with? (budget, components, SI score, or categories)`;
  };

  const quickQuestions = [
    'What are the best sustainable components?',
    'How can I improve my SI score?',
    'Recommend components within my budget',
    'Explain the Sustainability Index'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-space-blue border-2 border-primary-500/50 rounded-t-2xl md:rounded-2xl w-full max-w-2xl h-[80vh] md:h-[600px] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center">
              <FaRobot className="text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-lg">AI Assistant</h3>
              <p className="text-xs text-gray-400">Powered by LEOVERSE AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-400 mb-2">Quick questions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(question);
                  }}
                  className="text-xs bg-space-blue/50 hover:bg-space-blue p-2 rounded text-left transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your mission..."
              className="flex-1 px-4 py-3 bg-space-dark border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
