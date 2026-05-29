/* =========================================================================
   THIEVES & TASERS — landing page behavior
   ---------------------------------------------------------------------------
   EDIT THIS CONFIG with your real links, then everything on the page updates.
   ========================================================================= */
const CONFIG = {
  // Steam store page (the Wishlist button lives here). Keep as-is unless your appid changes.
  steamUrl: "https://store.steampowered.com/app/4536600/Thieves_and_Tasers/",

  // Discord invite link
  discordUrl: "https://discord.gg/ZE6P7HJK",

  // Social profiles — leave blank ("") to hide that link
  social: {
    twitter: "https://twitter.com/REPLACE_ME",
    tiktok:  "https://tiktok.com/@REPLACE_ME",
    youtube: "https://youtube.com/@REPLACE_ME",
  },

  // YouTube trailer video ID (the part after watch?v=). e.g. "dQw4w9WgXcQ"
  trailerYouTubeId: "D6io5XZWBHk",

  // Email signup endpoint. Paste the form/POST URL from your provider:
  //   Formspree  -> https://formspree.io/f/xxxxxxxx
  //   Buttondown -> https://buttondown.email/api/emails/embed-subscribe/<user>
  //   Mailchimp / ConvertKit also give you a POST URL.
  // Leave as REPLACE_ME and the form shows a friendly "coming soon" instead of breaking.
  emailFormAction: "REPLACE_ME",
};

/* ----------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  wireImageFallbacks();
  wireLinks();
  wireNavScroll();
  wireTrailer();
  wireLightbox();
  wireEmailForm();
  wireReveal();
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
});

/* Until real assets are added, show a styled placeholder instead of a broken
   image icon. Remove this once assets/ is populated if you prefer. ------- */
function wireImageFallbacks() {
  const placeholder = (label) =>
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='1280' height='720'>
         <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
           <stop offset='0' stop-color='#151b24'/><stop offset='1' stop-color='#0a0c10'/>
         </linearGradient></defs>
         <rect width='100%' height='100%' fill='url(#g)'/>
         <rect x='1' y='1' width='1278' height='718' fill='none' stroke='#1d2733' stroke-width='2'/>
         <text x='50%' y='50%' fill='#3a4654' font-family='Arial' font-size='34'
           text-anchor='middle' dominant-baseline='middle'>${label}</text>
       </svg>`
    );

  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener(
      "error",
      () => {
        const label = (img.getAttribute("alt") || "Add image").toUpperCase();
        img.src = placeholder(label);
      },
      { once: true }
    );
  });
}

/* Apply CONFIG urls to every tagged element ----------------------------- */
function wireLinks() {
  document.querySelectorAll("[data-wishlist]").forEach((a) => (a.href = CONFIG.steamUrl));

  document.querySelectorAll("[data-discord]").forEach((a) => {
    if (CONFIG.discordUrl && !CONFIG.discordUrl.includes("REPLACE_ME")) a.href = CONFIG.discordUrl;
    else hideOrDisable(a);
  });

  document.querySelectorAll("[data-social]").forEach((a) => {
    const key = a.getAttribute("data-social");
    const url = CONFIG.social[key];
    if (url && !url.includes("REPLACE_ME")) a.href = url;
    else a.remove();
  });
}

function hideOrDisable(a) {
  // Keep Discord buttons visible but inert until you add a link.
  a.setAttribute("aria-disabled", "true");
  a.style.opacity = "0.5";
  a.style.pointerEvents = "none";
}

/* Sticky-nav background on scroll --------------------------------------- */
function wireNavScroll() {
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* Trailer modal (lazy-loads the YouTube iframe on open) ----------------- */
function wireTrailer() {
  const modal = document.getElementById("trailerModal");
  const mount = document.getElementById("trailerMount");

  const open = () => {
    if (CONFIG.trailerYouTubeId && !CONFIG.trailerYouTubeId.includes("REPLACE_ME")) {
      mount.innerHTML =
        `<iframe src="https://www.youtube-nocookie.com/embed/${CONFIG.trailerYouTubeId}?autoplay=1&rel=0" ` +
        `title="Thieves and Tasers trailer" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
    } else {
      mount.innerHTML = `<p style="display:grid;place-items:center;height:100%;color:#aeb7c4;text-align:center;padding:2rem">` +
        `Add your YouTube trailer ID in <code>js/main.js</code> (CONFIG.trailerYouTubeId).</p>`;
    }
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    modal.hidden = true;
    mount.innerHTML = "";           // stop playback
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-open-trailer]").forEach((el) => el.addEventListener("click", open));
  document.querySelectorAll("[data-close-trailer]").forEach((el) => el.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) close(); });
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

/* Email signup — submits on-page (no redirect) and shows inline status.
   Works with any provider that accepts a POST and can return JSON/200. ---- */
function wireEmailForm() {
  const form = document.querySelector("[data-email-form]");
  if (!form) return;
  const status = form.parentElement.querySelector("[data-email-status]");
  const input = form.querySelector('input[type="email"]');
  const button = form.querySelector('button[type="submit"]');
  const configured = CONFIG.emailFormAction && !CONFIG.emailFormAction.includes("REPLACE_ME");

  if (configured) form.setAttribute("action", CONFIG.emailFormAction);

  const say = (msg, kind) => {
    if (!status) return;
    status.textContent = msg;
    status.dataset.kind = kind; // "ok" | "err" | ""
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!input.checkValidity()) { say("Please enter a valid email.", "err"); input.focus(); return; }

    if (!configured) {
      say("Signups open soon — check back, or join the Discord for updates!", "");
      return;
    }

    const original = button.textContent;
    button.disabled = true; button.textContent = "Sending…";
    try {
      const res = await fetch(CONFIG.emailFormAction, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        form.reset();
        say("You're on the list. We'll be in touch.", "ok");
      } else {
        say("Hmm, that didn't go through. Try again in a moment.", "err");
      }
    } catch (_) {
      say("Network hiccup — please try again.", "err");
    } finally {
      button.disabled = false; button.textContent = original;
    }
  });
}

/* Reveal-on-scroll ------------------------------------------------------ */
function wireReveal() {
  const targets = document.querySelectorAll(
    ".section__head, .faction, .shot, .community__card, .cta-banner__inner"
  );
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
