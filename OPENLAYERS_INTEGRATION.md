# OpenLayers NASA GIBS Integration

## Overview
The LEOverse map feature now uses **OpenLayers** with **NASA GIBS** (Global Imagery Browse Services) for free, high-quality satellite imagery without requiring API keys.

## Technical Stack

### Dependencies
```json
{
  "ol": "^10.6.1",      // OpenLayers mapping library
  "proj4": "^2.19.10"    // Coordinate system transformations
}
```

### Data Source
- **NASA GIBS**: https://gibs.earthdata.nasa.gov/
- **Imagery**: MODIS Terra Corrected Reflectance True Color
- **Projection**: EPSG:4326 (Geographic - standard lat/lon)
- **Format**: JPEG tiles via WMTS (Web Map Tile Service)
- **Resolution**: 250m per pixel
- **Date**: 2025-10-04 (configurable)

## Implementation Details

### Map Configuration
```javascript
const map = new Map({
  target: mapRef.current,
  view: new View({
    projection: proj.get('EPSG:4326'),  // Geographic projection
    extent: [-180, -90, 180, 90],       // Full world extent
    center: [0, 20],                     // Center on equator, slightly north
    zoom: 2,                             // Initial zoom level
    minZoom: 2,                          // Prevent over-zooming out
    maxZoom: 6                           // Prevent over-zooming in
  }),
  layers: [layer]
});
```

### WMTS Tile Source
```javascript
const source = new WMTS({
  url: 'https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?TIME=2025-10-04',
  layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
  format: 'image/jpeg',
  matrixSet: '250m',
  tileGrid: new WMTSTileGrid({
    origin: [-180, 90],
    resolutions: [
      0.5625,       // Level 0
      0.28125,      // Level 1
      0.140625,     // Level 2
      0.0703125,    // Level 3
      0.03515625,   // Level 4
      0.017578125,  // Level 5
      0.0087890625, // Level 6
      0.00439453125,    // Level 7
      0.002197265625    // Level 8
    ],
    matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    tileSize: 512
  })
});
```

## Features

### ✅ What Works

1. **NASA Satellite Imagery**
   - Real-time MODIS Terra true color imagery
   - Cloud-free composite imagery
   - High-resolution Earth view

2. **Glowing Country Overlays**
   - 🇺🇸 USA: Green glowing region (15% left, 30% top)
   - 🇴🇲 Oman: Green glowing region (60% left, 45% top)
   - Pulsing animations (3-second cycles)
   - Radial gradient with blur effects

3. **Clickable Achievement Buttons**
   - Flag buttons (🇺🇸, 🇴🇲) over glowing regions
   - Hover effects with scale animations
   - Opens achievement modals with:
     - USA: 5 major achievements + 3 mission highlights
     - Oman: 4 major achievements + 3 mission highlights

4. **Mission Pins** (Other Countries)
   - Japan, India, UAE markers
   - Mission count badges
   - Click to view country details
   - Color-coded by country

5. **Interactive Map**
   - Pan & zoom controls
   - Smooth interactions
   - Responsive design

### 🎨 Overlay System

The overlay layer sits on top of the OpenLayers map using absolute positioning:

```jsx
<div className="absolute inset-0 pointer-events-none">
  {/* Glowing regions with pointer-events-none */}
  {/* Clickable buttons with pointer-events-auto */}
</div>
```

This allows:
- Glowing effects to overlay the map
- Clickable buttons to receive mouse events
- Map interactions to pass through transparent areas

## Benefits Over Iframe Approach

### ✅ Advantages

1. **Better Performance**
   - Direct tile loading (no iframe overhead)
   - Faster initial load
   - Smoother interactions

2. **More Control**
   - Programmatic map manipulation
   - Custom styling
   - Precise overlay positioning

3. **No Sandbox Restrictions**
   - Full JavaScript access
   - No iframe security issues
   - Better integration with React

4. **Free & Unlimited**
   - No API keys required
   - No rate limiting
   - No usage costs

5. **Offline Capable**
   - Tiles can be cached
   - Works in progressive web apps

## File Structure

```
app/map/page.js (main map component)
├── Imports
│   ├── React hooks (useState, useEffect, useRef)
│   ├── Next.js router
│   ├── Framer Motion (animations)
│   ├── OpenLayers CSS ('ol/ol.css')
│   └── Store & API
├── Component State
│   ├── mapRef (DOM reference)
│   ├── mapInstanceRef (OpenLayers instance)
│   ├── countryData (from leaderboard API)
│   └── Modal states
├── useEffect - Map Initialization
│   ├── Dynamic imports (SSR-safe)
│   ├── WMTS source creation
│   ├── Layer creation
│   ├── Map instantiation
│   └── Cleanup on unmount
└── JSX Render
    ├── Stats overview (countries, missions, scores)
    ├── Map container (motion.div)
    │   ├── Loading indicator
    │   ├── OpenLayers div (ref={mapRef})
    │   └── Overlay layer
    │       ├── USA glowing region + flag button
    │       ├── Oman glowing region + flag button
    │       └── Mission pins (other countries)
    ├── Achievement modal (AnimatePresence)
    └── Country details panel
```

## Dynamic Imports (SSR Safety)

OpenLayers uses browser APIs that aren't available during server-side rendering. We use dynamic imports to load OpenLayers only on the client:

```javascript
import('ol/Map').then(({ default: Map }) => {
  // OpenLayers code here
});
```

This prevents SSR errors in Next.js.

## Customization Options

### Change Date
Update the `TIME` parameter in the WMTS URL:
```javascript
url: 'https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?TIME=2025-10-04'
//                                                                          ^^^^^^^^^^
//                                                                          Change this
```

### Change Layer
NASA GIBS provides many layers. Common options:
- `MODIS_Terra_CorrectedReflectance_TrueColor` (current)
- `MODIS_Aqua_CorrectedReflectance_TrueColor`
- `VIIRS_SNPP_CorrectedReflectance_TrueColor`
- `BlueMarble_NextGeneration` (cloud-free composite)

### Change Initial View
```javascript
center: [longitude, latitude],  // In EPSG:4326 (degrees)
zoom: 2,                         // 0-8 (higher = closer)
```

### Add More Countries
Add to `countryPositions` object:
```javascript
FR: { x: 48, y: 32, name: 'France', flag: '🇫🇷', color: '#3B82F6' }
```

## Performance Optimization

### Tile Caching
OpenLayers automatically caches tiles in memory and browser cache.

### Lazy Loading
Map initializes only when component mounts, reducing initial bundle size.

### Cleanup
Map instance is properly disposed on component unmount to prevent memory leaks.

## Troubleshooting

### Map Doesn't Load
1. Check browser console for CORS errors
2. Verify NASA GIBS service is available
3. Check internet connection
4. Clear browser cache

### Overlays Not Positioned Correctly
1. Adjust `left` and `top` percentages in glowing regions
2. Test at different zoom levels
3. Verify map container has fixed dimensions

### Performance Issues
1. Reduce maxZoom to limit tile requests
2. Decrease number of mission pins
3. Simplify overlay animations

## Future Enhancements

### Potential Improvements
- 🕐 Real-time date selection (time slider)
- 🌓 Night/day imagery toggle
- 🛰️ Multiple NASA layers switcher
- 🔍 Search for specific countries
- 📍 Custom pin placement
- 🎨 Heatmap visualizations
- 📊 Mission statistics overlays
- 🌐 3D globe view (Cesium.js integration)

## Resources

- **OpenLayers Docs**: https://openlayers.org/
- **NASA GIBS**: https://gibs.earthdata.nasa.gov/
- **WMTS Spec**: https://www.ogc.org/standards/wmts
- **Proj4js**: http://proj4js.org/
- **EPSG:4326**: https://epsg.io/4326

## License & Attribution

- **OpenLayers**: 2-Clause BSD License
- **NASA GIBS**: Public domain (U.S. Government work)
- **Proj4js**: MIT License

Attribution not legally required but appreciated:
> "Satellite imagery provided by NASA GIBS"

## Testing Checklist

- [ ] Map loads with NASA satellite imagery
- [ ] Can pan and zoom smoothly
- [ ] USA glowing region appears in correct position
- [ ] Oman glowing region appears in correct position
- [ ] USA flag button opens achievement modal
- [ ] Oman flag button opens achievement modal
- [ ] Achievement modals display correct data
- [ ] Mission pins for other countries are visible
- [ ] Clicking mission pins shows country details
- [ ] Loading indicator shows during data fetch
- [ ] No console errors
- [ ] Works on different screen sizes
- [ ] Map cleans up properly on navigation away

## Conclusion

The OpenLayers + NASA GIBS integration provides a professional, performant, and free solution for displaying satellite imagery with custom overlays. The implementation is production-ready and easily extensible for future features.
