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

/* Contained parallax — foreground art travels within its own window: it sits at
   the top as the window scrolls into view and drifts down to the bottom as you
   scroll past, then stops (clamped to the window's slack). Text stays static for
   readability. Off for reduced-motion. */
function wireParallax() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const imgs = [...document.querySelectorAll("[data-parallax]")];
  if (!imgs.length) return;

  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    imgs.forEach((img) => {
      const box = img.closest(".row__media--character") || img.parentElement;
      // Vertical room the art can travel inside its window (0 → no parallax).
      const slack = box.clientHeight - img.offsetHeight;
      if (slack <= 1) { img.style.transform = ""; return; }
      const rect = box.getBoundingClientRect();
      // 0 as the window enters from the bottom of the viewport, 1 once it has
      // scrolled off the top — so the art rides top → bottom of its window.
      let p = (vh - rect.top) / (vh + rect.height);
      p = Math.max(0, Math.min(1, p));
      img.style.transform = `translate3d(0, ${(p * slack).toFixed(1)}px, 0)`;
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
