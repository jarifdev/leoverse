'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { FaRocket, FaGlobe, FaChartLine, FaTrophy, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, missionStatus, selectedCountry } = useStore();

  // Debug logging
  useEffect(() => {
    console.log('Home Page - isAuthenticated:', isAuthenticated);
    console.log('Home Page - selectedCountry:', selectedCountry);
  }, [isAuthenticated, selectedCountry]);

  const features = [
    {
      icon: <FaRocket className="text-5xl" />,
      title: 'Build Your Mission',
      description: 'Design spacecraft with real components and constraints'
    },
    {
      icon: <FaGlobe className="text-5xl" />,
      title: 'Global Perspective',
      description: 'Choose your country and work with realistic budgets'
    },
    {
      icon: <FaChartLine className="text-5xl" />,
      title: 'Sustainability Index',
      description: 'Optimize for long-term space sustainability'
    },
    {
      icon: <FaTrophy className="text-5xl" />,
      title: 'Compete Globally',
      description: 'Climb the leaderboard and earn achievements'
    }
  ];

  const handleStart = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Determine where to send authenticated users based on game progress
    if (!selectedCountry) {
      router.push('/country');
    } else if (!missionStatus.payload.completed) {
      router.push('/mission');
    } else if (!missionStatus.orbital.completed) {
      router.push('/orbital-path');
    } else if (!missionStatus.crisis.completed) {
      router.push('/crisis');
    } else {
      // All missions complete, send to leaderboard
      router.push('/leaderboard');
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="text-gradient">LEOVERSE</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Build sustainable space missions, manage real-world constraints, and lead humanity's journey to the stars
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="btn-primary text-lg px-8 py-4"
              >
                🚀 Launch Your Mission
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/leaderboard')}
                className="btn-outline text-lg px-8 py-4"
              >
                🏆 View Leaderboard
              </motion.button>
            </div>
          </motion.div>

          {/* Floating Satellite */}
          <motion.div
            className="absolute top-20 right-10 text-6xl"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0, -10, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🛰️
          </motion.div>

          <motion.div
            className="absolute bottom-20 left-10 text-5xl"
            animate={{
              y: [0, -15, 0],
              rotate: [0, -10, 0, 10, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            🌍
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title text-center mb-16"
          >
            Why LEOVERSE ?
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-hover text-center"
              >
                <div className="text-primary-400 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title text-center mb-16"
          >
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose Your Nation',
                description: 'Select a country and receive a realistic space budget based on GDP'
              },
              {
                step: '02',
                title: 'Build Your Spacecraft',
                description: 'Select components for propulsion, power, communications, and structure'
              },
              {
                step: '03',
                title: 'Launch & Compete',
                description: 'Calculate your Sustainability Index and compete on the global leaderboard'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="card"
              >
                <div className="text-6xl font-bold text-primary-500/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-primary-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Shape the Future of Space?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of space enthusiasts building sustainable missions
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="btn-primary text-lg px-10 py-5"
            >
              Start Your Journey 🚀
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Auth Buttons - Always show for now */}
      <div className="fixed top-4 right-4 flex gap-3 z-50">
        {!isAuthenticated ? (
          <>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-2 bg-space-blue/80 hover:bg-space-blue rounded-lg font-semibold backdrop-blur-sm border border-gray-700"
              >
                <FaSignInAlt /> Log In
              </motion.button>
            </Link>
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg font-semibold"
              >
                <FaUserPlus /> Sign Up
              </motion.button>
            </Link>
          </>
        ) : (
          <button
            onClick={() => {
              console.log('Logout clicked');
              useStore.getState().logout();
            }}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-semibold"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
