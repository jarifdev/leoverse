'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export default function BudgetPage() {
  const router = useRouter();
  const { user, selectedCountry, totalBudget, updateProgress } = useStore();

  if (!user || !selectedCountry) {
    router.push('/');
    return null;
  }

  const handleContinue = () => {
    updateProgress({
      current_screen: 'mission',
      completed_screens: ['landing', 'country', 'budget'],
    });
    router.push('/mission');
  };

  return (
    <>
      <div className="min-h-screen pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="section-title mb-4">Mission Budget</h1>
            <p className="text-xl text-gray-300">
              You're building a mission for {selectedCountry.flag} {selectedCountry.name}
            </p>
          </motion.div>

        {/* Budget Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card text-center mb-12"
        >
          <div className="text-6xl mb-4">💰</div>
          <h2 className="text-5xl font-bold text-primary-400 mb-2">
            {formatCurrency(totalBudget)}
          </h2>
          <p className="text-xl text-gray-300">Available Mission Budget</p>
        </motion.div>

        {/* Budget Breakdown */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <span className="text-3xl mr-3">📊</span>
              Budget Guidelines
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-primary-400 mr-3 text-xl">•</span>
                <span>Allocate funds across 4 major categories: Propulsion, Communication, Power, and Structure</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-400 mr-3 text-xl">•</span>
                <span>Balance cost with sustainability impact (SI score)</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-400 mr-3 text-xl">•</span>
                <span>Staying under budget increases your final score</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-400 mr-3 text-xl">•</span>
                <span>Choose wisely - expensive doesn't always mean better!</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-gradient-to-br from-primary-900/30 to-purple-900/30"
          >
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <span className="text-3xl mr-3">🎯</span>
              Success Tips
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-3 text-xl">✓</span>
                <span>Prioritize high SI impact components</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3 text-xl">✓</span>
                <span>Include at least one component from each category</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3 text-xl">✓</span>
                <span>Use the AI assistant for recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3 text-xl">✓</span>
                <span>Think long-term sustainability over short-term gains</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Component Cost Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card mb-8"
        >
          <h3 className="text-2xl font-bold mb-6">Component Price Ranges</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { category: 'Propulsion', icon: '🚀', range: '$8K - $25K' },
              { category: 'Communication', icon: '📡', range: '$8K - $20K' },
              { category: 'Power', icon: '⚡', range: '$10K - $30K' },
              { category: 'Structure', icon: '🏗️', range: '$8K - $18K' }
            ].map((item, idx) => (
              <div key={idx} className="bg-space-blue/50 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-semibold mb-1">{item.category}</div>
                <div className="text-sm text-gray-400">{item.range}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <button
            onClick={handleContinue}
            className="btn-primary text-lg px-12 py-4"
          >
            Start Building Mission 🚀
          </button>
        </motion.div>
      </div>
    </div>
    </>
  );
}
