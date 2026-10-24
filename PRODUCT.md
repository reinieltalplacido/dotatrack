# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** Competitive Dota 2 players (ranked grinders from Archon to Immortal) analyzing match performance, item timings, and hero mastery.
- **Secondary:** Team drafters, captains, and tournament analysts studying meta trends, counter-picks, facet synergies, and professional esports circuits.
- **Tertiary:** Dota 2 spectators tracking live tournament brackets, pro player profiles, and patch impact.

## Product Purpose

DotaTrack is an esports-grade analytics and match intelligence platform for Dota 2. It transforms raw match data from OpenDota and Steam APIs into actionable tactical insights: lane outcome breakdowns, ward maps, item timing benchmarks, draft advantage simulations, and tournament tracking. Success means giving players immediate, unambiguous answers to *"Why did we win/lose, and what should we draft next?"* without wading through sluggish or ad-heavy bloated pages.

## Positioning

Unlike generic gaming wikis, ad-saturated stat aggregate sites, or bloated mobile-first wrappers, DotaTrack delivers a clean, high-density, latency-optimized tactical cockpit. It treats match statistics as real-time competitive telemetry with authentic Dota 2 faction semantics (Radiant Emerald vs. Dire Crimson) and HUD-inspired clarity.

## Operating Context

- Used on secondary monitors during draft phases or post-match reviews.
- High-intensity, low-ambient lighting environments common to esports and gaming setups.
- Data-dense views where players rapidly cross-reference combat logs, net worth deltas, talent choices, and ward placements.
- Keyboard navigation and quick search (Steam ID, Match ID, Hero name) during rapid queue cycles.

## Capabilities and Constraints

- **Live & Historical Telemetry:** OpenDota API integration, Steam Web API synchronization, and cached meta aggregations.
- **Draft Simulator:** Matrix comparisons, synergy/counter scoring, and facet recommendations.
- **Hero Compendium:** Stat scaling, attribute growth, armor/magic resistance curves, and lore context.
- **Tournament Hub:** Real-time pro circuit matches, tier classifications, and bracket tracking.
- **Technical Constraint:** Fast server-side rendering with Next.js App Router, strict TypeScript safety, zero runtime CSS bloat, and resilient rate-limiting for external APIs.

## Brand Commitments

- **Tone & Voice:** Analytical, authoritative, precise, and respectful of high-level Dota 2 mechanics. No gamer cringe, clickbait, or exaggerated AI hype.
- **Faction Faithfulness:** Radiant is always vibrant emerald/emerald-dark (`#10B981`); Dire is always predatory crimson/rose (`#E11D48`). Strength is red, Agility is emerald, Intelligence is sky blue, Universal is radiant amber/purple.
- **Tactical Aesthetic:** Obsidian glass, fine hairlines, corner ticks, and crisp monospace data telemetry.

## Evidence on Hand

- Live OpenDota endpoints (`/api/players`, `/api/matches`, `/api/heroes`, `/api/proMatches`).
- Real-time tournament metadata and tier-ranked pro statistics.
- Precomputed hero synergies and counter-pick delta matrices.

## Product Principles

1. **Telemetry Over Decoration:** Every visual element must convey real game state, delta, or tier. Never add arbitrary decorative containers that don't clarify data.
2. **Density With Breathing Room:** Present high-dimensional statistics (KDA, GPM, XPM, LH/DN, damage share) with sharp hierarchy and tabular lining numbers, avoiding claustrophobic clumping.
3. **Zero Clickbait / Zero Slop:** No generic SaaS greeting cards, no purple gradients, no nested card soup. Every screen feels like an authentic tournament control room.
4. **Performance is Ergonomics:** Instant page transitions, smooth drawer panels, and zero layout shifts when switching tabs or inspecting matches.
