# Earth Background Implementation Guide

## 🌍 Where & How to Use Earth Imagery

### 1. Landing Page (`app/page.js`)
**Current**: Space gradient with floating emojis
**Enhancement**: Add Earth view at bottom

```jsx
// Add to hero section
<section className="relative min-h-screen flex items-center justify-center px-4">
  {/* Earth glow effect at bottom */}
  <div className="absolute inset-0 earth-bg-bottom opacity-60" />
  
  {/* Content stays on top */}
  <div className="relative z-10">
    {/* Existing content */}
  </div>
  
  {/* Earth image at bottom */}
  <div className="absolute bottom-0 left-0 right-0 h-96 bg-earth-gradient opacity-40 blur-3xl" />
</section>
```

### 2. Login Page (`app/login/page.js`)
**Current**: Simple centered form
**Enhancement**: Split layout with Earth/Moon imagery

```jsx
<div className="min-h-screen grid md:grid-cols-2">
  {/* Left side - Earth/Moon visual */}
  <div className="hidden md:flex items-center justify-center bg-earth-night relative">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="text-9xl"
    >
      🌍
    </motion.div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-space-dark" />
  </div>
  
  {/* Right side - Login form */}
  <div className="flex items-center justify-center p-8">
    {/* Existing form */}
  </div>
</div>
```

### 3. Signup Page (`app/signup/page.js`)
**Enhancement**: Similar to login with moon imagery

```jsx
<div className="min-h-screen grid md:grid-cols-2">
  {/* Left side - Moon visual (matches your design) */}
  <div className="hidden md:flex flex-col items-center justify-center bg-space-dark relative p-12">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="mb-8"
    >
      <div className="w-64 h-64 rounded-full bg-gradient-radial from-gray-300 to-gray-600 shadow-2xl" />
    </motion.div>
    
    <h2 className="text-3xl font-bold text-center mb-2">Create Your Account</h2>
    <p className="text-gray-400 text-center">Begin your journey into LEOVERSE and explore new worlds of innovation.</p>
  </div>
  
  {/* Right side - Signup form */}
  <div className="flex items-center justify-center p-8">
    {/* Existing form */}
  </div>
</div>
```

### 4. Onboarding/Tutorial Screens
**New Feature**: Add tutorial slides with Earth background

```jsx
// Create new component: app/onboarding/page.js
export default function OnboardingPage() {
  const slides = [
    {
      title: "Shaping the Future of Lower Earth Orbit",
      subtitle: "Explore, decide, and experience how your choices shape space commercialization.",
      bg: "earth-bg-top"
    },
    {
      title: "Decisions that Matter",
      cards: [
        "Manage rockets, satellites, and orbital habitats",
        "Balance budgets, sustainability, and risks",
        "Learn with real NASA data & AI insights"
      ],
      bg: "earth-bg-bottom"
    }
  ];
  
  return (
    <div className={`min-h-screen ${slides[currentSlide].bg} relative`}>
      <div className="absolute inset-0 bg-space-dark/80" />
      <div className="relative z-10">
        {/* Slide content */}
      </div>
    </div>
  );
}
```

### 5. Country Selection (`app/country/page.js`)
**Enhancement**: Earth globe with country highlights

```jsx
<div className="min-h-screen relative">
  {/* Earth background */}
  <div className="absolute inset-0 bg-earth-gradient opacity-20" />
  
  <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
    <h1 className="section-title text-center mb-12">
      Choose Your Country
    </h1>
    
    {/* Add subtle Earth glow behind selected country */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {countries.map(country => (
        <motion.div
          key={country.code}
          className={`card-hover ${selected ? 'earth-glow' : ''}`}
        >
          {/* Country card */}
        </motion.div>
      ))}
    </div>
  </div>
</div>
```

### 6. Mission Complete/Results
**Enhancement**: Earth from orbit view

```jsx
<div className="min-h-screen relative overflow-hidden">
  {/* Earth view from orbit */}
  <motion.div
    initial={{ scale: 1.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 0.3 }}
    transition={{ duration: 2 }}
    className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-earth-gradient blur-2xl"
  />
  
  <div className="relative z-10">
    {/* Results content */}
  </div>
</div>
```

### 7. Crisis Management (`app/crisis/page.js`)
**Enhancement**: Dramatic Earth with debris warning

```jsx
<div className="min-h-screen relative">
  {/* Danger: Earth with red tint */}
  <div className="absolute inset-0 bg-gradient-radial from-red-900/20 via-earth-gradient to-space-dark opacity-40" />
  
  {/* Warning indicators */}
  <div className="absolute top-20 left-10">
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="text-6xl"
    >
      ⚠️
    </motion.div>
  </div>
  
  <div className="relative z-10">
    {/* Crisis content */}
  </div>
</div>
```

## 🎨 CSS Classes for Earth Effects

Add these to `globals.css`:

```css
/* Earth background variants */
.earth-bg-radial {
  background: radial-gradient(circle at center, rgba(74, 158, 255, 0.2) 0%, transparent 70%);
}

.earth-bg-corner {
  background: radial-gradient(circle at bottom right, rgba(74, 158, 255, 0.15) 0%, transparent 50%);
}

/* Animated Earth rotation */
@keyframes earthRotate {
  from { background-position: 0% 50%; }
  to { background-position: 100% 50%; }
}

.earth-rotate {
  background-size: 200% 100%;
  animation: earthRotate 60s linear infinite;
}

/* Earth atmosphere glow */
.earth-atmosphere {
  box-shadow: 
    inset 0 0 50px rgba(100, 200, 255, 0.3),
    0 0 80px rgba(100, 200, 255, 0.2);
}
```

## 🖼️ Recommended Earth Assets

### Option 1: Use Emoji/Unicode
```jsx
🌍 🌎 🌏 🪐 🌑 🌕
```

### Option 2: CSS Gradients (Current)
```css
bg-earth-gradient
bg-earth-night
```

### Option 3: NASA Images (High Quality)
```jsx
// Add to public/images/
- earth-from-orbit.jpg
- earth-at-night.jpg
- moon-surface.jpg
- space-debris-visualization.jpg
```

## 📱 Responsive Considerations

```jsx
// Hide Earth backgrounds on mobile for performance
<div className="hidden md:block earth-bg-top" />

// Or reduce complexity on mobile
<div className="earth-bg-top md:opacity-100 opacity-30" />
```

## ⚡ Performance Tips

1. **Use CSS gradients** instead of images when possible
2. **Lazy load** large Earth images
3. **Reduce blur** radius on mobile
4. **Use transforms** for animations (GPU accelerated)
5. **Limit backdrop-blur** usage

## 🎯 Quick Implementation Checklist

- [ ] Update landing page with Earth glow at bottom
- [ ] Add split-screen Earth to login page
- [ ] Add moon visual to signup page
- [ ] Create onboarding slides with Earth backgrounds
- [ ] Add Earth globe to country selection
- [ ] Add orbital view to mission complete
- [ ] Add warning Earth to crisis page
- [ ] Test responsive behavior
- [ ] Optimize performance
- [ ] Add loading states for Earth images

---

**Note**: Start with CSS gradients and simple effects, then enhance with images if needed. The current design system supports all Earth background variants without requiring external images.
