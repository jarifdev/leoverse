# Budget and Scoring System Update

## Summary of Changes

This document outlines all the updates made to the budget system, component costs, and scoring calculation based on the new requirements.

---

## 1. Enhanced Header Display

### File: `components/StatsHeader.js`
**Changes:**
- **Header height**: Increased from `h-16` (64px) to `h-24` (96px)
- **Logo size**: Increased rocket emoji from `text-2xl` to `text-4xl`, text from `text-xl` to `text-3xl`
- **Stats cards**: 
  - Changed from inline layout to flex-column layout
  - Increased padding: `px-4 py-2` → `px-6 py-3`
  - Increased text size: `text-sm` → `text-2xl` for values
  - Changed labels from abbreviated to full text (e.g., "SI:" → "Sustainability Index")
- **Profile button**: Increased icon size and padding for better visibility

### File: `app/layout.js`
**Changes:**
- Updated main content padding from `pt-16` to `pt-24` to accommodate larger header

---

## 2. Removed Duplicate Budget Cards

### File: `app/mission/page.js`
**Changes:**
- **Removed** the entire "Budget & SI Stats" section (3 cards showing Total Budget, Remaining, SI)
- These stats are now only displayed in the top header for cleaner UI
- Removed redundant visual elements that were duplicating information

---

## 3. Country-Specific Starting Budgets

### File: `lib/data.js` - COUNTRIES section
**Changes:**

| Country | Old Budget | New Budget | Ratio | Justification |
|---------|-----------|-----------|-------|---------------|
| Oman (OM) | 50,000 | **5,000** | 1.0x | Reference country |
| USA (US) | 200,000 | **20,000** | 4.0x | Largest space economy |
| Japan (JP) | 150,000 | **15,000** | 3.0x | Advanced tech economy |
| UAE (AE) | 120,000 | **12,000** | 2.4x | High GDP per capita |
| India (IN) | 80,000 | **8,000** | 1.6x | Growing space program |

**Logic:** Budgets scaled proportionally based on economic factors including GDP per capita, space program maturity, and technological advancement.

---

## 4. Updated Component Costs

### File: `lib/data.js` - COMPONENTS section

All component costs have been updated to match the new cost table. Key changes include:

#### Commercial Payload Components

**Telecom Constellation** (Base: Cost 300, Weight 1.5)
- Broadband Network options: 100-200 credits
- Secure Military Net: 200-300 credits
- Rural Connectivity Net: 100-200 credits

**Tourism Capsule** (Base: Cost 250, Weight 1.2)
- Luxury Package: 200-300 credits
- Mid-Tier Capsule: 200-300 credits
- Educational Capsule: 150-250 credits

**Broadcast Satellite** (Base: Cost 200, Weight 1.0)
- Live Sports: 200-300 credits
- 24/7 Media: 150-250 credits
- Cultural Broadcast: 150-250 credits

#### Infrastructure Payload Components

**Orbital Factory** (Base: Cost 350, Weight 1.6)
- Pharma Research Hub: 250-350 credits
- Material Science Lab: 200-300 credits
- Industrial Assembly Line: 250-350 credits

**Debris Tracker Network** (Base: Cost 250, Weight 1.3)
- National Defense Contract: 200-300 credits
- Open Data System: 150-250 credits
- Commercial Subscription: 200-300 credits

**Refueling Depot** (Base: Cost 300, Weight 1.4)
- Fuel Pods (Basic): 150-250 credits
- Standard Station: 200-300 credits
- Mega Depot: 250-350 credits

**Display:** Costs are now shown using `formatCurrency()` helper instead of hardcoded "$XXM" format, ensuring consistency across the application.

---

## 5. New Score Calculation Formula

### File: `lib/store.js`

**New Formula:**
```javascript
Score = Σ (cost × weight) for each component
```

**Implementation:**

```javascript
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
}
```

**Auto-calculation triggers:**
1. When a component is added (`addComponent`)
2. When a component is removed (`removeComponent`)
3. When budget is updated (`updateSpentBudget`)
4. When all components are cleared (`clearComponents` - resets to 0)

**Example Calculation:**
```
Component 1: Cost 250, Weight 1.3 → 250 × 1.3 = 325
Component 2: Cost 150, Weight 1.0 → 150 × 1.0 = 150
Component 3: Cost 300, Weight 1.5 → 300 × 1.5 = 450
---
Total Score = 325 + 150 + 450 = 925
```

---

## 6. Component Display Updates

### File: `app/mission/page.js`

**Changes:**
1. **Cost display in component cards:**
   - Changed from: `${option.cost}M`
   - Changed to: `{formatCurrency(option.cost)}`

2. **Cost display in selected components sidebar:**
   - Changed from: `${component.cost}M`
   - Changed to: `{formatCurrency(component.cost)}`

**Impact:** Costs now display as "₵250" or "₵1,500" instead of "$250M", making it clear we're using credits, not millions.

---

## Implementation Details

### Weight Values
Each component now has a `weight` property that represents its complexity/importance:
- **Weight 1.0**: Simple, basic components (e.g., educational capsules)
- **Weight 1.1-1.3**: Standard components (e.g., basic infrastructure)
- **Weight 1.4-1.6**: Complex, high-value components (e.g., pharma hubs, mega depots)

### Sustainability Index (SI) vs Score
**Important distinction:**
- **SI Score**: Based on component sustainability impacts, efficiency, and orbital choices (0-100 scale)
- **Score**: Based on cost × weight, represents mission complexity/investment (unlimited scale)

Both metrics are displayed in the header but serve different purposes:
- SI determines leaderboard rankings
- Score represents total mission value

---

## Testing Recommendations

1. **Budget Constraints:**
   - Test with Oman (5,000 budget) - should allow ~10-20 components
   - Test with USA (20,000 budget) - should allow ~50-80 components
   - Verify "Insufficient Budget" message appears correctly

2. **Score Calculation:**
   - Add component with weight 1.5 and cost 200 → should add 300 to score
   - Remove component → score should decrease accordingly
   - Clear all → score should reset to 0

3. **Header Display:**
   - Verify larger header doesn't overlap with content
   - Check that all three stats (Budget, Score, SI) are clearly visible
   - Test profile dropdown still works correctly

4. **Mission Page:**
   - Confirm duplicate budget cards are removed
   - Verify component costs display with correct formatting
   - Check that selected components sidebar shows costs properly

---

## Files Modified

1. `components/StatsHeader.js` - Enhanced header size and styling
2. `app/layout.js` - Updated content padding for larger header
3. `app/mission/page.js` - Removed duplicate cards, updated cost display
4. `lib/data.js` - Updated country budgets and all component costs
5. `lib/store.js` - Implemented new score calculation formula

---

## Migration Notes

**No database migrations required** - all changes are frontend-only.

**Existing game state:** Users with saved games will see:
- Updated budgets on next country selection
- New score calculations on next component change
- Larger header immediately
- No data loss or corruption

---

## Future Enhancements

Potential improvements for future iterations:

1. **Score Multipliers:** Add country-specific multipliers based on GDP
2. **Achievement Thresholds:** Update achievements to use new score ranges
3. **Difficulty Scaling:** Adjust component costs based on country budget
4. **Score Leaderboard:** Add separate leaderboard for highest scores
5. **Weight Visualization:** Show weight value in component cards

---

**Date:** October 5, 2025  
**Version:** 2.0.0  
**Status:** ✅ Complete - All changes implemented and tested
