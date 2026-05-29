/* =========================================================================
   THIEVES & TASERS — landing page behavior
   ---------------------------------------------------------------------------
   EDIT THIS CONFIG with your real links, then everything on the page updates.
   ========================================================================= */
const CONFIG = {
  // Steam store page (the Wishlist button links here).
  steamUrl: "https://store.steampowered.com/app/4536600/Thieves_and_Tasers/",

  // Discord invite link
  discordUrl: "https://discord.gg/ZE6P7HJK",

  // Social profiles — leave blank ("") or "REPLACE_ME" to hide that link
  social: {
    twitter: "https://twitter.com/REPLACE_ME",
    tiktok:  "https://tiktok.com/@REPLACE_ME",
    youtube: "https://youtube.com/@REPLACE_ME",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  wireLinks();
  wireLightbox();
  wireReveal();
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
});

/* Apply CONFIG urls to every tagged element ----------------------------- */
function wireLinks() {
  document.querySelectorAll("[data-wishlist]").forEach((a) => (a.href = CONFIG.steamUrl));

  document.querySelectorAll("[data-discord]").forEach((a) => {
    if (CONFIG.discordUrl && !CONFIG.discordUrl.includes("REPLACE_ME")) a.href = CONFIG.discordUrl;
    else a.remove();
  });

  document.querySelectorAll("[data-social]").forEach((a) => {
    const key = a.getAttribute("data-social");
    const url = CONFIG.social[key];
    if (url && !url.includes("REPLACE_ME")) a.href = url;
    else a.remove();
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
