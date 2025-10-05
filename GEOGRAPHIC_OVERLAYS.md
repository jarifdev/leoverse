# Geographic Coordinate-Based Map Overlays

## Overview
The map now uses **OpenLayers coordinate system** for all overlays, ensuring pins and regions stay in the correct geographic location regardless of zoom level or pan position.

## Key Improvements

### 1. ✅ Geographic Coordinates (EPSG:4326)
All countries use real latitude/longitude coordinates:

```javascript
const countryInfo = {
  US: {
    center: [-95, 37],  // Kansas, USA center
    bounds: { minLon: -125, maxLon: -65, minLat: 25, maxLat: 49 }
  },
  OM: {
    center: [56, 21],   // Oman center
    bounds: { minLon: 52, maxLon: 60, minLat: 16, maxLat: 26 }
  },
  JP: { center: [138, 36], bounds: {...} },
  IN: { center: [78, 20], bounds: {...} },
  AE: { center: [54, 24], bounds: {...} }
}
```

### 2. ✅ Zoom-Responsive Overlays
Overlays are positioned using `getPixelFromCoordinate()`:

```javascript
const getPixelPosition = (lonLat) => {
  if (!mapInstanceRef.current) return null;
  const pixel = mapInstanceRef.current.getPixelFromCoordinate(lonLat);
  return pixel ? { x: pixel[0], y: pixel[1] } : null;
};
```

**Benefits:**
- Pins stay at exact geographic locations
- Automatically adjust when zooming/panning
- No manual percentage calculations needed

### 3. ✅ Scattered Player Pins
Each player gets a unique pin at a random location within their country:

```javascript
const generateRandomPosition = (bounds) => {
  const lon = bounds.minLon + Math.random() * (bounds.maxLon - bounds.minLon);
  const lat = bounds.minLat + Math.random() * (bounds.maxLat - bounds.minLat);
  return [lon, lat];
};
```

**Pin Data Structure:**
```javascript
{
  id: "unique-id",
  countryCode: "US",
  username: "Player123",
  siScore: 85.3,
  position: [-100, 35],  // [lon, lat]
  color: "#3B82F6",
  flag: "🇺🇸"
}
```

### 4. ✅ Real-Time View Updates
Map view changes trigger overlay re-renders:

```javascript
map.on('moveend', () => {
  setMapViewKey(prev => prev + 1);  // Forces overlay recalculation
});
```

## Visual Design

### USA & Oman (Special Achievement Countries)
- **Glowing Region**: 200x150px (USA), 120x100px (Oman)
- **Pulsing Animation**: 3-second cycle, green glow
- **Achievement Button**: 16x16 flag icon, clickable
- **Player Pins**: Slightly larger (12px) with filled background

### Other Countries (JP, IN, AE)
- **No Glowing Region**: Only player pins
- **Player Pins**: Standard size (10px), hollow with border
- **Same scatter distribution**: Random within bounds

### Pin Sizes & Colors
```javascript
// Special countries (US, OM)
w-3 h-3          // 12px diameter
filled           // Solid color background
border-2         // 2px border

// Other countries
w-2.5 h-2.5      // 10px diameter
hollow           // White background
border-2         // 2px border
```

## Hover Interactions

### Player Pins
- **Scale**: 1.0 → 1.3 on hover
- **Tooltip**: Shows username + SI score
- **Position**: Above pin with 8px margin
- **Style**: Black/90% opacity, white text

### Achievement Buttons
- **Scale**: 1.0 → 1.1 on hover
- **Glow**: Pulsing box-shadow (green)
- **Label**: "USA Achievements" / "Oman Achievements"

## Data Flow

### 1. Fetch Player Data
```javascript
fetchMapData() → leaderboardAPI.get({ limit: 1000 })
```

### 2. Process & Scatter
```javascript
leaderboard.forEach(entry => {
  // Group by country
  // Generate random position within bounds
  // Create pin object
})
```

### 3. Render Pins
```javascript
playerPins.map(pin => {
  const pixel = getPixelPosition(pin.position);
  // Render at pixel coordinates
})
```

### 4. Update on Map Move
```javascript
map.on('moveend') → setMapViewKey++ → Re-render overlays
```

## Performance Optimization

### Conditional Rendering
```javascript
if (!pixel) return null;  // Skip pins outside viewport
```

### Staggered Animations
```javascript
transition={{ delay: Math.random() * 0.5 }}  // Prevent simultaneous renders
```

### Key-Based Re-renders
```javascript
<div key={mapViewKey} />  // Only update when map moves
```

## Testing Checklist

- [x] USA glowing region appears over USA
- [x] Oman glowing region appears over Oman
- [x] Achievement buttons are clickable
- [x] Player pins scattered across all 5 countries
- [x] Pins stay in correct position when zooming
- [x] Pins stay in correct position when panning
- [x] Hover tooltips show player info
- [x] Special countries (US/OM) have larger pins
- [x] Pin density reflects player count
- [x] Performance is smooth with 100+ pins

## Future Enhancements

### Clustering
For high-density areas, group nearby pins:
```javascript
// Pseudocode
if (pins.length > 50) {
  cluster(pins, minDistance: 20px)
}
```

### Heatmap Mode
Show player density as a heatmap:
```javascript
import HeatmapLayer from 'ol/layer/Heatmap';
```

### Filter by Score
Toggle to show only high-scoring players:
```javascript
const filteredPins = playerPins.filter(p => p.siScore > 80);
```

### Animation Trails
Show satellite orbit paths connecting pins:
```javascript
// Draw lines between pins in same country
```

## Troubleshooting

### Pins Not Appearing
1. Check `mapInstanceRef.current` is initialized
2. Verify `playerPins` array has data
3. Check `getPixelPosition()` returns valid pixels
4. Ensure `mapViewKey` is incrementing

### Pins in Wrong Location
1. Verify country bounds are correct
2. Check coordinate format is `[lon, lat]` not `[lat, lon]`
3. Ensure projection is EPSG:4326
4. Test with known coordinates (e.g., USA center)

### Performance Issues
1. Limit `maxResults` in leaderboardAPI call
2. Reduce pin size/complexity
3. Disable animations for many pins
4. Implement viewport culling

## Code Structure

```
MapPage Component
├── State
│   ├── playerPins (scattered pin data)
│   ├── mapViewKey (triggers re-renders)
│   └── countryData (aggregated stats)
├── Hooks
│   ├── useEffect - Initialize OpenLayers
│   ├── useEffect - Fetch player data
│   └── map.on('moveend') - Update overlays
├── Helper Functions
│   ├── getPixelPosition(lonLat) - Convert coords to pixels
│   ├── generateRandomPosition(bounds) - Scatter within country
│   └── fetchMapData() - Load & process player data
└── Render
    ├── Map container (OpenLayers div)
    ├── Overlay layer (absolute positioned)
    │   ├── USA glow + button
    │   ├── Oman glow + button
    │   └── Scattered pins (all countries)
    └── Achievement modal
```

## Geographic Accuracy

### Coordinate System
- **Projection**: EPSG:4326 (WGS 84)
- **Units**: Decimal degrees
- **Range**: Longitude -180 to 180, Latitude -90 to 90

### Country Bounds
All bounds are approximate bounding boxes:
- **US**: Continental USA only (excludes Alaska, Hawaii)
- **Oman**: Full country bounds
- **Japan**: Main islands
- **India**: Full country including Kashmir
- **UAE**: Full country bounds

### Center Points
Center coordinates represent geographic center (not population center):
- Used for achievement buttons
- Calculated as midpoint of bounds
- May not align with capital cities

## Conclusion

The coordinate-based overlay system provides:
- ✅ **Accurate positioning**: Pins at real world locations
- ✅ **Zoom responsive**: Stays correct at all zoom levels
- ✅ **Player distribution**: Scattered pins per country
- ✅ **Performance**: Efficient re-renders on map move
- ✅ **Visual appeal**: Glowing regions + smooth animations

The implementation is production-ready and scales well with 100+ concurrent players across 5 countries.
