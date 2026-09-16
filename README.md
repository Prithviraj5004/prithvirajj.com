# Prithviraj Salunke — portfolio (v1)

A single-page personal portfolio. React + Vite + Tailwind, no backend, no database.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Change the content

Everything you'll want to edit lives in **`src/config.js`** — name, intro, the
"still being built" message, about paragraphs, skills, the learning roadmap,
contact copy and the footer.

Replace these placeholders there before publishing:

```js
email:    'YOUR_EMAIL'
github:   'YOUR_GITHUB_URL'
linkedin: 'YOUR_LINKEDIN_URL'
twitter:  'YOUR_TWITTER_URL'
```

Adding a skill group or a roadmap item is just adding an object to the arrays —
no component changes needed.

## The four theme levels

The site has four palette levels instead of a plain light/dark switch:

| Level | Background          | Text          |
| ----- | ------------------- | ------------- |
| 1     | Floral White `#FFFBF4` | Smoky Black |
| 2     | Bone `#D8CFBC`      | Smoky Black   |
| 3     | Olive Drab `#565449` | Floral White |
| 4     | Smoky Black `#11120D` | Floral White |

Levels 1–2 are the light pair, 3–4 the dark pair. The sun/moon button jumps
between the two pairs and remembers the last level used in each.

All colours are CSS variables defined in `src/index.css` under
`:root[data-level='1' … '4']`, and Tailwind reads them through
`tailwind.config.js`. Change a hex in one place and the whole site follows.

The choice is saved to `localStorage` under `ps-theme-level`. On a first visit
the site follows the system light/dark preference. A tiny inline script in
`index.html` applies the saved level before first paint so there's no flash.

> One caveat: because the Tailwind colours are `var(--…)` values, opacity
> modifiers like `bg-bg/50` won't work. Use a variable or an explicit rgba
> instead.

## Structure

```
src/
  config.js                  ← all content and links
  App.jsx                    ← page composition
  index.css                  ← theme levels, base styles, .btn / .tag / .wrap
  hooks/useThemeLevel.js     ← theme state + persistence
  components/
    Navbar.jsx  ThemeControl.jsx  Hero.jsx
    Section.jsx Reveal.jsx        Icons.jsx
    About.jsx   Skills.jsx        CurrentlyLearning.jsx
    Contact.jsx Footer.jsx
```

`Section.jsx` is the reusable wrapper for About / Skills / Currently learning /
Contact — pass it an `id`, a `label` and an `index` and it handles layout and
the scroll reveal. Adding a new section later is a few lines in `App.jsx`.

Motion is one hero entrance sequence plus a gentle reveal per section, and all
of it is disabled under `prefers-reduced-motion`.

---

Fully vibe-coded with AI.

## Deploying

### GitHub Pages
A workflow at `.github/workflows/deploy.yml` builds and deploys automatically
on every push to `main`. In your repo: **Settings → Pages → Source → GitHub
Actions**. No other setup needed.

### Custom domain
1. Put your domain in a file named `CNAME` (no extension) inside `public/`,
   containing just the domain, e.g. `yourdomain.com`. Vite copies everything
   in `public/` into the build output untouched.
2. At your DNS provider, point the domain at GitHub Pages (an `A` record to
   GitHub's IPs, or a `CNAME` record to `yourusername.github.io` for a
   subdomain) — see GitHub's "Managing a custom domain" docs.
3. In **Settings → Pages**, add the same domain under "Custom domain" and
   enable "Enforce HTTPS" once it's verified.

### Any other static host (Netlify, Vercel, your own server)
Run `npm run build`, then upload the contents of `dist/` — that's the whole
site, no server required.
