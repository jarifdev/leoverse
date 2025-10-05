'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { formatCurrency, getSIColor } from '@/lib/utils';
import { leaderboardAPI } from '@/lib/api';
import { FaExclamationTriangle, FaRocket, FaGlobe, FaTrophy, FaRedo } from 'react-icons/fa';
import VideoTransition from '@/components/VideoTransition';

const CRISIS_OPTIONS = {
  ignore: {
    id: 'ignore',
    title: 'Ignore Warning',
    icon: '⚠️',
    description: 'Risk it and hope for the best. Saves budget, but failure could mean asset loss.',
    cost: 0,
    weight: 0.8,
    si_min: -30,
    si_max: -10,
    color: 'red',
    consequences: 'High risk, no cost. Gamble with your mission safety.'
  },
  cleanup: {
    id: 'cleanup',
    title: 'Deploy Cleanup Tech',
    icon: '🛰️',
    description: 'Spend heavily to clear debris using advanced nets or lasers. Costly, but boosts sustainability index.',
    cost: 200,
    weight: 1.4,
    si_impact: 15,
    color: 'green',
    consequences: 'Expensive but safe. Demonstrates environmental responsibility.'
  },
  treaty: {
    id: 'treaty',
    title: 'International Treaty Push',
    icon: '🤝',
    description: 'Invest in diplomacy. Slower payoff, but increases safety network-wide and earns collaboration points.',
    cost: 150,
    weight: 1.2,
    si_impact: 10,
    color: 'blue',
    consequences: 'Moderate cost, good SI boost. Promotes global cooperation.'
  }
};

export default function CrisisManagementPage() {
  const router = useRouter();
  const {
    user,
    selectedCountry,
    currentMission,
    totalBudget,
    spentBudget,
    score,
    addToScore,
    addToSpentBudget,
    calculateSI,
    selectedComponents,
    selectedOrbitalPath,
    collisionPercent,
    missionStatus,
    setMissionCompleted,
    resetMissions,
    logout
  } = useStore();

  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [finalResults, setFinalResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertAnimation, setAlertAnimation] = useState(true);
  const [showVideoTransition, setShowVideoTransition] = useState(false);
  const [showExitVideo, setShowExitVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  useEffect(() => {
    if (!user || !currentMission) {
      router.push('/');
    }
  }, [user, currentMission, router]);

  // ROUTE GUARD: Check if orbital mission is completed
  useEffect(() => {
    if (user && !missionStatus.orbital.completed) {
      alert('⚠️ Please complete the Orbital Mission first!');
      router.push('/orbital-path');
    }
  }, [user, missionStatus, router]);

  if (!user || !currentMission || !missionStatus.orbital.completed) {
    return null;
  }

  const currentSI = calculateSI();
  const remainingBudget = totalBudget - spentBudget;

  const handleSelectOption = (optionKey) => {
    setSelectedOption(CRISIS_OPTIONS[optionKey]);
  };

  const handleSubmitDecision = async () => {
    if (!selectedOption) {
      alert('Please select a crisis management option!');
      return;
    }

    setLoading(true);
    setAlertAnimation(false);

    try {
      // Calculate crisis SI impact
      let crisisSI = 0;
      if (selectedOption.id === 'ignore') {
        // Random penalty between -30 and -10
        crisisSI = Math.floor(Math.random() * (selectedOption.si_max - selectedOption.si_min + 1)) + selectedOption.si_min;
      } else {
        crisisSI = selectedOption.si_impact;
      }

      // Calculate crisis score: cost × weight
      const crisisScore = selectedOption.cost * selectedOption.weight;
      const crisisCost = selectedOption.cost;
      
      // Add crisis score to total score and subtract cost from budget
      addToScore(crisisScore);
      addToSpentBudget(crisisCost);
      const newTotalScore = score + crisisScore;

      // Calculate final scores
      const baseSI = currentSI;
      const finalSI = baseSI + crisisSI;
      const finalBudget = totalBudget - spentBudget - crisisCost;

      // Update leaderboard with final score and crisis decision
      const response = await leaderboardAPI.crisis({
        user_id: user.id,
        mission_id: currentMission.id,
        final_si_score: finalSI,
        score: newTotalScore,
        crisis_decision: selectedOption.id,
        crisis_si_impact: crisisSI,
        crisis_cost: crisisCost
      });

      // Get rank from response
      const rank = response.data?.data?.rank || '?';

      // Determine sustainability rating
      let rating = 'Poor';
      let ratingColor = 'text-red-400';
      if (finalSI >= 80) {
        rating = 'Excellent';
        ratingColor = 'text-green-400';
      } else if (finalSI >= 60) {
        rating = 'Good';
        ratingColor = 'text-blue-400';
      } else if (finalSI >= 40) {
        rating = 'Fair';
        ratingColor = 'text-yellow-400';
      } else if (finalSI >= 20) {
        rating = 'Below Average';
        ratingColor = 'text-orange-400';
      }

      // Mark crisis mission as completed
      setMissionCompleted('crisis', finalSI);

      // Set final results
      setFinalResults({
        decision: selectedOption.title,
        crisisSI: crisisSI,
        baseSI: baseSI,
        finalSI: finalSI,
        crisisCost: crisisCost,
        finalBudget: finalBudget,
        totalScore: newTotalScore,
        rank: rank,
        rating: rating,
        ratingColor: ratingColor,
        componentsCount: selectedComponents.length,
        orbitalPath: selectedOrbitalPath?.name || 'Not selected'
      });

      // Set video based on crisis option selected
      let videoFile = null;
      if (selectedOption.id === 'ignore') {
        videoFile = '/animations/5.mp4';
      } else if (selectedOption.id === 'cleanup') {
        videoFile = '/animations/6.mp4';
      } else if (selectedOption.id === 'treaty') {
        videoFile = '/animations/7.mp4';
      }

      // Show video before results
      if (videoFile) {
        setCurrentVideo(videoFile);
        setShowVideoTransition(true);
      } else {
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error updating crisis score:', error);
      alert('Error processing crisis decision. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoComplete = () => {
    // After video completes, show the results screen
    setShowVideoTransition(false);
    setShowResults(true);
  };

  const handlePlayAgain = () => {
    // Reset missions without logging out
    resetMissions();
    // Redirect to country selection to start fresh
    router.push('/country');
  };

  const handleExit = () => {
    // Show exit video before returning to home
    setShowExitVideo(true);
  };

  const handleExitVideoComplete = () => {
    // After exit video completes, go to home page (user stays logged in)
    router.push('/');
  };

  const canAfford = (cost) => remainingBudget >= cost;

  // Show exit video
  if (showExitVideo) {
    return <VideoTransition videoSrc="/animations/8.mp4" onComplete={handleExitVideoComplete} />;
  }

  // Show video transition based on selected crisis option
  if (showVideoTransition && currentVideo) {
    return <VideoTransition videoSrc={currentVideo} onComplete={handleVideoComplete} />;
  }

  if (showResults && finalResults) {
    return (
      <>
        <div className="min-h-screen pb-8 px-4 bg-gradient-to-b from-space-dark to-black">
          <div className="max-w-4xl mx-auto">
            {/* Results Header */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="text-center mb-8"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-5xl font-bold mb-2 text-gradient">Mission Complete!</h1>
              <p className="text-xl text-gray-300">Crisis managed. Here are your final results.</p>
            </motion.div>

            {/* Crisis Decision Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card mb-6 border-2"
              style={{ backgroundColor: '#0B8FA9', borderColor: '#0B8FA9' }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                {finalResults.crisisSI >= 0 ? '✅' : '❌'} Crisis Decision: {finalResults.decision}
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Base Score</div>
                  <div className="text-2xl font-bold">{finalResults.baseSI.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Crisis Impact</div>
                  <div className={`text-2xl font-bold ${finalResults.crisisSI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {finalResults.crisisSI >= 0 ? '+' : ''}{finalResults.crisisSI}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Final Score</div>
                  <div className={`text-2xl font-bold ${getSIColor(finalResults.finalSI)}`}>
                    {finalResults.finalSI.toFixed(2)}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Final Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid md:grid-cols-2 gap-6 mb-6"
            >
              {/* Budget Summary */}
              <div className="card">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  💰 Budget Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Budget:</span>
                    <span className="font-bold">{formatCurrency(totalBudget)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Components Spent:</span>
                    <span className="font-bold text-orange-400">{formatCurrency(spentBudget)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Crisis Cost:</span>
                    <span className="font-bold text-red-400">{formatCurrency(finalResults.crisisCost)}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2"></div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-300">Remaining Budget:</span>
                    <span className={`font-bold ${finalResults.finalBudget >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(finalResults.finalBudget)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mission Statistics */}
              <div className="card">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  📊 Mission Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Components:</span>
                    <span className="font-bold">{finalResults.componentsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Orbital Path:</span>
                    <span className="font-bold">{finalResults.orbitalPath}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Country:</span>
                    <span className="font-bold">{selectedCountry?.flag} {selectedCountry?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Score:</span>
                    <span className="font-bold text-primary-400">{finalResults.totalScore?.toFixed(2) || 0}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2"></div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-300">Mission Name:</span>
                    <span className="font-bold text-primary-400">{currentMission.name}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sustainability Rating & Leaderboard Position */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="card mb-6 bg-gradient-to-br from-green-900/30 to-blue-900/30 border-2 border-green-500/50"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Sustainability Rating */}
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-2">Space Sustainability Index</div>
                  <div className={`text-6xl font-bold ${finalResults.ratingColor} mb-2`}>
                    {finalResults.finalSI.toFixed(1)}
                  </div>
                  <div className={`text-2xl font-semibold ${finalResults.ratingColor}`}>
                    {finalResults.rating}
                  </div>
                  <div className="mt-4">
                    <div className="progress-bar h-3">
                      <div 
                        className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, finalResults.finalSI))}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Leaderboard Position */}
                <div className="text-center flex flex-col justify-center">
                  <div className="text-sm text-gray-400 mb-2">Leaderboard Position</div>
                  <div className="flex items-center justify-center gap-2">
                    <FaTrophy className="text-yellow-400 text-4xl" />
                    <div className="text-6xl font-bold text-yellow-400">
                      #{finalResults.rank}
                    </div>
                  </div>
                  <div className="text-gray-400 mt-2">
                    {finalResults.rank <= 10 ? '🎉 Top 10! Excellent work!' : 
                     finalResults.rank <= 50 ? '👏 Top 50! Well done!' : 
                     '💪 Keep improving!'}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="grid md:grid-cols-2 gap-4"
            >
              <button
                onClick={handleExit}
                className="btn-secondary flex items-center justify-center gap-2 py-4"
              >
                Exit
              </button>
              
              <button
                onClick={handlePlayAgain}
                className="btn-primary flex items-center justify-center py-4"
              >
                Play Again
              </button>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Cinematic Alert Header */}
          <AnimatePresence>
            {alertAnimation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                className="mb-8"
              >
                <div className="relative overflow-hidden rounded-2xl border-4 border-red-500 bg-gradient-to-br from-red-900/50 to-orange-900/50 p-8">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2 
                    }}
                    className="absolute inset-0 bg-red-500/10"
                  />
                  
                  <div className="relative z-10 text-center">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-8xl mb-4"
                    >
                      <FaExclamationTriangle className="text-red-500 inline" />
                    </motion.div>
                    
                    <h1 className="text-5xl font-bold text-red-400 mb-4">
                      DEBRIS ALERT!
                    </h1>
                    
                    <p className="text-2xl text-gray-200 mb-2">
                      Space debris detected on collision course!
                    </p>
                    
                    <p className="text-xl text-gray-300">
                      Your mission is at risk. Choose your crisis management strategy wisely.
                    </p>

                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="mt-6 text-yellow-400 font-semibold text-lg"
                    >
                      🚨 IMMEDIATE ACTION REQUIRED 🚨
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current Status */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="card">
              <div className="text-sm text-gray-400">Current SI Score</div>
              <div className={`text-3xl font-bold ${getSIColor(currentSI)}`}>
                {currentSI.toFixed(2)}
              </div>
            </div>
            
            <div className="card">
              <div className="text-sm text-gray-400">Remaining Budget</div>
              <div className="text-3xl font-bold text-green-400">
                {formatCurrency(remainingBudget)}
              </div>
            </div>
            
            <div className="card">
              <div className="text-sm text-gray-400">Mission Status</div>
              <div className="text-2xl font-bold text-yellow-400">
                ⚠️ Crisis Mode
              </div>
            </div>
          </div>

          {/* Crisis Options */}
          <h2 className="text-3xl font-bold mb-6 text-center">
            Choose Your Crisis Management Strategy
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {Object.entries(CRISIS_OPTIONS).map(([key, option], index) => {
              const isSelected = selectedOption?.id === option.id;
              const affordable = canAfford(option.cost);
              
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: affordable ? 1.05 : 1 }}
                  onClick={() => affordable && handleSelectOption(key)}
                  className={`card-hover cursor-pointer relative ${
                    isSelected ? 'ring-4 ring-primary-500' : ''
                  } ${!affordable ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSelected && (
                    <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl z-10">
                      ✓
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <div className="text-6xl mb-3">{option.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">{option.title}</h3>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 min-h-[80px]">
                    {option.description}
                  </p>

                  <div className="bg-space-blue/30 p-4 rounded-lg mb-4 text-center">
                    <div className="text-xs text-gray-400 mb-1">Cost</div>
                    <div className={`font-bold text-2xl ${option.cost === 0 ? 'text-green-400' : 'text-primary-400'}`}>
                      {option.cost === 0 ? 'FREE' : formatCurrency(option.cost)}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 italic mb-3">
                    {option.consequences}
                  </div>

                  {!affordable && (
                    <div className="bg-red-900/50 text-red-400 text-sm py-2 px-3 rounded flex items-center gap-2">
                      <FaExclamationTriangle />
                      Insufficient Budget
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: selectedOption ? 1.05 : 1 }}
              whileTap={{ scale: selectedOption ? 0.95 : 1 }}
              onClick={handleSubmitDecision}
              disabled={!selectedOption || loading}
              className={`text-xl font-bold py-4 px-12 rounded-lg transition-all ${
                selectedOption && !loading
                  ? 'text-white cursor-pointer'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
              style={selectedOption && !loading ? { background: 'linear-gradient(90deg, #00B4D8 0%, #165295 100%)' } : {}}
            >
              {loading ? 'Processing Decision...' : 'Execute Crisis Decision'}
            </motion.button>
            
            {selectedOption && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-gray-400"
              >
                You selected: <span className="text-white font-bold">{selectedOption.title}</span>
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
