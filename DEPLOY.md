# Cloudflare Pages Deployment

Everything to upload lives in the **`deploy/`** folder. Its *contents* go at the
root of the site (not the folder itself).

---

## What's in the bundle

| File | Purpose |
|---|---|
| `index.html` | Homepage |
| `conditions-services.html` | Conditions + Treatments |
| `team.html` · `insurance.html` · `blog.html` · `blog-post.html` | Sub-pages |
| `thank-you.html` | Form confirmation (noindex) |
| `404.html` | Not-found page + client-side redirect fallback |
| `styles.css` · `services.css` · `pages.css` | Stylesheets |
| `app.js` · `services.js` · `blog-posts.js` · `blog-post.js` · `redirect-map.js` | Scripts |
| `_redirects` | 301s from the old Wix URLs |
| `_headers` | Caching + security headers |
| `robots.txt` · `sitemap.xml` | Crawler files |
| `images/` | All photography, logo, favicons, OG image |

`_redirects` and `_headers` **must sit at the root**, beside `index.html`.
Cloudflare reads them at build time; if they end up in a subfolder they're
ignored silently.

---

## Option A — Deploy via GitHub (recommended)

1. Push the **contents** of `deploy/` to the root of your repo.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Pick the repo. Build settings:
   - **Framework preset:** `None`
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`
4. **Save and Deploy.** Every future `git push` redeploys automatically.

> If you'd rather keep `deploy/` as a folder in the repo, set
> **Build output directory** to `deploy` instead of `/`.

## Option B — Direct upload (no Git)

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Upload assets**.
2. Drag in the **contents** of `deploy/` (select the files inside, not the folder).
3. Deploy. Re-uploading creates a new version each time.

---

## Connect the domain

1. In the Pages project → **Custom domains → Set up a domain**.
2. Add **`www.elitespine-nj.com`** (this is the canonical host used across the
   site's `<link rel="canonical">`, OG tags, and `sitemap.xml`).
3. Add the apex **`elitespine-nj.com`** too — Cloudflare creates the records and
   redirects it to `www`.
4. If the domain isn't on Cloudflare yet, add the site first and change the
   nameservers at your registrar to the two Cloudflare assigns. DNS records are
   created automatically once the domain is in your Cloudflare account.
5. SSL/TLS → **Overview** → set encryption mode to **Full (strict)**.

### Force www (avoids duplicate-content)

Cloudflare handles apex → www automatically once both custom domains are added.
If you want it explicit, add a **Redirect Rule** (Rules → Redirect Rules):

- **If** hostname equals `elitespine-nj.com`
- **Then** dynamic redirect to `concat("https://www.elitespine-nj.com", http.request.uri.path)`, status **301**

---

## Clean URLs

Cloudflare Pages serves `/team` from `team.html` automatically, and all internal
links already use the extensionless form (`/team`, `/blog`, `/thank-you`), so
there are no redirect hops. Nothing to configure.

---

## Post-launch checklist

- [ ] Visit the site over `https://www.elitespine-nj.com` — no cert warnings.
- [ ] Submit the appointment form → lands on `/thank-you`, row appears in the
      Google Sheet, alert email arrives at **elitespinefl@gmail.com**.
- [ ] Spot-check redirects: `/services`, `/our-team`, `/about-us`,
      `/contact-us-1`, `/post/anything` should all 301 correctly.
- [ ] Open a bad URL (e.g. `/nope`) → custom 404 renders.
- [ ] `https://www.elitespine-nj.com/robots.txt` and `/sitemap.xml` both load.
- [ ] Submit the sitemap in **Google Search Console** and request indexing.
- [ ] Run the URL through **Facebook Sharing Debugger** and **LinkedIn Post
      Inspector** once to prime the social preview cache.
- [ ] Confirm GA4 (`G-5Z262J5YXZ`) is recording traffic in Realtime.
- [ ] Re-deploy the Apps Script if you've edited `Code.gs` since last time
      (Deploy → Manage deployments → Edit → New version).

---

## Still outstanding (needs your input)

- **reCAPTCHA v3** is wired but inactive — add the site key in `app.js` and the
  secret in `Code.gs` (see `SHEET-SETUP.md`, Step 7).
- **Live Google rating** is wired but inactive — add `PLACES_API_KEY` and
  `PLACE_ID` in `Code.gs` (Step 8). Until then the static 5.0 shows.
- **Zocdoc link** still points to the original practice ID — confirm it routes
  to the Fort Lee location.
## Images

`deploy/images/` ships **web-optimized** files only — total **2.6 MB** for the
whole site (down from ~240 MB of camera originals).

- Condition & treatment cards: 800px wide, ~50–135 KB each
- Backgrounds (proof, clinic, CTA, heroes): 1200–1600px wide, ~64–265 KB each
- Below-the-fold `<img>` tags carry `loading="lazy" decoding="async"`

Filenames use the `.jpg` suffix. The full-resolution originals stay in the
project's root `images/` folder (not deployed) if you ever need to re-crop —
regenerate optimized versions rather than uploading the originals.
