# Vista Neotech Design System
## Phase 3: Design Tokens & Component Foundation

**Last Updated:** February 5, 2026  
**Status:** Foundation Phase  
**Design Philosophy:** Quiet confidence, minimalist but authoritative, tech-forward without gimmicks

---

## 🎨 Color Palette

### Primary Brand Colors

Extracted from Vista Neotech logo and icon assets.

#### Primary Accent (Orange)
**Usage:** Primary CTAs, brand highlights, "Vista" text, key interactive elements

```css
--color-primary-orange: #FF7F00;        /* Vibrant orange - main brand color */
--color-primary-orange-light: #FFA64D; /* Lighter variant for hover states */
--color-primary-orange-dark: #CC6600;   /* Darker variant for pressed states */
```

**RGB:** `rgb(255, 127, 0)`  
**Accessibility:** WCAG AA compliant on white/dark backgrounds

---

#### Primary Neutrals (Grey Scale)
**Usage:** Body text, backgrounds, UI elements, "Neotech" text

```css
--color-neutral-charcoal: #545454;      /* Primary text - "Neotech" color */
--color-neutral-grey: #AAAAAA;          /* Secondary text - tagline color */
--color-neutral-light: #E5E5E5;         /* Borders, dividers */
--color-neutral-lighter: #F5F5F5;       /* Backgrounds */
--color-neutral-white: #FFFFFF;         /* Pure white */
--color-neutral-black: #000000;         /* Pure black - icon background */
```

**Hierarchy:**
- **Charcoal (#545454):** Primary headings, important text
- **Grey (#AAAAAA):** Secondary text, captions, taglines
- **Light (#E5E5E5):** Borders, subtle dividers
- **Lighter (#F5F5F5):** Section backgrounds, cards

---

### Secondary Accent Colors

Extracted from geometric icon - used for service differentiation, data visualization, interactive states.

#### Cyan Blue
**Usage:** Technology services, data visualization, secondary CTAs

```css
--color-accent-cyan: #00BCD4;           /* Vivid cyan blue */
--color-accent-cyan-light: #4DD0E1;     /* Light variant */
--color-accent-cyan-dark: #0097A7;      /* Dark variant */
```

**RGB:** `rgb(0, 188, 212)`  
**Semantic Meaning:** Innovation, clarity, technology

---

#### Lime Green
**Usage:** Growth services, success states, positive indicators

```css
--color-accent-green: #8BC34A;          /* Fresh lime green */
--color-accent-green-light: #AED581;    /* Light variant */
--color-accent-green-dark: #689F38;     /* Dark variant */
```

**RGB:** `rgb(139, 195, 74)`  
**Semantic Meaning:** Growth, sustainability, success

---

#### Warm Orange/Amber
**Usage:** Energy, creativity, innovation highlights (complements primary orange)

```css
--color-accent-amber: #FF9800;          /* Warm amber orange */
--color-accent-amber-light: #FFB74D;    /* Light variant */
--color-accent-amber-dark: #F57C00;     /* Dark variant */
```

**RGB:** `rgb(255, 152, 0)`  
**Semantic Meaning:** Energy, creativity, innovation

---

### Tertiary Colors (From Overlaps)

Created by semi-transparent overlapping shapes in icon - used for depth, backgrounds, subtle accents.

#### Teal (Blue + Green Overlap)
**Usage:** Backgrounds, subtle accents, depth layers

```css
--color-tertiary-teal: #26A69A;         /* Deep teal-blue */
--color-tertiary-teal-light: #4DB6AC;   /* Light variant */
--color-tertiary-teal-dark: #00796B;    /* Dark variant */
```

**RGB:** `rgb(38, 166, 154)`  
**Semantic Meaning:** Depth, sophistication, balance

---

#### Olive Green (Green + Orange Overlap)
**Usage:** Earth tones, grounding elements, secondary backgrounds

```css
--color-tertiary-olive: #8D6E63;        /* Muted olive/brown-green */
--color-tertiary-olive-light: #A1887F;  /* Light variant */
--color-tertiary-olive-dark: #5D4037;   /* Dark variant */
```

**RGB:** `rgb(141, 110, 99)`  
**Semantic Meaning:** Stability, grounding, reliability

---

#### Dark Brown-Green (Center Convergence)
**Usage:** Deep backgrounds, strong contrast, anchor elements

```css
--color-tertiary-dark: #3E2723;         /* Dark brownish-green */
--color-tertiary-dark-light: #5D4037;   /* Slightly lighter */
--color-tertiary-dark-base: #1B0000;    /* Deepest anchor */
```

**RGB:** `rgb(62, 39, 35)`  
**Semantic Meaning:** Authority, depth, foundation

---

## 🎯 Color Usage Guidelines

### Primary Hierarchy
1. **Primary Orange** → Main CTAs, brand highlights, key actions
2. **Charcoal Grey** → Primary text, headings, important content
3. **Accent Colors** → Service differentiation, data visualization, secondary actions

### Accessibility Standards
- **Text Contrast:** Minimum 4.5:1 for body text, 3:1 for large text
- **Interactive Elements:** Minimum 3:1 contrast ratio
- **Focus States:** 2px solid outline in primary orange
- **Color Blindness:** Never rely solely on color for information

### Dark Mode Support
```css
/* Light Mode (Default) */
--bg-primary: var(--color-neutral-white);
--text-primary: var(--color-neutral-charcoal);
--bg-secondary: var(--color-neutral-lighter);

/* Dark Mode */
[data-theme="dark"] {
  --bg-primary: var(--color-neutral-black);
  --text-primary: var(--color-neutral-light);
  --bg-secondary: var(--color-tertiary-dark);
}
```

---

## 📐 Typography

### Font Stack

**Primary Font:** Modern Sans-Serif (to be selected - Inter, Poppins, or custom)
**Fallback:** System font stack

```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### Type Scale

**Base Size:** 16px (1rem)  
**Line Height:** 1.6 (body), 1.2 (headings)

```css
--font-size-xs: 0.75rem;    /* 12px - Captions, labels */
--font-size-sm: 0.875rem;   /* 14px - Small text, metadata */
--font-size-base: 1rem;     /* 16px - Body text */
--font-size-lg: 1.125rem;   /* 18px - Large body, intro text */
--font-size-xl: 1.25rem;    /* 20px - Subheadings */
--font-size-2xl: 1.5rem;    /* 24px - Section headings */
--font-size-3xl: 1.875rem; /* 30px - Page headings */
--font-size-4xl: 2.25rem;   /* 36px - Hero headings */
--font-size-5xl: 3rem;     /* 48px - Display headings */
```

### Font Weights

```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Typography Patterns

**Headings:**
- H1: `font-size-5xl`, `font-weight-bold`, `color-neutral-charcoal`
- H2: `font-size-4xl`, `font-weight-bold`, `color-neutral-charcoal`
- H3: `font-size-3xl`, `font-weight-semibold`, `color-neutral-charcoal`
- H4: `font-size-2xl`, `font-weight-semibold`, `color-neutral-charcoal`

**Body Text:**
- Default: `font-size-base`, `font-weight-normal`, `color-neutral-charcoal`
- Large: `font-size-lg`, `font-weight-normal`, `color-neutral-charcoal`
- Small: `font-size-sm`, `font-weight-normal`, `color-neutral-grey`

**Tagline/Subtle Text:**
- Tagline: `font-size-sm`, `font-weight-light`, `color-neutral-grey`, `uppercase`, `letter-spacing: 0.1em`

---

## 📏 Spacing System

### Base Unit
**8px grid system** - All spacing multiples of 8px

```css
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */
--spacing-32: 8rem;     /* 128px */
```

### Component Spacing

```css
--component-padding-sm: var(--spacing-4);   /* 16px */
--component-padding-md: var(--spacing-6);   /* 24px */
--component-padding-lg: var(--spacing-8);   /* 32px */
--component-padding-xl: var(--spacing-12);  /* 48px */

--section-padding-sm: var(--spacing-8);     /* 32px */
--section-padding-md: var(--spacing-12);    /* 48px */
--section-padding-lg: var(--spacing-16);     /* 64px */
--section-padding-xl: var(--spacing-24);    /* 96px */
```

---

## 🔲 Border Radius

```css
--radius-none: 0;
--radius-sm: 0.25rem;   /* 4px - Small elements */
--radius-md: 0.5rem;    /* 8px - Buttons, cards */
--radius-lg: 0.75rem;   /* 12px - Large cards */
--radius-xl: 1rem;      /* 16px - Modals, containers */
--radius-full: 9999px;  /* Pills, avatars */
```

---

## 🌊 Shadows & Elevation

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
             0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
             0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
             0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

---

## ⚡ Motion & Transitions

### Duration
```css
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
```

### Easing
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Motion Principles
- **Micro-interactions:** Fast (150ms), subtle
- **Page transitions:** Normal (250ms), smooth
- **Complex animations:** Slow (350ms), deliberate
- **Reduce motion:** Respect `prefers-reduced-motion`

---

## 🧩 Component Patterns

### Buttons

**Primary Button:**
- Background: `--color-primary-orange`
- Text: White
- Padding: `--spacing-4` `--spacing-6`
- Border Radius: `--radius-md`
- Hover: `--color-primary-orange-dark`
- Focus: 2px solid outline

**Secondary Button:**
- Background: Transparent
- Border: 2px solid `--color-primary-orange`
- Text: `--color-primary-orange`
- Hover: Background `--color-primary-orange`, text white

**Ghost Button:**
- Background: Transparent
- Text: `--color-neutral-charcoal`
- Hover: Background `--color-neutral-lighter`

### Cards

- Background: White
- Border: 1px solid `--color-neutral-light`
- Border Radius: `--radius-lg`
- Shadow: `--shadow-md`
- Padding: `--component-padding-md`
- Hover: Shadow `--shadow-lg`, slight lift

### Forms

- Input Border: 1px solid `--color-neutral-light`
- Input Focus: 2px solid `--color-primary-orange`
- Input Padding: `--spacing-4`
- Label: `--color-neutral-charcoal`, `--font-weight-medium`
- Error State: Border `--color-error` (to be defined)

---

## 🎭 Multi-Brand Support

### Brand Color Overrides

Each brand/sub-site can override primary accent while maintaining neutral foundation:

```css
/* Brand A - Digital Transformation */
[data-brand="digital-transformation"] {
  --brand-primary: var(--color-accent-cyan);
}

/* Brand B - Growth Services */
[data-brand="growth-services"] {
  --brand-primary: var(--color-accent-green);
}

/* Brand C - Innovation Labs */
[data-brand="innovation-labs"] {
  --brand-primary: var(--color-accent-amber);
}
```

---

## 📱 Responsive Breakpoints

```css
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

---

## ✅ Design Principles

1. **Quiet Confidence:** Subtle, refined, never loud
2. **Minimalist but Authoritative:** Clean, purposeful, strong
3. **Tech-Forward without Gimmicks:** Modern, functional, no trends
4. **Premium & Custom:** Never template-like, always bespoke
5. **Accessibility First:** WCAG AA minimum, AAA where possible

---

## 📚 Implementation Notes

### CSS Variables Structure
All design tokens will be implemented as CSS custom properties for:
- Theme switching (light/dark)
- Multi-brand support
- Runtime customization
- Maintainability

### Tailwind Integration
Design tokens will be mapped to Tailwind config for utility-first development while maintaining design system consistency.

---

**Next Steps:**
1. Select primary typeface (Inter/Poppins/custom)
2. Create component library (`COMPONENT_LIBRARY.tsx`)
3. Implement design tokens in code
4. Build foundational components (Button, Card, Input, etc.)

---

**Document Owner:** Design System Team  
**Review Cycle:** As design evolves  
**Last Review:** TBD
