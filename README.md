# Thieves and Tasers — Landing Page

A static, single-page landing site for **Thieves and Tasers** (Arctic Palm Games). Plain
HTML / CSS / JS, built to deploy on **GitHub Pages**. The primary call to action is
**Wishlist on Steam**.

```
.
├── index.html        # the landing page
├── 404.html          # custom not-found page
├── CNAME             # custom domain for GitHub Pages
├── .nojekyll         # tell GitHub Pages to serve files as-is
├── css/styles.css    # all styles (theme: sleek heist/noir, gold + cyan)
├── js/main.js        # behavior + the CONFIG block you edit
├── press/index.html  # press kit page
└── assets/           # << YOU ADD IMAGES/VIDEO HERE >>
```

## 1. Fill in your links (most important)

Open **`js/main.js`** and edit the `CONFIG` block at the top:

| Field | What to put |
|---|---|
| `steamUrl` | Your Steam store URL (already set to your appid) |
| `discordUrl` | Your Discord invite link |
| `social.twitter` / `.tiktok` / `.youtube` | Profile URLs — leave `""` to hide a link |
| `trailerYouTubeId` | The ID from your YouTube trailer URL (after `watch?v=`) |

Links left as `REPLACE_ME` are auto-hidden/disabled, so the page never shows a dead link.

## 2. Drop in your assets

Create these files inside `assets/` (filenames must match, or update the paths in `index.html`):

| File | Used for | Recommended |
|---|---|---|
| `assets/hero-keyart.jpg` | Full-screen hero background | 1920×1080, key art or a striking screenshot |
| `assets/trailer-poster.jpg` | Trailer thumbnail | 1280×720 |
| `assets/og-image.jpg` | Social share preview | 1200×630 |
| `assets/favicon.ico` + `assets/icon.svg` | Browser tab icon | — |
| `assets/gifs/clip-1.gif` … `clip-3.gif` | The animated clip strip | short loops, keep under ~3–5 MB each |
| `assets/screenshots/shot-1.jpg` … `shot-6.jpg` | Screenshot gallery (lightbox) | 1920×1080 |
| `press/assets/thieves-and-tasers-presskit.zip` | Press asset download | logos + screenshots zip |

> Tip: keep images optimized (JPG/WebP, compressed). Big GIFs are the usual culprit for
> a slow page — consider short MP4/WebM if size becomes a problem and swap the `<img>` for `<video>`.

## 3. Email signup form

Static hosting can't process form posts. Point the form at a 3rd-party service:

1. Create a form/list at **Mailchimp**, **Buttondown**, **ConvertKit**, or **Formspree**.
2. In `index.html`, find `data-email-form` and replace `REPLACE_WITH_EMAIL_FORM_ACTION_URL`
   in the `action="..."` attribute with the URL that service gives you. Match the input
   `name="email"` to what the service expects (most accept `email`).

## 4. Deploy to GitHub Pages

1. Create a repo and push these files (see commands below).
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main`, folder `/ (root)`.
3. **Custom domain:** the included `CNAME` is set to `thievesandtasers.com`. At your domain
   registrar, add DNS records pointing at GitHub Pages:
   - Four `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - (optional) `AAAA` records for IPv6, or a `CNAME` for `www` → `<username>.github.io`
   - In Settings → Pages, tick **Enforce HTTPS** once the cert provisions.
   - If you don't have a custom domain yet, **delete the `CNAME` file** and the site will
     live at `https://<username>.github.io/<repo>/`. If using a project subpath, note the
     `404.html` and a couple of absolute `/` paths assume root — see comments.

```bash
git init
git add .
git commit -m "Initial landing page"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

## 5. Local preview

Any static server works, e.g.:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Customizing the look

Theme colors live as CSS variables at the top of `css/styles.css` (`:root`):
`--thief` (gold), `--taser` (cyan), and the dark `--bg*` family. Change those to re-skin
the whole site. Fonts are Oswald (display) + Inter (body) via Google Fonts in `index.html`.
