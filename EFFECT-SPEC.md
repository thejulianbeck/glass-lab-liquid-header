# EFFECT-SPEC — Liquid Glass Material Lab

## Surface
- **Material Liquid Glass** (cristal / frosted / refraction), applicable to multiple shapes.
- Demo vehicles only (not the product): **pill**, **card**, **panel** — all share the same `.glass` CSS variables.
- Not a sticky-header product; chrome topbar is minimal and separate from the subject material.

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
| Corner radius | `--glass-radius` | `22` | 0–40 | px |
| Inner shadow | `--glass-inner-shadow` | `0.25` | 0–1 | — |
| Outer shadow | `--glass-outer-shadow` | `0.18` | 0–1 | — |

### Presets
- **Apple-ish:** defaults above (bright, soft blur ~28px, light tint, subtle border, gentle specular).
- **Frost:** higher opacity + blur, lower saturate/specular, more grain.
- **Líquido:** lower opacity, higher saturate/specular, stronger refraction/chroma.
- **Claro:** thinner, clearer glass.

## Technique and why
1. **`backdrop-filter` + `-webkit-backdrop-filter`** on `.glass` — blur + saturate + brightness + contrast. Closest web analogue to frosted / liquid glass; Safari needs `-webkit-`.
2. **Semi-transparent fill** `rgba(var(--tint), var(--glass-opacity))` for light/dark tint.
3. **Specular overlay** — gradient + `mix-blend-mode: soft-light`, opacity `--glass-specular`.
4. **Noise layer** — SVG-noise data-URI; opacity `--glass-noise` (avoids heavy live turbulence every frame).
5. **SVG filter `#glass-refraction`** — `feTurbulence` + `feDisplacementMap` + RGB `feOffset` split. Class `glass--refract` only when refraction/chroma &gt; 0.
6. **Shape variants** (`.glass--pill` / `--card` / `--panel`) change size/radius only; material tokens stay shared.
7. **`env(safe-area-inset-*)`**, `translateZ(0)`, no `background-attachment: fixed` on stage photos.

## What NOT to do
- Do not frame the lab as a sticky-header product or redesign Ignara Universe.
- Do not claim OS-level Liquid Glass / iOS 26 / visionOS material parity.
- Do not run ungated heavy SVG turbulence on every glass instance while scrolling.
- Do not omit `-webkit-backdrop-filter`.
- Do not leave the page broken if `filter: url(#…)` fails — tint/border/shadow remain.

## Acceptance criteria
- [x] Material is the protagonist; pill / card / panel are demo vehicles only.
- [x] Live sliders for all listed variables → CSS custom properties on `.glass`.
- [x] Defaults tuned Apple-ish Liquid Glass.
- [x] Spanish (LatAm neutral, tú) UI labels.
- [x] Honest limits note in page UI.
- [x] Safari-first prefixes + safe-area + graceful degrade.
- [x] Public GitHub repo + Pages URL.
- [x] This EFFECT-SPEC committed alongside the lab.

## Honest web vs Apple system limits
| Web lab | Apple system Liquid Glass |
|---|---|
| Samples content behind the element via backdrop-filter | OS material samples true layer tree / wallpaper / chrome |
| Approximate “lens” with SVG displacement + RGB offsets | System refraction / specular path |
| Grain is a static overlay | Material micro-structure from OS |
| Shape-agnostic CSS tokens | First-class system material API |
| Perf sensitive to blur + SVG filter | Hardware-optimized system path |

**Bottom line:** convincing *visual* material emulation for demos and tuning; not a drop-in for Apple’s system material.
