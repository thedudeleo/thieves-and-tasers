/* =========================================================================
   THIEVES & TASERS — landing page behavior
   ---------------------------------------------------------------------------
   EDIT THIS CONFIG with your real links, then everything on the page updates.
   ========================================================================= */
const CONFIG = {
  // Steam store page (the Wishlist button links here).
  steamUrl: "https://store.steampowered.com/app/4536600/Thieves_and_Tasers/",

  // Community channels — paste real URLs when you have them.
  // Discord is live; the others stay visible (link to "#") until you fill them in.
  channels: {
    discord:   "https://discord.gg/ShfdKx4TKq",
    instagram: "https://www.instagram.com/arcticpalmgames",
    tiktok:    "https://www.tiktok.com/@arcticpalmgames",
    youtube:   "https://www.youtube.com/@arcticpalmgames",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  wireLinks();
  wireLightbox();
  wireWishbar();
  wireReveal();
  wireParallax();
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
});

/* Apply CONFIG urls to every tagged element ----------------------------- */
function wireLinks() {
  document.querySelectorAll("[data-wishlist]").forEach((a) => (a.href = CONFIG.steamUrl));

  document.querySelectorAll("[data-channel]").forEach((a) => {
    const url = CONFIG.channels[a.getAttribute("data-channel")];
    if (url && !url.includes("REPLACE_ME")) {
      a.href = url;
    } else {
      a.removeAttribute("href");
      a.setAttribute("aria-disabled", "true");
      a.title = "Coming soon";
    }
  });
}

/* Screenshot lightbox with prev/next ------------------------------------ */
function wireLightbox() {
  const box = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  const shots = [...document.querySelectorAll("[data-shot] img")].map((i) => i.src);
  let idx = 0;
  let closeTimer;

  const show = (i) => {
    clearTimeout(closeTimer);
    idx = (i + shots.length) % shots.length;
    img.src = shots[idx];
    box.hidden = false;
    // next frame so the opacity/scale transition actually runs from the hidden state
    requestAnimationFrame(() => box.classList.add("is-open"));
    document.body.style.overflow = "hidden";
    img.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: "ease" });
  };
  const close = () => {
    box.classList.remove("is-open");
    document.body.style.overflow = "";
    closeTimer = setTimeout(() => { box.hidden = true; img.src = ""; }, 260);
  };

  document.querySelectorAll("[data-shot]").forEach((btn, i) => btn.addEventListener("click", () => show(i)));
  document.querySelector("[data-close-lightbox]")?.addEventListener("click", close);
  document.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => show(idx - 1));
  document.querySelector("[data-lightbox-next]")?.addEventListener("click", () => show(idx + 1));
  document.querySelector(".lightbox__backdrop")?.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
}

/* Subtle parallax — foreground art only (text stays static for readability).
   Off for reduced-motion and on small screens, per accessibility guidance. */
function wireParallax() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = window.matchMedia("(max-width: 760px)").matches;
  if (reduce || small) return;

  const els = [...document.querySelectorAll("[data-parallax]")];
  if (!els.length) return;

  // Hard cap on travel so the art can never leave its padded cell (see the
  // matching padding on .row__media--character).
  const MAX = 26;
  let ticking = false;
  const update = () => {
    const mid = window.innerHeight / 2;
    els.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.05;
      const rect = el.getBoundingClientRect();
      let drift = -(rect.top + rect.height / 2 - mid) * speed;
      drift = Math.max(-MAX, Math.min(MAX, drift));
      el.style.transform = `translate3d(0, ${drift.toFixed(1)}px, 0)`;
    });
    ticking = false;
  };
  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}

/* Sticky wishlist bar — reveals once the hero scrolls out of view --------- */
function wireWishbar() {
  const bar = document.getElementById("wishbar");
  if (!bar) return;
  bar.hidden = false;

  // Reveal after a short scroll, not only once the whole hero leaves view.
  const onScroll = () => bar.classList.toggle("is-visible", window.scrollY > 320);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* Reveal-on-scroll ------------------------------------------------------ */
function wireReveal() {
  const targets = document.querySelectorAll(".row, .strip .shot, .cta");
  targets.forEach((t) => t.classList.add("reveal"));
  if (!("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } }),
    { threshold: 0.12 }
  );
  targets.forEach((t) => io.observe(t));
}
