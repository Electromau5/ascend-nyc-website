---
version: alpha
name: Ascend NYC Design System
description: Visual identity for Ascend NYC — an invite-only, AI-powered networking community for founders, investors, and operators in New York City.
colors:
  # Backgrounds
  background: "#000000"
  background-subtle: "#0A0A0A"
  # Surfaces (elevated layers)
  surface: "#15151E"
  surface-raised: "#1B1B26"
  # Borders / outlines
  outline: "rgba(255, 255, 255, 0.08)"
  outline-strong: "rgba(255, 255, 255, 0.14)"
  # Text
  on-surface: "#F2F2F5"
  on-surface-dim: "#A8A8B5"
  on-surface-muted: "#6E6E80"
  # Primary accent — amber gold
  primary: "#F5A524"
  primary-light: "#FFC468"
  primary-lighter: "#FFD699"
  primary-soft: "rgba(245, 165, 36, 0.12)"
  primary-outline: "rgba(245, 165, 36, 0.40)"
  # Semantic
  error: "#ff6b6b"
typography:
  hero:
    fontFamily: Syne
    fontSize: 5.5rem
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Syne
    fontSize: 3.4rem
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Syne
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Inter
    fontSize: 1.2rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.9rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  label-caps:
    fontFamily: Inter
    fontSize: 0.78rem
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.18em
  label-sm:
    fontFamily: Inter
    fontSize: 0.72rem
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.12em
  button:
    fontFamily: Inter
    fontSize: 0.95rem
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.01em
rounded:
  sm: 6px
  md: 14px
  lg: 22px
  full: 9999px
spacing:
  unit: 8px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  2xl: 64px
  3xl: 96px
  section: 140px
  container-max: 1140px
  container-pad: 28px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#000000"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: 14px 22px
    height: 48px
  button-primary-hover:
    backgroundColor: "{colors.primary-light}"
    boxShadow: "0 14px 40px rgba(245, 165, 36, 0.50)"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: 14px 22px
    height: 48px
  button-ghost-hover:
    backgroundColor: "rgba(245, 165, 36, 0.08)"
    textColor: "{colors.primary-light}"
    borderColor: "{colors.primary-outline}"
    boxShadow: "0 8px 28px rgba(245, 165, 36, 0.18)"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: 28px
  card-hover:
    borderColor: "{colors.primary-outline}"
  eyebrow:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: 6px 12px
    typography: "{typography.label-caps}"
  vibeai-badge:
    backgroundColor: "rgba(245, 165, 36, 0.07)"
    textColor: "{colors.primary-light}"
    rounded: "{rounded.full}"
    padding: 8px 18px
    typography: "{typography.label-caps}"
  event-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: 0px
  event-card-vip:
    borderColor: "rgba(201, 168, 76, 0.35)"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 14px 18px
    height: 48px
  input-focus:
    borderColor: "{colors.primary-outline}"
---

# Ascend NYC Design System

## Overview

Ascend NYC is where serious builders come before the deal is announced, before the intro is made, and before the idea becomes a company. The design system reflects this: **dark luxury meets intelligence**. It should feel like walking into a private members' club in lower Manhattan — low light, high signal.

The visual identity is built on three brand pillars:

1. **Exclusivity** — the space should feel earned, not open. Every design decision should subtly communicate that not everyone belongs here.
2. **AI-first credibility** — VibeMatch is not a feature bolt-on; it is the reason this community exists. Its presence should be felt on every page without being screamed.
3. **NYC energy** — direct, sharp, and ambitious. No filler. No decorative noise. Only elements that earn their place on screen.

The target audience is founders, investors, and operators who have seen a thousand landing pages and can spot low-quality instantly. The standard is: *if this could belong to any SaaS startup's website, it does not belong here.*

## Colors

The palette is anchored in absolute black and elevated through layered dark surfaces, with amber gold as the only true accent color.

- **Background (#000000):** Pure black. Not near-black — true black. This is the canvas and sets the immediate tone of premium exclusivity.
- **Surface (#15151E):** A deep indigo-charcoal used for all cards and elevated containers. The subtle blue-purple cast adds warmth and depth without breaking the dark-luxury mood.
- **Surface Raised (#1B1B26):** A slightly lighter surface for secondary elevated elements and nested components.
- **Primary / Amber Gold (#F5A524):** The only warm color in the system. Used sparingly and deliberately — it is the accent that signals action, reward, and the VibeMatch brand energy. Overuse dilutes its power entirely.
- **Primary Light (#FFC468):** Used for text labels and callouts where the full amber is too intense on dark backgrounds.
- **On-Surface (#F2F2F5):** Near-white primary text. Slightly warm to avoid harshness against the pure black canvas.
- **On-Surface Dim (#A8A8B5):** Secondary text for descriptions, metadata, and supporting copy.
- **On-Surface Muted (#6E6E80):** Tertiary text for labels, timestamps, and fine print.

Gold should appear on fewer than 30% of elements per page. When it appears, it should be the first thing the eye finds.

## Typography

Ascend NYC uses two typefaces — one for authority, one for utility.

- **Syne** (display) carries the brand's identity. It is used exclusively for headlines, section titles, and the hero. Its wide, geometric letterforms feel architectural and modern — not decorative. Use it at scale. Never below 1.2rem.
- **Inter** (body) handles everything else: body text, labels, buttons, captions, navigation. Its neutrality lets Syne breathe and ensures information density never feels cluttered.

Headlines always track tight (negative letter spacing). Labels are always uppercase with generous tracking (0.12–0.18em). Never mix tracking styles on adjacent text elements.

The hero heading is clamped fluidly: minimum 2.6rem on mobile, maximum 5.5rem on large desktop. Section headings clamp between 2rem and 3.4rem.

## Layout & Spacing

The layout follows a **fixed max-width container** model at 1140px with 28px horizontal padding on all breakpoints. The site is desktop-first — founders and investors share links via Slack and open on laptop; the experience must be flawless there first.

Section vertical rhythm is 140px top and bottom on desktop, scaling down to 64px on mobile. This generous whitespace is not empty — it is the design language of premium. Crowded layouts signal discount.

Spacing is governed by an 8px base unit. All margins, gaps, and padding must be multiples of 8. Never crowd two CTA blocks — always separate them with at least one full content section.

A 12-column grid at 1140px. Cards within sections use CSS grid: 3-column for event cards, 2-column plus spanning for featured history cards, auto-fit for stat rows.

## Elevation & Depth

Depth is communicated through **surface layering** rather than traditional shadows. There are no drop shadows on containers — instead, elevation is read through background color steps:

- **Level 0:** `#000000` — the page canvas. Nothing lives here permanently.
- **Level 1:** `#15151E` — cards, modals, and content panels.
- **Level 2:** `#1B1B26` — nested elements within cards, input backgrounds, and secondary panels.

Borders are semi-transparent white: `outline` (8% white) for structural edges, `outline-strong` (14% white) for active containers. Hover states swap to the amber `primary-outline` (40% amber) to indicate interactivity.

The one exception is the primary button: a gold shadow `0 10px 30px rgba(245,165,36,0.32)` is permitted because it communicates the action is "lit" — energized and important.

## Shapes

The shape language is **rounded but not soft**. Radius is applied consistently to cards, badges, inputs, and buttons — never sharp corners, never excessive pill-shapes on rectangular containers.

- `sm` (6px) — fine-grained elements: vol badges, format tags, small chips.
- `md` (14px) — cards, inputs, modal containers.
- `lg` (22px) — large event cards, primary surface panels.
- `full` (9999px) — buttons, eyebrow labels, badge-style elements.

Never mix radii within a component family. Never use border-radius on section containers — only on components within them.

## Components

### Buttons

The **primary button** (amber gold fill, black text) is used once per section maximum. It is always the most important action on the page. Label should be action-specific: "Request your invite", "Apply for your spot" — never "Sign up" or "Register."

The **ghost button** (transparent, white text, subtle border) is the workhorse for secondary actions. On hover it shifts to a warm amber tint — this reinforces the brand color story without competing with the primary CTA.

### Cards

All cards share `surface` background, `rounded.lg` radius, and a `1px outline` border. On hover, the border transitions to `primary-outline` (amber at 40%) and the card lifts 4–5px via `transform: translateY`. Never add hover state to non-clickable cards — false affordance breaks trust.

Featured history cards span two columns and use a taller photo area (300px vs 220px). Their heading steps up one type level.

### Eyebrow Labels

Section eyebrows are all-caps Inter at 0.78rem, amber background at 12% opacity, full border-radius. They are a consistent wayfinding pattern — every major section has one. Never use them for decorative purposes; they are structural navigation cues.

### VibeMatch Badge

The VibeMatch AI chip is a special badge with amber border at 28% opacity, amber background at 7%, and an animated pulsing dot. It is the only animated element in the passive page state. It signals that the AI is alive and present — not a feature, but an ambient capability.

### Event & History Cards

Event cards follow the tier hierarchy:
- **Flagship Mixer** — standard card treatment.
- **Founders Panel** — elevated border, format badge.
- **VIP Dinner** — gold-tinted border (`rgba(201, 168, 76, 0.35)`), gold format badge. This is the rarest visual treatment. Use it only for VIP-tier events.

## Do's and Don'ts

- **Do** use amber gold as the primary attention signal — one element per viewport at a time.
- **Do** write CTA labels as specific actions: "Request your invite", "Apply now", "Get early access."
- **Do** use whitespace aggressively. If it feels too empty, it is probably right.
- **Do** apply `reveal` class to all section content blocks for scroll-triggered fade-up animations.
- **Don't** use amber for decorative fills — only for interactive signals, key data callouts, and VibeMatch UI.
- **Don't** use Syne below 1.2rem. Below that size, it loses legibility and brand character.
- **Don't** place two primary (gold-fill) buttons in the same viewport without scrolling.
- **Don't** add hover states to non-interactive elements.
- **Don't** use gradients on text — renders poorly on high-DPI displays and reads as low-quality.
- **Don't** use any visual pattern that could belong to a generic SaaS product — every element should only make sense for Ascend NYC.
- **Don't** add animation unless it communicates something specific (state change, AI presence, entrance).
