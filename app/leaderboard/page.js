'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { leaderboardAPI } from '@/lib/api';
import { formatSI } from '@/lib/utils';
import { FaTrophy, FaMedal, FaStar, FaRedo } from 'react-icons/fa';

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' or country code
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { limit: 100 };
      if (filter !== 'all') {
        params.country = filter;
      }
      
      const response = await leaderboardAPI.get(params);
      
      if (response.data.success) {
        setLeaderboard(response.data.leaderboard || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch leaderboard');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError(error.message);
      // Show demo data if backend is unavailable
      setLeaderboard([
        { 
          rank: 1,
          user_id: 'demo1', 
          username: 'SpaceExplorer',
          display_name: 'Space Explorer', 
          mission_name: 'Apollo Demo Mission',
          country_code: 'US',
          si_score: 92.5,
          total_budget: 150000,
          components_count: 8,
          created_at: '2025-10-05T10:30:00Z'
        },
        { 
          rank: 2,
          user_id: 'demo2', 
          username: 'AstroBuilder',
          display_name: 'Astro Builder',
          mission_name: 'Artemis Build',
          country_code: 'OM',
          si_score: 88.3,
          total_budget: 45000,
          components_count: 6,
          created_at: '2025-10-05T09:15:00Z'
        },
        { 
          rank: 3,
          user_id: 'demo3', 
          username: 'SatellitePro',
          display_name: 'Satellite Pro',
          mission_name: 'LEO Constellation',
          country_code: 'IN',
          si_score: 85.7,
          total_budget: 75000,
          components_count: 7,
          created_at: '2025-10-05T08:45:00Z'
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (position) => {
    if (position === 1) return <FaTrophy className="text-yellow-400 text-2xl" />;
    if (position === 2) return <FaMedal className="text-gray-300 text-2xl" />;
    if (position === 3) return <FaMedal className="text-orange-400 text-2xl" />;
    return <FaStar className="text-primary-400" />;
  };

  const getRankBg = (position) => {
    if (position === 1) return 'bg-gradient-to-r from-yellow-900/30 to-yellow-700/30 border-yellow-500/50';
    if (position === 2) return 'bg-gradient-to-r from-gray-700/30 to-gray-600/30 border-gray-400/50';
    if (position === 3) return 'bg-gradient-to-r from-orange-900/30 to-orange-700/30 border-orange-500/50';
    return 'bg-space-blue/50 border-gray-700';
  };

  const getCountryFlag = (code) => {
    const flags = {
      'OM': '🇴🇲',
      'US': '🇺🇸',
      'IN': '🇮🇳',
      'JP': '🇯🇵',
      'AE': '🇦🇪'
    };
    return flags[code] || '🌍';
  };

  const countries = [
    { code: 'all', name: 'All Countries', flag: '🌍' },
    { code: 'OM', name: 'Oman', flag: '🇴🇲' },
    { code: 'US', name: 'USA', flag: '🇺🇸' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'AE', name: 'UAE', flag: '🇦🇪' }
  ];

  return (
    <>
      <div className="min-h-screen pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="section-title mb-4">🏆 Global Leaderboard</h1>
            <p className="text-xl text-gray-300">
              Top space engineers ranked by Sustainability Index
            </p>
          </motion.div>

        {/* Filters & Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Country Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => setFilter(country.code)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  filter === country.code
                    ? 'bg-primary-600 text-white'
                    : 'bg-space-blue text-gray-400 hover:bg-space-blue/80'
                }`}
              >
                {country.flag} {country.name}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="btn-secondary flex items-center gap-2"
          >
            <FaRedo className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-400">Loading leaderboard...</p>
          </div>
        )}

        {/* Leaderboard List */}
        {!loading && leaderboard.length > 0 && (
          <div className="space-y-4">
            {leaderboard.map((entry, index) => {
              const position = entry.rank || (index + 1);
              return (
                <motion.div
                  key={entry.id || entry.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`card border-2 ${getRankBg(position)} hover:scale-[1.02] transition-transform`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex-shrink-0 w-16 text-center">
                      {position <= 3 ? (
                        <div>{getRankIcon(position)}</div>
                      ) : (
                        <div className="text-2xl font-bold text-gray-500">
                          #{position}
                        </div>
                      )}
                    </div>

                    {/* User Info & Mission */}
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">
                        {entry.display_name || entry.username || `Player ${entry.user_id?.substring(0, 8)}`}
                        {entry.country_code && (
                          <span className="ml-2 text-sm font-normal">
                            {getCountryFlag(entry.country_code)}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        {entry.mission_name || 'Mission'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {entry.components_count} components • Budget: ${(entry.total_budget / 1000).toFixed(0)}K
                      </div>
                    </div>

                    {/* SI Score */}
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary-400 mb-1">
                        {formatSI(parseFloat(entry.si_score || 0))}
                      </div>
                      <div className="text-sm text-gray-400">SI Score</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && leaderboard.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-20"
          >
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold mb-4">No Missions Yet</h2>
            <p className="text-gray-400 mb-8">
              Be the first to complete a mission and claim the top spot!
            </p>
            <button
              onClick={() => router.push('/country')}
              className="btn-primary px-8 py-3"
            >
              Start Your Mission
            </button>
          </motion.div>
        )}

        {/* Stats Box */}
        {!loading && leaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 card"
          >
            <h3 className="text-xl font-bold mb-4">Leaderboard Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-400">
                  {leaderboard.length}
                </div>
                <div className="text-sm text-gray-400">Total Players</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">
                  {leaderboard.length > 0 ? formatSI(Math.max(...leaderboard.map(e => parseFloat(e.si_score || 0)))) : 0}
                </div>
                <div className="text-sm text-gray-400">Top SI</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">
                  {leaderboard.length > 0 
                    ? formatSI(leaderboard.reduce((sum, e) => sum + parseFloat(e.si_score || 0), 0) / leaderboard.length)
                    : 0}
                </div>
                <div className="text-sm text-gray-400">Average SI</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => router.push('/country')}
            className="btn-primary px-8 py-3"
          >
            Start New Mission 🚀
          </button>
          <button
            onClick={() => router.push('/')}
            className="btn-outline px-8 py-3"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
    </>
  );
}
