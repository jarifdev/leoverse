# Payload Type Selection Implementation - Summary

## ✅ COMPLETED

### 1. Data Structure (lib/data.js) ✅
- Created `PAYLOAD_TYPES` with Commercial and Infrastructure options
- Completely restructured `COMPONENTS` object:
  - Top level: `commercial` and `infrastructure`
  - Second level: Main categories (e.g., "Telecom Constellation", "Tourism Capsule")
  - Third level: `options` array with subcategories and all properties (cost, weight, si_impact)

### 2. Store Updates (lib/store.js) ✅
- Added `selectedPayloadType` state
- Added `setSelectedPayloadType` function
- Updated `logout` to clear payload type
- **Updated `calculateSI` to include weight in calculations:**
  - Formula: Weighted average SI based on component weights
  - Base score (50) + weighted SI + efficiency bonus
  - Considers weight when calculating impact

### 3. Payload Selection Page (app/payload/page.js) ✅
- Created new `/payload` route
- Beautiful UI with two cards for Commercial vs Infrastructure
- Shows icon, description, and details for each type
- Validates that user has selected a country first
- Redirects to mission builder after selection

### 4. Country Page Update (app/country/page.js) ✅
- Changed navigation from `/budget` to `/payload`
- Updated progress tracking to include payload selection step

## 🔨 TODO: Mission Builder Update

The mission builder needs major restructuring. Here's the required implementation:

### Mission Page Structure

```javascript
// app/mission/page.js - Key Changes Needed

// 1. Get the selected payload type components
const { selectedPayloadType, selectedCountry, /* ... */ } = useStore();

// 2. Get components based on payload type
const payloadComponents = selectedPayloadType 
  ? COMPONENTS[selectedPayloadType.id] 
  : {};

// 3. Display main categories (instead of old propulsion/power/etc.)
const mainCategories = Object.keys(payloadComponents);

// For Commercial:
// - "Telecom Constellation"
// - "Tourism Capsule"
// - "Broadcast Satellite"

// For Infrastructure:
// - "Orbital Factory"
// - "Debris Tracker Network"
// - "Refueling Depot"

// 4. Group options by subcategory within each main category
// Example for Telecom Constellation:
//   - Broadband Network
//     • High-Speed Priority
//     • Balanced Services
//     • Community Discount Model
//   - Secure Military Net
//     • Encrypted Comms
//     • Surveillance Package
//     • Allied Sharing Model
//   - Rural Connectivity Net
//     • Low-Cost Terminals
//     • Government Subsidy Plan
//     • Non-Profit Mission
```

### Component Display Logic

```javascript
// Group options by subcategory
const groupBySubcategory = (options) => {
  return options.reduce((acc, option) => {
    if (!acc[option.subcategory]) {
      acc[option.subcategory] = [];
    }
    acc[option.subcategory].push(option);
    return acc;
  }, {});
};

// Usage in render:
{mainCategories.map(categoryName => {
  const category = payloadComponents[categoryName];
  const groupedOptions = groupBySubcategory(category.options);
  
  return (
    <div key={categoryName}>
      <h2>{category.icon} {category.name}</h2>
      
      {Object.entries(groupedOptions).map(([subcategory, options]) => (
        <div key={subcategory}>
          <h3>{subcategory}</h3>
          
          {options.map(option => (
            <ComponentCard
              key={option.id}
              option={option}
              onAdd={handleAddComponent}
            />
          ))}
        </div>
      ))}
    </div>
  );
})}
```

### Component Card Display

Each option card should show:
- **Name**: Option name (e.g., "High-Speed Priority")
- **Cost**: `${option.cost}M` 
- **SI Impact**: Display with color (green for positive, red for negative)
- **Weight**: Hidden from display (used in calculations only)
- **Add Button**: If budget allows

```javascript
const ComponentCard = ({ option, onAdd }) => {
  const canAfford = remainingBudget >= option.cost;
  
  return (
    <div className={`component-card ${!canAfford ? 'disabled' : ''}`}>
      <h4>{option.name}</h4>
      
      <div className="stats">
        <span>💰 Cost: ${option.cost}M</span>
        <span className={option.si_impact >= 0 ? 'positive' : 'negative'}>
          📊 SI: {option.si_impact > 0 ? '+' : ''}{option.si_impact}
        </span>
        {/* Weight is hidden - used in calculations only */}
      </div>
      
      <button
        onClick={() => onAdd(option)}
        disabled={!canAfford}
        className="btn-add"
      >
        {canAfford ? '+ Add' : 'Insufficient Budget'}
      </button>
    </div>
  );
};
```

### Mission Completion Update

When completing mission, ensure all component data is included:

```javascript
await missionAPI.addComponent({
  mission_id: missionId,
  category: component.category, // 'commercial' or 'infrastructure'
  component_name: component.name,
  cost: component.cost,
  si_impact: component.si_impact,
  weight: component.weight, // Include weight!
  subcategory: component.subcategory // Include subcategory!
});
```

## 🧪 Testing Checklist

1. **Country Selection**:
   - [ ] Select a country
   - [ ] Should redirect to `/payload`

2. **Payload Selection**:
   - [ ] See two options: Commercial & Infrastructure
   - [ ] Click Commercial → redirects to `/mission`
   - [ ] Back button → returns to `/country`

3. **Mission Builder** (after update):
   - [ ] Commercial: Shows Telecom, Tourism, Broadcast categories
   - [ ] Infrastructure: Shows Factory, Tracker, Depot categories
   - [ ] Each category shows grouped subcategories
   - [ ] Each option shows cost and SI impact
   - [ ] Weight is hidden (used in calculations)
   - [ ] Can add options to mission
   - [ ] Budget updates correctly
   - [ ] SI score calculates with weight factor

4. **Mission Completion**:
   - [ ] Complete mission with new components
   - [ ] Data saves to database
   - [ ] SI score reflects weight calculations
   - [ ] Appears in leaderboard with correct rank

## 📊 SI Score Formula (Updated)

```javascript
// Old Formula:
SI = (Average SI Impact) + (Budget Efficiency Bonus)

// New Formula with Weight:
Weighted SI = Σ(SI_impact × weight) / Σ(weight)
Final SI = 50 + Weighted SI + (Budget Efficiency × 10)

// Example:
Component A: SI = +10, Weight = 1.5 → Contribution = 15
Component B: SI = -5, Weight = 1.0 → Contribution = -5
Total Weight = 2.5
Weighted Average = (15 - 5) / 2.5 = 4

If 20% budget remaining:
Final SI = 50 + 4 + 2 = 56
```

## 🎯 Key Implementation Points

1. **Weight is Hidden**: Users don't see weight values, only cost and SI
2. **Three-Level Hierarchy**: Payload Type → Main Category → Subcategory
3. **Budget Scaling**: Costs are in millions, multiply by 1,000,000 for actual budget
4. **Flexible Categories**: Each payload type has completely different categories
5. **Subcategory Grouping**: Options are grouped under subcategories for better UX

## 📁 Files Modified

- ✅ `lib/data.js` - New data structure
- ✅ `lib/store.js` - Payload type state + SI calculation
- ✅ `app/payload/page.js` - New payload selection page
- ✅ `app/country/page.js` - Navigate to payload
- 🔨 `app/mission/page.js` - **NEEDS UPDATE** (major restructuring required)

## 🚀 Next Step

Update `app/mission/page.js` with the new component display logic to show:
1. Main categories based on selected payload type
2. Subcategories within each main category  
3. Options within each subcategory
4. Proper handling of cost, SI, and weight

Would you like me to provide the complete updated mission/page.js code?
