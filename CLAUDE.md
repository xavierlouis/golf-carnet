# Carnet de golf — PWA

Journal d'entraînement de golf perso (Xavier). Static site, no build step, no framework, no backend.
Installed on iPhone via Safari → Partager → « Sur l'écran d'accueil ».

## Files
- `index.html` — whole app (HTML + CSS + JS inline). UI in French.
- `manifest.webmanifest` — PWA manifest (name, standalone display, icons).
- `sw.js` — service worker: network-first for same-origin files (new deploys show up on next app open), cache fallback offline, cache-first for Google Fonts.
- `icons/` — apple-touch-icon 180, 192, 512, maskable 512, favicon 32.

## Data
- Stored in `localStorage` under key `golf-carnet-v1` as an array of sessions:
  `{id, date:"YYYY-MM-DD", type:"practice|putting|approche|bunker|parcours|physique", mode:"cours|solo", minutes, place, feel:1-5|null, note, balls|null, score|null, updatedAt}`
- **Never rename the key or change the shape without a migration** — it is the user's only copy.
- Backup: header button « Sauvegarde » → export JSON (iOS share sheet) / import (merge by id, newest `updatedAt` wins).
- All storage goes through the `store` object (`sub/put/del/all/replace`). A remote backend (e.g. Supabase) can replace it later behind the same API.

## Deploy (GitHub Pages)
1. Create a repo (e.g. `golf-carnet`), push these files to `main` at the root.
2. Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. Site URL: `https://<user>.github.io/golf-carnet/` — all paths are relative, so a sub-path works.
4. On iPhone: open the URL in Safari → Partager → « Sur l'écran d'accueil ».

Alternatives that also work as-is: Cloudflare Pages, Netlify, Vercel (static, no build command, output dir `/`).

## Updating
- Edit, commit, push. GitHub Pages redeploys in ~1 min.
- Because `sw.js` is network-first, the phone gets the new version the next time the app is opened online (the page reloads itself once when the new worker takes control).
- Bump `VERSION` in `sw.js` when icons or the manifest change so old caches are dropped.
- iOS caches the home-screen icon at install time: to see a new icon, remove and re-add the shortcut.

## Constraints
- Must stay a single static page that works offline and in iOS standalone mode (safe-area insets already handled).
- Keep both light and dark palettes (CSS tokens in `:root` + `prefers-color-scheme`).
- No `alert/confirm/prompt` — confirmations are inline in the UI.
