(() => {
  "use strict";

  const root = document.documentElement;
  const form = document.getElementById("controlsForm");

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

  if (form) {
    form.addEventListener("input", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLInputElement) || t.type !== "range") return;
      applyControl(t.id, t.value);
      clearPresetActive();
    });
  }

  /* Locked defaults from Julián's screenshots (= Lock / apple preset) */
  const presets = {
    apple: {
      opacity: 0.15, blur: 10, saturate: 1.15, brightness: 1.1, contrast: 1.05,
      "border-opacity": 0.35, "border-width": 0.25, specular: 0,
      noise: 0.12, radius: 20,
      "inner-shadow": 0.2, "outer-shadow": 0,
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

  if (form) {
    Object.keys(map).forEach((id) => {
      const input = document.getElementById(id);
      if (input) applyControl(id, input.value);
    });
    document.getElementById("presetApple")?.classList.add("is-active");
  }

  /* ——— Adaptive peel text (Safari iOS-safe) ———
     Sections declare data-peel-luma="light"|"dark".
     On scroll/resize we sample which marker sits under the peel center
     (getBoundingClientRect + rAF throttle). Cream + zona-prueba photo
     are marked light → black text; dark bands/photos → white text.
     No live canvas/CORS; readable over cleverness. */
  const peel = document.getElementById("glassPeel");
  if (peel) {
    let raf = 0;
    let last = "";
    let colorRaf = 0;
    let colorAnimationStart = 0;
    let colorAnimationFrom = 0;
    let currentLuma = 0;
    let targetLuma = 0;

    // Keep the endpoints familiar, but render every intermediate value so the
    // text passes smoothly through gray instead of relying on a CSS color swap.
    const PEEL_COLORS = {
      dark: { rgb: [245, 245, 247], mutedAlpha: 0.78 },
      light: { rgb: [11, 11, 15], mutedAlpha: 0.72 },
    };
    const PEEL_COLOR_DURATION = 400;

    function setPeelColors(luma) {
      const dark = PEEL_COLORS.light;
      const light = PEEL_COLORS.dark;
      const rgb = dark.rgb.map((value, index) =>
        Math.round(value + (light.rgb[index] - value) * luma),
      );
      const mutedAlpha =
        dark.mutedAlpha + (light.mutedAlpha - dark.mutedAlpha) * luma;
      peel.style.setProperty("--peel-fg", `rgb(${rgb.join(", ")})`);
      peel.style.setProperty(
        "--peel-muted",
        `rgba(${rgb.join(", ")}, ${mutedAlpha.toFixed(3)})`,
      );
    }

    function easeInOut(t) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function animatePeelColors(timestamp) {
      if (!colorAnimationStart) colorAnimationStart = timestamp;
      const progress = Math.min(
        1,
        (timestamp - colorAnimationStart) / PEEL_COLOR_DURATION,
      );
      currentLuma =
        colorAnimationFrom +
        (targetLuma - colorAnimationFrom) * easeInOut(progress);
      setPeelColors(currentLuma);

      if (progress < 1) {
        colorRaf = requestAnimationFrame(animatePeelColors);
      } else {
        currentLuma = targetLuma;
        colorRaf = 0;
        colorAnimationStart = 0;
      }
    }

    function transitionPeelColors(mode) {
      const nextTarget = mode === "dark" ? 1 : 0;
      if (nextTarget === targetLuma && !colorRaf) return;
      targetLuma = nextTarget;
      colorAnimationFrom = currentLuma;
      colorAnimationStart = 0;
      if (!colorRaf) colorRaf = requestAnimationFrame(animatePeelColors);
    }

    function markers() {
      return document.querySelectorAll("[data-peel-luma]");
    }

    function sampleLuma() {
      const pr = peel.getBoundingClientRect();
      if (!pr.width || !pr.height) return "light";
      // Sample a few points under the peel (center + upper/lower thirds)
      const xs = [pr.left + pr.width * 0.5];
      const ys = [
        pr.top + pr.height * 0.35,
        pr.top + pr.height * 0.5,
        pr.top + pr.height * 0.65,
      ];
      const votes = { light: 0, dark: 0 };

      const list = markers();
      for (const y of ys) {
        for (const x of xs) {
          // Prefer the topmost (last in DOM among intersecting) marker
          let hit = null;
          for (let i = 0; i < list.length; i++) {
            const el = list[i];
            const r = el.getBoundingClientRect();
            if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
              hit = el;
            }
          }
          if (hit) {
            const v = hit.getAttribute("data-peel-luma");
            if (v === "dark" || v === "light") votes[v]++;
          }
        }
      }

      if (votes.dark === 0 && votes.light === 0) {
        // Fallback: page background is light in this lab
        return "light";
      }
      return votes.dark > votes.light ? "dark" : "light";
    }

    function applyLuma(mode) {
      if (mode === last) return;
      last = mode;
      peel.classList.toggle("is-over-dark", mode === "dark");
      peel.classList.toggle("is-over-light", mode === "light");
      transitionPeelColors(mode);
    }

    function tick() {
      raf = 0;
      applyLuma(sampleLuma());
    }

    function schedule() {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", schedule, { passive: true });
      window.visualViewport.addEventListener("scroll", schedule, { passive: true });
    }
    // Initial + after images layout
    schedule();
    window.addEventListener("load", schedule, { once: true });
  }

  /* ——— Panel B: Pattern refraction web-approx params ———
     Maps Figma defineProperties (Strength/Smoothness/Frost/Dispersion)
     onto CSS custom properties on #refractCard. Honest approx only. */
  const refractCard = document.getElementById("refractCard");
  const refractForm = document.getElementById("refractForm");
  if (refractCard && refractForm) {
    const refractMap = {
      amount: { css: "--refract-amount", out: "out-amount", decimals: 0 },
      smoothness: { css: "--refract-smoothness", out: "out-smoothness", decimals: 0 },
      frost: { css: "--refract-frost", out: "out-frost", decimals: 0 },
      dispersion: { css: "--refract-dispersion", out: "out-dispersion", decimals: 0 },
    };

    const displaceMap = refractCard.querySelector("#refractDisplace feDisplacementMap");

    function applyRefract(id, raw) {
      const meta = refractMap[id];
      if (!meta) return;
      const num = Number(raw);
      refractCard.style.setProperty(meta.css, String(num));
      const out = document.getElementById(meta.out);
      if (out) out.textContent = fmt(num, meta.decimals);
      // Strength → displace the lenticular overlay only (not true WGSL backdrop warp)
      if (id === "amount" && displaceMap) {
        displaceMap.setAttribute("scale", String(Math.round(num * 0.18)));
      }
    }

    refractForm.addEventListener("input", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLInputElement) || t.type !== "range") return;
      if (t.id === "patternType") return;
      applyRefract(t.id, t.value);
    });

    Object.keys(refractMap).forEach((id) => {
      const input = document.getElementById(id);
      if (input) applyRefract(id, input.value);
    });
  }

})();
