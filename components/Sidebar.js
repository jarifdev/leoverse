'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaTrophy, FaRobot, FaMapMarkedAlt, FaRocket } from 'react-icons/fa';
import { useStore } from '@/lib/store';

export default function Sidebar({ onOpenAI }) {
  const router = useRouter();
  const { isAuthenticated, missionStatus, selectedCountry } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which mission to resume
  const getResumePath = () => {
    if (!selectedCountry) {
      return '/country';
    }
    if (!missionStatus.payload.completed) {
      return '/mission';
    }
    if (!missionStatus.orbital.completed) {
      return '/orbital-path';
    }
    if (!missionStatus.crisis.completed) {
      return '/crisis';
    }
    // All missions completed - show leaderboard
    return '/leaderboard';
  };

  if (!mounted || !isAuthenticated) {
    return null;
  }

  const navItems = [
    {
      id: 'resume',
      icon: <FaRocket className="text-2xl" />,
      label: 'Resume Game',
      onClick: () => router.push(getResumePath()),
      highlight: true
    },
    {
      id: 'leaderboard',
      icon: <FaTrophy className="text-2xl" />,
      label: 'Leaderboard',
      onClick: () => router.push('/leaderboard')
    },
    {
      id: 'ai',
      icon: <FaRobot className="text-2xl" />,
      label: 'LEO AI',
      onClick: onOpenAI
    },
    {
      id: 'map',
      icon: <FaMapMarkedAlt className="text-2xl" />,
      label: 'Global Map',
      onClick: () => {
        router.push('/map');
      }
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 border-r border-gray-800 z-40 flex flex-col items-center justify-center gap-6" style={{ backgroundColor: '#15161B' }}>
      {navItems.map((item) => (
        <motion.button
          key={item.id}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={item.onClick}
          className={`w-14 h-14 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 group relative ${
            item.highlight 
              ? 'border border-[#0B8FA9]/50 hover:border-[#0B8FA9]/80' 
              : 'bg-[#283145]/50 hover:bg-[#283145]/70 border border-gray-700/30'
          }`}
          style={item.highlight ? { backgroundColor: '#0B8FA9' } : {}}
          aria-label={item.label}
        >
          {item.icon}
          
          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-3 py-1 bg-space-dark border border-blue-500/30 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {item.label}
          </div>
        </motion.button>
      ))}
    </aside>
  );
}
