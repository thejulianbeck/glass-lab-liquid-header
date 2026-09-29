(() => {
  "use strict";

  const root = document.documentElement;
  const form = document.getElementById("controlsForm");
  if (!form) return;

  const map = {
    opacity: { css: "--glass-opacity", unit: "", decimals: 2 },
    blur: { css: "--glass-blur", unit: "px", decimals: 0 },
    saturate: { css: "--glass-saturate", unit: "", decimals: 2 },
    brightness: { css: "--glass-brightness", unit: "", decimals: 2 },
    contrast: { css: "--glass-contrast", unit: "", decimals: 2 },
    "border-opacity": { css: "--glass-border-opacity", unit: "", decimals: 2 },
    "border-width": { css: "--glass-border-width", unit: "px", decimals: 2 },
    specular: { css: "--glass-specular", unit: "", decimals: 2 },
    noise: { css: "--glass-noise", unit: "", decimals: 2 },
    radius: { css: "--glass-radius", unit: "px", decimals: 0 },
    "inner-shadow": { css: "--glass-inner-shadow", unit: "", decimals: 2 },
    "outer-shadow": { css: "--glass-outer-shadow", unit: "", decimals: 2 },
  };

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
  }

  form.addEventListener("input", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLInputElement) || t.type !== "range") return;
    applyControl(t.id, t.value);
    clearPresetActive();
  });

  const presets = {
    apple: {
      opacity: 0.55, blur: 28, saturate: 1.6, brightness: 1.08, contrast: 1.05,
      "border-opacity": 0.35, "border-width": 0.5, specular: 0.45,
      noise: 0.12, radius: 22,
      "inner-shadow": 0.25, "outer-shadow": 0.18,
    },
    frost: {
      opacity: 0.72, blur: 40, saturate: 1.15, brightness: 1.02, contrast: 1.02,
      "border-opacity": 0.28, "border-width": 0.5, specular: 0.2,
      noise: 0.18, radius: 24,
      "inner-shadow": 0.3, "outer-shadow": 0.22,
    },
    liquid: {
      opacity: 0.42, blur: 22, saturate: 1.9, brightness: 1.12, contrast: 1.08,
      "border-opacity": 0.45, "border-width": 0.75, specular: 0.7,
      noise: 0.08, radius: 26,
      "inner-shadow": 0.2, "outer-shadow": 0.14,
    },
    clear: {
      opacity: 0.28, blur: 16, saturate: 1.35, brightness: 1.1, contrast: 1.04,
      "border-opacity": 0.5, "border-width": 0.5, specular: 0.55,
      noise: 0.05, radius: 18,
      "inner-shadow": 0.15, "outer-shadow": 0.1,
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
    document.querySelector(`.preset[data-preset="${name}"]`)?.classList.add("is-active");
  }

  document.querySelectorAll(".preset").forEach((btn) => {
    btn.addEventListener("click", () => applyPreset(btn.dataset.preset));
  });

  Object.keys(map).forEach((id) => {
    const input = document.getElementById(id);
    if (input) applyControl(id, input.value);
  });
  document.getElementById("presetApple")?.classList.add("is-active");
})();
