'use client';

import { motion } from 'framer-motion';
import { FaCheckCircle, FaTrophy, FaRocket } from 'react-icons/fa';

export default function MissionCompleteModal({ 
  isOpen, 
  title, 
  stats, 
  buttons, 
  onClose 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-space-dark to-black border-2 border-blue-500/50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block mb-4"
          >
            <FaCheckCircle className="text-6xl text-green-400" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gradient mb-2">{title}</h2>
        </div>

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="space-y-3 mb-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-space-blue/30 rounded-lg border border-blue-500/20"
              >
                <span className="text-gray-300">{stat.label}:</span>
                <span className="font-bold text-white">{stat.value}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Buttons */}
        {buttons && buttons.length > 0 && (
          <div className={`grid ${buttons.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
            {buttons.map((button, index) => (
              <motion.button
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={button.onClick}
                className={`py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  button.primary
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                    : 'bg-space-blue/50 hover:bg-space-blue/70 text-gray-200 border border-blue-500/30'
                }`}
              >
                {button.icon && button.icon}
                {button.label}
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
