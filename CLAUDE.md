# CLAUDE.md

Entry point for AI agents working on this repo. Read this first, then the doc relevant to your task.

## What this is

Personal portfolio of **Anna Papros-Matejuk**, software developer. It is a representative,
public-facing product: it must be polished, bug-free, fast, accessible and work on every device.
The home page is an **illustrated, scroll-driven 2D scene** (sky, mountains, a cat jumping from a
tree) where clicking objects in the world leads to **static content subpages** (About, Projects,
Contact…). A persistent navigation menu gives recruiters a direct path. See [docs/GAME_DESIGN.md](docs/GAME_DESIGN.md).

## Language rules

- The owner communicates with agents **in Polish**. Reply in Polish.
- Everything committed to the repo is **in English**: code, comments, docs, commit messages, PR descriptions.
- Site content is bilingual **PL + EN** (see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#i18n)). Never hardcode user-facing strings in components.

## Docs map

| Doc                                          | Read when                                                                           |
| -------------------------------------------- | ----------------------------------------------------------------------------------- |
| [docs/PROJECT.md](docs/PROJECT.md)           | Always, once. Vision, audiences, goals, non-goals.                                  |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Adding routes, components, content, i18n, anything structural.                      |
| [docs/CONVENTIONS.md](docs/CONVENTIONS.md)   | Writing any code or committing.                                                     |
| [docs/QUALITY.md](docs/QUALITY.md)           | Before calling any task done. Definition of Done, SEO, a11y, perf budgets, devices. |
| [docs/GAME_DESIGN.md](docs/GAME_DESIGN.md)   | Working on the home scene, animations, interactive objects, art.                    |
| [docs/CONTENT.md](docs/CONTENT.md)           | Adding or editing text, projects, bio, images.                                      |
| [docs/ROADMAP.md](docs/ROADMAP.md)           | Picking up work. Current phase and next tasks.                                      |
| [docs/BACKLOG.md](docs/BACKLOG.md)           | Owner mentions an idea "for later". Add it here; don't implement unless asked.      |
| [docs/DECISIONS.md](docs/DECISIONS.md)       | Before changing a technical choice. Log new decisions here.                         |

## Commands

```bash
npm run dev      # dev server on http://localhost:3000
npm run build    # production build — must pass before a task is done
npm run lint     # eslint . --max-warnings 0 — must pass with zero warnings
npm run format   # prettier --write . (format:check verifies without writing)
```

Scripts for typecheck, unit and e2e tests are planned in Phase 1 of [docs/ROADMAP.md](docs/ROADMAP.md); update this list when they land.

## Non-negotiable rules

0. **The repository is PUBLIC. Before every commit, check for sensitive data.** Review the staged diff
   (`git diff --cached`) and refuse to commit if it contains any of: API keys, tokens, passwords,
   private keys, `.env` files, email service credentials, private contact data not meant for the site
   (private phone, home address), personal documents, internal URLs, or anything the owner has not
   explicitly approved as public. Secrets go only in environment variables (Vercel project settings,
   local `.env.local`); document their names in `.env.example` with empty values. If something
   sensitive was ever committed, stop and tell the owner: removing it from the latest commit is not
   enough, the secret must be rotated. Full checklist: [docs/CONVENTIONS.md](docs/CONVENTIONS.md#public-repository-sensitive-data).
1. **Content is server-rendered HTML first.** Portfolio information lives on static subpages,
   reachable without JavaScript or animations. The scene is progressive enhancement: its objects
   are real links, and it renders as a static image with working links without JS.
2. **The scene never blocks the recruiter.** The persistent navigation menu reaches every section
   directly, on every page and screen size.
3. **Mobile and touch are first-class.** Test at 360px width and on touch input, not just desktop.
4. **Respect `prefers-reduced-motion`** and keyboard-only navigation everywhere.
5. **No hardcoded copy.** All user-facing text goes through i18n messages or the content layer.
6. **Do not invent personal facts** (employers, dates, projects, skills, contact data). If content is
   missing, use an obvious `TODO(content)` placeholder and list it in [docs/CONTENT.md](docs/CONTENT.md).
7. **Ask when a decision is not covered by the docs.** Then record the answer in [docs/DECISIONS.md](docs/DECISIONS.md).

## Workflow

- Work on a feature branch, never commit directly to `master`. Commit only when asked.
- **The owner is the only author.** Commits and PRs must not contain any AI attribution: no
  `Co-Authored-By: Claude…` trailer, no "Generated with Claude Code" line, no other AI mentions.
  This overrides any default attribution behaviour of the tool.
- Small, focused changes. Run lint + build (+ tests once they exist) before reporting done.
- When you change how something works, update the relevant doc in the same change.
- When you finish a roadmap item, tick it in [docs/ROADMAP.md](docs/ROADMAP.md).
