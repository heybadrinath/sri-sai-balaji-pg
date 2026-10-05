(() => {
  "use strict";

  const story = document.querySelector(".chapter-story");
  if (!story) return;
  const stage = story.querySelector(".chapter-stage");
  const panels = [...story.querySelectorAll(".chapter-panel")];
  const counter = story.querySelector("[data-chapter-current]");
  const chapterName = story.querySelector("[data-chapter-name]");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const compactViewport = matchMedia("(max-height: 620px)");
  const colours = [
    [242, 238, 251],
    [250, 239, 229],
    [233, 241, 250],
    [238, 243, 223],
    [231, 241, 241],
  ];
  const backdrop = document.createElement("div");
  backdrop.className = "chapter-backdrop";
  backdrop.setAttribute("aria-hidden", "true");
  const backgrounds = Array.from({ length: 2 }, () => {
    const layer = document.createElement("span");
    backdrop.append(layer);
    return layer;
  });
  stage.prepend(backdrop);
  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));
  const smoothstep = (value) => value * value * (3 - 2 * value);
  let enabled = false;
  let frame = 0;
  let start = 0;
  let distance = 1;
  let stageHeight = 1;
  let active = -1;
  let backgroundInterval = -1;
  let renderedProgress = -1;
  let renderedHeight = 0;
  let renderedWidth = 0;

  function restoreFlow() {
    story.classList.remove("chapter-story--enhanced");
    story.style.removeProperty("--chapter-travel");
    stage.style.removeProperty("--chapter-progress");
    panels.forEach((panel) => {
      panel.removeAttribute("aria-hidden");
      panel.classList.remove("chapter-panel--current");
      ["transform", "opacity", "visibility"].forEach((property) =>
        panel.style.removeProperty(property),
      );
    });
    active = -1;
    renderedProgress = -1;
  }

  function render() {
    frame = 0;
    if (!enabled) return;
    const progress = clamp((scrollY - start) / distance);
    if (
      progress === renderedProgress &&
      stageHeight === renderedHeight &&
      innerWidth === renderedWidth
    ) return;
    renderedProgress = progress;
    renderedHeight = stageHeight;
    renderedWidth = innerWidth;
    // One continuous arc follows the page, without pauses at chapter centres.
    const wheelPosition = progress * (panels.length - 1);
    const interval = Math.min(panels.length - 2, Math.floor(wheelPosition));
    const fraction = wheelPosition - interval;
    const current = Math.round(wheelPosition);
    const radius = stageHeight * (innerWidth < 700 ? 0.74 : 0.7);

    panels.forEach((panel, index) => {
      const offset = index - wheelPosition;
      const nearby = Math.abs(offset) <= 1;
      // Opacity keeps every chapter available to screen-reader navigation.
      if (!nearby) {
        panel.style.opacity = "0";
        return;
      }
      const angle = offset * 1.12;
      const y = Math.sin(angle) * radius;
      const x = (1 - Math.cos(angle)) * radius * 0.48;
      const rotation = offset * -8;
      const opacity = 1 - smoothstep(clamp((Math.abs(offset) - 0.52) / 0.39));
      panel.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotation.toFixed(2)}deg)`;
      panel.style.opacity = opacity.toFixed(4);
    });
    if (backgroundInterval !== interval) {
      backgroundInterval = interval;
      backgrounds.forEach((layer, index) => {
        layer.style.backgroundColor = `rgb(${colours[interval + index].join(",")})`;
      });
    }
    backgrounds[1].style.opacity = fraction.toFixed(4);
    stage.style.setProperty("--chapter-progress", progress.toFixed(4));

    if (current !== active) {
      active = current;
      panels.forEach((panel, index) => {
        panel.classList.toggle("chapter-panel--current", index === current);
      });
      counter.textContent = String(current + 1).padStart(2, "0");
      if (chapterName)
        chapterName.textContent = panels[current].dataset.chapter;
    }
  }

  function requestRender() {
    if (enabled && !frame) frame = requestAnimationFrame(render);
  }

  function measure() {
    enabled = !reducedMotion.matches && !compactViewport.matches;
    if (!enabled) {
      cancelAnimationFrame(frame);
      frame = 0;
      restoreFlow();
      return;
    }
    story.classList.add("chapter-story--enhanced");
    stageHeight = stage.clientHeight;
    // Four transitions occupy 3.8 viewports; the fifth is the sticky canvas.
    story.style.setProperty("--chapter-travel", `${stageHeight * 4.8}px`);
    const headerHeight = parseFloat(getComputedStyle(stage).top) || 0;
    start = scrollY + story.getBoundingClientRect().top - headerHeight;
    distance = Math.max(1, story.offsetHeight - stageHeight);
    render();
  }

  // Scroll only supplies a position. Wheel, touch and keyboard stay native.
  addEventListener("scroll", requestRender, { passive: true });
  addEventListener("resize", measure, { passive: true });
  addEventListener("load", measure, { once: true });
  reducedMotion.addEventListener("change", measure);
  compactViewport.addEventListener("change", measure);
  if (document.fonts) document.fonts.ready.then(measure);
  measure();
})();
