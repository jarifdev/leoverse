import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      authToken: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthToken: (token) => set({ authToken: token }),
      logout: () => set({ 
        user: null, 
        authToken: null, 
        isAuthenticated: false,
        currentMission: null, 
        progress: null,
        selectedComponents: [],
        selectedCountry: null,
        selectedPayloadType: null,
        selectedOrbitalPath: null,
        orbitalPathPoint: null,
        collisionPercent: 0,
        chatMessages: [],
        score: 0,
        missionStatus: {
          payload: { completed: false, score: null },
          orbital: { completed: false, score: null },
          crisis: { completed: false, score: null }
        }
      }),

      // Current mission state
      currentMission: null,
      setCurrentMission: (mission) => set({ currentMission: mission }),
      
      // Mission components
      selectedComponents: [],
      addComponent: (component) => {
        set((state) => ({ 
          selectedComponents: [...state.selectedComponents, component] 
        }));
        // Recalculate score after adding component
        setTimeout(() => get().calculateScore(), 0);
      },
      removeComponent: (componentId) => {
        set((state) => ({
          selectedComponents: state.selectedComponents.filter((c) => c.id !== componentId)
        }));
        // Recalculate score after removing component
        setTimeout(() => get().calculateScore(), 0);
      },
      clearComponents: () => {
        set({ selectedComponents: [] });
        // Reset score when clearing all components
        set({ score: 0 });
      },

      // Budget
      totalBudget: 0,
      spentBudget: 0,
      setTotalBudget: (budget) => set({ totalBudget: budget }),
      setSpentBudget: (spent) => set({ spentBudget: spent }),
      updateSpentBudget: () => {
        const spent = get().selectedComponents.reduce((sum, c) => sum + (c.cost || 0), 0);
        set({ spentBudget: spent });
        // Auto-update score when budget changes
        get().calculateScore();
      },
      addToSpentBudget: (amount) => set((state) => ({ spentBudget: state.spentBudget + amount })),

      // Score calculation: Score = cost × weight
      score: 0,
      setScore: (score) => set({ score }),
      addToScore: (additionalScore) => set((state) => ({ score: state.score + additionalScore })),
      calculateScore: () => {
        const components = get().selectedComponents;
        if (components.length === 0) {
          set({ score: 0 });
          return 0;
        }
        
        // Formula: Score = sum of (cost × weight) for each component
        const totalScore = components.reduce((sum, c) => {
          const cost = c.cost || 0;
          const weight = c.weight || 1.0;
          return sum + (cost * weight);
        }, 0);
        
        set({ score: Math.round(totalScore) });
        return Math.round(totalScore);
      },
      
      // Mission Status Tracking (for gating)
      missionStatus: {
        payload: { completed: false, score: null },
        orbital: { completed: false, score: null },
        crisis: { completed: false, score: null }
      },
      setMissionCompleted: (missionType, score) => 
        set((state) => ({
          missionStatus: {
            ...state.missionStatus,
            [missionType]: { completed: true, score }
          }
        })),
      resetMissionStatus: () => 
        set({
          missionStatus: {
            payload: { completed: false, score: null },
            orbital: { completed: false, score: null },
            crisis: { completed: false, score: null }
          }
        }),
      
      // Reset all missions (for Play Again functionality)
      resetMissions: () => {
        set({
          currentMission: null,
          selectedComponents: [],
          selectedCountry: null,
          selectedPayloadType: null,
          selectedOrbitalPath: null,
          orbitalPathPoint: null,
          collisionPercent: 0,
          totalBudget: 0,
          spentBudget: 0,
          score: 0,
          missionStatus: {
            payload: { completed: false, score: null },
            orbital: { completed: false, score: null },
            crisis: { completed: false, score: null }
          },
          chatMessages: [],
          chatSession: null,
        });
      },

      // Progress
      progress: {
        current_screen: 'landing',
        current_branch: 'main',
        completed_screens: [],
        decisions_made: {},
      },
      setProgress: (progress) => set({ progress }),
      updateProgress: (updates) =>
        set((state) => ({
          progress: { ...state.progress, ...updates }
        })),

      // SI Score calculation
      // Formula: SI = Base (50) + Payload Modifiers + Orbit Modifiers + Crisis Modifiers – Capacity Penalties
      calculateSI: () => {
        const components = get().selectedComponents;
        
        // Base SI
        let finalSI = 50;
        
        // Payload Modifiers: Sum of all component SI impacts
        const payloadModifiers = components.reduce((sum, c) => {
          return sum + (c.si_impact || 0);
        }, 0);
        finalSI += payloadModifiers;
        
        // Orbit Modifiers: SI impact from selected orbital path
        const orbitalPath = get().selectedOrbitalPath;
        if (orbitalPath) {
          finalSI += orbitalPath.si_impact || 0;
        }
        
        // Crisis Modifiers: (Applied separately in crisis page, not calculated here)
        // This is added when crisis decision is made
        
        // Capacity Penalties: (To be implemented if capacity system is added)
        // For now, no penalty applied
        
        return Math.max(0, Math.min(100, finalSI));
      },

      // Achievements
      achievements: [],
      setAchievements: (achievements) => set({ achievements }),
      addAchievement: (achievement) =>
        set((state) => ({
          achievements: [...state.achievements, achievement]
        })),

      // Country selection
      selectedCountry: null,
      setSelectedCountry: (country) => set({ 
        selectedCountry: country, 
        totalBudget: country?.budget || 0,
        spentBudget: 0 
      }),

      // Payload type selection
      selectedPayloadType: null,
      setSelectedPayloadType: (payloadType) => set({ selectedPayloadType: payloadType }),

      // Orbital path selection
      selectedOrbitalPath: null,
      orbitalPathPoint: null, // {lat, lng}
      collisionPercent: 0,
      setSelectedOrbitalPath: (orbitalPath) => set({ selectedOrbitalPath: orbitalPath }),
      setOrbitalPathPoint: (point) => set({ orbitalPathPoint: point }),
      setCollisionPercent: (percent) => set({ collisionPercent: percent }),

      // Chat state
      chatSession: null,
      setChatSession: (session) => set({ chatSession: session }),
      chatMessages: [],
      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, message]
        })),
      clearChatMessages: () => set({ chatMessages: [] }),
    }),
    {
      name: 'leoverse-storage',
      partialize: (state) => ({
        // User & Auth
        user: state.user,
        authToken: state.authToken,
        isAuthenticated: state.isAuthenticated,
        
        // Game State
        currentMission: state.currentMission,
        progress: state.progress,
        
        // Country & Selections
        selectedCountry: state.selectedCountry,
        selectedPayloadType: state.selectedPayloadType,
        selectedOrbitalPath: state.selectedOrbitalPath,
        orbitalPathPoint: state.orbitalPathPoint,
        
        // Mission Components & Budget
        selectedComponents: state.selectedComponents,
        totalBudget: state.totalBudget,
        spentBudget: state.spentBudget,
        
        // Scores & Status
        score: state.score,
        missionStatus: state.missionStatus,
        
        // Orbital Data
        collisionPercent: state.collisionPercent,
        
        // Achievements
        achievements: state.achievements,
        
        // Chat History
        chatMessages: state.chatMessages,
        chatSession: state.chatSession,
      }),
    }
  )
);
