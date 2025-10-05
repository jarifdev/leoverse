'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSave, FaCheckCircle } from 'react-icons/fa';
import { useStore } from '@/lib/store';

export default function GameStateIndicator() {
  const [showSaved, setShowSaved] = useState(false);
  const { missionStatus, selectedComponents, selectedCountry } = useStore();
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Don't show on initial mount - only on actual changes
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Show saved indicator whenever important state changes
    setShowSaved(true);
    const timer = setTimeout(() => setShowSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [missionStatus, selectedComponents, selectedCountry]);

  return (
    <AnimatePresence>
      {showSaved && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-4 z-50 bg-green-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg border border-green-400/50 flex items-center gap-2"
        >
          <FaCheckCircle className="text-lg" />
          <span className="text-sm font-medium">Game Progress Saved</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
