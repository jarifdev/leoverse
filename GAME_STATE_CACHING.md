# Game State Caching System

## Overview
LEOverse uses **Zustand with localStorage persistence** to cache all game state. This means players can:
- ✅ Refresh the page without losing progress
- ✅ Close the browser and return later
- ✅ Navigate between map, leaderboard, and chatbot freely
- ✅ Resume exactly where they left off

## What Gets Cached

### 🔐 Authentication
- `user` - User profile data
- `authToken` - Authentication token
- `isAuthenticated` - Login status

### 🎮 Game Progress
- `currentMission` - Current mission data
- `progress` - Mission progress tracking
- `missionStatus` - Completion status for all missions:
  - `payload.completed` - Payload mission done?
  - `orbital.completed` - Orbital path mission done?
  - `crisis.completed` - Crisis management done?

### 🌍 Player Selections
- `selectedCountry` - Chosen country
- `selectedPayloadType` - Selected payload
- `selectedOrbitalPath` - Chosen orbital path
- `orbitalPathPoint` - Exact orbital coordinates
- `selectedComponents` - All selected mission components

### 💰 Budget & Scoring
- `totalBudget` - Total mission budget
- `spentBudget` - Amount spent
- `score` - Current game score
- `collisionPercent` - Collision risk percentage

### 🏆 Achievements
- `achievements` - Unlocked achievements array

### 💬 Chat History
- `chatMessages` - AI assistant conversation history
- `chatSession` - Current chat session data

## How It Works

### Storage Key
All game state is stored in localStorage under the key: `leoverse-storage`

### Automatic Saving
State is **automatically saved** to localStorage whenever any of the cached values change. No manual save required!

### Visual Feedback
A green "Game Progress Saved" notification appears briefly in the top-right corner whenever state is updated.

## Resume Game Feature

The **Resume Game** button in the sidebar intelligently determines where to send the player:

1. **No Country Selected** → `/country-selection`
2. **Payload Incomplete** → `/mission` (Payload Mission)
3. **Orbital Incomplete** → `/orbital-path` (Orbital Path)
4. **Crisis Incomplete** → `/crisis` (Crisis Management)
5. **All Missions Done** → `/result` (Results Page)

## Testing Cache Persistence

### Test 1: Page Refresh
1. Select a country
2. Complete payload mission
3. Refresh the page (F5)
4. ✅ You should still be on the same mission with progress saved

### Test 2: Browser Close
1. Start a mission
2. Close the browser completely
3. Reopen and navigate to the app
4. ✅ You should be able to resume from the sidebar

### Test 3: Navigation Persistence
1. Complete payload mission
2. Navigate to Map or Leaderboard
3. Click "Resume Game" in sidebar
4. ✅ You should go to Orbital Path mission

## Technical Implementation

### Store Configuration (`lib/store.js`)
```javascript
export const useStore = create(
  persist(
    (set, get) => ({
      // ... state and actions
    }),
    {
      name: 'leoverse-storage',
      partialize: (state) => ({
        // All important game state fields
      }),
    }
  )
);
```

### Components
- **`Sidebar.js`** - Resume Game button with smart routing
- **`GameStateIndicator.js`** - Visual save confirmation
- **`layout.js`** - Global state indicator integration

## Clearing Cache

To start fresh (useful for testing):
1. Open browser DevTools (F12)
2. Go to Application > Local Storage
3. Delete `leoverse-storage` key
4. Refresh the page

Or programmatically:
```javascript
localStorage.removeItem('leoverse-storage');
```

## Benefits

### For Players
- 🎯 Never lose progress
- 🔄 Can explore auxiliary features freely
- 📱 Works across sessions
- 🚀 Quick resume with one click

### For Developers
- 🛠️ No backend session management needed
- 🎨 Simple state persistence
- 🐛 Easy to debug (visible in DevTools)
- ⚡ Fast and efficient

## Limitations

### Storage Limits
- localStorage has a 5-10MB limit per domain
- Current game state is well under 1MB

### Security Notes
- Sensitive data is still validated server-side
- Auth tokens can expire
- localStorage is domain-specific (not shared across domains)

### Browser Support
- Works in all modern browsers
- Requires JavaScript enabled
- Private/Incognito mode may clear on close

## Future Enhancements

Potential improvements:
- 🔄 Cloud sync for cross-device play
- 💾 Multiple save slots
- ⏰ Auto-save timestamps
- 📊 Progress analytics
- 🎁 Checkpoint rewards
