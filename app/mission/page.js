'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { COMPONENTS } from '@/lib/data';
import { formatCurrency, formatSI, getSIColor, getBudgetColor } from '@/lib/utils';
import { missionAPI, leaderboardAPI } from '@/lib/api';
import { FaTrash, FaRobot, FaTimes, FaTrophy, FaRocket } from 'react-icons/fa';
import ChatBot from '@/components/ChatBot';
import MissionCompleteModal from '@/components/MissionCompleteModal';
import VideoTransition from '@/components/VideoTransition';

export default function MissionPage() {
  const router = useRouter();
  const {
    user,
    selectedCountry,
    selectedPayloadType,
    selectedOrbitalPath,
    orbitalPathPoint,
    collisionPercent,
    totalBudget,
    spentBudget,
    selectedComponents,
    score,
    addComponent,
    removeComponent,
    updateSpentBudget,
    calculateSI,
    setCurrentMission,
    setMissionCompleted
  } = useStore();

  const [activeCategory, setActiveCategory] = useState(null);
  const [showChatBot, setShowChatBot] = useState(false);
  const [missionName, setMissionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionStats, setCompletionStats] = useState(null);
  const [showVideoTransition, setShowVideoTransition] = useState(false);

  useEffect(() => {
    updateSpentBudget();
  }, [selectedComponents, updateSpentBudget]);

  // Redirect if missing required selections
  useEffect(() => {
    if (!user || !selectedCountry || !selectedPayloadType) {
      router.push('/');
    }
  }, [user, selectedCountry, selectedPayloadType, router]);

  // Get components for selected payload type
  const payloadComponents = COMPONENTS[selectedPayloadType?.id] || {};
  const mainCategories = Object.keys(payloadComponents);

  // Set initial active category
  useEffect(() => {
    if (!activeCategory && mainCategories.length > 0) {
      setActiveCategory(mainCategories[0]);
    }
  }, [mainCategories]);

  const remainingBudget = totalBudget - spentBudget;
  const budgetPercentage = (spentBudget / totalBudget) * 100;
  const currentSI = calculateSI();

  const handleVideoComplete = () => {
    // After video completes, redirect to orbital path page
    router.push('/orbital-path');
  };

  // Group options by subcategory
  const groupBySubcategory = (options) => {
    return options.reduce((acc, option) => {
      if (!acc[option.subcategory]) {
        acc[option.subcategory] = [];
      }
      acc[option.subcategory].push(option);
      return acc;
    }, {});
  };

  const handleAddComponent = (component) => {
    if (spentBudget + component.cost > totalBudget) {
      alert('Insufficient budget! Remove some components or choose cheaper alternatives.');
      return;
    }
    addComponent({ ...component, selectedId: Date.now() });
  };

  const handleCompleteMission = async () => {
    if (selectedComponents.length === 0) {
      alert('Please add at least one component to your mission!');
      return;
    }

    if (!missionName.trim()) {
      alert('Please enter a mission name!');
      return;
    }

    setLoading(true);

    try {
      let missionId = 'mission-' + Date.now();

      // Try to save to backend, but continue even if it fails
      try {
        const missionResponse = await missionAPI.create({
          user_id: user.id,
          mission_name: missionName,
          country_code: selectedCountry.code,
          total_budget: spentBudget,
          payload_type: selectedPayloadType.id,
          orbital_path: selectedOrbitalPath?.id || null,
          orbital_latitude: orbitalPathPoint?.lat || null,
          orbital_longitude: orbitalPathPoint?.lng || null,
          collision_risk: collisionPercent || 0
        });

        missionId = missionResponse.data.mission_id;

        // Add all components with weight and subcategory
        for (const component of selectedComponents) {
          await missionAPI.addComponent({
            mission_id: missionId,
            category: component.category,
            component_name: component.name,
            cost: component.cost,
            si_impact: component.si_impact,
            weight: component.weight,
            subcategory: component.subcategory
          });
        }

        // Complete mission with SI score
        await missionAPI.complete({
          mission_id: missionId,
          si_score: currentSI,
          status: 'completed'
        });

        // Add to leaderboard
        await leaderboardAPI.add({
          user_id: user.id,
          mission_id: missionId,
          mission_name: missionName,
          country_code: selectedCountry.code,
          si_score: currentSI,
          score: score,
          total_budget: spentBudget,
          components_count: selectedComponents.length,
          payload_type: selectedPayloadType.id,
          orbital_path: selectedOrbitalPath?.id || null,
          collision_risk: collisionPercent || 0
        });

        console.log('Mission saved to backend successfully!');
      } catch (apiError) {
        console.error('Backend error details:', {
          message: apiError.message,
          response: apiError.response?.data,
          status: apiError.response?.status
        });
        alert('Error saving mission: ' + (apiError.response?.data?.message || apiError.message));
        setLoading(false);
        return; // Don't continue if there's an error
      }

      // Set mission data locally
      setCurrentMission({
        id: missionId,
        name: missionName,
        si_score: currentSI
      });

      // Mark payload mission as completed
      setMissionCompleted('payload', currentSI);

      // Prepare stats for modal
      setCompletionStats({
        missionId,
        missionName,
        componentsCount: selectedComponents.length,
        budgetSpent: formatCurrency(spentBudget),
        score: score,
        siScore: formatSI(currentSI)
      });

      // Show completion modal
      setShowCompletionModal(true);
    } catch (error) {
      console.error('Error completing mission:', error);
      alert('Failed to complete mission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show video transition if Next Mission was clicked
  if (showVideoTransition) {
    return <VideoTransition videoSrc="/animations/4.mp4" onComplete={handleVideoComplete} />;
  }

  // Show loading or null if missing required data
  if (!user || !selectedCountry || !selectedPayloadType) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header with Stats */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold">Mission Builder</h1>
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-sm">Payload Type:</span>
                <div className="bg-primary-600/20 text-primary-400 px-4 py-2 rounded-lg font-semibold">
                  {selectedPayloadType.icon} {selectedPayloadType.name}
                </div>
              </div>
            </div>

          {/* Mission Name Input */}
          <div className="card">
            <label className="block text-sm font-medium mb-2">Mission Name</label>
            <input
              type="text"
              value={missionName}
              onChange={(e) => setMissionName(e.target.value)}
              placeholder="e.g., Artemis LEO Sat-1"
              className="input-field"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Component Selection */}
          <div className="lg:col-span-2">
            {/* Main Category Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {mainCategories.map((categoryName) => {
                const category = payloadComponents[categoryName];
                return (
                  <button
                    key={categoryName}
                    onClick={() => setActiveCategory(categoryName)}
                    className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                      activeCategory === categoryName
                        ? 'bg-primary-600 text-white'
                        : 'bg-space-blue text-gray-400 hover:bg-space-blue/80'
                    }`}
                  >
                    {category.icon} {category.name}
                  </button>
                );
              })}
            </div>

            {/* Component Grid - Grouped by Subcategory */}
            {activeCategory && payloadComponents[activeCategory] && (
              <div className="space-y-8">
                {Object.entries(groupBySubcategory(payloadComponents[activeCategory].options)).map(([subcategory, options]) => (
                  <div key={subcategory}>
                    <h3 className="text-xl font-bold mb-4 text-primary-400">
                      {subcategory}
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {options.map((option) => {
                        const canAfford = spentBudget + option.cost <= totalBudget;
                        
                        return (
                          <motion.div
                            key={option.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`card-hover ${!canAfford ? 'opacity-60' : ''}`}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className="font-bold text-lg">{option.name}</h4>
                                <p className="text-xs text-gray-500 mt-1">{option.subcategory}</p>
                              </div>
                            </div>
                            
                            <div className="bg-space-blue/50 p-3 rounded mb-4">
                              <div className="text-center">
                                <div className="text-xs text-gray-400 mb-1">Cost</div>
                                <div className="text-primary-400 font-bold text-xl">
                                  {formatCurrency(option.cost)}
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleAddComponent(option)}
                              className="w-full btn-primary text-sm py-2"
                              disabled={!canAfford}
                            >
                              {canAfford ? '+ Add to Mission' : '💰 Insufficient Budget'}
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Components Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-4">
              <h2 className="text-xl font-bold mb-4">
                Selected Components ({selectedComponents.length})
              </h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {selectedComponents.map((component) => (
                    <motion.div
                      key={component.selectedId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-space-blue/50 p-3 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{component.name}</div>
                          <div className="text-xs text-gray-400">{component.subcategory}</div>
                        </div>
                        <button
                          onClick={() => removeComponent(component.selectedId)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-primary-400">{formatCurrency(component.cost)}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {selectedComponents.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  <div className="text-4xl mb-2">📦</div>
                  <p className="text-sm">No components selected yet</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-700">
                <button
                  onClick={handleCompleteMission}
                  disabled={loading || selectedComponents.length === 0}
                  className="w-full btn-primary"
                >
                  {loading ? 'Launching...' : 'Complete Mission 🚀'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowChatBot(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-2xl hover:shadow-primary-500/50 transition-shadow z-40"
        >
          <FaRobot />
        </motion.button>

        {/* ChatBot Modal */}
        {showChatBot && (
          <ChatBot onClose={() => setShowChatBot(false)} />
        )}

        {/* Mission Completion Modal */}
        {completionStats && (
          <MissionCompleteModal
            isOpen={showCompletionModal}
            title="🎉 Payload Mission Complete!"
            stats={[
              { label: 'Mission Name', value: completionStats.missionName },
              { label: 'Components Added', value: completionStats.componentsCount },
              { label: 'Budget Spent', value: completionStats.budgetSpent },
              { label: 'Score', value: completionStats.score },
              { label: 'SI Score', value: completionStats.siScore }
            ]}
            buttons={[
              {
                label: 'View Leaderboard',
                icon: <FaTrophy />,
                primary: false,
                onClick: () => {
                  setShowCompletionModal(false);
                  router.push('/leaderboard');
                }
              },
              {
                label: 'Next Mission',
                icon: <FaRocket />,
                primary: true,
                onClick: () => {
                  setShowCompletionModal(false);
                  setShowVideoTransition(true);
                }
              }
            ]}
            onClose={() => setShowCompletionModal(false)}
          />
        )}
      </div>
    </div>
    </>
  );
}
