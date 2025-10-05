'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { FaUser, FaSignOutAlt, FaTrophy, FaRocket } from 'react-icons/fa';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useStore();

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-space-dark/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-xl font-bold cursor-pointer"
            >
              <span className="text-2xl">🚀</span>
              <span className="text-gradient">LEOVERSE</span>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/mission">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <FaRocket className="text-sm" />
                <span>Mission Builder</span>
              </motion.div>
            </Link>

            <Link href="/orbital-path">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <span className="text-sm">🛰️</span>
                <span>Orbital Path</span>
              </motion.div>
            </Link>

            <Link href="/crisis">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <span className="text-sm">⚠️</span>
                <span>Crisis Management</span>
              </motion.div>
            </Link>
            
            <Link href="/leaderboard">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <FaTrophy className="text-sm" />
                <span>Leaderboard</span>
              </motion.div>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-space-blue/50 rounded-lg">
              <FaUser className="text-primary-400" />
              <span className="text-sm font-medium">{user.display_name || user.username}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
}
