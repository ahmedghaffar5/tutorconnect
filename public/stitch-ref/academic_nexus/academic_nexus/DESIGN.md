---
name: Academic Nexus
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#684000'
  on-tertiary: '#ffffff'
  tertiary-container: '#885500'
  on-tertiary-container: '#ffd4a4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
  headline-sm:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The design system is built on the pillars of **clarity, progress, and mentorship**. It targets a multi-sided marketplace of students seeking growth and educators offering expertise. The aesthetic follows a **Corporate / Modern** approach with a focus on high legibility and a sense of organized calm. 

The emotional response should be one of "structured empowerment"—the interface stays out of the way of the learning content while providing a reliable framework for transactions and scheduling. We utilize generous whitespace to reduce cognitive load and a "soft-professional" tone that avoids being overly clinical or childish.

## Colors
The palette is rooted in a deep Indigo (`#4F46E5`) which represents authority, trust, and the academic tradition. This is paired with Emerald (`#10B981`) to signify personal growth, "green-for-go" success states, and financial stability for tutor payouts.

- **Primary (Indigo):** Used for main actions, navigation states, and brand-heavy elements.
- **Secondary (Emerald):** Reserved for success indicators, progress bars, and high-conversion growth areas.
- **Tertiary (Amber):** Used sparingly for alerts, rating stars, and notifications to provide a warm contrast.
- **Neutral (Slate/Gray):** A sophisticated range of grays manages the information hierarchy, with `#F8FAFC` for backgrounds and `#1E293B` for primary text.

## Typography
The system uses a pairing of **Geist** and **Inter**. Geist is utilized for headlines and labels to provide a precise, technical, and modern feel. Inter is the workhorse for all body copy and instructional text, ensuring maximum readability across all device types and user demographics.

- **Headlines:** Use Geist with tighter letter spacing for a punchy, professional look.
- **Body:** Use Inter with standard tracking to ensure comfort during long reading sessions (e.g., tutor bios or lesson notes).
- **Labels:** Use Geist Medium for buttons and data tags to maintain a sharp, utilitarian distinction from prose.

## Layout & Spacing
This design system utilizes a **12-column fluid grid** for desktop and a **single-column fluid layout** for mobile. The system is built on a 4px baseline grid to ensure mathematical harmony.

- **Desktop (1280px+):** 12 columns, 24px gutters, 40px+ margins.
- **Tablet (768px - 1024px):** 8 columns, 20px gutters, 24px margins.
- **Mobile (below 768px):** 4 columns, 16px gutters, 16px margins.

Whitespace is used aggressively to separate tutor listings and lesson modules, preventing the UI from feeling cluttered. Large 3xl (64px) vertical spacing is used to separate major sections on landing pages.

## Elevation & Depth
Depth is achieved through **ambient shadows** and **tonal layering**. We avoid heavy borders in favor of soft shadows that suggest a physical "stacking" of information.

- **Level 0 (Surface):** The base background layer (#F8FAFC).
- **Level 1 (Cards/Inputs):** White surface with a 1px border (#E2E8F0) or a very soft shadow (0px 1px 3px rgba(0,0,0,0.05)).
- **Level 2 (Dropdowns/Modals):** White surface with a more pronounced, diffused shadow (0px 10px 15px -3px rgba(0,0,0,0.1)).
- **Level 3 (Popovers):** Highest elevation with a deep shadow for focus.

Tutor cards should appear to "lift" slightly on hover using a subtle transition of the shadow depth.

## Shapes
We employ a **Rounded** shape language to make the educational environment feel approachable and modern. 

- **Standard Radius (8px):** Used for buttons, input fields, and small UI widgets.
- **Large Radius (16px / rounded-lg):** Used for cards, containers, and main content blocks.
- **Extra Large (24px / rounded-xl):** Used for hero sections, large modal containers, and decorative image wrappers to soften the professional tone.
- **Pill:** Reserved exclusively for status tags (e.g., "Online", "Verified") and category chips.

## Components
- **Buttons:** Primary buttons are solid Indigo with white text. Secondary buttons use a subtle Indigo ghost style (light blue tint background) with Indigo text. All buttons use 8px rounding and Geist Medium for labels.
- **Input Fields:** Clean white backgrounds with 1px Slate-200 borders. Focus states transition the border to Indigo with a subtle 3px Indigo-100 glow/ring.
- **Cards:** White backgrounds, 16px corner radius, and a subtle Slate-200 border. Use Lucide-react icons in Slate-400 for metadata (e.g., clock icon for duration, user icon for student count).
- **Chips/Badges:** Pill-shaped with a light tint of the status color (e.g., Emerald-50 background with Emerald-700 text for "Completed").
- **Lists:** Clean rows with 1px bottom borders, using generous 16px vertical padding for high touch-target accessibility on mobile.
- **Avatars:** Always circular for tutors and students, with a 2px white border when overlapping on "meeting" cards.