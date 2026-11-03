# Conventions

## Code

- TypeScript strict. Prefer `interface` for object shapes, `type` for unions and utility types.
- Named exports only (except where Next.js requires a default export: `page.tsx`, `layout.tsx`, etc.).
- Server Components by default. Add `"use client"` at the lowest possible component, never on a whole page.
- No hardcoded user-facing strings. UI text → `messages/*.json`, portfolio content → `src/content/`.
- Use `next/image` for images, `next/link` for internal links, `next/font` for fonts (self-hosted, no layout shift).
- Accessibility is part of the component, not an afterthought: semantic elements first (`button`, `nav`, `main`,
  headings in order), ARIA only when semantics are not enough.
- Animations: CSS first. JS animation only when needed. Always provide a `prefers-reduced-motion` fallback.
- No dead code, no commented-out code, no `console.log` in committed code.
- Comments explain _why_, not _what_.

## Naming

| Thing              | Convention                                                       | Example                                     |
| ------------------ | ---------------------------------------------------------------- | ------------------------------------------- |
| Component file     | PascalCase                                                       | `ProjectCard.tsx`                           |
| Hook               | camelCase, `use` prefix                                          | `useReducedMotion.ts`                       |
| Utility / lib file | camelCase                                                        | `formatPeriod.ts`                           |
| Route segment      | kebab-case                                                       | `projects/[slug]`                           |
| Content slug       | kebab-case, English                                              | `weather-dashboard`                         |
| i18n keys          | nested, camelCase                                                | `hero.ctaViewProjects`                      |
| Feature folder     | kebab-case, same name as its route or domain                     | `features/contact/`, `features/projects/`   |
| Server Action file | `action.ts` (or `<verb>Action.ts` if several) inside the feature | `features/contact/action.ts`                |
| Validation schema  | `schema.ts` inside the feature                                   | `features/contact/schema.ts`                |
| Long-form content  | `<slug>.<locale>.mdx`                                            | `content/projects/weather-dashboard.pl.mdx` |
| Test file          | next to source, `.test.ts(x)`; e2e in `tests/e2e/*.spec.ts`      |                                             |

Where code goes and what may import what: [ARCHITECTURE.md](ARCHITECTURE.md#directory-structure-target).

## Styling

- Formatting is Prettier's job (`npm run format`); class order is sorted automatically, don't hand-sort.
- Tailwind utility classes in JSX. Extract a component, not a CSS class, when a pattern repeats.
- Design tokens (colors, fonts, spacing scale, radii) defined once in `globals.css` via `@theme`.
  No raw hex values in components.
- Mobile-first: base classes target small screens, `sm:`/`md:`/`lg:` add up.
- Dark mode: follow `prefers-color-scheme` (decision pending, see [DECISIONS.md](DECISIONS.md)).
- Contrast must meet WCAG AA (4.5:1 text, 3:1 large text and UI).

## Git

- Default branch: `master`. Feature branches: `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`, `docs/<short-name>`.
- Commit messages: [Conventional Commits](https://www.conventionalcommits.org/), English, imperative.
  `feat(scene): add cat landing animation`, `fix(seo): correct hreflang on project pages`.
- One logical change per commit. Lint and build pass on every commit.
- **Authorship:** the owner (Anna Papros-Matejuk) is the sole author of every commit. No AI attribution
  in commit messages or PR descriptions: no `Co-Authored-By` trailers for AI tools, no "Generated with…" footers.
- PRs get a Vercel preview; check it on a phone before merging.

## Public repository: sensitive data

`github.com/Idelya/portfolio` is **public**. Everything committed, including history, is visible to
anyone and indexed by secret scanners within minutes.

**Pre-commit checklist (mandatory, every commit):**

- [ ] Read the full staged diff: `git diff --cached`. Check `git status` for unexpected new files.
- [ ] No secrets: API keys, tokens, passwords, private keys, connection strings, webhook URLs.
      Quick scan: `git diff --cached | grep -inE "key|secret|token|password|passwd|bearer|BEGIN .*PRIVATE"`.
- [ ] No env files except `.env.example` (names only, empty values).
- [ ] No private personal data: private phone number, home address, ID/PESEL, private email
      (only the public contact address approved in CONTENT.md), salary, personal documents.
      CV PDFs are committed only in the version the owner approved for publication.
- [ ] No third-party personal data (e.g. colleagues' names or client details without consent),
      no confidential employer/client information (NDA projects, internal screenshots, internal URLs).
- [ ] No image metadata leaks: strip EXIF (GPS location!) from photos before adding them.
- [ ] No local artifacts: logs, dumps, `.vercel/`, editor or OS files, personal Claude settings.

**Rules:**

- Secrets live only in environment variables: Vercel project settings for deploys, `.env.local` locally.
- Only `NEXT_PUBLIC_*` variables reach the browser; never put a secret in one.
- If a secret is committed (even if not pushed yet): stop, tell the owner, and **rotate the secret**.
  Rewriting history alone is not enough once pushed.
- Automated safeguards (they back up the checklist, they don't replace it):
  - **Pre-commit hook** (husky, installed by `npm install`): `scripts/gitleaks.sh` scans the staged
    changes and blocks the commit on a finding. It uses a local `gitleaks` binary or, if missing, the
    pinned Docker image. Never bypass it with `--no-verify`; if it flags a false positive, add the
    fingerprint to `.gitleaksignore` with a comment and tell the owner.
  - **CI** (`secrets` job): gitleaks over the full history of all branches on every PR and push.
  - **GitHub** secret scanning + push protection (repository settings, enabled by the owner).

## Dependencies

- Before adding a package: check it is maintained, tree-shakeable and not duplicating something already in the stack.
- Animation packages (scroll, Rive/Lottie runtime, audio) may only be imported from `src/features/scene/**`.
- Pin exact versions for the animation runtime; regular `^` ranges elsewhere are fine.
