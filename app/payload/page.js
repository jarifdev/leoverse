'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { PAYLOAD_TYPES } from '@/lib/data';
import VideoTransition from '@/components/VideoTransition';

export default function PayloadPage() {
  const router = useRouter();
  const { user, selectedCountry, selectedPayloadType, setSelectedPayloadType, updateProgress } = useStore();
  const [showVideoTransition, setShowVideoTransition] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleSelectPayload = (payloadType) => {
    setSelectedPayloadType(payloadType);
    updateProgress({
      current_screen: 'mission',
      completed_screens: ['landing', 'country', 'payload'],
      decisions_made: {
        ...useStore.getState().progress.decisions_made,
        selected_payload: payloadType.id
      }
    });
    
    // Play video based on payload type
    if (payloadType.id === 'commercial') {
      setSelectedVideo('/animations/2.mp4');
      setShowVideoTransition(true);
    } else if (payloadType.id === 'infrastructure') {
      setSelectedVideo('/animations/3.mp4');
      setShowVideoTransition(true);
    } else {
      // If no video for this payload type, go directly to mission
      router.push('/mission');
    }
  };

  const handleVideoComplete = () => {
    // After video completes, redirect to mission page
    router.push('/mission');
  };

  if (!user) {
    router.push('/');
    return null;
  }

  if (!selectedCountry) {
    router.push('/country');
    return null;
  }

  // Show video transition if payload was selected
  if (showVideoTransition && selectedVideo) {
    return <VideoTransition videoSrc={selectedVideo} onComplete={handleVideoComplete} />;
  }

  return (
    <>
      <div className="min-h-screen pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="section-title mb-4">Select Payload Type</h1>
            <p className="text-xl text-gray-300 mb-4">
              Choose the focus of your space mission for {selectedCountry.flag} {selectedCountry.name}
            </p>
            <div className="inline-block px-6 py-3 bg-space-blue/50 rounded-lg">
              <span className="text-gray-400">Available Budget:</span>
              <span className="text-3xl font-bold text-primary-400 ml-3">
                ${selectedCountry.budget.toLocaleString()}
              </span>
            </div>
          </motion.div>

          {/* Payload Type Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {Object.values(PAYLOAD_TYPES).map((payloadType, index) => (
              <motion.div
                key={payloadType.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                onClick={() => handleSelectPayload(payloadType)}
                className="card-hover cursor-pointer group relative overflow-hidden"
              >
                {/* Selection Indicator */}
                {selectedPayloadType?.id === payloadType.id && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">✓</span>
                  </div>
                )}

                {/* Icon */}
                <div className="text-center mb-6">
                  <div className="text-8xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {payloadType.icon}
                  </div>
                  <h2 className="text-3xl font-bold mb-3">{payloadType.name}</h2>
                  <p className="text-lg text-gray-300">{payloadType.description}</p>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  {payloadType.id === 'commercial' && (
                    <div className="bg-space-blue/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-primary-400 mb-2">💼 Commercial Focus</h3>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Telecom & Connectivity Solutions</li>
                        <li>• Space Tourism Ventures</li>
                        <li>• Broadcasting & Media Services</li>
                        <li>• Revenue-generating missions</li>
                      </ul>
                    </div>
                  )}

                  {payloadType.id === 'infrastructure' && (
                    <div className="bg-space-blue/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-400 mb-2">🏗️ Infrastructure Focus</h3>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Orbital Manufacturing Facilities</li>
                        <li>• Space Debris Tracking Systems</li>
                        <li>• Refueling & Service Depots</li>
                        <li>• Long-term sustainability projects</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 card max-w-4xl mx-auto"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-2xl mr-3">💡</span>
              Understanding Payload Types
            </h3>
            <p className="text-gray-300 mb-4">
              Your payload type determines the categories of components available for your mission. 
              Each type offers unique opportunities and challenges for achieving sustainability.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gradient-to-br from-primary-600/20 to-primary-400/10 p-4 rounded-lg border border-primary-500/30">
                <strong className="text-primary-400 text-base">Commercial Missions:</strong>
                <p className="text-gray-300 mt-2">
                  Focus on immediate returns and customer satisfaction. Balance profitability 
                  with environmental responsibility to maximize your Sustainability Index.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-400/10 p-4 rounded-lg border border-purple-500/30">
                <strong className="text-purple-400 text-base">Infrastructure Missions:</strong>
                <p className="text-gray-300 mt-2">
                  Invest in the future of space exploration. Build essential services that 
                  support long-term orbital operations and earn high sustainability scores.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/country')}
              className="btn-outline"
            >
              ← Back to Country Selection
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
