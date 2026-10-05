(() => {
  "use strict";

  const gallery = document.querySelector(".gallery-sequence");
  if (!gallery) return;

  const items = [...gallery.querySelectorAll(".gallery-item")];
  const pieces = items.map((item) => item.closest(".gallery-piece"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const entrance = [
    { x: 0, y: 110, angle: -3, scale: 0.82, duration: 1320 },
    { x: -30, y: 100, angle: -5, scale: 0.84, duration: 1260 },
    { x: 30, y: 130, angle: 5, scale: 0.82, duration: 1380 },
    { x: 12, y: 95, angle: 3, scale: 0.82, duration: 1300 },
    { x: -26, y: 115, angle: -5, scale: 0.84, duration: 1340 },
    { x: 0, y: 110, angle: -3, scale: 0.82, duration: 1360 },
  ];
  const states = items.map((item, index) => ({
    item,
    piece: pieces[index],
    motion: entrance[index],
    delay:
      [...pieces[index].parentElement.children].indexOf(pieces[index]) * 130,
    seen: false,
    animation: null,
  }));
  const stateByPiece = new Map(states.map((state) => [state.piece, state]));
  let visibility = null;

  function settle(state) {
    state.seen = true;
    if (state.animation) {
      state.animation.onfinish = null;
      state.animation.cancel();
      state.animation = null;
    }
    state.item.classList.remove("is-pending", "is-revealing");
    state.item.style.removeProperty("--gallery-entry");
    visibility?.unobserve(state.piece);
  }

  function reveal(state) {
    if (state.seen || state.animation) return;
    if (state.item.contains(document.activeElement)) {
      settle(state);
      return;
    }
    state.item.classList.add("is-revealing");
    state.animation = state.item.animate(
      [
        {
          transform: state.item.style.getPropertyValue("--gallery-entry"),
          opacity: 0,
        },
        { transform: "translate3d(0, 0, 0) rotate(0deg) scale(1)", opacity: 1 },
      ],
      {
        duration: state.motion.duration,
        delay: state.delay,
        easing: "cubic-bezier(0.24, 0.12, 0.2, 1)",
        fill: "both",
      },
    );
    state.animation.onfinish = () => settle(state);
  }

  function syncMotion() {
    visibility?.disconnect();
    if (reducedMotion.matches) {
      gallery.dataset.motion = "off";
      states.forEach(settle);
      return;
    }
    gallery.dataset.motion = "on";
    states.forEach((state) => {
      if (state.seen) return;
      const { x, y, angle, scale } = state.motion;
      state.item.style.setProperty(
        "--gallery-entry",
        `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg) scale(${scale})`,
      );
      state.item.classList.add("is-pending");
      visibility.observe(state.piece);
    });
  }

  if (
    "IntersectionObserver" in window &&
    typeof items[0]?.animate === "function"
  ) {
    visibility = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const state = stateByPiece.get(entry.target);
          if (state.seen) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.16) {
            reveal(state);
          } else if (
            !entry.isIntersecting &&
            (state.animation || entry.boundingClientRect.bottom <= 0)
          ) {
            // A quick swipe past a photo should leave it fully shown on return.
            settle(state);
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: [0, 0.16] },
    );
    gallery.addEventListener("focusin", (event) => {
      const state = states.find(({ item }) => item.contains(event.target));
      if (state) settle(state);
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden)
        states.filter((state) => state.animation).forEach(settle);
    });
    reducedMotion.addEventListener("change", syncMotion);
    syncMotion();
  }

  const dialog = document.getElementById("photo-dialog");
  if (!dialog || typeof dialog.showModal !== "function") return;

  const image = dialog.querySelector("#lightbox-image");
  const caption = dialog.querySelector("#lightbox-caption");
  const counter = dialog.querySelector("#lightbox-counter");
  const closeButton = dialog.querySelector("[data-lightbox-close]");
  const previousButton = dialog.querySelector("[data-lightbox-prev]");
  const nextButton = dialog.querySelector("[data-lightbox-next]");
  let currentIndex = 0;
  let openedFrom = null;
  let savedOverflow = "";
  let savedPadding = "";
  let touchStart = null;

  function showPhoto(index) {
    currentIndex = (index + items.length) % items.length;
    const current = items[currentIndex];
    const thumbnail = current.querySelector("img");
    image.src = thumbnail.dataset.full || current.href;
    image.alt = thumbnail.alt;
    caption.textContent = current.dataset.caption;
    counter.textContent = `${currentIndex + 1} / ${items.length}`;
  }

  function openPhoto(index, trigger) {
    openedFrom = trigger;
    showPhoto(index);
    savedOverflow = document.body.style.overflow;
    savedPadding = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      const padding =
        parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${padding + scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";
    dialog.showModal();
    closeButton.focus({ preventScroll: true });
  }

  items.forEach((item, index) => {
    item.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      openPhoto(index, item);
    });
  });

  closeButton.addEventListener("click", () => dialog.close());
  previousButton.addEventListener("click", () => showPhoto(currentIndex - 1));
  nextButton.addEventListener("click", () => showPhoto(currentIndex + 1));
  dialog.addEventListener("close", () => {
    document.body.style.overflow = savedOverflow;
    document.body.style.paddingRight = savedPadding;
    touchStart = null;
    openedFrom?.focus({ preventScroll: true });
  });

  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      dialog.close();
    }
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showPhoto(currentIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPhoto(currentIndex - 1);
    }
  });

  image.addEventListener(
    "touchstart",
    (event) => {
      touchStart =
        event.touches.length === 1
          ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
          : null;
    },
    { passive: true },
  );

  image.addEventListener(
    "touchend",
    (event) => {
      if (!touchStart || event.changedTouches.length !== 1) return;
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        showPhoto(currentIndex + (deltaX < 0 ? 1 : -1));
      }
      touchStart = null;
    },
    { passive: true },
  );

  image.addEventListener(
    "touchcancel",
    () => {
      touchStart = null;
    },
    { passive: true },
  );
})();
