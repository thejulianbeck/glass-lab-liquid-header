(() => {
  "use strict";

  const root = document.documentElement;
  const header = document.getElementById("glassHeader");
  const form = document.getElementById("controlsForm");
  if (!header || !form) return;

  // Map control id → CSS variable + unit + output formatter
  const map = {
    opacity: { css: "--glass-opacity", unit: "", decimals: 2 },
    blur: { css: "--glass-blur", unit: "px", decimals: 0 },
    saturate: { css: "--glass-saturate", unit: "", decimals: 2 },
    brightness: { css: "--glass-brightness", unit: "", decimals: 2 },
    contrast: { css: "--glass-contrast", unit: "", decimals: 2 },
    "border-opacity": { css: "--glass-border-opacity", unit: "", decimals: 2 },
    "border-width": { css: "--glass-border-width", unit: "px", decimals: 2 },
    specular: { css: "--glass-specular", unit: "", decimals: 2 },
    refraction: { css: "--glass-refraction", unit: "", decimals: 0 },
    chroma: { css: "--glass-chroma", unit: "", decimals: 1 },
    noise: { css: "--glass-noise", unit: "", decimals: 2 },
    radius: { css: "--glass-radius", unit: "px", decimals: 0 },
    "inner-shadow": { css: "--glass-inner-shadow", unit: "", decimals: 2 },
    "outer-shadow": { css: "--glass-outer-shadow", unit: "", decimals: 2 },
  };

  const turbidity = document.querySelector("#glass-refraction feTurbulence");
  const displace = document.querySelector("#glass-refraction feDisplacementMap");
  const offsets = document.querySelectorAll("#glass-refraction feOffset");
  // offsets[0] = rChannel, offsets[1] = bChannel (order in SVG)

  function fmt(n, decimals) {
    const v = Number(n);
    return decimals === 0 ? String(Math.round(v)) : v.toFixed(decimals);
  }

  function applyControl(id, raw) {
    const meta = map[id];
    if (!meta) return;
    const num = Number(raw);
    root.style.setProperty(meta.css, `${num}${meta.unit}`);
    const out = document.getElementById(`out-${id}`);
    if (out) out.textContent = fmt(num, meta.decimals);

    if (id === "refraction" || id === "chroma") {
      updateSvgFilter();
    }
  }

  function updateSvgFilter() {
    const scale = Number(document.getElementById("refraction").value);
    const chroma = Number(document.getElementById("chroma").value);

    if (displace) displace.setAttribute("scale", String(scale));
    if (offsets[0]) {
      offsets[0].setAttribute("dx", String(-chroma));
      offsets[0].setAttribute("dy", "0");
    }
    if (offsets[1]) {
      offsets[1].setAttribute("dx", String(chroma));
      offsets[1].setAttribute("dy", "0");
    }

    // Only attach SVG filter when there's something to do — cheaper on scroll
    const on = scale > 0 || chroma > 0;
    header.classList.toggle("glass-header--refract", on);
  }

  // Live updates
  form.addEventListener("input", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLInputElement) || t.type !== "range") return;
    applyControl(t.id, t.value);
    clearPresetActive();
  });

  // Presets
  const presets = {
    apple: {
      opacity: 0.55,
      blur: 28,
      saturate: 1.6,
      brightness: 1.08,
      contrast: 1.05,
      "border-opacity": 0.35,
      "border-width": 0.5,
      specular: 0.45,
      refraction: 4,
      chroma: 0.6,
      noise: 0.12,
      radius: 18,
      "inner-shadow": 0.25,
      "outer-shadow": 0.18,
    },
    frost: {
      opacity: 0.72,
      blur: 40,
      saturate: 1.15,
      brightness: 1.02,
      contrast: 1.02,
      "border-opacity": 0.28,
      "border-width": 0.5,
      specular: 0.2,
      refraction: 0,
      chroma: 0,
      noise: 0.18,
      radius: 20,
      "inner-shadow": 0.3,
      "outer-shadow": 0.22,
    },
    liquid: {
      opacity: 0.42,
      blur: 22,
      saturate: 1.9,
      brightness: 1.12,
      contrast: 1.08,
      "border-opacity": 0.45,
      "border-width": 0.75,
      specular: 0.7,
      refraction: 10,
      chroma: 1.2,
      noise: 0.08,
      radius: 22,
      "inner-shadow": 0.2,
      "outer-shadow": 0.14,
    },
    clear: {
      opacity: 0.28,
      blur: 16,
      saturate: 1.35,
      brightness: 1.1,
      contrast: 1.04,
      "border-opacity": 0.5,
      "border-width": 0.5,
      specular: 0.55,
      refraction: 2,
      chroma: 0.3,
      noise: 0.05,
      radius: 16,
      "inner-shadow": 0.15,
      "outer-shadow": 0.1,
    },
  };

  function clearPresetActive() {
    document.querySelectorAll(".preset").forEach((b) => b.classList.remove("is-active"));
  }

  function applyPreset(name) {
    const p = presets[name];
    if (!p) return;
    Object.keys(p).forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        input.value = String(p[id]);
        applyControl(id, p[id]);
      }
    });
    clearPresetActive();
    const btn = document.querySelector(`.preset[data-preset="${name}"]`);
    if (btn) btn.classList.add("is-active");
  }

  document.querySelectorAll(".preset").forEach((btn) => {
    btn.addEventListener("click", () => applyPreset(btn.dataset.preset));
  });

  // Init from HTML defaults
  Object.keys(map).forEach((id) => {
    const input = document.getElementById(id);
    if (input) applyControl(id, input.value);
  });
  document.getElementById("presetApple")?.classList.add("is-active");

  // Graceful: if SVG filter url() breaks rendering in some engines, strip it
  try {
    if (typeof CSS !== "undefined" && CSS.supports) {
      // no-op probe; filter applied conditionally above
    }
  } catch (_) {
    header.classList.remove("glass-header--refract");
  }
})();
