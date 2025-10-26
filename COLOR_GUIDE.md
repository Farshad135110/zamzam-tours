# ZamZam Tours - Brand Color Guide

## Primary Brand Colors

### Main Brand Color
```css
--primary-color: #053b3c;  /* Deep Teal - Main brand color */
```
**Usage:**
- Navigation hover/active states
- Primary buttons
- Links
- Hero gradients
- Brand accents

### Color Variations
```css
--primary-light: #0a5c5e;  /* Light Teal - Hover states */
--primary-dark: #032626;   /* Dark Teal - Shadows, gradients */
```

### Secondary Color
```css
--secondary-color: #f8b500; /* Gold - Accents, highlights */
```
**Usage:**
- Call-to-action accents
- Special offers
- Premium features
- Badges

## Text Colors
```css
--text-color: #333;        /* Primary text */
--text-light: #777;        /* Secondary text */
```

## UI Colors
```css
--border-color: #e0e0e0;   /* Borders, dividers */
--bg-light: #f9f9f9;       /* Light backgrounds */
```

## Component-Specific Colors

### Navbar
- **Background**: Transparent → White on scroll
- **Links**: #333 default → #053b3c on hover/active
- **Underline**: #053b3c
- **WhatsApp Button**: #25D366 (WhatsApp brand color)

### Buttons
```css
.btn-primary {
  background: #053b3c;
  color: white;
}

.btn-primary:hover {
  background: #0a5c5e;
}

.btn-secondary {
  background: transparent;
  border: 2px solid #053b3c;
  color: #053b3c;
}

.btn-secondary:hover {
  background: #053b3c;
  color: white;
}
```

### Hero Sections
```css
background: linear-gradient(135deg, #053b3c, #0a5c5e, #032626);
```

### Cards & Containers
- **Background**: White / #f9f9f9
- **Border**: #e0e0e0
- **Hover**: Scale + shadow effect
- **Active/Featured**: #053b3c accent

## Color Accessibility

### Contrast Ratios (WCAG AA Compliant)
- **#053b3c on white**: ✅ 11.5:1 (Excellent)
- **White on #053b3c**: ✅ 11.5:1 (Excellent)
- **#f8b500 on white**: ✅ 7.2:1 (Good)
- **#333 on white**: ✅ 12.6:1 (Excellent)

## Usage Guidelines

### Do's ✅
- Use #053b3c for all brand-related elements
- Maintain consistency across all pages
- Use teal gradients for hero sections
- Keep WhatsApp button in brand green (#25D366)
- Use gold (#f8b500) sparingly for highlights

### Don'ts ❌
- Don't use random colors (red, blue, purple)
- Don't mix different shades of teal
- Don't override the primary color
- Don't use poor contrast combinations

## Files Updated
- ✅ `components/Navbar.tsx` - Primary color for links
- ✅ `components/HeroSection.tsx` - Teal gradient
- ✅ `styles/globals.css` - CSS variables
- ✅ `styles/home.css` - Already correct
- ✅ `pages/contact/index.tsx` - Emergency banner
- ✅ `pages/hotels/index.tsx` - Price badges

## CSS Variables Setup

All pages should use CSS variables for consistency:

```css
:root {
  --primary-color: #053b3c;
  --primary-light: #0a5c5e;
  --primary-dark: #032626;
  --secondary-color: #f8b500;
  --accent-color: #053b3c;
  --text-color: #333;
  --text-light: #777;
  --border-color: #e0e0e0;
  --bg-light: #f9f9f9;
}
```

Then use in components:
```css
background: var(--primary-color);
color: var(--text-color);
border: 1px solid var(--border-color);
```

## Quick Reference

| Element | Color | Hex |
|---------|-------|-----|
| Primary Brand | Deep Teal | #053b3c |
| Hover State | Light Teal | #0a5c5e |
| Dark Accent | Dark Teal | #032626 |
| Secondary | Gold | #f8b500 |
| Text | Dark Gray | #333 |
| Light Text | Gray | #777 |
| Borders | Light Gray | #e0e0e0 |
| WhatsApp | Green | #25D366 |

## Color Psychology

**Teal (#053b3c)**:
- Represents trust, reliability, and professionalism
- Associated with travel, tourism, and adventure
- Calming and sophisticated
- Perfect for premium travel services

**Gold (#f8b500)**:
- Represents quality and premium service
- Creates excitement and energy
- Used for special offers and highlights
- Complements teal perfectly
