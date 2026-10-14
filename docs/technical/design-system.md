---
name: Precision Slate
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
  on-surface-variant: '#464554'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#6b38d4'
  on-tertiary: '#ffffff'
  tertiary-container: '#8455ef'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
---

## Brand & Style

This design system channels the engineered precision of modern developer platforms like Stripe and Shadcn UI, tailored for high-velocity gaming commerce and administrative ecosystems. The tone is restrained, authoritative, and frictionless—eliminating aesthetic noise in favor of data legibility, typographic rhythm, and immediate visual hierarchy.

The aesthetic marries **Minimalism** with subtle **Tactile Precision**:
- Crisp slate surface boundaries instead of dramatic drop shadows.
- Micro-interactions that emphasize speed, feedback, and deterministic state transitions.
- A balanced density model that satisfies power users monitoring live revenue, transaction logs, and gaming inventory without overwhelming the eye.

## Colors

The palette operates under an ultra-clean, high-legibility light mode structure:

- **Canvas & Surfaces**: The base application canvas rests at `#f8fafc` (Slate 50). Interactive containers, panels, and data tables emerge at `#ffffff` (Pure White). Subdued card headers and nested utility bars use `#f1f5f9` (Slate 100).
- **Dividers & Structural Borders**: Defined by `#e2e8f0` (Slate 200) for primary borders and `#cbd5e1` (Slate 300) for interactive control boundaries.
- **Typography & Neutrals**: Headings and primary metrics anchor at `#0f172a` (Slate 900). Secondary labels and operational meta text sit at `#475569` (Slate 600) and `#64748b` (Slate 500). Disabled states rely on `#94a3b8` (Slate 400).
- **Accents & Telemetry**:
  - **Indigo (`#6366f1`)**: Primary actions, focused tab states, selection rings, and key callouts.
  - **Violet (`#8b5cf6`)**: Secondary transactional highlights, gaming item tiers, and secondary metrics.
  - **Emerald (`#10b981`)**: Positive yields, successful payouts, and live status indications.
  - **Rose (`#f43f5e`)**: Chargebacks, failed transactions, and critical warnings.
  - **Amber (`#f59e0b`)**: Pending settlements and inventory escrow.
- **Pastel Status Badges**: Tinted badge fills use 10% opacity tints against their solid counterparts with 20% border rings (e.g., `#ecfdf5` fill with `#a7f3d0` border and `#065f46` text for success states).

## Typography

The type system utilizes **Geist** across all structural display and body roles, providing cold precision, tight tracking, and exceptional readability at tabular scales. **JetBrains Mono** handles all technical identifiers, SKUs, hash keys, currency tallies, and status tags, delivering an unmistakable technical edge suited for commerce operations.

- Tabular figures (`tnum`) must be enforced for all currency values, analytics counts, and metrics to prevent horizontal jitter during real-time streaming updates.
- Section headers above 20px leverage negative tracking (`-0.02em`) to maintain editorial density without sacrificing legibility.

## Layout & Spacing

The layout is structured around an adaptive 12-column fluid grid paired with a rigid 4px baseline rhythm:

- **Desktop (1280px+)**: 12-column grid, 24px (`gutter-desktop`) gutters, and 32px (`margin-desktop`) outer margins. Side navigation remains pinned at 240px or collapses to a 64px icon bar. Max-width content boundaries cap at 1600px for super-wide dashboard monitors.
- **Tablet (768px - 1279px)**: 8-column layout with 16px (`gutter`) gutters and 24px (`margin-tablet`) outer margins. Two-column metric rows compress gracefully to single or dual stack configurations.
- **Mobile (< 768px)**: 4-column layout with 12px gutters and 16px (`margin`) margins. Tables shift to horizontally scrollable viewports or stacked card arrays. Navigation retreats to a bottom action sheet or top drawer.

Spacing density inside cards favors compact layouts: `space-md` (12px) and `space-lg` (16px) for interior padding, ensuring primary KPI metrics remain viewable above the fold.

## Elevation & Depth

Visual hierarchy does not rely on heavy drop shadows. Instead, it employs **low-contrast outlines combined with micro-ambient layered diffusion**:

- **Level 0 (Canvas)**: `#f8fafc` — completely flat, no outline.
- **Level 1 (Cards & Data Tables)**: `#ffffff` surface, 1px solid border in `#e2e8f0`, supported by a microscopic ambient drop shadow: `0 1px 2px 0 rgba(15, 23, 42, 0.04)`.
- **Level 2 (Dropdowns, Popovers & Context Menus)**: `#ffffff` surface, 1px solid border in `#cbd5e1`, elevated by `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Modals & Command Palettes)**: `#ffffff` surface, 1px solid border in `#94a3b8`, backed by a structural backdrop blur (`backdrop-blur-sm bg-slate-900/30`) and cast shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`.

## Shapes

The geometric identity relies on disciplined, tight radii (**Soft - 1**):

- Standard interactive controls (buttons, inputs, select triggers, chips) use `0.375rem` (6px) for a modern, compact profile.
- High-level containers (cards, data tables, modal dialogs) utilize `0.5rem` (8px).
- Badges and indicators use a tighter `0.25rem` (4px) or complete pill geometry strictly when representing live engine state dots or avatar status pips.

## Components

### Buttons
- **Primary**: Background `#0f172a` (Slate 900) with white text, transitioning to `#1e293b` on hover. Active scale down to 0.98. Focus rings use `2px solid #6366f1` with a `2px` offset.
- **Secondary**: Pure `#ffffff` background with `#0f172a` text, wrapped in a 1px `#e2e8f0` border; hover state shifts to `#f8fafc` canvas match.
- **Accent (Checkout / Instant Purchase)**: Background `#6366f1` (Indigo 500) with crisp white text.
- **Ghost & Subtle**: Transparent background, `#475569` text, background becomes `#f1f5f9` on hover.

### Form Inputs & Selects
- 36px standard control height.
- Background `#ffffff`, border 1px solid `#e2e8f0`, placeholder in `#94a3b8`.
- Focus state triggers an immediate crisp transition to `#0f172a` border with a `1px` outer halo in `#6366f1`.
- Error states enforce a `#f43f5e` boundary and a soft `#fff1f2` highlight glow.

### Data Tables
- Header row uses a rigid 36px height with `#64748b` uppercase `label-sm` text, anchored over `#f8fafc`.
- Body rows use `#ffffff` backgrounds, 48px baseline height, divided by 1px horizontal borders in `#f1f5f9`.
- Row hover triggers a subtle background switch to `#f8fafc`.
- Numerics, dates, and transaction identifiers align right using `JetBrains Mono`.

### Badges & Chips
- Compact dimensions: padding 2px 8px, font size 11px via `JetBrains Mono` medium.
- **Success (Settled/Active)**: Background `#ecfdf5`, text `#065f46`, border 1px solid `#a7f3d0`.
- **Pending (In Escrow)**: Background `#fffbeb`, text `#92400e`, border 1px solid `#fde68a`.
- **Failed / Cancelled**: Background `#fff1f2`, text `#9f1239`, border 1px solid `#fecdd3`.
- **Tier Accents (Gaming Commerce)**: Violet background `#f5f3ff`, text `#5b21b6`, border 1px solid `#ddd6fe`.

### Cards & Metrics
- Metric cards showcase an upper `body-sm` neutral label, followed by a prominent 28px `headline-lg` numeric value in `#0f172a`.
- Sparklines and trend chips (e.g., `+12.4%`) sit aligned horizontally to the right of the headline, displaying directional arrows in emerald or rose.
- Cards maintain zero padding bleed on dividers, ensuring top-to-bottom structural alignment across table and metric widgets.