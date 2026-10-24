---
name: DotaTrack
description: High-precision Dota 2 esports analytics and tactical intelligence design system
colors:
  primary: "#E11D48"
  primary-dark: "#9F1239"
  neutral-bg: "#08090C"
  neutral-surface: "#0E1017"
  neutral-surface-elevated: "#141722"
  neutral-border: "rgba(255, 255, 255, 0.08)"
  neutral-border-subtle: "rgba(255, 255, 255, 0.04)"
  text-primary: "#EDEDF0"
  text-muted: "#9496A1"
  text-dim: "#5A5D6B"
  radiant: "#10B981"
  radiant-dark: "#065F46"
  dire: "#F43F5E"
  dire-dark: "#881337"
  gold: "#F59E0B"
  attr-strength: "#F87171"
  attr-agility: "#34D399"
  attr-intellect: "#38BDF8"
  attr-universal: "#C084FC"
  scrollbar-thumb: "#202434"
  shadow-ambient: "rgba(0, 0, 0, 0.5)"
  shadow-heavy: "rgba(0, 0, 0, 0.7)"
  glow-accent: "rgba(220, 38, 38, 0.25)"
typography:
  display:
    fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  body:
    fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  caption:
    fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.05em"
  micro-telemetry:
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.04em"
  badge-nano:
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.05em"
  badge-pico:
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace"
    fontSize: "9px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.06em"
rounded:
  pico: "1px"
  xs: "2px"
  scrollbar: "3px"
  sm: "4px"
  md: "6px"
  lg: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  tactical-panel:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "20px"
  badge-radiant:
    backgroundColor: "rgba(6, 95, 70, 0.3)"
    textColor: "{colors.radiant}"
    rounded: "{rounded.xs}"
    padding: "2px 8px"
  badge-dire:
    backgroundColor: "rgba(136, 19, 55, 0.3)"
    textColor: "{colors.dire}"
    rounded: "{rounded.xs}"
    padding: "2px 8px"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
---

# Design System

## Overview

DotaTrack employs a **tactical dark esports control-room** aesthetic. The design is engineered for high data density, low ambient light environments, and rapid scanability.

The visual signature relies on:
1. Deep obsidian and void-tinted surfaces (`#08090C`, `#0E1017`) rather than generic flat grays.
2. Fine hairline borders (`rgba(255, 255, 255, 0.08)`) and precision corner ticks (`.corner-tick`) inspired by authentic HUD telemetry.
3. High-contrast faction coding: **Radiant Emerald** (`#10B981`) vs. **Dire Crimson** (`#E11D48`).
4. Monospace numeric telemetry rendered with tabular lining figures (`font-feature-settings: "tnum"`).

---

## Colors

### Canvas & Surface Ladder
- **Canvas Base:** `#08090C` — deep obsidian canvas with zero pure black.
- **Surface Level 1:** `#0E1017` — standard tactical panel background.
- **Surface Elevated:** `#141722` — hovered states, drawers, popovers, and sticky tab bars.
- **Surface Interactive:** `#1A1E2D` — active controls, segment selectors, search inputs.

### Semantic Brand Accents
- **Crimson Primary:** `#E11D48` (`#9F1239` deep) — primary actions, active focus rings, selection highlight.
- **Gold Telemetry:** `#F59E0B` — net worth, GPM, match victory highlights, tier 1 indicators.

### Faction Semantics
- **Radiant Faction:** Emerald `#10B981` (badge background: `rgba(6, 95, 70, 0.35)`, border: `rgba(16, 185, 129, 0.4)`).
- **Dire Faction:** Crimson `#F43F5E` (badge background: `rgba(136, 19, 55, 0.35)`, border: `rgba(244, 63, 94, 0.4)`).

### Dota 2 Attribute Tokens
- **Strength (STR):** Red `#F87171` / Border `rgba(239, 68, 68, 0.4)`
- **Agility (AGI):** Emerald `#34D399` / Border `rgba(16, 185, 129, 0.4)`
- **Intelligence (INT):** Sky Blue `#38BDF8` / Border `rgba(56, 189, 248, 0.4)`
- **Universal (ALL):** Radiant Violet `#C084FC` / Border `rgba(192, 132, 252, 0.4)`

---

## Typography

### Font Families
- **Display & Interface:** Geist Sans (`var(--font-geist-sans)`). Clean, legible, with balanced optical kerning.
- **Data & Telemetry:** Geist Mono (`var(--font-geist-mono)`). Used for match IDs, timestamps, KDA, win rates, hero stats, and table headers.

### Tabular Numbers Rule
All statistical metrics, numbers, percentages, and game times **must** enable tabular lining figures:
```css
font-feature-settings: "cv02", "cv03", "cv04", "cv11", "tnum";
```
This prevents jitter and maintains precise vertical alignment in comparative grids and combat logs.

### Type Scale
- **Display 1:** `clamp(2rem, 5vw, 3.5rem)` — Bold 800, tracking `-0.03em`. Reserved for landing heroes and tournament titles.
- **Heading 2:** `1.5rem` (`24px`) — Bold 700, tracking `-0.02em`. Section headers and modal titles.
- **Title 3:** `1.125rem` (`18px`) — Semibold 600, mono-accented. Match cards, drawer hero titles.
- **Body:** `0.875rem` (`14px`) — Regular 400, line-height `1.5`. Match narratives, tooltips, descriptions.
- **Telemetry Label:** `0.75rem` (`12px`) or `0.6875rem` (`11px`) — Mono Medium 500, uppercase, tracking `0.05em`.

---

## Layout

### Container & Grid System
- **Main Viewport Width:** Max `1280px` (`max-w-7xl`), expandable to `1520px` (`2xl:max-w-[1520px]`) for wide data tables.
- **Grid Layouts:**
  - Overview stats: 4-column responsive grid (`grid-cols-2 lg:grid-cols-4`).
  - Hero matrix: dynamic flex/grid with sticky comparative headers.
  - Match details: 2-column tactical split (Radiant roster vs. Dire roster).

### Spacing Rhythm
- **Component Padding:** Standard tactical panels use `p-5` (`20px`) or `p-6` (`24px`). Compact cards use `p-4` (`16px`).
- **Gaps:** Dense data clusters use `gap-2` to `gap-3`. Major layout blocks use `gap-6` to `gap-8`.

---

## Elevation & Depth

### Tonal Hierarchy (No Heavy Artificial Shadows)
Elevation is primarily expressed through tonal layering:
- **Level 0 (Canvas):** `#08090C`
- **Level 1 (Panels):** `#0E1017` + `border: 1px solid rgba(255, 255, 255, 0.08)`
- **Level 2 (Hover/Active):** `#141722` + `border-color: rgba(225, 29, 72, 0.4)`
- **Level 3 (Floating Drawers & Modals):** `#0C0E16` + `box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.8)`

### Tactical Corner Ticks
Prominent tournament panels and high-priority cards feature authentic HUD ticks (`.corner-tick`) that evoke tournament broadcast overlays.

---

## Shapes

- **Radius Scale:** Tight and tactical. Never use oversized bubbly pill borders for structural containers.
  - Container Panels: `rounded-sm` (`2px` to `4px`)
  - Badges & Chips: `rounded-xs` (`2px`) or `rounded-sm`
  - Action Buttons: `rounded-sm`
  - Hero Portraits: `rounded-sm` or `rounded-none` with hairline borders

---

## Components

### Tactical Panel
```html
<div class="tactical-panel rounded-sm p-5 border border-white/[0.08] bg-[#0E1018]">
  <!-- High density tactical telemetry -->
</div>
```

### Match Status Badges
- **Live Match:** Red pulse dot + `bg-rose-950 text-rose-300 border-rose-600/70`
- **Upcoming:** `bg-amber-950/80 text-amber-300 border-amber-700/60`
- **Completed:** `bg-zinc-900 text-zinc-400 border-white/[0.08]`

### Action Controls
- **Primary Action:** Solid rose crimson (`bg-rose-600 hover:bg-rose-500 text-white`).
- **Secondary / Ghost:** Dark tactical surface (`bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300`).

---

## Do's and Don'ts (Anti-Slop Directives)

### DO:
- **DO** use authentic Dota 2 faction semantics (Radiant = Emerald `#10B981`, Dire = Crimson `#E11D48`).
- **DO** format all stats (KDA, GPM, XPM, winrate, net worth) with monospace and tabular figures (`font-mono tnum`).
- **DO** keep panel borders sharp (`border-white/[0.08]`) with corner ticks on featured esports cards.
- **DO** theme browser surfaces (custom scrollbar thumb `#202434`, hover `#E11D48`, text selection `selection:bg-rose-600`).
- **DO** provide clear empty, loading, and error states with analytical, non-patronizing copy.

### DON'T:
- **DON'T** use purple-to-blue SaaS gradients. We are an esports cockpit, not an AI marketing website.
- **DON'T** nest cards inside cards inside cards. Use tonal background shifts and hairlines instead.
- **DON'T** put meaningless rounded-square icon tiles above every heading.
- **DON'T** use generic kicker eyebrows (e.g., "FEATURE OVERVIEW" in small caps) above titles. Let headings speak directly.
- **DON'T** use pure `#000000` or neutral `#111111` gray. Always maintain the deep obsidian navy/slate undertone (`#08090C`).
- **DON'T** use bouncing or elastic easing curves. Use snappy ease-out curves (`cubic-bezier(0.16, 1, 0.3, 1)`).
