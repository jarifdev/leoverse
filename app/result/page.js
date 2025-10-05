'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { formatCurrency, formatSI, getSIColor } from '@/lib/utils';
import { FaTrophy, FaMedal, FaStar } from 'react-icons/fa';
import confetti from 'canvas-confetti';

export default function ResultPage() {
  const router = useRouter();
  const {
    user,
    selectedCountry,
    totalBudget,
    spentBudget,
    selectedComponents,
    currentMission,
    clearComponents
  } = useStore();

  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    if (!user || !currentMission) {
      router.push('/');
      return;
    }

    // Celebrate!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Check for achievements
    checkAchievements();
  }, []);

  const checkAchievements = () => {
    const earned = [];
    const siScore = currentMission.si_score;
    const budgetEfficiency = ((totalBudget - spentBudget) / totalBudget) * 100;

    // First mission
    earned.push({
      title: 'Space Pioneer',
      description: 'Completed your first mission',
      icon: '🚀'
    });

    // High SI score
    if (siScore >= 85) {
      earned.push({
        title: 'Sustainability Champion',
        description: 'Achieved SI score above 85',
        icon: '🌍'
      });
    }

    // Budget efficiency
    if (budgetEfficiency >= 20) {
      earned.push({
        title: 'Budget Master',
        description: 'Completed mission under 80% of budget',
        icon: '💰'
      });
    }

    // All high SI components
    const allHighSI = selectedComponents.every(c => c.si_impact >= 8.0);
    if (allHighSI) {
      earned.push({
        title: 'Tech Innovator',
        description: 'Used only high-SI components',
        icon: '⚡'
      });
    }

    setAchievements(earned);
  };

  if (!user || !currentMission) {
    return null;
  }

  const siScore = currentMission.si_score;
  const budgetSaved = totalBudget - spentBudget;
  const efficiency = (budgetSaved / totalBudget) * 100;

  const getRank = () => {
    if (siScore >= 90) return { title: 'Legendary', icon: '👑', color: 'text-yellow-400' };
    if (siScore >= 80) return { title: 'Excellent', icon: '💎', color: 'text-blue-400' };
    if (siScore >= 70) return { title: 'Great', icon: '⭐', color: 'text-green-400' };
    if (siScore >= 60) return { title: 'Good', icon: '✨', color: 'text-purple-400' };
    return { title: 'Promising', icon: '🌟', color: 'text-gray-400' };
  };

  const rank = getRank();

  return (
    <>
      <div className="min-h-screen pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="text-8xl mb-4">{rank.icon}</div>
            <h1 className="text-5xl font-bold mb-4">
            <span className={rank.color}>{rank.title}</span> Mission!
          </h1>
          <p className="text-2xl text-gray-300">
            {currentMission.name}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card text-center"
          >
            <div className="text-4xl mb-2">🎯</div>
            <div className={`text-4xl font-bold mb-2 ${getSIColor(siScore)}`}>
              {formatSI(siScore)}
            </div>
            <div className="text-gray-400">Sustainability Index</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card text-center"
          >
            <div className="text-4xl mb-2">💰</div>
            <div className="text-4xl font-bold mb-2 text-green-400">
              {formatCurrency(budgetSaved)}
            </div>
            <div className="text-gray-400">Budget Saved ({efficiency.toFixed(1)}%)</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card text-center"
          >
            <div className="text-4xl mb-2">🛰️</div>
            <div className="text-4xl font-bold mb-2 text-primary-400">
              {selectedComponents.length}
            </div>
            <div className="text-gray-400">Components Used</div>
          </motion.div>
        </div>

        {/* Mission Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Mission Summary</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>🌍</span> Country
              </h3>
              <p className="text-gray-300">
                {selectedCountry.flag} {selectedCountry.name}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>📊</span> Budget Analysis
              </h3>
              <p className="text-gray-300">
                Spent: {formatCurrency(spentBudget)} / {formatCurrency(totalBudget)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-3">Components Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['propulsion', 'communication', 'power', 'structure'].map((category) => {
                const count = selectedComponents.filter(c => c.category === category).length;
                const icons = { propulsion: '🚀', communication: '📡', power: '⚡', structure: '🏗️' };
                return (
                  <div key={category} className="bg-space-blue/50 p-3 rounded text-center">
                    <div className="text-2xl mb-1">{icons[category]}</div>
                    <div className="text-sm capitalize text-gray-400">{category}</div>
                    <div className="text-lg font-bold">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaTrophy className="text-yellow-400" />
              Achievements Unlocked!
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  className="bg-gradient-to-r from-primary-900/30 to-purple-900/30 p-4 rounded-lg border border-primary-500/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div>
                      <div className="font-bold text-lg">{achievement.title}</div>
                      <div className="text-sm text-gray-400">{achievement.description}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => {
              clearComponents();
              router.push('/leaderboard');
            }}
            className="btn-primary px-8 py-4"
          >
            View Leaderboard 🏆
          </button>
          <button
            onClick={() => {
              clearComponents();
              router.push('/country');
            }}
            className="btn-outline px-8 py-4"
          >
            New Mission 🚀
          </button>
        </motion.div>
      </div>
    </div>
    </>
  );
}
