// Country data with GDP-based budgets and characteristics
export const COUNTRIES = {
  OM: {
    code: 'OM',
    name: 'Oman',
    flag: '🇴🇲',
    budget: 5000,
    gdpPerCapita: 19000,
    challenges: [
      'Limited space infrastructure',
      'Developing aerospace sector',
      'Need for regional cooperation'
    ],
    strengths: [
      'Strategic geographic location',
      'Growing tech investment',
      'Strong government support'
    ]
  },
  US: {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    budget: 20000,
    gdpPerCapita: 70000,
    challenges: [
      'High operational costs',
      'Complex regulatory environment'
    ],
    strengths: [
      'Advanced technology',
      'Established space infrastructure',
      'Large aerospace industry'
    ]
  },
  IN: {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    budget: 8000,
    gdpPerCapita: 2500,
    challenges: [
      'Budget constraints',
      'Growing but competitive market'
    ],
    strengths: [
      'Cost-effective innovation',
      'Strong STEM education',
      'Proven launch capabilities'
    ]
  },
  JP: {
    code: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    budget: 15000,
    gdpPerCapita: 42000,
    challenges: [
      'Earthquake-prone launch sites',
      'Limited domestic resources'
    ],
    strengths: [
      'Advanced robotics',
      'Precision manufacturing',
      'Strong R&D infrastructure'
    ]
  },
  AE: {
    code: 'AE',
    name: 'UAE',
    flag: '🇦🇪',
    budget: 12000,
    gdpPerCapita: 44000,
    challenges: [
      'New to space sector',
      'Limited heritage'
    ],
    strengths: [
      'Significant investment',
      'Modern facilities',
      'Ambitious space program'
    ]
  }
};

// Payload types
export const PAYLOAD_TYPES = {
  commercial: {
    id: 'commercial',
    name: 'Commercial Payload',
    icon: '💼',
    description: 'Revenue-generating commercial space missions'
  },
  infrastructure: {
    id: 'infrastructure',
    name: 'Infrastructure Payload',
    icon: '🏗️',
    description: 'Long-term space infrastructure development'
  }
};

// Orbital path options with collision risk and scoring
export const ORBITAL_PATHS = {
  LEO: {
    id: 'LEO',
    name: 'Low Earth Orbit (LEO)',
    icon: '🌍',
    altitude: '160-2,000 km',
    description: 'Affordable and close to Earth. Crowded highways mean higher collision risks.',
    cost: 100,
    weight: 1,
    si_impact: -5,
    collisionMultiplier: -1.0,
    characteristics: [
      'Altitude: 160-2,000 km',
      'Orbital period: ~90 minutes',
      'High collision risk',
      'Lower launch costs',
      'Ideal for Earth observation'
    ]
  },
  MEO: {
    id: 'MEO',
    name: 'Medium Earth Orbit (MEO)',
    icon: '🛰️',
    altitude: '2,000-35,786 km',
    description: 'Balanced distance and cost. Safer than LEO, but fewer commercial perks.',
    cost: 150,
    weight: 2,
    si_impact: -2,
    collisionMultiplier: -0.5,
    characteristics: [
      'Altitude: 2,000-35,786 km',
      'Orbital period: 2-12 hours',
      'Moderate collision risk',
      'Good for navigation (GPS)',
      'Balanced cost/benefit'
    ]
  },
  GEO: {
    id: 'GEO',
    name: 'Geostationary Orbit (GEO)',
    icon: '📡',
    altitude: '35,786 km',
    description: 'Expensive but stable. Communications and broadcasting thrive here with lower risks.',
    cost: 200,
    weight: 3,
    si_impact: 5,
    collisionMultiplier: -0.2,
    characteristics: [
      'Altitude: 35,786 km (fixed)',
      'Orbital period: 24 hours',
      'Low collision risk',
      'Highest launch costs',
      'Perfect for communications'
    ]
  }
};

// Component library organized by payload type
export const COMPONENTS = {
  commercial: {
    'Telecom Constellation': {
      name: 'Telecom Constellation',
      icon: '📡',
      description: 'Satellite clusters powering global internet. Profitable but adds to orbital crowding.',
      cost: 300,
      weight: 1.5,
      options: [
        {
          id: 'telecom_broadband_highspeed',
          name: 'High-Speed Priority',
          description: 'Top-tier internet access focused on profit and performance at any cost.',
          subcategory: 'Broadband Network',
          cost: 200,
          weight: 1.4,
          si_impact: -5,
          category: 'commercial'
        },
        {
          id: 'telecom_broadband_balanced',
          name: 'Balanced Services',
          description: 'A mixed approach offering steady, reliable growth across global markets.',
          subcategory: 'Broadband Network',
          cost: 150,
          weight: 1.2,
          si_impact: 0,
          category: 'commercial'
        },
        {
          id: 'telecom_broadband_community',
          name: 'Community Discount Model',
          description: 'Affordable services prioritizing accessibility and sustainability over profit.',
          subcategory: 'Broadband Network',
          cost: 100,
          weight: 1.1,
          si_impact: 5,
          category: 'commercial'
        },
        {
          id: 'telecom_military_encrypted',
          name: 'Encrypted Comms',
          description: 'Ultra-secure satellite channels protecting sensitive military and government data.',
          subcategory: 'Secure Military Net',
          cost: 250,
          weight: 1.3,
          si_impact: 0,
          category: 'commercial'
        },
        {
          id: 'telecom_military_surveillance',
          name: 'Surveillance Package',
          description: 'Enhanced orbital monitoring with both defense and civilian tracking capabilities.',
          subcategory: 'Secure Military Net',
          cost: 300,
          weight: 1.5,
          si_impact: -2,
          category: 'commercial'
        },
        {
          id: 'telecom_military_allied',
          name: 'Allied Sharing Model',
          description: 'A cooperative defense framework enabling secure communications among allies.',
          subcategory: 'Secure Military Net',
          cost: 200,
          weight: 1.2,
          si_impact: 2,
          category: 'commercial'
        },
        {
          id: 'telecom_rural_lowcost',
          name: 'Low-Cost Terminals',
          description: 'Affordable ground stations ensuring rapid adoption in underserved regions.',
          subcategory: 'Rural Connectivity Net',
          cost: 150,
          weight: 1.2,
          si_impact: 2,
          category: 'commercial'
        },
        {
          id: 'telecom_rural_subsidy',
          name: 'Government Subsidy Plan',
          description: 'Partnerships with governments to expand coverage through subsidies and support.',
          subcategory: 'Rural Connectivity Net',
          cost: 200,
          weight: 1.3,
          si_impact: 5,
          category: 'commercial'
        },
        {
          id: 'telecom_rural_nonprofit',
          name: 'Non-Profit Mission',
          description: 'A humanitarian initiative offering essential connectivity free of charge.',
          subcategory: 'Rural Connectivity Net',
          cost: 100,
          weight: 1.0,
          si_impact: 10,
          category: 'commercial'
        }
      ]
    },
    'Tourism Capsule': {
      name: 'Tourism Capsule',
      icon: '🚀',
      description: 'Luxury orbital capsule. Popular but safety concerns lurk.',
      cost: 250,
      weight: 1.2,
      options: [
        {
          id: 'tourism_luxury_vip',
          name: 'VIP Orbital Suites',
          description: 'Private, luxury modules boasting unmatched comfort and prestige in orbit.',
          subcategory: 'Luxury Package',
          cost: 300,
          weight: 1.5,
          si_impact: -15,
          category: 'commercial'
        },
        {
          id: 'tourism_luxury_celebrity',
          name: 'Celebrity Flights',
          description: 'Short, media-friendly missions catering to high-profile clients and influencers.',
          subcategory: 'Luxury Package',
          cost: 250,
          weight: 1.3,
          si_impact: -10,
          category: 'commercial'
        },
        {
          id: 'tourism_luxury_elite',
          name: 'Elite Experience Package',
          description: 'Tailor-made orbital journeys offering exclusivity and premium services.',
          subcategory: 'Luxury Package',
          cost: 200,
          weight: 1.2,
          si_impact: -5,
          category: 'commercial'
        },
        {
          id: 'tourism_midtier_weekend',
          name: 'Weekend in Orbit',
          description: 'Compact packages enabling ordinary travelers to experience space for a few days.',
          subcategory: 'Mid-Tier Capsule',
          cost: 200,
          weight: 1.1,
          si_impact: -5,
          category: 'commercial'
        },
        {
          id: 'tourism_midtier_moongazer',
          name: 'Moon-Gazer Package',
          description: 'Tourist capsules timed to celestial events, offering spectacular views.',
          subcategory: 'Mid-Tier Capsule',
          cost: 250,
          weight: 1.3,
          si_impact: -2,
          category: 'commercial'
        },
        {
          id: 'tourism_midtier_corporate',
          name: 'Corporate Retreats',
          description: 'Specialized space missions designed for business team-building and branding.',
          subcategory: 'Mid-Tier Capsule',
          cost: 300,
          weight: 1.4,
          si_impact: -5,
          category: 'commercial'
        },
        {
          id: 'tourism_educational_student',
          name: 'Student Programs',
          description: 'Affordable study trips giving students first-hand experience in microgravity.',
          subcategory: 'Educational Capsule',
          cost: 150,
          weight: 1.0,
          si_impact: 5,
          category: 'commercial'
        },
        {
          id: 'tourism_educational_stem',
          name: 'STEM Partnerships',
          description: 'Collaborations with global universities to conduct hands-on space education.',
          subcategory: 'Educational Capsule',
          cost: 200,
          weight: 1.2,
          si_impact: 10,
          category: 'commercial'
        },
        {
          id: 'tourism_educational_research',
          name: 'Research Missions',
          description: 'Capsules devoted to experiments, scientific training, and published studies.',
          subcategory: 'Educational Capsule',
          cost: 250,
          weight: 1.3,
          si_impact: 10,
          category: 'commercial'
        }
      ]
    },
    'Broadcast Satellite': {
      name: 'Broadcast Satellite',
      icon: '📺',
      description: 'Event & entertainment beamed worldwide. Prestige but limited lifespan.',
      cost: 200,
      weight: 1.0,
      options: [
        {
          id: 'broadcast_sports_worldcup',
          name: 'World Cup Broadcast',
          description: 'Satellite feeds dedicated to one of the biggest sports events on Earth.',
          subcategory: 'Live Sports Broadcasting',
          cost: 300,
          weight: 1.5,
          si_impact: 0,
          category: 'commercial'
        },
        {
          id: 'broadcast_sports_olympics',
          name: 'Space Olympics',
          description: 'A new concept of zero-gravity sports competitions broadcast worldwide.',
          subcategory: 'Live Sports Broadcasting',
          cost: 250,
          weight: 1.3,
          si_impact: -2,
          category: 'commercial'
        },
        {
          id: 'broadcast_sports_regional',
          name: 'Regional Leagues',
          description: 'Coverage of local and continental sports markets for steady engagement.',
          subcategory: 'Live Sports Broadcasting',
          cost: 200,
          weight: 1.1,
          si_impact: 0,
          category: 'commercial'
        },
        {
          id: 'broadcast_media_news',
          name: 'News Focus',
          description: 'Dedicated to breaking news and real-time event coverage around the clock.',
          subcategory: '24/7 Media Satellite',
          cost: 200,
          weight: 1.1,
          si_impact: 0,
          category: 'commercial'
        },
        {
          id: 'broadcast_media_entertainment',
          name: 'Entertainment Package',
          description: 'Satellites streaming pop culture, music, and reality content worldwide.',
          subcategory: '24/7 Media Satellite',
          cost: 250,
          weight: 1.3,
          si_impact: -2,
          category: 'commercial'
        },
        {
          id: 'broadcast_media_hybrid',
          name: 'Hybrid Channel',
          description: 'Combines news, entertainment, and culture in a flexible broadcast platform.',
          subcategory: '24/7 Media Satellite',
          cost: 150,
          weight: 1.0,
          si_impact: 2,
          category: 'commercial'
        },
        {
          id: 'broadcast_cultural_science',
          name: 'Science Outreach',
          description: 'Educational satellite broadcasts aimed at inspiring future generations.',
          subcategory: 'Cultural Broadcast',
          cost: 200,
          weight: 1.2,
          si_impact: 10,
          category: 'commercial'
        },
        {
          id: 'broadcast_cultural_heritage',
          name: 'Heritage Channels',
          description: 'Preserving and sharing cultural heritage content from orbit.',
          subcategory: 'Cultural Broadcast',
          cost: 150,
          weight: 1.0,
          si_impact: 5,
          category: 'commercial'
        },
        {
          id: 'broadcast_cultural_festivals',
          name: 'Global Festivals',
          description: 'Live coverage of international music and art events from space.',
          subcategory: 'Cultural Broadcast',
          cost: 250,
          weight: 1.3,
          si_impact: 0,
          category: 'commercial'
        }
      ]
    }
  },
  infrastructure: {
    'Orbital Factory': {
      name: 'Orbital Factory',
      icon: '🏭',
      description: 'Zero-g industry hub. Huge upfront costs, but future industrial payoff.',
      cost: 350,
      weight: 1.6,
      options: [
        {
          id: 'factory_pharma_cancer',
          name: 'Cancer Research Drugs',
          description: 'A frontier program leveraging zero-g to accelerate cancer drug development.',
          subcategory: 'Pharma Research Hub',
          cost: 350,
          weight: 1.6,
          si_impact: 10,
          category: 'infrastructure'
        },
        {
          id: 'factory_pharma_rare',
          name: 'Rare Disease Therapies',
          description: 'Orbital labs tackling niche but critical medical conditions.',
          subcategory: 'Pharma Research Hub',
          cost: 300,
          weight: 1.5,
          si_impact: 10,
          category: 'infrastructure'
        },
        {
          id: 'factory_pharma_biotech',
          name: 'General Biotech',
          description: 'Broad research pipelines producing medicines and health solutions at scale.',
          subcategory: 'Pharma Research Hub',
          cost: 250,
          weight: 1.3,
          si_impact: 5,
          category: 'infrastructure'
        },
        {
          id: 'factory_material_fiber',
          name: 'Fiber Optics Plant',
          description: 'Zero-gravity fiber optics manufacturing with unmatched purity and performance.',
          subcategory: 'Material Science Lab',
          cost: 250,
          weight: 1.3,
          si_impact: 2,
          category: 'infrastructure'
        },
        {
          id: 'factory_material_alloy',
          name: 'Alloy Development',
          description: 'Specialized orbital production of lightweight aerospace alloys.',
          subcategory: 'Material Science Lab',
          cost: 300,
          weight: 1.4,
          si_impact: 0,
          category: 'infrastructure'
        },
        {
          id: 'factory_material_crystal',
          name: 'Crystal Manufacturing',
          description: 'Unique crystal structures grown in orbit for cutting-edge industries.',
          subcategory: 'Material Science Lab',
          cost: 200,
          weight: 1.1,
          si_impact: 2,
          category: 'infrastructure'
        },
        {
          id: 'factory_assembly_drone',
          name: 'Drone Assembly',
          description: 'Automated orbital factory for rapid production of space drones.',
          subcategory: 'Industrial Assembly Line',
          cost: 300,
          weight: 1.4,
          si_impact: -5,
          category: 'infrastructure'
        },
        {
          id: 'factory_assembly_satellite',
          name: 'Satellite Parts',
          description: 'Efficient production of modular satellite components for fleets.',
          subcategory: 'Industrial Assembly Line',
          cost: 250,
          weight: 1.2,
          si_impact: -5,
          category: 'infrastructure'
        },
        {
          id: 'factory_assembly_habitat',
          name: 'Space Habitat Units',
          description: 'Construction of prefabricated modules for future orbital colonies.',
          subcategory: 'Industrial Assembly Line',
          cost: 350,
          weight: 1.6,
          si_impact: 5,
          category: 'infrastructure'
        }
      ]
    },
    'Debris Tracker Network': {
      name: 'Debris Tracker Network',
      icon: '🛡️',
      description: 'Track orbital junk. Modest revenue, but boosts sustainability score.',
      cost: 250,
      weight: 1.3,
      options: [
        {
          id: 'debris_defense_surveillance',
          name: 'Military Surveillance',
          description: 'Integrated debris tracking with military surveillance capabilities.',
          subcategory: 'National Defense Contract',
          cost: 250,
          weight: 1.3,
          si_impact: 2,
          category: 'infrastructure'
        },
        {
          id: 'debris_defense_border',
          name: 'Space Border Patrol',
          description: 'Defense-oriented orbital patrol satellites monitoring key orbits.',
          subcategory: 'National Defense Contract',
          cost: 300,
          weight: 1.5,
          si_impact: 0,
          category: 'infrastructure'
        },
        {
          id: 'debris_defense_alerts',
          name: 'Quick-Response Alerts',
          description: 'Instant warning systems for high-risk debris collisions.',
          subcategory: 'National Defense Contract',
          cost: 200,
          weight: 1.1,
          si_impact: 5,
          category: 'infrastructure'
        },
        {
          id: 'debris_opendata_citizen',
          name: 'Citizen Science Project',
          description: 'Engages the public in tracking and analyzing orbital debris data.',
          subcategory: 'Open Data System',
          cost: 150,
          weight: 1.0,
          si_impact: 10,
          category: 'infrastructure'
        },
        {
          id: 'debris_opendata_university',
          name: 'University Access',
          description: 'Supports academic research through shared orbital data systems.',
          subcategory: 'Open Data System',
          cost: 200,
          weight: 1.2,
          si_impact: 5,
          category: 'infrastructure'
        },
        {
          id: 'debris_opendata_monitoring',
          name: 'Public Monitoring Platform',
          description: 'Interactive, global-access dashboard for orbital safety awareness.',
          subcategory: 'Open Data System',
          cost: 250,
          weight: 1.3,
          si_impact: 5,
          category: 'infrastructure'
        },
        {
          id: 'debris_commercial_insurance',
          name: 'Private Insurance Deals',
          description: 'Risk analysis satellites used by insurers for premium calculations.',
          subcategory: 'Commercial Subscription Service',
          cost: 300,
          weight: 1.4,
          si_impact: 2,
          category: 'infrastructure'
        },
        {
          id: 'debris_commercial_safety',
          name: 'Corporate Safety Contracts',
          description: 'Custom debris protection packages for commercial fleets.',
          subcategory: 'Commercial Subscription Service',
          cost: 250,
          weight: 1.3,
          si_impact: 5,
          category: 'infrastructure'
        },
        {
          id: 'debris_commercial_apps',
          name: 'Subscription Apps',
          description: 'Consumer apps offering real-time space safety alerts for subscribers.',
          subcategory: 'Commercial Subscription Service',
          cost: 200,
          weight: 1.1,
          si_impact: 2,
          category: 'infrastructure'
        }
      ]
    },
    'Refueling Depot': {
      name: 'Refueling Depot',
      icon: '⛽',
      description: 'Gas station in orbit. Costly, but extends satellite lifespans.',
      cost: 300,
      weight: 1.4,
      options: [
        {
          id: 'refuel_basic_single',
          name: 'Single-Pod System',
          description: 'A lone, low-cost pod servicing limited spacecraft.',
          subcategory: 'Fuel Pods (Basic)',
          cost: 150,
          weight: 1.0,
          si_impact: 2,
          category: 'infrastructure'
        },
        {
          id: 'refuel_basic_cluster',
          name: 'Cluster Pods',
          description: 'Groups of pods creating redundancy and scalability.',
          subcategory: 'Fuel Pods (Basic)',
          cost: 200,
          weight: 1.2,
          si_impact: 5,
          category: 'infrastructure'
        },
        {
          id: 'refuel_basic_fleet',
          name: 'Fleet Support',
          description: 'Pods dedicated to specific constellations for efficient fueling.',
          subcategory: 'Fuel Pods (Basic)',
          cost: 250,
          weight: 1.3,
          si_impact: 5,
          category: 'infrastructure'
        },
        {
          id: 'refuel_standard_corporate',
          name: 'Corporate Hub',
          description: 'Depot specializing in private company servicing contracts.',
          subcategory: 'Standard Station',
          cost: 250,
          weight: 1.3,
          si_impact: 5,
          category: 'infrastructure'
        },
        {
          id: 'refuel_standard_national',
          name: 'National Fleet Station',
          description: 'Government-backed station ensuring secure refueling access.',
          subcategory: 'Standard Station',
          cost: 300,
          weight: 1.4,
          si_impact: 5,
          category: 'infrastructure'
        },
        {
          id: 'refuel_standard_tourism',
          name: 'Tourism Support Depot',
          description: 'Orbital fueling station designed for space tourism capsules.',
          subcategory: 'Standard Station',
          cost: 200,
          weight: 1.2,
          si_impact: 0,
          category: 'infrastructure'
        },
        {
          id: 'refuel_mega_multiorbit',
          name: 'Multi-Orbit Supply',
          description: 'A large-scale depot servicing multiple orbital layers simultaneously.',
          subcategory: 'Mega Depot',
          cost: 350,
          weight: 1.5,
          si_impact: 10,
          category: 'infrastructure'
        },
        {
          id: 'refuel_mega_coalition',
          name: 'Coalition Investment',
          description: 'Internationally funded mega-station supporting shared operations.',
          subcategory: 'Mega Depot',
          cost: 300,
          weight: 1.4,
          si_impact: 15,
          category: 'infrastructure'
        },
        {
          id: 'refuel_mega_autonomous',
          name: 'Autonomous Refueling Bots',
          description: 'Fleet of AI-driven drones automating in-orbit refueling.',
          subcategory: 'Mega Depot',
          cost: 250,
          weight: 1.3,
          si_impact: 10,
          category: 'infrastructure'
        }
      ]
    }
  }
};

// Screen flow and narrative branches
export const SCREENS = {
  landing: { id: 'landing', title: 'Welcome to LEOVERSE', next: 'country' },
  country: { id: 'country', title: 'Choose Your Country', next: 'payload' },
  payload: { id: 'payload', title: 'Select Payload Type', next: 'mission' },
  mission: { id: 'mission', title: 'Mission Builder', next: 'review' },
  review: { id: 'review', title: 'Mission Review', next: 'result' },
  result: { id: 'result', title: 'Mission Results', next: 'leaderboard' },
  leaderboard: { id: 'leaderboard', title: 'Global Leaderboard', next: null },
  'orbital-path': { id: 'orbital-path', title: 'Orbital Path (Score Modifier)', next: 'leaderboard' }
};

// Achievement definitions
export const ACHIEVEMENTS = {
  first_mission: {
    type: 'first_mission_completed',
    title: 'Space Pioneer',
    description: 'Complete your first mission',
    icon: '🚀'
  },
  high_si: {
    type: 'high_sustainability',
    title: 'Sustainability Champion',
    description: 'Achieve SI score above 85',
    icon: '🌍'
  },
  budget_master: {
    type: 'budget_efficient',
    title: 'Budget Master',
    description: 'Complete mission under 80% of budget',
    icon: '💰'
  },
  tech_innovator: {
    type: 'all_advanced_tech',
    title: 'Tech Innovator',
    description: 'Use only high-SI components',
    icon: '⚡'
  },
  global_leader: {
    type: 'top_leaderboard',
    title: 'Global Leader',
    description: 'Reach top 10 in leaderboard',
    icon: '👑'
  }
};
