# Liquid Glass Material Lab

Safari-first web lab that emulates Apple-style **Liquid Glass** (cristal / frosted / refraction) as a reusable **material**, shown on minimal vehicles (pill, card, panel) with live CSS-variable controls.

**Live:** https://thejulianbeck.github.io/glass-lab-liquid-header/

Not a full site or header product — just the material lab. See [EFFECT-SPEC.md](./EFFECT-SPEC.md).

## Local

```bash
python3 -m http.server 8080
```

Open in Safari (iPhone / iPad / Mac preferred).

## Stack

- `backdrop-filter` / `-webkit-backdrop-filter` on `.glass`
- Specular + noise overlays
- SVG `#glass-refraction` (displacement + mild chromatic split)
- Shared CSS variables · presets Apple-ish / Frost / Líquido / Claro
- `env(safe-area-inset-*)`
