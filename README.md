# Liquid Glass Header Lab

Safari-first web lab that emulates Apple-style Liquid Glass / frosted glass on a **sticky header**, with live CSS-variable controls.

**Live:** https://thejulianbeck.github.io/glass-lab-liquid-header/

Not a full site — just the effect lab. See [EFFECT-SPEC.md](./EFFECT-SPEC.md) for variables, technique, and honest OS vs web limits.

## Local

Open `index.html` in Safari (or any modern browser), or:

```bash
python3 -m http.server 8080
```

## Stack

- `backdrop-filter` / `-webkit-backdrop-filter`
- Specular + noise overlays
- SVG `#glass-refraction` (displacement + mild chromatic split)
- `env(safe-area-inset-*)`
