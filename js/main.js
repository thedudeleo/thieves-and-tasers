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
    discord:   "https://discord.gg/ZE6P7HJK",
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

  const show = (i) => {
    idx = (i + shots.length) % shots.length;
    img.src = shots[idx];
    box.hidden = false;
    document.body.style.overflow = "hidden";
  };
  const close = () => { box.hidden = true; img.src = ""; document.body.style.overflow = ""; };

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
