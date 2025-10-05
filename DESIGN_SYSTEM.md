# LEOVERSE Design System

## 🎨 Color Palette

### Primary Colors
- **Cyan Accent**: `#00B4D8` - Main brand color for buttons and highlights
- **Cyan Dark**: `#0077b6` - Hover states and darker accents
- **Cyan Light**: `#48cae4` - Light accents and gradients

### Background Colors
- **Space Dark**: `#000000` - Pure black for main background
- **Space Dark Blue**: `#0a0e1a` - Subtle dark blue tint
- **Card Background**: `#0d1117` - Dark cards with slight transparency
- **Border**: `#30363d` - Subtle borders for cards and inputs

### Text Colors
- **Primary Text**: `#ffffff` - White for main content
- **Secondary Text**: `#9ca3af` - Gray for less important text
- **Placeholder**: `#6b7280` - Gray for placeholders

## 🔘 Button Styles

### Primary Button (Cyan)
```jsx
className="btn-primary"
```
- Background: Cyan (#00B4D8)
- Hover: Darker cyan with glow effect
- Usage: Main CTAs, submit buttons

### Secondary Button
```jsx
className="btn-secondary"
```
- Background: Dark card with border
- Usage: Cancel, back buttons

### Outline Button
```jsx
className="btn-outline"
```
- Border: Cyan with transparent background
- Hover: Fills with cyan
- Usage: Alternative actions

## 📦 Card Components

### Standard Card
```jsx
className="card"
```
- Dark background with subtle border
- Rounded corners (12px)
- Subtle backdrop blur

### Hover Card
```jsx
className="card-hover"
```
- Includes hover effects with cyan glow
- Slight scale on hover
- Perfect for clickable items

## 📝 Input Fields

### Text Input
```jsx
className="input-field"
```
- Dark background with border
- Cyan border on focus
- Cyan glow ring on focus

## 🌍 Earth Background Usage

### Where to Use Earth Imagery:

1. **Landing Page (`/`)**
   - Large Earth view at bottom of hero section
   - Subtle Earth glow in background
   ```jsx
   <div className="relative min-h-screen earth-bg-bottom">
     {/* Content */}
   </div>
   ```

2. **Login/Signup Pages**
   - Earth or Moon as hero image (left side)
   - Creates immersive space theme
   ```jsx
   <div className="grid md:grid-cols-2">
     <div className="earth-bg-left">
       {/* Earth/Moon image */}
     </div>
     <div>{/* Form */}</div>
   </div>
   ```

3. **Onboarding/Tutorial Screens**
   - Earth in background with dark overlay
   - "Decisions that Matter" cards
   ```jsx
   <section className="relative earth-bg-top">
     <div className="relative z-10">{/* Content */}</div>
   </section>
   ```

4. **Country Selection Page**
   - Interactive Earth globe as background
   - Countries highlighted on Earth

5. **Mission Results/Complete**
   - Earth from orbit perspective
   - Shows impact of decisions

6. **Crisis Management**
   - Earth with visible space debris
   - Dramatic view showing urgency

### Background Utility Classes:

```css
/* Top glow effect */
.earth-bg-top

/* Bottom glow effect */
.earth-bg-bottom

/* Cyan glow around elements */
.earth-glow
```

## 📐 Typography

### Font Family
- Primary: `Inter`, `Segoe UI`
- Clean, modern sans-serif
- Good readability at all sizes

### Font Sizes
- **Section Title**: `text-4xl md:text-5xl` (36px-48px)
- **Subsection**: `text-2xl md:text-3xl` (24px-30px)
- **Body**: `text-base` (16px)
- **Small**: `text-sm` (14px)

### Font Weights
- **Headings**: `font-semibold` (600)
- **Body**: `font-normal` (400)
- **Buttons**: `font-semibold` (600)

### Letter Spacing
- Body: `0.01em` (slight tracking)
- Headings: `-0.02em` (tight for modern look)

## 🎭 Animations

### Hover Effects
- Buttons: Scale 102% with glow
- Cards: Scale 102% with cyan border glow
- Duration: 300ms ease

### Loading States
- Spinner with cyan color
- Pulse effect for loading text

### Page Transitions
- Fade in from opacity 0
- Slide up from y: 20px
- Duration: 500-800ms

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Grid Layouts
- Cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Forms: `grid-cols-1 md:grid-cols-2`
- Full width on mobile, responsive on larger screens

## 🌟 Special Effects

### Star Field Background
```jsx
className="star-field"
```
- Animated stars moving slowly
- Creates depth and space atmosphere

### Glass Effect
```jsx
className="glass-effect"
```
- Frosted glass with backdrop blur
- Subtle transparency
- Perfect for overlays

### Glow Animation
```jsx
className="animate-glow"
```
- Pulsing cyan glow
- Great for important elements

## 🎯 Component Examples

### Button Example
```jsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="btn-primary"
>
  Launch Mission 🚀
</motion.button>
```

### Card Example
```jsx
<motion.div
  className="card-hover"
  whileHover={{ y: -5 }}
>
  <h3 className="subsection-title">Mission Builder</h3>
  <p className="text-gray-400">Design your spacecraft</p>
</motion.div>
```

### Input Example
```jsx
<div>
  <label className="block text-sm font-medium mb-2 text-gray-300">
    Mission Name
  </label>
  <input
    type="text"
    className="input-field"
    placeholder="Enter mission name..."
  />
</div>
```

## 📋 Design Checklist

When implementing a new component, ensure:

- ✅ Uses cyan (#00B4D8) for primary actions
- ✅ Dark background (#000000 or #0d1117) for cards
- ✅ Subtle borders (#30363d) for separation
- ✅ Rounded corners (8-12px)
- ✅ Hover effects with scale and glow
- ✅ Consistent spacing (p-4, p-6, p-8)
- ✅ Responsive grid layouts
- ✅ Proper font weights and letter spacing
- ✅ Framer Motion animations where appropriate
- ✅ Earth background for relevant pages

## 🚀 Implementation Priority

### Phase 1: Core Components (Immediate)
- ✅ Update button colors to cyan
- ✅ Update card backgrounds to dark
- ✅ Update input field styles
- ✅ Update scrollbar colors

### Phase 2: Page Updates (Next)
- Add Earth background to landing page
- Update login/signup with moon/Earth imagery
- Add onboarding tutorial cards with Earth
- Update country selection with Earth globe

### Phase 3: Enhanced Effects (Polish)
- Add Earth glow effects to results pages
- Implement crisis page with dramatic Earth view
- Add subtle Earth particles/atmosphere effects
- Enhance animations with Earth-themed transitions

## 💡 Best Practices

1. **Consistency**: Always use the defined color palette
2. **Contrast**: Ensure text is readable on all backgrounds
3. **Spacing**: Use Tailwind's spacing scale (4, 6, 8, 12)
4. **Accessibility**: Maintain WCAG AA contrast ratios
5. **Performance**: Use backdrop-blur sparingly
6. **Mobile First**: Design for mobile, enhance for desktop
7. **Theme**: Keep space/Earth theme consistent throughout

---

**Note**: This design system is based on the provided mockups and implements a clean, modern space exploration theme with cyan accents and Earth imagery.
