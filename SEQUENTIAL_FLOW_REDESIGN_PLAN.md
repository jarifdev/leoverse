# Sequential Mission Flow Redesign - Implementation Plan

## 🎯 New User Flow

### Sequential Mission Path (GATED):
```
1. Login
   ↓
2. Choose Country
   ↓
3. Payload Mission (Select components)
   ↓ Complete → Modal with "View Leaderboard" | "Next Mission"
   ↓ [Next Mission]
4. Orbital Mission
   ↓ Complete → Modal with info + "Next Mission" (NO leaderboard)
   ↓ [Next Mission]
5. Crisis Management
   ↓ Complete → Dashboard with full stats + Play Again
```

### Gating Rules:
- ❌ **Cannot access Orbital Mission** without completing Payload Mission
- ❌ **Cannot access Crisis Management** without completing Orbital Mission
- ✅ **Must complete missions in order**: Payload → Orbital → Crisis

---

## 🎨 Layout Redesign

### Current Layout:
```
┌─────────────────────────────────────────────────┐
│  🚀 LEOverse  [Mission] [Orbital] [Crisis] [LB] │ ← Top Navbar
├─────────────────────────────────────────────────┤
│                                                 │
│              Page Content                       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### New Layout:
```
┌──────────┬──────────────────────────────────────┐
│          │  Budget: $150M | Score: 450 | SI: 72 │ ← Top Stats Header
│          ├──────────────────────────────────────┤
│  🏆 LB   │                                      │
│          │                                      │
│  🤖 AI   │         Page Content                 │
│          │                                      │
│  🗺️ Map  │                                      │
│          │                                      │
└──────────┴──────────────────────────────────────┘
   ↑ Left Sidebar (3 buttons)
```

---

## 📋 Detailed Requirements

### 1. Left Sidebar Navigation (NEW)

**Position:** Fixed left side  
**Width:** ~80px (icon-focused)  
**Background:** Space theme (dark)  
**Buttons (Vertical):**

1. **🏆 Leaderboard**
   - Always accessible
   - Opens leaderboard view

2. **🤖 LEO AI**
   - Always accessible (if logged in)
   - Opens AI Assistant chat

3. **🗺️ Map**
   - Purpose: TBD (placeholder for now)
   - Could be mission map, orbital map, etc.

**Remove from navbar:**
- ❌ Mission Builder link
- ❌ Orbital Path link
- ❌ Crisis Management link

---

### 2. Top Stats Header (NEW)

**Position:** Fixed top (where current navbar is)  
**Height:** ~60px  
**Elements (Left to Right):**

1. **Logo:** 🚀 LEOverse (left side)
   - Click → Home (if not in mission)
   - Or keep for branding only

2. **Stats Display (Center/Right):**
   - **Remaining Budget:** 
     - Format: $150,000,000 or $150M
     - Updates as components selected
     - Starts with country budget
     - Red when low, green when good
   
   - **Score:** 
     - NEW FIELD (logic to be provided later)
     - Format: 450 points
     - Updates based on missions completed
   
   - **Sustainability Index (SI):**
     - Format: 72.5 or 72.5/100
     - Updates based on component selections
     - Color-coded (green=good, yellow=fair, red=poor)

3. **User Info + Logout** (far right)
   - Username
   - Logout button

---

### 3. Mission Completion Flows (UPDATED)

#### A. Payload Mission Completion
**Current:** Goes to `/result` page

**New:**
```
User completes payload mission
   ↓
Modal/Results Screen appears:
   ┌─────────────────────────────────┐
   │   ✅ Payload Mission Complete!  │
   │                                 │
   │   Components: 5                 │
   │   Budget Spent: $100M           │
   │   SI Score: 65.2                │
   │                                 │
   │  [View Leaderboard] [Next Mission] │
   └─────────────────────────────────┘
```

**Buttons:**
- **View Leaderboard** → Navigate to leaderboard page
- **Next Mission** → Navigate to Orbital Mission page

---

#### B. Orbital Mission Completion
**Current:** Updates leaderboard, shows alert

**New:**
```
User completes orbital mission
   ↓
Modal with info appears:
   ┌─────────────────────────────────┐
   │  ✅ Orbital Mission Complete!   │
   │                                 │
   │   Orbital Path: LEO             │
   │   Collision Risk: 25%           │
   │   SI Impact: +3.5               │
   │   New SI Score: 68.7            │
   │                                 │
   │        [Next Mission]           │
   └─────────────────────────────────┘
```

**Button:**
- **Next Mission** → Navigate to Crisis Management page
- **NO View Leaderboard button** (as per requirement)

---

#### C. Crisis Management Completion
**Current:** Shows final results with Play Again

**New:**
```
User completes crisis management
   ↓
Dashboard/Final Results Screen:
   ┌─────────────────────────────────┐
   │    🎉 All Missions Complete!    │
   │                                 │
   │   Final Statistics:             │
   │   • Remaining Budget: $50M      │
   │   • Total Score: 1,250 points   │
   │   • SI Rating: Excellent (85.3) │
   │   • Leaderboard Rank: #12       │
   │                                 │
   │   Missions Completed:           │
   │   ✅ Payload Mission            │
   │   ✅ Orbital Mission            │
   │   ✅ Crisis Management          │
   │                                 │
   │        [Play Again]             │
   └─────────────────────────────────┘
```

**Keep current behavior:** Play Again resets and returns to start

---

### 4. Mission Gating System (NEW)

**State Tracking:**
```javascript
// Zustand store
missionStatus: {
  payload: { completed: false, score: null },
  orbital: { completed: false, score: null },
  crisis: { completed: false, score: null }
}
```

**Route Guards:**

**Orbital Path Page:**
```javascript
// Check if payload mission completed
if (!missionStatus.payload.completed) {
  alert('Complete Payload Mission first!');
  router.push('/mission');
  return null;
}
```

**Crisis Management Page:**
```javascript
// Check if orbital mission completed
if (!missionStatus.orbital.completed) {
  alert('Complete Orbital Mission first!');
  router.push('/orbital-path');
  return null;
}
```

---

### 5. Score Field (NEW)

**Database Schema:**
```sql
ALTER TABLE leaderboard 
ADD COLUMN score INT DEFAULT 0;

ALTER TABLE missions
ADD COLUMN score INT DEFAULT 0;
```

**Zustand Store:**
```javascript
// Add to store
score: 0,
setScore: (score) => set({ score }),
```

**Score Logic:**
- To be provided by user later
- Will update based on mission completions
- Display in top header

---

## 🗂️ Files to Modify

### Create New:
1. **components/Sidebar.js** - Left navigation sidebar
2. **components/StatsHeader.js** - Top stats display
3. **components/MissionCompleteModal.js** - Reusable completion modal

### Modify Existing:
1. **components/Navbar.js** → Remove or simplify drastically
2. **app/layout.js** → Add Sidebar + StatsHeader
3. **app/mission/page.js** → Change completion to show modal
4. **app/orbital-path/page.js** → Add gating, change completion flow
5. **app/crisis/page.js** → Keep current final results (already good)
6. **lib/store.js** → Add score field, missionStatus tracking
7. **lib/api.js** → Update API calls for score field

### Database:
1. **db_ver/add_score_field.sql** - New migration for score column

---

## 🎨 Design Specs

### Left Sidebar:
- **Width:** 80px
- **Background:** `bg-space-dark` with `border-r border-gray-800`
- **Buttons:** 
  - Size: 60x60px
  - Icon-only
  - Hover effect
  - Active state indicator

### Top Stats Header:
- **Height:** 60px
- **Background:** `bg-space-dark/80 backdrop-blur-md`
- **Stats Layout:** Flex row, gap-4
- **Stat Cards:**
  - Padding: px-4 py-2
  - Background: `bg-space-blue/30`
  - Border radius: rounded-lg
  - Color-coded based on values

### Modals:
- **Backdrop:** Semi-transparent dark overlay
- **Modal:** Centered, max-width 500px
- **Buttons:** Full width or side-by-side
- **Animation:** Fade in + scale up

---

## 🔄 Migration Path

### Phase 1: Layout (Do First)
1. Create Sidebar component
2. Create StatsHeader component
3. Update layout.js to use new components
4. Test that all pages render with new layout

### Phase 2: Mission Gating
1. Add missionStatus to store
2. Add route guards to orbital-path/page.js
3. Add route guards to crisis/page.js
4. Test that gating works

### Phase 3: Completion Flows
1. Create MissionCompleteModal component
2. Update mission/page.js completion
3. Update orbital-path/page.js completion
4. Test all completion flows

### Phase 4: Score Field
1. Create database migration
2. Update store with score field
3. Update API calls
4. Add score calculation logic (when provided)

---

## ✅ Success Criteria

### Layout:
- [ ] Left sidebar visible on all pages
- [ ] Sidebar has 3 buttons (Leaderboard, AI, Map)
- [ ] Top stats header shows Budget, Score, SI
- [ ] Stats update in real-time
- [ ] No old navbar links visible

### Mission Flow:
- [ ] Payload mission shows modal on completion
- [ ] Modal has "View Leaderboard" and "Next Mission" buttons
- [ ] Next Mission goes to Orbital Path
- [ ] Orbital mission shows modal (no leaderboard button)
- [ ] Next Mission goes to Crisis Management
- [ ] Crisis shows final dashboard with all stats

### Gating:
- [ ] Cannot access Orbital without completing Payload
- [ ] Cannot access Crisis without completing Orbital
- [ ] Proper error messages when trying to skip
- [ ] State persists across page refreshes

### Score Field:
- [ ] Score field in database
- [ ] Score field in store
- [ ] Score displays in header
- [ ] Ready for logic implementation

---

## 🚀 Ready to Implement?

**Estimated Time:** 3-4 hours  
**Complexity:** Medium-High (lots of UI changes)  
**Risk:** Medium (affects entire navigation)  

**Recommendation:** 
1. Start with Phase 1 (Layout)
2. Test thoroughly
3. Then move to Phase 2-4

**Questions before starting:**
1. What should the "Map" button do? (placeholder for now?)
2. Score calculation logic - when will this be provided?
3. Should logo still be clickable? If yes, where should it go?
4. Should sidebar be collapsible on mobile?

---

**Ready to proceed with implementation?** 🚀
