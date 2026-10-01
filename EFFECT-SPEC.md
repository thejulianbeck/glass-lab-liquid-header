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
| Opacity / tint | `--glass-opacity` | `0.15` | 0.05–0.95 | — |
| Backdrop blur | `--glass-blur` | `10` | 0–60 | px |
| Saturate | `--glass-saturate` | `1.15` | 0.5–2.5 | — |
| Brightness | `--glass-brightness` | `1.10` | 0.7–1.4 | — |
| Contrast | `--glass-contrast` | `1.05` | 0.7–1.4 | — |
| Border opacity | `--glass-border-opacity` | `0.35` | 0–1 | — |
| Border width | `--glass-border-width` | `0.25` | 0–3 | px |
| Specular highlight | `--glass-specular` | `0` | 0–1 | — |
| Noise / grain | `--glass-noise` | `0.12` | 0–0.45 | — |
| Corner radius | `--glass-radius` | `20` | 0–40 | px |
| Inner shadow | `--glass-inner-shadow` | `0.20` | 0–1 | — |
| Outer shadow | `--glass-outer-shadow` | `0` | 0–1 | — |

### Presets
- **Lock:** locked defaults above (Julián screenshots: opacity 0.15, blur 10px, saturate 1.15, brightness 1.10, contrast 1.05, border 0.25px @ 0.35, specular 0, noise 0.12, radius 20, inner 0.20, outer 0).
- **Frost:** higher opacity + blur, lower saturate/specular, more grain.
- **Líquido:** lower opacity, higher saturate/specular, clearer liquid feel.
- **Claro:** thinner, clearer glass.

## Technique and why
1. **`backdrop-filter` + `-webkit-backdrop-filter`** on `.glass` — blur + saturate + brightness + contrast. Closest web analogue to frosted / liquid glass; Safari needs `-webkit-`.
2. **Semi-transparent fill** `rgba(var(--tint), var(--glass-opacity))` for light/dark tint.
3. **Specular overlay** — gradient + `mix-blend-mode: soft-light`, opacity `--glass-specular`.
4. **Noise layer** — SVG-noise data-URI; opacity `--glass-noise` (static overlay, no live turbulence).
5. **Border + inner/outer shadow** — fine edge and depth via `--glass-border-*` and `--glass-*-shadow`.
6. **Fixed peel** — `.glass--peel` host is a direct `body` child (`position: fixed`, bottom-center via left/right + margin auto). Inner `.glass` carries backdrop-filter / tint / specular. Do not put `.glass` transform/will-change/backdrop-filter on the fixed host itself (Safari traps fixed). z-index below/beside controls.
9. **Adaptive peel text** — markers `data-peel-luma="light|dark"` on sections; on scroll/resize (rAF) sample points under the peel rect and toggle `.is-over-light` / `.is-over-dark` (black vs white). Cream + `#zona-prueba` photo count as light; darkband/stage photos as dark. No canvas/CORS.
7. **Shape variants** (`.glass--pill` / `--card` / `--panel` / `--peel`) change size/placement only; material tokens stay shared.
8. **`env(safe-area-inset-*)`**, `translateZ(0)`, no `background-attachment: fixed` on stage photos.

## What NOT to do
- Do not frame the lab as a sticky-header product or redesign Ignara Universe.
- Do not claim OS-level Liquid Glass / iOS 26 / visionOS material parity.
- Do not add refraction / chromatic aberration to the **Lock / `.glass` material** stack.
- Panel B in `#ab-compare` is the only place that approximates Figma Pattern refraction (CSS lenticular ridges + frost blur + light chromatic fringe). Label it as web approx, not Figma native Glass / not WGSL pixel-perfect.
- Do not omit `-webkit-backdrop-filter`.
- Do not leave the page broken if `backdrop-filter` fails — tint/border/shadow remain.
- Do not let the fixed peel cover the controls section.

## Acceptance criteria
- [x] Material is the protagonist; pill / card / panel are demo vehicles only.
- [x] Fixed viewport peel lets you scroll and see the material over changing backgrounds.
- [x] Live sliders for all listed variables → CSS custom properties on `.glass`.
- [x] Defaults locked from Julián screenshots (Lock preset).
- [x] Adaptive peel text: black over light/cream/photo, white over dark (section `data-peel-luma` + rAF sample under peel).
- [x] Spanish (LatAm neutral, tú) UI labels.
- [x] Honest limits note in page UI.
- [x] Safari-first prefixes + safe-area + graceful degrade.
- [x] Lock material has no refraction; A/B Panel B is labeled web approx of Pattern refraction only.
- [x] A/B side-by-side over shared photo so Lock vs Pattern refraction approx can be compared on phone.
- [x] Public GitHub repo + Pages URL.
- [x] This EFFECT-SPEC committed alongside the lab.


## A/B comparison — Lock vs Pattern refraction (web approx)

Section `#ab-compare`. **Does not claim Figma native Glass.**

| Panel | What it is |
|---|---|
| **A — Glass Lab Lock** | Existing `.glass` stack with locked defaults (opacity 0.15, blur 10px, saturate 1.15, brightness 1.10, contrast 1.05, border 0.25px @ 0.35, specular 0, noise 0.12, radius 20, inner 0.20, outer 0). Isolated via `[data-ab-lock]` so live controls do not change the A/B card. |
| **B — Pattern refraction (web approx)** | Honest label: emulación web del shader Figma «Pattern refraction». Params from Figma defineProperties exposed as sliders/readouts. |

### Panel B parameter map (Figma → web)

| Figma property | Default | Web mapping |
|---|---|---|
| patternType | Lenticular (0) | Vertical CSS `repeating-linear-gradient` ridges only (other patterns not ported — iPhone perf) |
| amount / Strength | 50 | Ridge contrast + slight `scale()` on card (`--refract-amount`) |
| seamlessness / Smoothness | 0 | Softens ridge edges / stripe spacing (`--refract-smoothness`) |
| frost | 0 | Extra `backdrop-filter` blur + optional noise overlay (`--refract-frost`) |
| iorDispersion / Dispersion | 4 | Light R/B inset fringe via layered shadows (`--refract-dispersion`); Safari-safe, kept subtle |
| Edge wrap | Clamp | `overflow: hidden` on `.refract` |
| Transform | center default | `transform-origin: center` (no on-canvas handle) |

### What B implements vs Figma WGSL

| Web Panel B | Figma Pattern refraction (WGSL) |
|---|---|
| Samples backdrop via `backdrop-filter` blur/saturate | Full per-pixel refraction through lens SDF / pattern in shader |
| Fake lenticular look with CSS stripe overlays | True image warp along Lenticular / Waves / Zigzag / etc. |
| Strength → ridge contrast + tiny scale | Strength → displacement magnitude of sampled texels |
| Dispersion → cheap R/B inset fringe | Spectral IOR split along lens edges |
| Frost → blur + static noise | Shader frost / grain haze |
| Clamp via CSS overflow clip | Edge wrap modes (Zero / Clamp / Repeat / Mirror) |
| No WGSL / WebGL port | GPU shader path inside Figma |

**Spanish LA note (in UI):** Pattern refraction dobla la imagen como lentes de vidrio texturizado; Lock es frosted `backdrop-filter` sin desplazamiento de píxeles.

## Honest web vs Apple system limits
| Web lab | Apple system Liquid Glass |
|---|---|
| Samples content behind the element via backdrop-filter | OS material samples true layer tree / wallpaper / chrome |
| Specular + border + shadow as CSS overlays | System refraction / specular path |
| Grain is a static overlay | Material micro-structure from OS |
| Shape-agnostic CSS tokens | First-class system material API |
| Perf sensitive to blur strength | Hardware-optimized system path |

**Bottom line:** convincing *visual* material emulation for demos and tuning; not a drop-in for Apple’s system material.
