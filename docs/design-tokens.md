# JembaTani — Design Tokens

Single source of truth untuk design system JembaTani. File ini wajib di-attach atau di-copy ke setiap prompt (AI Studio maupun Claude Code) supaya implementasi konsisten.

**System:** Material Design 3 semantic tokens
**Theme scope:** Light mode V1 (dark mode tokens reserved untuk fase berikutnya)
**Font system:** Fraunces (display) + Plus Jakarta Sans (body)

---

## 1. Color Tokens (Light Mode)

### Semantic Naming Convention

Gunakan **semantic names**, bukan literal color names. Contoh:

- ✅ `bg-surface text-on-surface` — semantic, akan otomatis pair dengan benar
- ❌ `bg-cream text-charcoal` — literal, susah maintain

Setiap warna background punya pasangan foreground (`on-*`):

- `primary` → text di atasnya pakai `on-primary`
- `secondary-container` → text di atasnya pakai `on-secondary-container`
- `surface` → text di atasnya pakai `on-surface`

### Full Color Token List

```typescript
export const colors = {
  // Surfaces — hierarchical elevation without shadows
  surface: '#fcf9f4', // Default background
  'surface-dim': '#dcdad5', // Dimmed surface (for emphasis on others)
  'surface-bright': '#fcf9f4', // Bright surface (same as default)
  'surface-container-lowest': '#ffffff', // White cards (modal, elevated)
  'surface-container-low': '#f6f3ee', // Slight lift from background
  'surface-container': '#f0ede9', // Standard cards
  'surface-container-high': '#ebe8e3', // Higher elevation cards
  'surface-container-highest': '#e5e2dd', // Highest elevation (nav bars)

  // On-surface (foreground colors paired with surfaces)
  'on-surface': '#1c1c19', // Primary text on any surface
  'on-surface-variant': '#424843', // Secondary text, captions
  'inverse-surface': '#31302d', // Dark surface (snackbars, toasts)
  'inverse-on-surface': '#f3f0eb', // Text on inverse-surface

  // Outlines
  outline: '#727972', // Strong borders, dividers
  'outline-variant': '#c2c8c1', // Subtle borders (default for cards)
  'surface-tint': '#466551', // Tint overlay color

  // Primary — Deep forest (brand, primary actions)
  primary: '#082717', // Primary buttons, key actions
  'on-primary': '#ffffff', // Text on primary
  'primary-container': '#1f3d2b', // Lighter forest for containers
  'on-primary-container': '#87a890', // Text on primary-container
  'inverse-primary': '#accfb6', // Primary on dark backgrounds

  // Secondary — Warm red (CTAs, prices, urgency)
  secondary: '#b22a16', // Primary CTAs (Tawar, Beli)
  'on-secondary': '#ffffff',
  'secondary-container': '#fc5f44', // Brighter red for emphasis
  'on-secondary-container': '#5e0700',

  // Tertiary — Dark amber (premium, organic, featured)
  tertiary: '#2d1f00', // Premium category labels
  'on-tertiary': '#ffffff',
  'tertiary-container': '#483300',
  'on-tertiary-container': '#c99820',

  // Error
  error: '#ba1a1a',
  'on-error': '#ffffff',
  'error-container': '#ffdad6',
  'on-error-container': '#93000a',

  // Fixed colors (don't change between light/dark)
  'primary-fixed': '#c8ebd1',
  'primary-fixed-dim': '#accfb6',
  'on-primary-fixed': '#022111',
  'on-primary-fixed-variant': '#2f4d3a',
  'secondary-fixed': '#ffdad3',
  'secondary-fixed-dim': '#ffb4a6',
  'on-secondary-fixed': '#3f0300',
  'on-secondary-fixed-variant': '#900f00',
  'tertiary-fixed': '#ffdea2',
  'tertiary-fixed-dim': '#f5be46', // Gold accent for star ratings, badges
  'on-tertiary-fixed': '#261900',
  'on-tertiary-fixed-variant': '#5c4200',

  // Background (same as surface)
  background: '#fcf9f4',
  'on-background': '#1c1c19',
  'surface-variant': '#e5e2dd',
};
```

### Color Usage Guide

| Use Case                          | Token                                                                    |
| --------------------------------- | ------------------------------------------------------------------------ |
| Page background                   | `bg-surface`                                                             |
| Default text                      | `text-on-surface`                                                        |
| Caption / metadata text           | `text-on-surface-variant`                                                |
| Cards default                     | `bg-surface-container-lowest` (white) with `border-outline-variant`      |
| Cards subtle                      | `bg-surface-container-low`                                               |
| Bottom nav bar                    | `bg-surface-container-highest`                                           |
| Primary button                    | `bg-primary text-on-primary`                                             |
| Primary CTA outlined              | `border-primary text-primary`                                            |
| Price text emphasis (Tawar, Beli) | `text-secondary`                                                         |
| Action CTA button (Tawar/Beli)    | `bg-secondary text-on-secondary`                                         |
| Featured/premium badge            | `bg-tertiary-fixed text-on-tertiary-fixed`                               |
| Star rating / gold accent         | `text-tertiary-fixed-dim`                                                |
| Subtle card borders               | `border-outline-variant`                                                 |
| Strong dividers                   | `border-outline`                                                         |
| Error state                       | `bg-error text-on-error` or `bg-error-container text-on-error-container` |
| Success toast (dark)              | `bg-inverse-surface text-inverse-on-surface`                             |

---

## 2. Typography Tokens

### Type Scale

```typescript
export const typography = {
  'display-lg': {
    fontFamily: 'Fraunces',
    fontSize: '56px',
    fontWeight: '600',
    lineHeight: '64px',
    letterSpacing: '-0.02em',
  },
  'display-lg-mobile': {
    fontFamily: 'Fraunces',
    fontSize: '40px',
    fontWeight: '600',
    lineHeight: '48px',
    letterSpacing: '-0.01em',
  },
  'headline-lg': {
    fontFamily: 'Fraunces',
    fontSize: '32px',
    fontWeight: '500',
    lineHeight: '40px',
  },
  'headline-md': {
    fontFamily: 'Fraunces',
    fontSize: '24px',
    fontWeight: '500',
    lineHeight: '32px',
  },
  'body-lg': {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: '18px',
    fontWeight: '400',
    lineHeight: '28px',
  },
  'body-md': {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '24px',
  },
  'label-md': {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '20px',
    letterSpacing: '0.02em',
  },
  'numeral-xl': {
    fontFamily: 'Fraunces',
    fontSize: '48px',
    fontWeight: '700',
    lineHeight: '48px',
  },
};
```

### Typography Usage Guide

| Use Case                                 | Token                                                 | Notes                                               |
| ---------------------------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| Splash screen hero, marketing display    | `display-lg` (desktop) / `display-lg-mobile` (mobile) | Fraunces, large statements                          |
| Page title (Beranda, Harga, Pesan, Akun) | `headline-lg` or `headline-md`                        | Fraunces serif                                      |
| Card title (product name)                | `headline-md`                                         | Fraunces 24px                                       |
| Product description, body content        | `body-md`                                             | Plus Jakarta Sans 16px                              |
| Long-form content (e.g., post caption)   | `body-lg`                                             | Plus Jakarta Sans 18px                              |
| Button labels, chip labels, tags         | `label-md`                                            | Plus Jakarta Sans 14px semibold with letter-spacing |
| Price display in spotlight cards         | `numeral-xl`                                          | Fraunces 48px bold with tabular-nums                |
| Captions, timestamps, metadata           | `label-md` with `text-on-surface-variant`             | Smaller, muted                                      |

### Critical Typography Rules

1. **Always apply `font-variant-numeric: tabular-nums`** on Fraunces when displaying numbers (prices, quantities, percentages)
2. **Sentence case** for all headlines (not Title Case, not UPPERCASE)
3. **Generous line heights** preserved as specified — don't tighten
4. **ALL CAPS only for chip labels** (e.g., "ORGANIC", "GRADE A") with `label-md` token

---

## 3. Spacing & Layout Tokens

### Spacing Scale (base-8)

```typescript
export const spacing = {
  base: '8px', // Unit base
  'margin-mobile': '20px',
  'margin-desktop': '64px',
  gutter: '24px',
  'section-gap': '80px', // Vertical breathing room between major sections
};

// Tailwind already has 4/8/12/16/20/24/32/40/48/56/64/80px increments via numeric scale
// Use: p-2 (8px), p-3 (12px), p-4 (16px), p-5 (20px), p-6 (24px), p-8 (32px), p-10 (40px), p-20 (80px)
```

### Grid Specs

| Breakpoint          | Width  | Columns    | Margins    | Gutters     |
| ------------------- | ------ | ---------- | ---------- | ----------- |
| Mobile (default)    | 375px+ | 4 columns  | 20px outer | 16px gutter |
| Desktop             | 1440px | 12 columns | 64px outer | 24px gutter |
| Container max-width | 1280px |            |            |             |

For JembaTani mobile-first portfolio: target **390px viewport baseline** with **max-width 480px centered** on larger screens (acts as a phone preview wrapper on desktop).

---

## 4. Border Radius Tokens

```typescript
export const borderRadius = {
  sm: '0.25rem', // 4px — small chips inline
  DEFAULT: '0.5rem', // 8px — small inputs, badges
  md: '0.75rem', // 12px — medium components
  lg: '1rem', // 16px — STANDARD for cards, buttons, image containers
  xl: '1.5rem', // 24px — large modal sheets, hero containers
  full: '9999px', // Full pill for chips, avatars, toggle switches
};
```

### Radius Usage Guide

| Element                          | Radius                         |
| -------------------------------- | ------------------------------ |
| Cards (post, commodity, profile) | `rounded-lg` (16px)            |
| Primary buttons                  | `rounded-lg` (16px)            |
| Image containers in cards        | `rounded-lg` (16px)            |
| Input fields                     | `rounded` (8px)                |
| Chips, badges, tags              | `rounded-full`                 |
| Avatars                          | `rounded-full`                 |
| Bottom sheet modal top corners   | `rounded-t-xl` (24px top only) |
| Pill toggle switches             | `rounded-full`                 |

**Important rule from design system:** Avoid `rounded-md` for cards — design system specifies 16px (`rounded-lg`) as standard.

---

## 5. Elevation & Depth

**No drop shadows.** Depth comes from tonal layering using surface-container variants.

| Elevation Level    | Implementation                                                   |
| ------------------ | ---------------------------------------------------------------- |
| Base (background)  | `bg-surface`                                                     |
| +1 (subtle card)   | `bg-surface-container-low`                                       |
| +2 (default card)  | `bg-surface-container-lowest` (white) + `border-outline-variant` |
| +3 (elevated card) | `bg-surface-container-low` + `border-outline-variant`            |
| +4 (modal, drawer) | `bg-surface-container-lowest` (white)                            |
| +5 (bottom nav)    | `bg-surface-container-highest` + top `border-outline-variant`    |

For "press" state on interactive elements:

- Border thickness increases (1px → 1.5px)
- OR slight inset translate (translate-y-px) — NOT shadow

---

## 6. Tailwind Config Ready-to-Paste

Save sebagai `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#fcf9f4',
        'surface-dim': '#dcdad5',
        'surface-bright': '#fcf9f4',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f6f3ee',
        'surface-container': '#f0ede9',
        'surface-container-high': '#ebe8e3',
        'surface-container-highest': '#e5e2dd',
        'on-surface': '#1c1c19',
        'on-surface-variant': '#424843',
        'inverse-surface': '#31302d',
        'inverse-on-surface': '#f3f0eb',
        outline: '#727972',
        'outline-variant': '#c2c8c1',
        'surface-tint': '#466551',
        primary: '#082717',
        'on-primary': '#ffffff',
        'primary-container': '#1f3d2b',
        'on-primary-container': '#87a890',
        'inverse-primary': '#accfb6',
        secondary: '#b22a16',
        'on-secondary': '#ffffff',
        'secondary-container': '#fc5f44',
        'on-secondary-container': '#5e0700',
        tertiary: '#2d1f00',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#483300',
        'on-tertiary-container': '#c99820',
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        'primary-fixed': '#c8ebd1',
        'primary-fixed-dim': '#accfb6',
        'on-primary-fixed': '#022111',
        'on-primary-fixed-variant': '#2f4d3a',
        'secondary-fixed': '#ffdad3',
        'secondary-fixed-dim': '#ffb4a6',
        'on-secondary-fixed': '#3f0300',
        'on-secondary-fixed-variant': '#900f00',
        'tertiary-fixed': '#ffdea2',
        'tertiary-fixed-dim': '#f5be46',
        'on-tertiary-fixed': '#261900',
        'on-tertiary-fixed-variant': '#5c4200',
        background: '#fcf9f4',
        'on-background': '#1c1c19',
        'surface-variant': '#e5e2dd',
      },
      fontFamily: {
        fraunces: ['Fraunces', 'serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['56px', { lineHeight: '64px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-lg-mobile': [
          '40px',
          { lineHeight: '48px', letterSpacing: '-0.01em', fontWeight: '600' },
        ],
        'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '500' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.02em', fontWeight: '600' }],
        'numeral-xl': ['48px', { lineHeight: '48px', fontWeight: '700' }],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      spacing: {
        'margin-mobile': '20px',
        'margin-desktop': '64px',
        gutter: '24px',
        'section-gap': '80px',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 7. Google Fonts Import

Add to `index.html` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

Or via CSS `@import` in `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #1c1c19;
    background-color: #fcf9f4;
  }
}
```

---

## 8. Component Token Mapping (Quick Reference)

### Primary Button

```tsx
className = 'bg-primary text-on-primary rounded-lg px-8 py-4 text-label-md font-jakarta';
```

### Secondary CTA (Tawar/Beli — uses warm red)

```tsx
className = 'bg-secondary text-on-secondary rounded-lg px-8 py-4 text-label-md font-jakarta';
```

### Outlined Button

```tsx
className =
  'border border-outline-variant text-primary rounded-lg px-8 py-4 text-label-md font-jakarta hover:bg-surface-container-low';
```

### Card (Post Card)

```tsx
className = 'bg-surface-container-lowest border border-outline-variant rounded-lg p-6';
```

### Input Field

```tsx
className =
  'bg-surface-container-lowest border border-outline-variant rounded text-body-md font-jakarta px-4 py-3 focus:border-primary focus:border-[1.5px]';
```

### Chip (Category)

```tsx
className =
  'bg-primary-fixed text-on-primary-fixed-variant rounded-full px-4 py-1.5 text-label-md uppercase';
```

### Premium / Featured Badge

```tsx
className = 'bg-tertiary-fixed text-on-tertiary-fixed rounded-full px-3 py-1 text-label-md';
```

### Price Display (large, in spotlight)

```tsx
className = 'text-numeral-xl font-fraunces text-on-surface tabular-nums';
```

### Page Title

```tsx
className = 'text-headline-lg font-fraunces text-on-surface';
```

### Bottom Nav Background

```tsx
className = 'bg-surface-container-highest border-t border-outline-variant';
```

---

## 9. Icon System

**Library:** `lucide-react`

- Linear style with slightly rounded terminals (matches design system spec)
- Comprehensive set: 1400+ icons
- Tree-shakeable, lightweight

**Installation:**

```bash
npm install lucide-react
```

**Usage:**

```tsx
import { Home, TrendingUp, Plus, MessageCircle, User } from 'lucide-react';

<Home className="w-6 h-6 text-on-surface" strokeWidth={1.5} />;
```

**Icon size standards:**

- Inline icons: `w-5 h-5` (20px)
- Standard UI icons: `w-6 h-6` (24px)
- Bottom nav icons: `w-7 h-7` (28px)
- Large feature icons: `w-8 h-8` (32px)

**Stroke width:** Use `strokeWidth={1.5}` for editorial feel (default lucide is 2 which can feel heavy)

---

## 10. Dark Mode Reservation (for future)

Tokens already provided in palette but NOT used in V1:

- `inverse-surface`, `inverse-on-surface` — for future snackbars/toasts
- `inverse-primary` — for primary action on dark backgrounds

When V2 dark mode is enabled, additional dark color tokens will be added with corresponding semantic structure. Don't worry about this for V1.

---

## 11. How to Use This File in Prompts

**For AI Studio:**

- Copy section 6 (Tailwind config) and section 7 (Fonts) into your master prompt
- Reference section 8 (Component mapping) when AI Studio asks about specific component styling

**For Claude Code:**

- Save this file at `docs/design-tokens.md` in your repo
- Reference it in every refactor prompt: "Follow the design tokens in docs/design-tokens.md"
- Use tailwind.config.ts from section 6 as the actual config file

**For yourself:**

- This is the single source of truth — if you want to change a token, change it here first, then propagate
- When introducing a new component, check section 1 for token availability before creating new colors
