'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { ORBITAL_PATHS } from '@/lib/data';
import { formatCurrency, getSIColor } from '@/lib/utils';
import { leaderboardAPI } from '@/lib/api';
import MissionCompleteModal from '@/components/MissionCompleteModal';
import { FaArrowLeft, FaArrowRight, FaMapMarkerAlt, FaExclamationTriangle, FaSyncAlt, FaRocket } from 'react-icons/fa';

export default function OrbitalPathPage() {
  const router = useRouter();
  const {
    user,
    selectedCountry,
    selectedPayloadType,
    selectedOrbitalPath,
    orbitalPathPoint,
    collisionPercent,
    currentMission,
    missionStatus,
    score,
    addToScore,
    addToSpentBudget,
    setSelectedOrbitalPath,
    setOrbitalPathPoint,
    setCollisionPercent,
    setMissionCompleted,
    calculateSI,
    totalBudget,
    spentBudget
  } = useStore();

  const [selectedOrbit, setSelectedOrbit] = useState(selectedOrbitalPath || null);
  const [mapPoint, setMapPoint] = useState(orbitalPathPoint || null);
  const [localCollision, setLocalCollision] = useState(collisionPercent || 35);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionStats, setCompletionStats] = useState(null);

  // Redirect if user not logged in
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  // ROUTE GUARD: Check if payload mission is completed
  useEffect(() => {
    if (user && !missionStatus.payload.completed) {
      alert('⚠️ Please complete the Payload Mission first!');
      router.push('/mission');
    }
  }, [user, missionStatus, router]);

  if (!user || !missionStatus.payload.completed) {
    return null;
  }

  const handleOrbitSelect = (orbitKey) => {
    const orbit = ORBITAL_PATHS[orbitKey];
    setSelectedOrbit(orbit);
  };

  const handleMapClick = (lat, lng) => {
    const point = { lat, lng };
    setMapPoint(point);
    
    // Calculate collision risk based on latitude (simplified)
    // Higher collision risk near equator (more satellites), lower at poles
    const latAbs = Math.abs(lat);
    let risk = 0;
    
    if (latAbs < 30) {
      // Equatorial region - highest traffic
      risk = 40 + Math.random() * 20; // 40-60%
    } else if (latAbs < 60) {
      // Mid-latitudes - moderate traffic
      risk = 20 + Math.random() * 20; // 20-40%
    } else {
      // Polar regions - lowest traffic
      risk = 10 + Math.random() * 15; // 10-25%
    }
    
    setLocalCollision(Math.round(risk));
  };

  const handleUpdateScore = async () => {
    if (!selectedOrbit) {
      alert('Please select an orbital path!');
      return;
    }

    // Check if user has a completed mission
    if (!currentMission || !currentMission.id) {
      alert('No completed mission found! Please complete a mission first.');
      router.push('/mission');
      return;
    }

    // Save selections to store
    setSelectedOrbitalPath(selectedOrbit);
    setOrbitalPathPoint(mapPoint);
    setCollisionPercent(localCollision);

    // Calculate orbital score: cost × weight
    const orbitalScore = selectedOrbit.cost * selectedOrbit.weight;
    
    // Add orbital score to total score and deduct cost from budget
    addToScore(orbitalScore);
    addToSpentBudget(selectedOrbit.cost);
    const newTotalScore = score + orbitalScore;

    // Calculate new SI score with orbital impact
    const currentSI = calculateSI();

    try {
      // Update leaderboard with new score
      const response = await leaderboardAPI.update({
        user_id: user.id,
        mission_id: currentMission.id,
        si_score: currentSI,
        score: newTotalScore,
        orbital_path: selectedOrbit.id,
        collision_risk: localCollision
      });

      if (response.data.success) {
        // Mark orbital mission as completed
        setMissionCompleted('orbital', currentSI);
        
        // Calculate SI impact
        const previousSI = currentMission.si_score || 0;
        const siImpact = currentSI - previousSI;
        
        // Prepare completion stats
        setCompletionStats({
          orbitalPath: selectedOrbit.name,
          collisionRisk: `${localCollision}%`,
          score: newTotalScore,
          siImpact: siImpact >= 0 ? `+${siImpact.toFixed(2)}` : siImpact.toFixed(2),
          newSIScore: currentSI.toFixed(2)
        });
        
        // Show completion modal
        setShowCompletionModal(true);
      }
    } catch (error) {
      console.error('Error updating score:', error);
      
      // Show user-friendly error message
      if (error.response?.status === 404) {
        alert('❌ Mission not found in leaderboard!\n\nPlease complete a mission first, then return here to optimize your score.');
        router.push('/mission');
      } else {
        alert(`❌ Error updating score: ${error.response?.data?.message || error.message}\n\nPlease try again or contact support.`);
      }
    }
  };

  const handleBack = () => {
    router.push('/leaderboard');
  };

  // Calculate score impact
  const getScoreImpact = (orbit) => {
    if (!orbit) return 0;
    const baseImpact = orbit.si_impact;
    const collisionImpact = (localCollision / 100) * orbit.collisionMultiplier;
    return baseImpact + collisionImpact;
  };

  return (
    <>
      <div className="min-h-screen pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <FaArrowLeft /> Back to Leaderboard
            </button>

            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold">Orbital Path Selection</h1>
            </div>

            <div className="bg-blue-600/20 border border-blue-600/30 p-4 rounded-lg mb-4">
              <p className="text-blue-300 text-lg">
                <FaSyncAlt className="inline mr-2" />
                Choose your orbital path to <strong>update your existing mission score</strong>. Different orbits affect sustainability and collision risks.
              </p>
            </div>

            <p className="text-gray-400 text-lg">
              Select LEO, MEO, or GEO orbit and adjust collision risk. Your SI score will be recalculated and updated on the leaderboard.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Orbital Path Options */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-6">Select Orbital Path</h2>
              
              {Object.keys(ORBITAL_PATHS).map((orbitKey) => {
                const orbit = ORBITAL_PATHS[orbitKey];
                const isSelected = selectedOrbit?.id === orbit.id;

                return (
                  <motion.div
                    key={orbit.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOrbitSelect(orbitKey)}
                    className={`card-hover cursor-pointer relative overflow-hidden ${
                      isSelected ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Selected
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      <div className="text-5xl">{orbit.icon}</div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{orbit.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">{orbit.description}</p>

                        {/* Cost Display */}
                        <div className="bg-space-blue/50 p-3 rounded mb-4 inline-block">
                          <div className="text-xs text-gray-400 mb-1">Cost</div>
                          <div className="text-primary-400 font-bold text-xl">
                            {formatCurrency(orbit.cost)}
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          <ul className="space-y-1">
                            {orbit.characteristics.map((char, idx) => (
                              <li key={idx}>• {char}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Submit Button */}
              {selectedOrbit && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <button
                    onClick={handleUpdateScore}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg"
                  >
                    <FaSyncAlt />
                    Continue with {selectedOrbit.name}
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && completionStats && (
        <MissionCompleteModal
          isOpen={showCompletionModal}
          title="🛰️ Orbital Mission Complete!"
          stats={[
            { label: 'Orbital Path', value: completionStats.orbitalPath },
            { label: 'Collision Risk', value: completionStats.collisionRisk },
            { label: 'Score', value: completionStats.score },
            { label: 'SI Impact', value: completionStats.siImpact },
            { label: 'New SI Score', value: completionStats.newSIScore }
          ]}
          buttons={[
            {
              label: 'Next Mission',
              icon: FaRocket,
              primary: true,
              onClick: () => {
                setShowCompletionModal(false);
                router.push('/crisis');
              }
            }
          ]}
          onClose={() => setShowCompletionModal(false)}
        />
      )}
    </>
  );
}
