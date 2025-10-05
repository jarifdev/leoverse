'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { leaderboardAPI } from '@/lib/api';
import { FaGlobeAmericas, FaMapMarkerAlt, FaUsers, FaTrophy, FaTimes, FaRocket, FaSatellite } from 'react-icons/fa';
import 'ol/ol.css';

export default function MapPage() {
  const router = useRouter();
  const { user } = useStore();
  const [countryData, setCountryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapViewKey, setMapViewKey] = useState(0); // Force re-render on map move

  // Country achievements data
  const countryAchievements = {
    US: {
      name: 'United States',
      flag: '🇺🇸',
      color: '#10B981',
      position: { x: 20, y: 40 },
      achievements: [
        { 
          icon: '🌙',
          title: 'Apollo Missions (NASA)',
          description: 'First humans on the Moon (1969)'
        },
        { 
          icon: '🛰️',
          title: 'International Space Station (ISS)',
          description: 'Major partner in design & operations'
        },
        { 
          icon: '🚀',
          title: 'Space Shuttle Program',
          description: 'Reusable spacecraft enabling 135 missions'
        },
        { 
          icon: '💼',
          title: 'Commercial Space (SpaceX, Blue Origin)',
          description: 'First private reusable rockets, human commercial flights'
        },
        { 
          icon: '🌕',
          title: 'Artemis Program (Ongoing)',
          description: 'Return to the Moon with international partners'
        }
      ],
      missions: [
        { name: 'Artemis I (2022)', desc: 'First uncrewed Moon test mission' },
        { name: 'SpaceX Crew Dragon flights', desc: 'Active commercial human transport' },
        { name: 'Mars Rovers (Perseverance, Curiosity)', desc: 'Exploration leadership' }
      ]
    },
    OM: {
      name: 'Oman',
      flag: '🇴🇲',
      color: '#10B981',
      position: { x: 62, y: 48 },
      achievements: [
        { 
          icon: '🛰️',
          title: 'Oman National Satellite (OMNISAT plans)',
          description: 'Investments in Earth observation & telecom'
        },
        { 
          icon: '🔭',
          title: 'Oman Astronomical Society',
          description: 'Promoting astronomy & public education'
        },
        { 
          icon: '🤝',
          title: 'Part of GCC Space Initiatives',
          description: 'Collaborating on Earth observation, sustainability, oil/gas monitoring'
        },
        { 
          icon: '🎯',
          title: 'Oman Vision 2040',
          description: 'Roadmap includes space, renewable energy, and tech'
        }
      ],
      missions: [
        { name: 'EO Satellite Projects', desc: 'Data for agriculture, ports, and environment' },
        { name: 'Space Education Programs', desc: 'University & school-level initiatives tied to GCC' },
        { name: 'Partnership with ESA & GCC', desc: 'Joint Earth Observation collaboration' }
      ]
    }
  };

  // Country geographic bounds and centers (lon, lat) in EPSG:4326
  const countryInfo = {
    US: { 
      name: 'United States', 
      flag: '🇺🇸', 
      color: '#3B82F6',
      center: [-95, 37],
      bounds: { minLon: -125, maxLon: -65, minLat: 25, maxLat: 49 }
    },
    JP: { 
      name: 'Japan', 
      flag: '🇯🇵', 
      color: '#EF4444',
      center: [138, 36],
      bounds: { minLon: 129, maxLon: 146, minLat: 30, maxLat: 45 }
    },
    IN: { 
      name: 'India', 
      flag: '🇮🇳', 
      color: '#F97316',
      center: [78, 20],
      bounds: { minLon: 68, maxLon: 97, minLat: 8, maxLat: 35 }
    },
    OM: { 
      name: 'Oman', 
      flag: '🇴🇲', 
      color: '#F97316',
      center: [56, 21],
      bounds: { minLon: 52, maxLon: 60, minLat: 16, maxLat: 26 }
    },
    AE: { 
      name: 'UAE', 
      flag: '🇦🇪', 
      color: '#8B5CF6',
      center: [54, 24],
      bounds: { minLon: 51, maxLon: 56, minLat: 22, maxLat: 26 }
    }
  };

  // Store player pins with geographic coordinates
  const [playerPins, setPlayerPins] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    fetchMapData();
  }, [user, router]);

  // Initialize OpenLayers map with NASA GIBS imagery
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import OpenLayers to avoid SSR issues
    import('ol/Map').then(({ default: Map }) => {
      import('ol/View').then(({ default: View }) => {
        import('ol/layer/Tile').then(({ default: TileLayer }) => {
          import('ol/source/WMTS').then(({ default: WMTS }) => {
            import('ol/tilegrid/WMTS').then(({ default: WMTSTileGrid }) => {
              import('ol/proj').then((proj) => {

                // Create WMTS source for NASA GIBS
                const source = new WMTS({
                  url: 'https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?TIME=2025-10-04',
                  layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
                  format: 'image/jpeg',
                  matrixSet: '250m',
                  tileGrid: new WMTSTileGrid({
                    origin: [-180, 90],
                    resolutions: [
                      0.5625, 0.28125, 0.140625, 0.0703125, 0.03515625,
                      0.017578125, 0.0087890625, 0.00439453125, 0.002197265625
                    ],
                    matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                    tileSize: 512
                  })
                });

                const layer = new TileLayer({
                  source: source,
                  extent: [-180, -90, 180, 90]
                });

                const map = new Map({
                  target: mapRef.current,
                  view: new View({
                    projection: proj.get('EPSG:4326'),
                    extent: [-180, -90, 180, 90],
                    center: [0, 20],
                    zoom: 2,
                    minZoom: 2,
                    maxZoom: 2,  // Lock zoom at level 2
                    enableRotation: false
                  }),
                  layers: [layer],
                  interactions: []  // Disable all interactions (no zoom, no pan)
                });

                mapInstanceRef.current = map;

                // Initial render trigger (no need for moveend since map is static)
                setTimeout(() => setMapViewKey(1), 500);
              });
            });
          });
        });
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(null);
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Generate random position within country bounds
  const generateRandomPosition = (bounds) => {
    const lon = bounds.minLon + Math.random() * (bounds.maxLon - bounds.minLon);
    const lat = bounds.minLat + Math.random() * (bounds.maxLat - bounds.minLat);
    return [lon, lat];
  };

  const fetchMapData = async () => {
    try {
      setLoading(true);
      const response = await leaderboardAPI.get({ limit: 1000 });
      
      if (response.data.success) {
        const leaderboard = response.data.leaderboard || [];
        const countryCounts = {};
        const pins = [];
        
        leaderboard.forEach(entry => {
          const countryCode = entry.country_code || entry.country || 'US';
          const country = countryInfo[countryCode];
          
          if (!country) return; // Skip unknown countries
          
          if (!countryCounts[countryCode]) {
            countryCounts[countryCode] = {
              code: countryCode,
              count: 0,
              missions: [],
              topScore: 0,
              ...country
            };
          }
          
          countryCounts[countryCode].count++;
          countryCounts[countryCode].missions.push(entry);
          if (entry.si_score > countryCounts[countryCode].topScore) {
            countryCounts[countryCode].topScore = entry.si_score;
          }
          
          // Generate a scattered pin for each player
          pins.push({
            id: entry.id || pins.length,
            countryCode,
            username: entry.username || 'Player',
            siScore: entry.si_score || 0,
            position: generateRandomPosition(country.bounds),
            color: country.color,
            flag: country.flag
          });
        });

        setCountryData(Object.values(countryCounts));
        setPlayerPins(pins);
      }
    } catch (error) {
      console.error('Error fetching map data:', error);
      // Fallback data with scattered pins
      const fallbackData = [
        { code: 'US', count: 15, topScore: 87.5, ...countryInfo.US },
        { code: 'JP', count: 8, topScore: 92.1, ...countryInfo.JP },
        { code: 'IN', count: 12, topScore: 85.3, ...countryInfo.IN },
        { code: 'OM', count: 3, topScore: 78.9, ...countryInfo.OM },
        { code: 'AE', count: 5, topScore: 89.7, ...countryInfo.AE }
      ];
      
      setCountryData(fallbackData);
      
      // Generate fallback pins
      const fallbackPins = [];
      fallbackData.forEach(country => {
        for (let i = 0; i < country.count; i++) {
          fallbackPins.push({
            id: `${country.code}-${i}`,
            countryCode: country.code,
            username: `Player ${i + 1}`,
            siScore: 70 + Math.random() * 30,
            position: generateRandomPosition(country.bounds),
            color: country.color,
            flag: country.flag
          });
        }
      });
      setPlayerPins(fallbackPins);
    } finally {
      setLoading(false);
    }
  };

  const handlePinClick = (country) => {
    setSelectedCountry(selectedCountry?.code === country.code ? null : country);
  };

  const handleAchievementClick = (countryCode) => {
    setSelectedAchievement(countryAchievements[countryCode]);
    setShowAchievements(true);
  };

  const handlePinHover = (pin) => {
    // Optional: Add hover tooltips later
  };

  // Convert geographic coordinates to pixel coordinates
  const getPixelPosition = (lonLat) => {
    if (!mapInstanceRef.current) return null;
    try {
      const pixel = mapInstanceRef.current.getPixelFromCoordinate(lonLat);
      return pixel ? { x: pixel[0], y: pixel[1] } : null;
    } catch (error) {
      return null;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <FaGlobeAmericas className="text-4xl text-blue-400" />
            <h1 className="text-4xl font-bold">Global Mission Map</h1>
          </div>
          <p className="text-xl text-gray-300">
            Explore space achievements from USA and Oman
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-2xl text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Active Countries</div>
                <div className="text-2xl font-bold">{countryData.length}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FaUsers className="text-2xl text-green-400" />
              <div>
                <div className="text-sm text-gray-400">Total Missions</div>
                <div className="text-2xl font-bold">
                  {countryData.reduce((sum, c) => sum + c.count, 0)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-600/20 border border-purple-600/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FaTrophy className="text-2xl text-purple-400" />
              <div>
                <div className="text-sm text-gray-400">Highest SI Score</div>
                <div className="text-2xl font-bold">
                  {Math.max(...countryData.map(c => c.topScore || 0), 0).toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* OpenLayers Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full h-[700px] rounded-lg overflow-hidden border-2 border-blue-500/30 shadow-2xl"
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-space-dark z-10">
              <div className="text-center">
                <div className="animate-spin text-6xl mb-4">🌍</div>
                <p className="text-gray-400">Loading NASA GIBS Satellite Imagery...</p>
              </div>
            </div>
          )}
          
          {/* OpenLayers Map */}
          <div 
            ref={mapRef} 
            className="absolute inset-0 w-full h-full"
            style={{ background: '#000' }}
          />

          {/* Overlay Layer for Glowing Countries and Pins */}
          <div key={mapViewKey} className="absolute inset-0 pointer-events-none">
            {/* USA Glowing Region & Achievement Button */}
            {(() => {
              const usPixel = getPixelPosition(countryInfo.US.center);
              if (!usPixel) return null;
              return (
                <>
                  <motion.div
                    className="absolute"
                    style={{
                      left: usPixel.x,
                      top: usPixel.y,
                      width: '200px',
                      height: '150px',
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                      boxShadow: [
                        '0 0 60px 30px rgba(16, 185, 129, 0.4)',
                        '0 0 100px 50px rgba(16, 185, 129, 0.6)',
                        '0 0 60px 30px rgba(16, 185, 129, 0.4)',
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div 
                      className="w-full h-full rounded-full" 
                      style={{
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
                        filter: 'blur(25px)'
                      }}
                    />
                  </motion.div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAchievementClick('US')}
                    className="absolute pointer-events-auto"
                    style={{
                      left: usPixel.x,
                      top: usPixel.y,
                      transform: 'translate(-50%, -50%)',
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="relative">
                      <motion.div
                        className="w-16 h-16 rounded-full bg-green-500/90 backdrop-blur-sm border-4 border-green-300 flex items-center justify-center text-3xl cursor-pointer shadow-lg"
                        animate={{
                          boxShadow: [
                            '0 0 20px 5px rgba(16, 185, 129, 0.6)',
                            '0 0 40px 10px rgba(16, 185, 129, 0.9)',
                            '0 0 20px 5px rgba(16, 185, 129, 0.6)',
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        🇺🇸
                      </motion.div>
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-black/90 px-2 py-1 rounded">
                        USA Achievements
                      </div>
                    </div>
                  </motion.button>
                </>
              );
            })()}

            {/* Oman Glowing Region & Achievement Button */}
            {(() => {
              const omPixel = getPixelPosition(countryInfo.OM.center);
              if (!omPixel) return null;
              return (
                <>
                  <motion.div
                    className="absolute"
                    style={{
                      left: omPixel.x,
                      top: omPixel.y,
                      width: '120px',
                      height: '100px',
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                      boxShadow: [
                        '0 0 60px 30px rgba(16, 185, 129, 0.4)',
                        '0 0 100px 50px rgba(16, 185, 129, 0.6)',
                        '0 0 60px 30px rgba(16, 185, 129, 0.4)',
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5
                    }}
                  >
                    <div 
                      className="w-full h-full rounded-full" 
                      style={{
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
                        filter: 'blur(20px)'
                      }}
                    />
                  </motion.div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAchievementClick('OM')}
                    className="absolute pointer-events-auto"
                    style={{
                      left: omPixel.x,
                      top: omPixel.y,
                      transform: 'translate(-50%, -50%)',
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="relative">
                      <motion.div
                        className="w-16 h-16 rounded-full bg-green-500/90 backdrop-blur-sm border-4 border-green-300 flex items-center justify-center text-3xl cursor-pointer shadow-lg"
                        animate={{
                          boxShadow: [
                            '0 0 20px 5px rgba(16, 185, 129, 0.6)',
                            '0 0 40px 10px rgba(16, 185, 129, 0.9)',
                            '0 0 20px 5px rgba(16, 185, 129, 0.6)',
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1
                        }}
                      >
                        🇴🇲
                      </motion.div>
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-black/90 px-2 py-1 rounded">
                        Oman Achievements
                      </div>
                    </div>
                  </motion.button>
                </>
              );
            })()}

            {/* Player pins removed - only USA & Oman achievement buttons shown */}
          </div>
        </motion.div>

        {/* Achievement Modal */}
        <AnimatePresence>
          {showAchievements && selectedAchievement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAchievements(false)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-space-dark to-space-blue max-w-3xl w-full max-h-[80vh] overflow-y-auto rounded-2xl border-2 border-green-500/50 shadow-2xl"
              >
                {/* Header */}
                <div className="sticky top-0 bg-space-dark/95 backdrop-blur-sm border-b border-green-500/30 p-6 flex items-center justify-between z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 border-3 border-green-500 flex items-center justify-center text-4xl">
                      {selectedAchievement.flag}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{selectedAchievement.name}</h2>
                      <p className="text-green-400">Space Achievements & Missions</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAchievements(false)}
                    className="text-gray-400 hover:text-white text-3xl transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Achievements Section */}
                <div className="p-6">
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <FaTrophy className="text-2xl text-yellow-400" />
                      <h3 className="text-2xl font-bold">Major Achievements</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {selectedAchievement.achievements.map((achievement, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-green-600/10 border border-green-600/30 rounded-lg p-4 hover:bg-green-600/20 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-3xl flex-shrink-0">{achievement.icon}</div>
                            <div>
                              <h4 className="text-lg font-semibold text-white mb-1">{achievement.title}</h4>
                              <p className="text-gray-300">{achievement.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Missions Highlight Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <FaRocket className="text-2xl text-blue-400" />
                      <h3 className="text-2xl font-bold">Mission Highlights</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedAchievement.missions.map((mission, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 hover:bg-blue-600/20 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <FaSatellite className="text-xl text-blue-400 flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="text-base font-semibold text-white">{mission.name}</h4>
                              <p className="text-sm text-gray-300">{mission.desc}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-space-dark/95 backdrop-blur-sm border-t border-green-500/30 p-4">
                  <button
                    onClick={() => setShowAchievements(false)}
                    className="w-full btn-primary"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Country Details Panel (for other countries) */}
        {selectedCountry && selectedCountry.code !== 'US' && selectedCountry.code !== 'OM' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 glass-card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full border-4 flex items-center justify-center text-3xl"
                  style={{
                    borderColor: selectedCountry.color,
                    backgroundColor: 'rgba(0,0,0,0.5)'
                  }}
                >
                  {selectedCountry.flag}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedCountry.name}</h3>
                  <p className="text-gray-400">Country Code: {selectedCountry.code}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCountry(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="p-4 rounded-lg border-2"
                style={{
                  borderColor: selectedCountry.color,
                  backgroundColor: `${selectedCountry.color}20`
                }}
              >
                <div className="text-sm text-gray-400 mb-1">Total Missions</div>
                <div className="text-3xl font-bold" style={{ color: selectedCountry.color }}>
                  {selectedCountry.count}
                </div>
              </div>

              <div
                className="p-4 rounded-lg border-2"
                style={{
                  borderColor: selectedCountry.color,
                  backgroundColor: `${selectedCountry.color}20`
                }}
              >
                <div className="text-sm text-gray-400 mb-1">Top SI Score</div>
                <div className="text-3xl font-bold" style={{ color: selectedCountry.color }}>
                  {selectedCountry.topScore.toFixed(1)}
                </div>
              </div>

              <div
                className="p-4 rounded-lg border-2"
                style={{
                  borderColor: selectedCountry.color,
                  backgroundColor: `${selectedCountry.color}20`
                }}
              >
                <div className="text-sm text-gray-400 mb-1">Global Rank</div>
                <div className="text-3xl font-bold" style={{ color: selectedCountry.color }}>
                  #{countryData.findIndex(c => c.code === selectedCountry.code) + 1}
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push(`/leaderboard?country=${selectedCountry.code}`)}
              className="mt-4 w-full btn-primary"
            >
              View {selectedCountry.name} Leaderboard
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
