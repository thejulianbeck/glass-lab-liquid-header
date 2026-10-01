# Liquid Glass Material Lab

Safari-first web lab that emulates Apple-style **Liquid Glass** (cristal / frosted glass) as a reusable **material**, shown on minimal vehicles (pill, card, panel) plus a **fixed viewport peel** with live CSS-variable controls.

**Live:** https://thejulianbeck.github.io/glass-lab-liquid-header/

Includes an **A/B** section: Glass Lab Lock vs a Safari-friendly web approx of Figma **Pattern refraction** (not native Glass / not WGSL). See [EFFECT-SPEC.md](./EFFECT-SPEC.md).

## Local

```bash
python3 -m http.server 8080
```

Open in Safari (iPhone / iPad / Mac preferred).

## Stack

- `backdrop-filter` / `-webkit-backdrop-filter` on `.glass`
- Tint, blur, saturate, brightness, contrast
- Border, specular + noise overlays, radius, inner/outer shadow
- Fixed viewport peel (`position: fixed`) for scroll-reactive sampling
- Shared CSS variables · presets Apple-ish / Frost / Líquido / Claro
- `env(safe-area-inset-*)`
