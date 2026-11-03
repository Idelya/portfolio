# Quality standards

This site represents its owner professionally. These standards are the Definition of Done.

## Definition of Done (every task)

- [ ] `npm run lint` passes with zero warnings (enforced by `--max-warnings 0`).
- [ ] `npm run build` passes.
- [ ] Typecheck and tests pass (once set up in Phase 1).
- [ ] Checked at **360px, 768px, 1280px and 1920px** widths.
- [ ] Works with **keyboard only** (visible focus, logical tab order, no traps).
- [ ] Works with **touch** (tap targets ≥ 44×44 px, no hover-only interactions).
- [ ] `prefers-reduced-motion: reduce` respected.
- [ ] Both locales (`en`, `pl`) render correctly, no missing keys, no text overflow (Polish strings are often longer).
- [ ] No console errors or warnings in the browser.
- [ ] Relevant docs updated.
- [ ] **Sensitive-data check done on the staged diff** (public repo, see [CONVENTIONS.md](CONVENTIONS.md#public-repository-sensitive-data)).

## Supported devices and browsers

| Category | Targets |
|---|---|
| Mobile | iOS Safari (last 2 major), Chrome Android (last 2 major) |
| Desktop | Chrome, Edge, Firefox, Safari (last 2 major) |
| Viewports | 360px to 2560px wide; portrait and landscape |
| Input | Mouse, touch (incl. touch scroll momentum), keyboard |
| Low-end | All pages fully usable on low-end Android and slow 4G |

On weak devices (`saveData`, low memory) the scene may drop to the static composition (same as reduced motion), with no error.
Scroll animation must stay at 60 fps on a mid-range phone: animate only `transform` and `opacity`.

## Performance budgets (mobile, Lighthouse)

| Metric | Budget |
|---|---|
| Lighthouse Performance / Accessibility / Best Practices / SEO | ≥ 95 each |
| LCP | < 2.0 s |
| CLS | < 0.05 |
| INP | < 200 ms |
| Initial JS (gzipped, subpages) | < 100 KB |
| Initial JS (gzipped, home incl. animation runtime) | < 180 KB |
| Scene art above the fold | < 300 KB total; lower layers lazy-loaded |

## SEO

- [ ] Unique `<title>` and meta description per page and locale (description ≤ 160 chars).
- [ ] Canonical URL on every page; `hreflang` alternates for `en`, `pl` and `x-default`.
- [ ] Open Graph + Twitter card tags, with a 1200×630 OG image.
- [ ] JSON-LD `Person` schema on home (name, jobTitle, url, sameAs: GitHub, LinkedIn…).
- [ ] `sitemap.xml` and `robots.txt` generated.
- [ ] One `<h1>` per page, heading levels not skipped.
- [ ] All meaningful images have localized `alt`; decorative images have `alt=""`.
- [ ] All content is in the server-rendered HTML (verify with JS disabled).
- [ ] Clean, human-readable URLs; no content behind hash routes or query strings only.
- [ ] Preview deployments are `noindex`.

## Accessibility

Target **WCAG 2.2 AA**.
- Skip link to main content as the first focusable element.
- Color contrast AA.
- Scene: every interactive object is a focusable link/button with a label, decorative layers are
  `aria-hidden`, no flashing above 3 Hz, looping ambient animations can be paused (WCAG 2.2.2) or stop
  after a few seconds, and the reduced-motion static composition works fully.
- Screen reader smoke test (VoiceOver or NVDA) before each release.

## Testing strategy

| Layer | Tool | What |
|---|---|---|
| Unit | Vitest | Content validation (all fields translated, slugs unique), utils, hooks, scroll keyframe math (pure functions). |
| E2E | Playwright | Navigation, language switch, scene objects link to subpages, scene with JS disabled and with reduced motion (all links reachable, `<h1>` present), `/` locale redirect, contact links, 404; on Chromium, WebKit, Firefox and mobile emulation. |
| A11y | `@axe-core/playwright` | Axe scan on every page in both locales, zero violations. |
| Performance / SEO | Lighthouse CI | Budgets above, run on PR previews. |
| Visual | Playwright screenshots (optional) | Key pages at 360 / 1280 px. |
