# Crisis Management Feature - Implementation Guide

## Overview
Crisis Management is the final stage of the LEOverse mission flow, where players face a dramatic debris alert and must choose one of three strategies to handle the crisis. Their decision impacts their final Space Sustainability Index (SI) score, remaining budget, and leaderboard ranking.

---

## 🎮 User Flow

### Complete Mission Journey
1. **Login** → User signs in
2. **Country Selection** → Choose country with specific budget
3. **Payload Selection** → Pick Commercial or Infrastructure payload type
4. **Mission Builder** → Select components and build mission
5. **Submit Mission** → Score gets added to leaderboard (Stage 1)
6. **Orbital Path** (optional) → Select orbit to optimize score (Stage 2)
7. **Crisis Management** → Handle debris alert (FINAL STAGE)
8. **Final Results** → View complete statistics and play again

---

## 🚨 Crisis Options

### 1. Ignore Warning (High Risk, Zero Cost)
- **Icon:** ⚠️
- **Cost:** $0M
- **Weightage:** 0.8
- **SI Impact:** Random penalty between -30 and -10
- **Description:** "Risk it and hope for the best. Saves budget, but failure could mean asset loss."
- **Use Case:** Budget-constrained players willing to gamble

### 2. Deploy Cleanup Tech (High Cost, High Reward)
- **Icon:** 🛰️
- **Cost:** $200M
- **Weightage:** 1.4
- **SI Impact:** +15 (fixed boost)
- **Description:** "Spend heavily to clear debris using advanced nets or lasers. Costly, but boosts sustainability index."
- **Use Case:** Players with budget surplus seeking maximum SI score

### 3. International Treaty Push (Balanced)
- **Icon:** 🤝
- **Cost:** $150M
- **Weightage:** 1.2
- **SI Impact:** +10 (fixed boost)
- **Description:** "Invest in diplomacy. Slower payoff, but increases safety network-wide and earns collaboration points."
- **Use Case:** Balanced approach - moderate cost, good SI boost

---

## 📊 Score Calculation

### Formula
```
Base SI = Score from Mission Builder + Orbital Path adjustments
Crisis SI = Selected option's SI impact
Final SI = Base SI + Crisis SI
Final Budget = Remaining Budget - Crisis Cost
```

### Example Scenarios

**Scenario 1: Ignore Warning**
- Base SI: 65.0
- Crisis Decision: Ignore Warning
- Random Penalty: -18 (rolled between -30 and -10)
- Final SI: 65.0 + (-18) = 47.0
- Cost: $0M
- Result: Score decreased, budget preserved

**Scenario 2: Deploy Cleanup Tech**
- Base SI: 58.0
- Crisis Decision: Deploy Cleanup Tech
- SI Boost: +15
- Final SI: 58.0 + 15 = 73.0
- Cost: $200M
- Result: Score increased significantly, major budget cost

**Scenario 3: International Treaty**
- Base SI: 62.0
- Crisis Decision: International Treaty Push
- SI Boost: +10
- Final SI: 62.0 + 10 = 72.0
- Cost: $150M
- Result: Balanced score increase, moderate cost

---

## 🎯 Final Results Screen

After submitting crisis decision, players see:

### 1. Crisis Decision Summary
- Selected decision name
- Base score before crisis
- Crisis impact (+ or -)
- Final score after crisis

### 2. Budget Summary
- Total budget (from country)
- Components spent (from mission builder)
- Crisis cost
- **Remaining budget** (can be negative!)

### 3. Mission Statistics
- Number of components used
- Orbital path selected
- Country & flag
- Mission name

### 4. Sustainability Rating
Based on final SI score:
- **Excellent** (80+): Green, 🎉 "Outstanding sustainability!"
- **Good** (60-79): Blue, 👏 "Solid performance!"
- **Fair** (40-59): Yellow, 👍 "Room for improvement"
- **Below Average** (20-39): Orange, 😐 "Needs work"
- **Poor** (0-19): Red, ⚠️ "Critical issues"

### 5. Leaderboard Position
- Large trophy icon with rank number
- Encouragement message based on rank:
  - Top 10: "🎉 Top 10! Excellent work!"
  - Top 50: "👏 Top 50! Well done!"
  - Other: "💪 Keep improving!"

### 6. Action Buttons
- **View Full Leaderboard**: Navigate to leaderboard page
- **Play Again**: Resets all user data and returns to landing page

---

## 🗄️ Database Schema Changes

### Leaderboard Table
```sql
ALTER TABLE leaderboard
ADD COLUMN crisis_decision VARCHAR(20) DEFAULT NULL,
ADD COLUMN crisis_si_impact INT DEFAULT 0,
ADD COLUMN crisis_cost INT DEFAULT 0;
```

### Missions Table
```sql
ALTER TABLE missions
ADD COLUMN crisis_decision VARCHAR(20) DEFAULT NULL,
ADD COLUMN crisis_si_impact INT DEFAULT 0,
ADD COLUMN crisis_cost INT DEFAULT 0;
```

---

## 🔌 Backend API

### Endpoint: `/api/leaderboard/crisis.php`

**Method:** POST

**Request Body:**
```json
{
  "user_id": "user123",
  "mission_id": "mission456",
  "final_si_score": 73.5,
  "crisis_decision": "cleanup",
  "crisis_si_impact": 15,
  "crisis_cost": 200
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Crisis decision processed successfully",
  "data": {
    "final_score": 73.5,
    "crisis_decision": "cleanup",
    "crisis_si_impact": 15,
    "crisis_cost": 200,
    "rank": 12
  }
}
```

**Error Responses:**
- `400`: Missing required fields
- `404`: Leaderboard entry not found
- `500`: Database error

### What the API Does:
1. Validates required fields (user_id, mission_id, final_si_score, crisis_decision)
2. Checks if leaderboard entry exists for this mission
3. Updates leaderboard with final score and crisis data
4. Updates missions table with crisis decision
5. Recalculates user's rank
6. Returns final score, decision, and new rank

---

## 🎨 Frontend Features

### Cinematic Alert Animation
- Pulsing red border
- Rotating warning icon
- Animated text
- Creates urgency and excitement

### Option Cards
- Large icons for each option
- Color-coded borders (red, green, blue)
- Clear cost and SI impact display
- Disabled state if budget insufficient
- Selection indicator (green checkmark)

### Loading States
- "⏳ Processing Decision..." button text
- Disabled interactions during API call
- Smooth transitions

### Results Animations
- Staggered entrance animations
- Scale effects on hover
- Confetti emoji for celebration
- Color-coded SI ratings

---

## 🚀 Setup Instructions

### 1. Run Database Migration
```bash
mysql -u root -p leoverse < c:/Users/jbinn/Documents/leo/db_ver/add_crisis_management_columns.sql
```

### 2. Verify Database Changes
```sql
DESCRIBE leaderboard;
-- Should show: crisis_decision, crisis_si_impact, crisis_cost

DESCRIBE missions;
-- Should show: crisis_decision, crisis_si_impact, crisis_cost
```

### 3. Test Backend Endpoint
```bash
# Using curl (PowerShell)
$body = @{
    user_id = "test_user"
    mission_id = "test_mission"
    final_si_score = 75.5
    crisis_decision = "cleanup"
    crisis_si_impact = 15
    crisis_cost = 200
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost/leo/api/leaderboard/crisis.php" -Method POST -Body $body -ContentType "application/json"
```

### 4. Test Frontend Flow
1. Navigate to http://localhost:3000
2. Complete full mission flow
3. Click "Crisis Management" in navbar
4. Select an option and submit
5. Verify final results display correctly
6. Click "Play Again" and verify reset

---

## 🧪 Testing Checklist

### Functional Tests
- [ ] Crisis page loads with cinematic alert
- [ ] All three options display correctly
- [ ] Can't afford message shows when budget insufficient
- [ ] Selection works (only one option at a time)
- [ ] Submit button disabled when no selection
- [ ] API call successful with valid data
- [ ] Final results display all statistics
- [ ] Sustainability rating matches score
- [ ] Leaderboard rank displays correctly
- [ ] "View Leaderboard" navigates correctly
- [ ] "Play Again" resets user and redirects to home

### Edge Cases
- [ ] Negative final budget displays correctly
- [ ] Random penalty for "Ignore" varies between -30 and -10
- [ ] Works without orbital path selection
- [ ] Works with orbital path selection
- [ ] Multiple crisis attempts update same leaderboard entry
- [ ] Rank recalculates correctly after each submission

### Database Verification
```sql
-- Check crisis data was saved
SELECT 
    u.username,
    m.name as mission_name,
    l.si_score,
    l.crisis_decision,
    l.crisis_si_impact,
    l.crisis_cost,
    l.updated_at
FROM leaderboard l
JOIN users u ON l.user_id = u.id
JOIN missions m ON l.mission_id = m.id
WHERE l.crisis_decision IS NOT NULL
ORDER BY l.updated_at DESC
LIMIT 10;
```

---

## 🎯 Key Features

### User Experience
✅ Cinematic presentation with urgency
✅ Clear decision consequences
✅ Budget constraints visible
✅ Immediate feedback on selection
✅ Comprehensive final results
✅ Easy reset for replay

### Technical Implementation
✅ Proper state management with Zustand
✅ API integration with error handling
✅ Database transactions for data integrity
✅ Rank recalculation after updates
✅ Responsive design for all screens
✅ Smooth animations with Framer Motion

### Game Design
✅ Three distinct strategic choices
✅ Risk vs reward balance
✅ Random elements (Ignore penalty)
✅ Budget pressure creates tough decisions
✅ Sustainability theme reinforced
✅ Satisfying conclusion to mission

---

## 🔄 Play Again Flow

When user clicks "Play Again":

1. **Frontend:**
   - Calls `logout()` from Zustand store
   - Clears all state (user, mission, components, budget, etc.)
   - Navigates to landing page `/`

2. **User sees:**
   - Landing page as if first visit
   - Must login/signup again
   - Fresh start for new mission

3. **Why Full Reset:**
   - Encourages trying different strategies
   - Prevents state pollution
   - Clean slate for next game
   - Simulates new player session

---

## 📱 Responsive Design

- **Desktop:** 3-column grid for options
- **Tablet:** 2-column grid, cards stack nicely
- **Mobile:** Single column, full-width cards
- All animations optimized for mobile
- Touch-friendly button sizes

---

## 🎨 Visual Design

### Color Scheme
- **Ignore:** Red tones (danger)
- **Cleanup:** Green tones (safe)
- **Treaty:** Blue tones (diplomatic)
- **Alerts:** Yellow/Orange (warning)
- **Success:** Green gradient
- **Results:** Purple/Blue gradient

### Icons
- ⚠️ Warning triangle (crisis alert)
- 🛰️ Satellite (cleanup tech)
- 🤝 Handshake (treaty)
- 🎉 Party (celebration)
- 💰 Money bag (budget)
- 📊 Chart (statistics)
- 🏆 Trophy (leaderboard)
- 🔄 Refresh (play again)

---

## 📝 Notes

- Crisis Management is FINAL stage - no going back
- Score permanently updated in leaderboard
- Player can start new mission with "Play Again"
- Each mission can only have ONE crisis decision
- Budget can go negative (shown in red)
- Random penalty makes "Ignore" unpredictable
- Higher SI score = higher rank on leaderboard

---

## 🐛 Troubleshooting

**Issue:** "Leaderboard entry not found"
- Solution: Complete mission builder and submit first
- Verify mission exists in database
- Check user_id and mission_id match

**Issue:** Can't afford any option
- Solution: This is intentional game design
- Player made poor budget choices earlier
- Must use "Ignore Warning" (free option)

**Issue:** Rank not updating
- Solution: Check rank calculation query in crisis.php
- Verify si_score and updated_at columns exist
- Clear database cache if needed

**Issue:** Play Again doesn't reset
- Solution: Check logout() function in store.js
- Verify localStorage clearing
- Hard refresh browser if needed

---

## 🎓 Learning Outcomes

Players learn:
- **Risk Management:** Weighing cost vs benefit
- **Sustainability:** Environmental responsibility has rewards
- **Budget Planning:** Early decisions impact final options
- **Strategic Thinking:** Different paths to success
- **Diplomacy Value:** Cooperation benefits everyone
