# EFFECT-SPEC — Liquid Glass Material Lab

## Surface
- **Material Liquid Glass** (cristal / frosted glass), applicable to multiple shapes.
- Demo vehicles only (not the product): **pill**, **card**, **panel** — all share the same `.glass` CSS variables.
- **Fixed viewport peel** (`.glass--peel` host as a **direct `body` child** + inner `.glass`): host is `position: fixed` bottom-center with no backdrop-filter/will-change; material styles live on the child so Safari cannot trap fixed positioning.
- Not a sticky-header product; chrome topbar is minimal and separate from the subject material.

## Targets
- **Primary:** iPhone Safari, iPad Safari, Mac Safari
- Secondary: Chromium / Firefox (graceful degrade if `backdrop-filter` is weak)

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
| Noise / grain | `--glass-noise` | `0.12` | 0–0.45 | — |
| Corner radius | `--glass-radius` | `22` | 0–40 | px |
| Inner shadow | `--glass-inner-shadow` | `0.25` | 0–1 | — |
| Outer shadow | `--glass-outer-shadow` | `0.18` | 0–1 | — |

### Presets
- **Apple-ish:** defaults above (bright, soft blur ~28px, light tint, subtle border, gentle specular).
- **Frost:** higher opacity + blur, lower saturate/specular, more grain.
- **Líquido:** lower opacity, higher saturate/specular, clearer liquid feel.
- **Claro:** thinner, clearer glass.

## Technique and why
1. **`backdrop-filter` + `-webkit-backdrop-filter`** on `.glass` — blur + saturate + brightness + contrast. Closest web analogue to frosted / liquid glass; Safari needs `-webkit-`.
2. **Semi-transparent fill** `rgba(var(--tint), var(--glass-opacity))` for light/dark tint.
3. **Specular overlay** — gradient + `mix-blend-mode: soft-light`, opacity `--glass-specular`.
4. **Noise layer** — SVG-noise data-URI; opacity `--glass-noise` (static overlay, no live turbulence).
5. **Border + inner/outer shadow** — fine edge and depth via `--glass-border-*` and `--glass-*-shadow`.
6. **Fixed peel** — `.glass--peel` host is a direct `body` child (`position: fixed`, bottom-center, `transform: translateX(-50%)` only). Inner `.glass` carries backdrop-filter / tint / specular. Do not put `.glass` transform/will-change/backdrop-filter on the fixed host itself (Safari traps fixed). z-index below/beside controls.
7. **Shape variants** (`.glass--pill` / `--card` / `--panel` / `--peel`) change size/placement only; material tokens stay shared.
8. **`env(safe-area-inset-*)`**, `translateZ(0)`, no `background-attachment: fixed` on stage photos.

## What NOT to do
- Do not frame the lab as a sticky-header product or redesign Ignara Universe.
- Do not claim OS-level Liquid Glass / iOS 26 / visionOS material parity.
- Do not add chromatic aberration, SVG displacement / `feDisplacementMap`, or refraction distortion.
- Do not omit `-webkit-backdrop-filter`.
- Do not leave the page broken if `backdrop-filter` fails — tint/border/shadow remain.
- Do not let the fixed peel cover the controls section.

## Acceptance criteria
- [x] Material is the protagonist; pill / card / panel are demo vehicles only.
- [x] Fixed viewport peel lets you scroll and see the material over changing backgrounds.
- [x] Live sliders for all listed variables → CSS custom properties on `.glass`.
- [x] Defaults tuned Apple-ish Liquid Glass.
- [x] Spanish (LatAm neutral, tú) UI labels.
- [x] Honest limits note in page UI.
- [x] Safari-first prefixes + safe-area + graceful degrade.
- [x] No refraction / chromatic aberration / SVG displacement path.
- [x] Public GitHub repo + Pages URL.
- [x] This EFFECT-SPEC committed alongside the lab.

## Honest web vs Apple system limits
| Web lab | Apple system Liquid Glass |
|---|---|
| Samples content behind the element via backdrop-filter | OS material samples true layer tree / wallpaper / chrome |
| Specular + border + shadow as CSS overlays | System refraction / specular path |
| Grain is a static overlay | Material micro-structure from OS |
| Shape-agnostic CSS tokens | First-class system material API |
| Perf sensitive to blur strength | Hardware-optimized system path |

**Bottom line:** convincing *visual* material emulation for demos and tuning; not a drop-in for Apple’s system material.
