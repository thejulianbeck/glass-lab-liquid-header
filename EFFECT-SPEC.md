# EFFECT-SPEC — Liquid Glass Sticky Header Lab

## Surface
- **Sticky top header bar** (not a full-page hub).
- Floats with side inset + safe-area padding; scrolls content underneath so glass is visible.

## Targets
- **Primary:** iPhone Safari, iPad Safari, Mac Safari
- Secondary: Chromium / Firefox (graceful degrade if `backdrop-filter` or SVG filter is weak)

## Variables (defaults + ranges)

| Variable | CSS custom property | Default | Range (UI) | Unit |
|---|---|---|---|---|
| Opacity / tint | `--glass-opacity` | `0.55` | 0.05–0.95 | — |
| Backdrop blur | `--glass-blur` | `28` | 0–60 | px |
| Saturate | `--glass-saturate` | `1.6` | 0.5–2.5 | — |
| Brightness | `--glass-brightness` | `1.08` | 0.7–1.4 | — |
| Contrast | `--glass-contrast` | `1.05` | 0.7–1.4 | — |
| Border opacity | `--glass-border-opacity` | `0.35` | 0–1 | — |
| Border width | `--glass-border-width` | `0.5` | 0–3 | px |
| Specular highlight | `--glass-specular` | `0.45` | 0–1 | — |
| Refraction / lens | `--glass-refraction` | `4` | 0–24 | (feDisplacementMap scale) |
| Chromatic aberration | `--glass-chroma` | `0.6` | 0–3 | px (RGB channel offset) |
| Noise / grain | `--glass-noise` | `0.12` | 0–0.45 | — |
| Corner radius | `--glass-radius` | `18` | 0–40 | px |
| Inner shadow | `--glass-inner-shadow` | `0.25` | 0–1 | — |
| Outer shadow | `--glass-outer-shadow` | `0.18` | 0–1 | — |

### Presets
- **Apple-ish:** defaults above (bright, soft blur ~28px, light tint, subtle border, gentle specular).
- **Frost:** higher opacity + blur, lower saturate/specular, more grain.
- **Líquido:** lower opacity, higher saturate/specular, stronger refraction/chroma.
- **Claro:** thinner, clearer glass.

## Technique and why
1. **`backdrop-filter` + `-webkit-backdrop-filter`**  
   Blur + saturate + brightness + contrast over live page content. Closest web analogue to frosted / liquid glass; Safari requires the `-webkit-` prefix.
2. **Semi-transparent fill** via `rgba(var(--tint), var(--glass-opacity))` for light/dark tint.
3. **Specular overlay** — absolute gradient layer with `mix-blend-mode: soft-light`, opacity driven by `--glass-specular`.
4. **Noise layer** — SVG-noise data-URI tiled; opacity via `--glass-noise` (avoids heavy live `feTurbulence` on the whole header every frame).
5. **SVG filter `#glass-refraction`** — `feTurbulence` + `feDisplacementMap` for lens-ish warp; dual `feOffset` + channel matrices for mild chromatic split. Applied only when refraction or chroma &gt; 0 (`glass-header--refract` class) to limit scroll cost.
6. **`env(safe-area-inset-*)`** on header margin/padding for notched devices.
7. **`isolation: isolate`**, `translateZ(0)`, avoid `background-attachment: fixed` on panels (iOS scroll jank).

## What NOT to do
- Do not claim OS-level Liquid Glass / iOS 26 / visionOS material parity.
- Do not use huge live SVG turbulence on scroll without gating.
- Do not use `background-attachment: fixed` for demo photos on iOS.
- Do not omit `-webkit-backdrop-filter`.
- Do not leave the page unusable if SVG `filter: url(#…)` fails — tint/border/shadow remain.
- Do not overwrite unrelated repos (e.g. Ignara Universe).

## Acceptance criteria
- [x] Sticky header over rich scrollable photo/gradient content.
- [x] Live sliders for all listed variables, wired to CSS custom properties.
- [x] Defaults tuned Apple-ish Liquid Glass.
- [x] Spanish (LatAm neutral, tú) UI labels.
- [x] Honest limits note in page UI.
- [x] Safari-first prefixes + safe-area + graceful degrade.
- [x] Public GitHub repo + Pages URL.
- [x] This EFFECT-SPEC committed alongside the lab.

## Honest web vs Apple system limits
| Web lab | Apple system Liquid Glass |
|---|---|
| Samples content *behind the element* via compositor backdrop-filter | OS material samples true layer tree / wallpaper / UI behind chrome |
| Approximate “lens” with SVG displacement + RGB offsets | Physical-ish refraction / specular from system renderer |
| Grain is a static overlay | Material micro-structure from OS |
| No integration with status bar / home indicator materials | First-class system chrome |
| Perf sensitive to blur radius + SVG filter | Hardware-optimized system path |

**Bottom line:** convincing *visual* emulation for demos and tuning; not a drop-in replacement for Apple’s system material.
