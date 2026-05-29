---
name: Aprenda Aqui!
colors:
  surface: '#faf9f8'
  surface-dim: '#dadad9'
  surface-bright: '#faf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f2'
  surface-container: '#eeeeec'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e1'
  on-surface: '#1a1c1b'
  on-surface-variant: '#3f4a36'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#6f7b64'
  outline-variant: '#becbb1'
  surface-tint: '#2b6c00'
  primary: '#2b6c00'
  on-primary: '#ffffff'
  primary-container: '#58cc02'
  on-primary-container: '#1e5000'
  inverse-primary: '#6be026'
  secondary: '#575a89'
  on-secondary: '#ffffff'
  secondary-container: '#c6c8fd'
  on-secondary-container: '#4f5280'
  tertiary: '#755b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#ddad00'
  on-tertiary-container: '#574300'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#87fe45'
  primary-fixed-dim: '#6be026'
  on-primary-fixed: '#082100'
  on-primary-fixed-variant: '#1f5100'
  secondary-fixed: '#e0e0ff'
  secondary-fixed-dim: '#c0c2f7'
  on-secondary-fixed: '#141742'
  on-secondary-fixed-variant: '#404370'
  tertiary-fixed: '#ffdf92'
  tertiary-fixed-dim: '#f4bf00'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#faf9f8'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e1'
typography:
  display-lg:
    fontFamily: Nunito Sans
    fontSize: 48px
    fontWeight: '900'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Nunito Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
  headline-lg:
    fontFamily: Nunito Sans
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 32px
  headline-md:
    fontFamily: Nunito Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Nunito Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 36px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1200px
  gutter: 16px
---

## Brand & Style
The design system is built to evoke the high-energy, rewarding atmosphere of a premium mobile game. The brand personality is encouraging, vibrant, and "bouncy," transforming the often-intimidating world of programming into an approachable adventure. 

The aesthetic sits at the intersection of **High-Contrast / Bold** and **Tactile**. It utilizes thick strokes, vibrant saturated colors, and 3D-inspired depth to make every interaction feel physical and satisfying. The target audience includes students and career-switchers who value engagement and immediate feedback. The goal is to reduce cognitive load through playfulness, making the learning process feel less like "work" and more like "play."

## Colors
The palette is dominated by "Electric Green," symbolizing growth and energy. 
- **Primary (Electric Green):** Used for primary actions, success states, and progress indicators.
- **Secondary (Deep Navy):** Provides a grounding contrast, used for text, navigation bars, and "hard" UI elements to ensure readability.
- **Tertiary (Golden Yellow):** Reserved for achievements, streaks, and premium features to signify value.
- **Background:** Pure white is used to maintain high legibility, with the "Light Green Accent" used for subtle container backgrounds and decorative flourishes.

All interactive elements must maintain high contrast ratios against the white background to ensure accessibility.

## Typography
The typography strategy uses a "Chunky-and-Clean" pairing. 
- **Nunito Sans** handles all display and heading roles. Its rounded terminals and heavy weights reinforce the friendly, game-like character of the interface. 
- **Plus Jakarta Sans** is used for body copy and UI labels. Its modern, open counters ensure that technical programming concepts remain easy to read even in long-form text.

For mobile screens, display sizes are capped to prevent overflow, while maintaining a minimum body size of 16px to ensure comfortable reading during long coding sessions.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a heavy emphasis on mobile-first verticality. 
- **Mobile:** 4-column grid with 16px margins.
- **Tablet/Desktop:** 12-column grid with a maximum container width of 1200px.

Spacing is generous to prevent the UI from feeling cluttered. We use an 8px base unit. Components like cards and lesson modules should use "md" (24px) padding to maintain a premium, spacious feel. Elements are often grouped within large white containers to separate different phases of a lesson or gamified path.

## Elevation & Depth
Depth in this design system is achieved through **Tactile Offset Layers** rather than realistic lighting. 
- **Primary Elevation:** Interactive elements like buttons and active cards use a "Block Shadow"—a solid, non-blurred offset (usually 4px to 6px) in a darker shade of the element's base color. This creates a "pressable" 3D effect.
- **Surface Elevation:** Passive containers use a very soft, diffused ambient shadow (10% opacity) to lift them slightly off the background without creating visual noise.
- **Interactive State:** On "Hover" or "Active" states, the offset shadow should decrease or disappear, simulating the physical act of pushing a button down into the screen.

## Shapes
The shape language is dominated by **extreme roundedness**. 
- Buttons and progress bars are always **Pill-shaped** (full radius).
- Cards and Modals use a **24px to 32px corner radius** (rounded-xl) to maintain a soft, friendly silhouette.
- Avoid sharp 90-degree angles entirely, as they conflict with the playful brand narrative. Even icons and progress indicators should feature rounded caps and corners.

## Components

### Buttons
Buttons are the primary vehicle for the "bouncy" feel. They feature a solid 4px bottom border (shadow) in a darker shade. For example, the Primary Green button has a #46A302 bottom shadow. On click, the button shifts down by 2px to simulate a physical press.

### Progress Bars
Chunky, pill-shaped bars. The "track" is a light gray or a desaturated version of the primary color, and the "fill" is the Electric Green. A subtle inner-white-glow at the top of the fill adds a 3D "gel" effect.

### Lesson Cards
White background with a 2px stroke in #E5E5E5. When a card is "Selected," the stroke changes to Electric Green (#58CC02) and a light green tint (#F0FFF0) is applied to the background.

### Input Fields
Large, rounded-xl inputs with a thick 2px border. Focus states should use the Deep Navy (#1C1F4A) for the border to indicate "Serious Input Mode" while maintaining the rounded aesthetic.

### Feedback Toasts (Snackbars)
Animated pops that appear from the bottom. Success toasts are Electric Green with white text; error toasts are vibrant Coral/Red. Both use the chunky Nunito Sans font for immediate impact.

### Game Icons
Icons should be thick-stroked (2pt minimum) with rounded joins. They are often encased in a circular "coin" or "badge" container to reinforce the gamification theme.