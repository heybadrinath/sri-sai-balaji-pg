(() => {
  "use strict";
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const header = document.querySelector(".site-header");
  const menu = document.querySelector("#mobile-menu");
  const menuButton = document.querySelector(".menu-toggle");
  const main = document.querySelector("main");
  const footer = document.querySelector("footer");
  const chat = document.querySelector(".whatsapp-float");
  const progress = header.querySelector(".reading-progress");
  function measureProgress() {
    const width = header.clientWidth;
    const waves = Math.ceil(width / 48);
    const step = width / waves;
    let curve = "M0 7";
    for (let index = 0; index < waves; index++) {
      const x = index * step;
      curve += ` C${x + step / 6} 1 ${x + step / 3} 1 ${x + step / 2} 7 S${x + step * 5 / 6} 13 ${x + step} 7`;
    }
    progress.setAttribute("viewBox", `0 0 ${width} 14`);
    progress.querySelector(".navbar-edge").setAttribute("d", `${curve} V0 H0 Z`);
    progress.querySelectorAll(".reading-track, .reading-value").forEach((path) =>
      path.setAttribute("d", curve),
    );
  }
  new ResizeObserver(measureProgress).observe(header);
  measureProgress();
  let menuOpen = false;
  let previousOverflow = "";

  let menuAnimation;
  function setMenu(open, restoreFocus = false) {
    if (open === menuOpen) return;
    menuOpen = open;
    menuAnimation?.cancel();
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
    main.inert = open;
    footer.inert = open;
    chat.inert = open;
    menu.inert = !open;
    document.body.classList.toggle("menu-open", open);
    if (open) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      menu.hidden = false;
    } else {
      document.body.style.overflow = previousOverflow;
      if (restoreFocus) menuButton.focus({ preventScroll: true });
    }
    if (reducedMotion.matches) {
      menu.hidden = !open;
      return;
    }
    menuAnimation = menu.animate(
      open
        ? [
            { opacity: 0, clipPath: "inset(0 0 100% 0 round 0 0 24px 24px)" },
            { opacity: 1, clipPath: "inset(0 0 0% 0 round 0px)" },
          ]
        : [
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: "translateY(-18px)" },
          ],
      { duration: open ? 650 : 280, easing: "cubic-bezier(.22,.7,.25,1)" },
    );
    menuAnimation.onfinish = () => {
      if (!menuOpen) menu.hidden = true;
    };
  }
  menuButton.addEventListener("click", () => setMenu(!menuOpen));
  menu
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document
    .querySelector(".site-header .wordmark")
    .addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", (event) => {
    if (!menuOpen) return;
    if (event.key === "Escape") {
      setMenu(false, true);
      return;
    }
    if (event.key === "Tab") {
      const controls = [
        document.querySelector(".site-header .wordmark"),
        menuButton,
        ...menu.querySelectorAll("a"),
      ];
      const first = controls[0],
        last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  matchMedia("(min-width:900px)").addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });

  const headings = [
    ...document.querySelectorAll(
      "[data-reveal-text], .section-heading h2, .gallery-heading h2",
    ),
  ];
  headings.forEach((heading) => {
    heading.setAttribute(
      "aria-label",
      heading.innerText.replace(/\s+/g, " ").trim(),
    );
    heading.classList.add("text-reveal");
    const nodes = [];
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let index = 0;
    nodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((word) => {
        if (!word.trim()) {
          fragment.append(document.createTextNode(word));
          return;
        }
        const wrapper = document.createElement("span");
        wrapper.className = "text-word";
        wrapper.setAttribute("aria-hidden", "true");
        [...word].forEach((letter) => {
          const span = document.createElement("span");
          span.className = "text-letter";
          span.style.setProperty("--letter", Math.min(index++, 34));
          span.textContent = letter;
          wrapper.append(span);
        });
        fragment.append(wrapper);
      });
      node.replaceWith(fragment);
    });
  });
  let introPending =
    document.documentElement.classList.contains("intro-loading");
  const heroHeading = document.querySelector("#hero-title");
  const heroContent = document.querySelector(".intro-content");
  const revealHeading = (heading) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const bounds = heading.getBoundingClientRect();
        if (bounds.bottom <= header.offsetHeight || bounds.top >= innerHeight - 35)
          return;
        heading.classList.add("is-revealed");
        if (heading === heroHeading) heroContent.classList.add("is-revealed");
      });
    });
  };
  const headingObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Reset only once fully outside, avoiding flicker at the reveal threshold.
        if (!entry.isIntersecting) {
          entry.target.classList.remove("is-revealed");
          return;
        }
        if (
          entry.intersectionRatio < (entry.target === heroContent ? 0.05 : 0.45) ||
          (introPending && (entry.target === heroHeading || entry.target === heroContent))
        )
          return;
        revealHeading(entry.target);
      });
    },
    { threshold: [0, 0.05, 0.45], rootMargin: `-${header.offsetHeight}px 0px -35px 0px` },
  );
  headings.forEach((heading) => headingObserver.observe(heading));
  headingObserver.observe(heroContent);
  let entranceFinished = false;
  function finishEntrance() {
    if (entranceFinished) return;
    entranceFinished = true;
    const hasEntrance = introPending && !reducedMotion.matches && scrollY < 80;
    document.documentElement.classList.remove("intro-loading");
    const revealHero = () => {
      introPending = false;
      document.body.classList.add("intro-ready");
      const bounds = heroHeading.getBoundingClientRect();
      if (bounds.top < innerHeight && bounds.bottom > 0) {
        revealHeading(heroHeading);
      }
    };
    if (hasEntrance) setTimeout(revealHero, 600);
    else revealHero();
  }
  if (introPending) {
    Promise.race([
      document.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, 500)),
    ]).then(() => setTimeout(finishEntrance, 900));
    setTimeout(finishEntrance, 1700);
    addEventListener(
      "scroll",
      () => {
        if (scrollY > 80) finishEntrance();
      },
      { passive: true },
    );
  } else finishEntrance();
  function syncMotion() {
    document.body.classList.toggle("motion-ready", !reducedMotion.matches);
    if (reducedMotion.matches) {
      menuAnimation?.cancel();
      menu.hidden = !menuOpen;
    }
  }
  syncMotion();
  reducedMotion.addEventListener("change", syncMotion);

  const ambientObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) =>
      entry.target.classList.toggle("is-outside", !entry.isIntersecting),
    );
  });
  document
    .querySelectorAll(".intro-hero")
    .forEach((element) => ambientObserver.observe(element));

  const hero = document.querySelector(".intro-hero");
  let scrollFrame = 0;
  function renderScroll() {
    scrollFrame = 0;
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 12);
    header.style.setProperty(
      "--reading",
      (
        Math.max(0, Math.min(1,
          y / Math.max(1, document.documentElement.scrollHeight - innerHeight),
        ))
      ).toFixed(4),
    );
    if (y < hero.offsetHeight + 100 || reducedMotion.matches)
      hero.style.setProperty(
        "--hero-travel",
        `${reducedMotion.matches ? 0 : Math.max(0, Math.min(y, hero.offsetHeight))}px`,
      );
  }
  function scheduleScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(renderScroll);
  }
  addEventListener("scroll", scheduleScroll, { passive: true });
  addEventListener("resize", scheduleScroll, { passive: true });
  reducedMotion.addEventListener("change", scheduleScroll);
  renderScroll();

  const cursor = document.querySelector(".custom-cursor");
  const pointer = matchMedia(
    "(hover:hover) and (pointer:fine) and (min-width:900px)",
  );
  let cursorEnabled = false,
    cursorFrame = 0,
    mouseX = -100,
    mouseY = -100,
    x = -100,
    y = -100;
  function cursorMode() {
    cursorEnabled = pointer.matches && !reducedMotion.matches;
    document.body.classList.toggle("cursor-enabled", cursorEnabled);
    if (!cursorEnabled) {
      cursor.classList.remove("is-visible");
      cancelAnimationFrame(cursorFrame);
      cursorFrame = 0;
    }
  }
  function drawCursor() {
    cursorFrame = 0;
    x += (mouseX - x) * 0.35;
    y += (mouseY - y) * 0.35;
    cursor.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
    if (Math.abs(x - mouseX) + Math.abs(y - mouseY) > 0.2)
      cursorFrame = requestAnimationFrame(drawCursor);
  }
  document.addEventListener(
    "pointermove",
    (event) => {
      if (!cursorEnabled || event.pointerType === "touch") return;
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (!cursor.classList.contains("is-visible")) {
        x = mouseX;
        y = mouseY;
      }
      cursor.classList.add("is-visible");
      if (!cursorFrame) cursorFrame = requestAnimationFrame(drawCursor);
    },
    { passive: true },
  );
  document.addEventListener("pointerover", (event) => {
    if (!cursorEnabled || !(event.target instanceof Element)) return;
    const native = !!event.target.closest(
      "input,select,textarea,dialog,iframe",
    );
    const photo = !!event.target.closest(".gallery-item");
    cursor.classList.toggle("is-native", native);
    cursor.classList.toggle("is-photo", photo);
    cursor.classList.toggle(
      "is-link",
      !native && !!event.target.closest("a,button,summary"),
    );
    cursor.firstElementChild.textContent = photo ? "VIEW" : "↗";
  });
  document.documentElement.addEventListener("pointerleave", () =>
    cursor.classList.remove("is-visible"),
  );
  addEventListener("blur", () => cursor.classList.remove("is-visible"));
  pointer.addEventListener("change", cursorMode);
  reducedMotion.addEventListener("change", cursorMode);
  cursorMode();
})();
