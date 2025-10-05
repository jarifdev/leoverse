'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { formatCurrency, formatSI, getSIColor, getBudgetColor } from '@/lib/utils';
import { FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';

export default function StatsHeader() {
  const router = useRouter();
  const { user, isAuthenticated, logout, totalBudget, spentBudget, score, calculateSI } = useStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isAuthenticated || !user) {
    return null;
  }

  const remainingBudget = totalBudget - spentBudget;
  const currentSI = calculateSI();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-20 right-0 h-24 bg-space-dark/95 backdrop-blur-md border-b border-gray-800 z-30 flex items-center px-8">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="text-4xl">🚀</span>
          <span className="text-3xl font-bold text-gradient">LEOVERSE</span>
        </div>

        {/* Stats Display */}
        <div className="flex items-center gap-8">
          {/* Remaining Budget */}
          <div className="flex flex-col gap-1 px-6 py-3 bg-space-blue/30 rounded-lg border border-blue-500/20">
            <span className="text-sm text-gray-400">Budget</span>
            <span className={`text-2xl font-bold ${getBudgetColor(remainingBudget, totalBudget)}`}>
              {formatCurrency(remainingBudget)}
            </span>
          </div>

          {/* Score */}
          <div className="flex flex-col gap-1 px-6 py-3 bg-purple-900/30 rounded-lg border border-purple-500/20">
            <span className="text-sm text-gray-400">Score</span>
            <span className="text-2xl font-bold text-purple-300">
              {score || 0}
            </span>
          </div>

          {/* Sustainability Index */}
          <div className="flex flex-col gap-1 px-6 py-3 bg-space-blue/30 rounded-lg border border-blue-500/20">
            <span className="text-sm text-gray-400">Sustainability Index</span>
            <span className={`text-2xl font-bold ${getSIColor(currentSI)}`}>
              {formatSI(currentSI)}
            </span>
          </div>
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 px-5 py-3 bg-space-blue/30 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all"
          >
            <FaUser className="text-primary-400 text-lg" />
            <span className="text-base font-medium">{user.display_name || user.username}</span>
            <FaChevronDown className={`text-sm text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-space-dark border border-gray-700 rounded-lg shadow-xl overflow-hidden"
              >
                <div className="p-3 border-b border-gray-700">
                  <div className="text-xs text-gray-400">Signed in as</div>
                  <div className="text-sm font-semibold text-white truncate">
                    {user.username}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    handleLogout();
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-900/20 transition-colors flex items-center gap-2"
                >
                  <FaSignOutAlt />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
