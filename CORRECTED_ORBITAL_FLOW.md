# CORRECTED FLOW - Orbital Path as Score Modifier

## ✅ CORRECT User Flow

```
1. Login/Register
   ↓
2. Country Selection
   ↓
3. Payload Selection (Commercial OR Infrastructure)
   ↓
4. Mission Builder (Select Components from Payload Categories)
   ↓
5. Submit Mission → Score Calculated → Leaderboard Entry Created
   ↓
6. [OPTIONAL] Orbital Path Selection (Accessed from Navbar)
   ↓
7. Select LEO/MEO/GEO + Collision Risk → UPDATES EXISTING SCORE
   ↓
8. Leaderboard Ranking Updated
```

---

## 🎯 Key Differences from Previous Implementation

### BEFORE (WRONG):
- Orbital Path was IN the main mission flow
- Country → Payload → **Orbital Path** → Mission Builder
- User had to select orbit BEFORE building mission
- Orbit cost affected budget for components

### NOW (CORRECT):
- Orbital Path is SEPARATE from mission flow
- Country → Payload → Mission Builder → Submit
- Orbital Path is accessed from navbar AFTER mission complete
- Orbital Path UPDATES existing leaderboard score
- No budget impact, purely score modification

---

## 📋 Navbar Order (CORRECTED)

```
🚀 Mission Builder | 🛰️ Orbital Path | 🏆 Leaderboard
```

**Flow:**
1. **Mission Builder**: Create new mission with components
2. **Orbital Path**: Modify score of completed mission  
3. **Leaderboard**: View all rankings

---

## 🔄 How Orbital Path Works Now

### Purpose:
**Post-mission score enhancement feature** that lets users optimize their ranking by selecting optimal orbital parameters.

### User Journey:
1. User completes mission → Gets base SI score (e.g., 65.2)
2. User clicks "Orbital Path" in navbar
3. User selects orbit (LEO/MEO/GEO) and adjusts collision risk
4. System recalculates SI score with orbital impact
5. User clicks "Update Mission Score"
6. Leaderboard entry updated with new score (e.g., 70.1)
7. Alert shows: "Score updated! New SI Score: 70.1"
8. Redirects to leaderboard to see new ranking

### Example Scenarios:

**Scenario 1: Score Boost**
- Original mission: 60.0 SI
- Selects GEO orbit (SI +5)
- Sets collision risk to 20%
- Collision penalty: 0.2 × -0.2 = -0.04
- New score: 60 + 5 - 0.04 = **64.96 SI** ✅ Higher rank!

**Scenario 2: Strategic Trade-off**
- Original mission: 55.0 SI
- Selects LEO orbit (SI -5)
- Sets collision risk to 15% (low for LEO)
- Collision penalty: 0.15 × -1.0 = -0.15
- New score: 55 - 5 - 0.15 = **49.85 SI** ❌ Lower rank

---

## 💻 Technical Implementation

### Orbital Path Page (`app/orbital-path/page.js`):

**Key Changes:**
- ✅ Removed budget checking (no longer affects mission budget)
- ✅ Removed "Continue to Mission Builder" button
- ✅ Added "Update Mission Score" button
- ✅ Calls `leaderboardAPI.update()` instead of navigating
- ✅ Shows alert with new score
- ✅ Redirects to leaderboard after update
- ✅ Back button goes to leaderboard (not payload)

**New Button:**
```jsx
<button onClick={handleUpdateScore}>
  <FaSyncAlt /> Update Mission Score
</button>
```

**Update Function:**
```javascript
const handleUpdateScore = async () => {
  // Save orbital selections
  setSelectedOrbitalPath(selectedOrbit);
  setOrbitalPathPoint(mapPoint);
  setCollisionPercent(localCollision);

  // Recalculate SI with orbital impact
  const currentSI = calculateSI();

  // Update leaderboard
  await leaderboardAPI.update({
    user_id: user.id,
    mission_id: user.latest_mission_id,
    si_score: currentSI,
    orbital_path: selectedOrbit.id,
    collision_risk: localCollision
  });

  alert(`Score updated! New SI: ${currentSI.toFixed(2)}`);
  router.push('/leaderboard');
};
```

---

## 🗄️ Database Changes

### New API Endpoint Needed:

**POST `/api/leaderboard/update.php`**
```php
<?php
// Update existing leaderboard entry
$user_id = $_POST['user_id'];
$mission_id = $_POST['mission_id'];
$si_score = $_POST['si_score'];
$orbital_path = $_POST['orbital_path'];
$collision_risk = $_POST['collision_risk'];

$sql = "UPDATE leaderboard 
        SET si_score = ?, 
            orbital_path = ?, 
            collision_risk = ?,
            updated_at = NOW()
        WHERE user_id = ? AND mission_id = ?";

$stmt = $conn->prepare($sql);
$stmt->execute([$si_score, $orbital_path, $collision_risk, $user_id, $mission_id]);

echo json_encode([
  'success' => true,
  'new_score' => $si_score,
  'message' => 'Score updated successfully'
]);
?>
```

### Table Schema (if not exists):
```sql
ALTER TABLE leaderboard
ADD COLUMN orbital_path VARCHAR(10) DEFAULT NULL,
ADD COLUMN collision_risk INT DEFAULT 0,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

---

## 📊 Component Categories (UNCHANGED)

### 💼 Commercial Payload:
- **📡 Telecom Constellation**
  - Broadband Network (High-Speed, Balanced, Community)
  - Secure Military Net (Encrypted, Surveillance, Allied)
  - Rural Connectivity (Low-Cost, Subsidy, Non-Profit)

- **🚀 Tourism Capsule**
  - Luxury Package options
  - Mid-Tier Package options
  - Educational Package options

- **📺 Broadcast Satellite**
  - Sports Broadcasting options
  - Media Broadcasting options
  - Cultural Broadcasting options

### 🏗️ Infrastructure Payload:
- **🏭 Orbital Factory**
  - Pharmaceutical Hub options
  - Material Lab options
  - Assembly Line options

- **🛰️ Debris Tracker**
  - Defense Tracker options
  - Open Data options
  - Commercial Tracker options

- **⛽ Refueling Depot**
  - Basic Pods options
  - Standard Station options
  - Mega Depot options

**ALL YOUR ORIGINAL CATEGORIES ARE PRESERVED!**

---

## 🎮 Visual Flow Diagram

```
┌────────────────────────────────────────────────────────────┐
│                    MAIN MISSION FLOW                       │
└────────────────────────────────────────────────────────────┘

1. 🔐 Login → 2. 🌍 Country → 3. 💼 Payload → 4. 🚀 Mission Builder

   Components Selected:
   • Telecom: Community Discount ($100M, SI +5)
   • Tourism: Educational Package ($150M, SI +3)
   
   Total: $250M spent, SI Score: 58.0
   
   [Submit Mission] → Score saved to leaderboard

┌────────────────────────────────────────────────────────────┐
│              SEPARATE: ORBITAL PATH FEATURE                │
└────────────────────────────────────────────────────────────┘

5. Click "🛰️ Orbital Path" in navbar

   Current Score: 58.0
   
   Select Orbit:
   [ ] LEO  (SI -5)
   [✓] MEO  (SI -2)
   [ ] GEO  (SI +5)
   
   Collision Risk: 30% [slider]
   
   New Score Preview: 58 - 2 - (0.3 × -0.5) = 56.15
   
   [Update Mission Score] → Leaderboard updated!

6. 🏆 Leaderboard shows new ranking with updated score
```

---

## ✅ Testing Checklist

### Mission Flow:
- [ ] Login → Country → Payload → Mission Builder works
- [ ] Can select components from your categories
- [ ] Submit mission creates leaderboard entry
- [ ] Original SI score calculated correctly

### Orbital Path (Separate):
- [ ] Can access Orbital Path from navbar anytime
- [ ] Shows LEO, MEO, GEO options
- [ ] Collision slider adjusts risk (0-100%)
- [ ] Score preview updates in real-time
- [ ] "Update Mission Score" button works
- [ ] Alert shows new score
- [ ] Leaderboard entry updates
- [ ] Can modify score multiple times

### Navbar:
- [ ] Mission Builder is first link
- [ ] Orbital Path is second link  
- [ ] Leaderboard is third link
- [ ] All links work correctly

---

## 🚀 Summary

**What Changed:**
1. ✅ Removed orbital path from main mission flow
2. ✅ Made it a standalone score modifier feature
3. ✅ Updated to modify existing scores, not block mission creation
4. ✅ Reordered navbar: Mission → Orbital → Leaderboard
5. ✅ Your payload categories remain 100% intact

**User Benefit:**
- Complete missions quickly with components
- Optionally optimize score later with orbital parameters
- Can experiment with different orbits without redoing mission
- Strategic post-mission optimization

**Server:** http://localhost:3000
**Ready to test!** 🎉
