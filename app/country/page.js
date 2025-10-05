'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { COUNTRIES } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { FaCheckCircle } from 'react-icons/fa';

export default function CountryPage() {
  const router = useRouter();
  const { user, selectedCountry, setSelectedCountry, setTotalBudget, setSpentBudget, updateProgress } = useStore();

  // Reset budget to 0 when arriving at country selection page
  useEffect(() => {
    setTotalBudget(0);
    setSpentBudget(0);
  }, [setTotalBudget, setSpentBudget]);

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setTotalBudget(country.budget);
    
    const currentProgress = useStore.getState().progress || {};
    const currentDecisions = currentProgress.decisions_made || {};
    
    updateProgress({
      current_screen: 'payload',
      completed_screens: ['landing', 'country'],
      decisions_made: {
        ...currentDecisions,
        selected_country: country.code
      }
    });
    router.push('/payload');
  };

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <>
      <div className="min-h-screen pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="section-title mb-4">Choose Your Nation</h1>
            <p className="text-xl text-gray-300">
              Select a country to begin your space mission. Each nation has unique budgets and challenges.
            </p>
          </motion.div>

        {/* Country Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(COUNTRIES).map((country, index) => (
            <motion.div
              key={country.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelectCountry(country)}
              className="card-hover relative overflow-hidden group"
            >
              {/* Selection Indicator */}
              {selectedCountry?.code === country.code && (
                <div className="absolute top-4 right-4 text-green-400 text-2xl">
                  <FaCheckCircle />
                </div>
              )}

              {/* Country Flag & Name */}
              <div className="text-center mb-6">
                <div className="text-7xl mb-4">{country.flag}</div>
                <h2 className="text-2xl font-bold mb-2">{country.name}</h2>
                <div className="text-3xl font-bold text-primary-400">
                  {formatCurrency(country.budget)}
                </div>
                <p className="text-sm text-gray-400">Mission Budget</p>
              </div>

              {/* GDP Per Capita */}
              <div className="mb-4 pb-4 border-b border-gray-700">
                <p className="text-sm text-gray-400">GDP Per Capita</p>
                <p className="text-lg font-semibold">{formatCurrency(country.gdpPerCapita)}</p>
              </div>

              {/* Strengths */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-green-400 mb-2">💪 Strengths</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  {country.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Challenges */}
              <div>
                <h3 className="text-sm font-semibold text-yellow-400 mb-2">⚠️ Challenges</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  {country.challenges.map((challenge, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 card max-w-3xl mx-auto"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <span className="text-2xl mr-3">💡</span>
            Understanding Budgets
          </h3>
          <p className="text-gray-300 mb-4">
            Mission budgets are based on each country's GDP per capita and space program investment. 
            Higher budgets allow for more advanced components, but sustainability matters more than spending!
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-space-blue/50 p-3 rounded">
              <strong className="text-primary-400">Higher Budget:</strong>
              <p className="text-gray-400">Access to cutting-edge technology and more component choices</p>
            </div>
            <div className="bg-space-blue/50 p-3 rounded">
              <strong className="text-purple-400">Lower Budget:</strong>
              <p className="text-gray-400">Requires strategic thinking and innovative solutions</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
}
