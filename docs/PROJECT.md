# Project overview

## Purpose

A personal portfolio website for **Anna Papros-Matejuk**, software developer. It is her public
business card: the first impression for recruiters, hiring managers and potential clients.
Because of that, **quality is the feature**. A single layout bug, slow load or broken mobile view
reflects directly on the owner's craft.

The site is also a showcase in itself: the interactive scene demonstrates frontend skill,
creativity and attention to detail.

## Audiences

| Audience                        | What they need                                                  | Time budget              | Main path                      |
| ------------------------------- | --------------------------------------------------------------- | ------------------------ | ------------------------------ |
| **Recruiter / HR**              | Name, role, key skills, experience, CV download, contact. Fast. | 30–90 s, often on mobile | Navigation menu → subpages     |
| **Hiring manager / tech lead**  | Depth: projects, tech decisions, code (GitHub), how she thinks. | 3–10 min, desktop        | Scene + project pages          |
| **Potential client**            | What she can build for them, past work, how to get in touch.    | 1–5 min                  | Scene as a hook, then subpages |
| **Curious visitor / developer** | The fun part: explore, find easter eggs.                        | Open-ended               | Scene                          |

Design every feature by asking: _does this help or hinder the recruiter on a phone?_

## Structure: scene + subpages

- **Home scene**: an illustrated, fairy-tale 2D scene driven by scroll (sky → mountains → ground,
  a cat jumps from a tree). At the bottom, clickable objects lead to subpages or trigger easter eggs.
  Details in [GAME_DESIGN.md](GAME_DESIGN.md).
- **Subpages**: static, fast, readable pages with the actual portfolio content (About, Projects,
  Experience, Skills, Contact with a form). This is what search engines index.
- **Navigation menu**: persistent on every page, the recruiter's shortcut past the scene.

## Goals

1. Communicate who Anna is and what she does within 5 seconds of landing.
2. Rank well for her name and role (e.g. "Anna Papros-Matejuk", "Anna Papros-Matejuk developer").
3. Lighthouse 95+ in all categories on mobile, including the home scene.
4. Work on all modern browsers and devices, from 360px phones to wide desktops, mouse, touch and keyboard.
5. Make the scene memorable: something people share and talk about.
6. Easy to update content (new project, new job) without touching component code.

## Non-goals

- No CMS, database or separate backend. Content lives in the repo. Server-side code is limited to Next.js
  serverless functions (contact form, locale redirect, later the AI cat), see [DECISIONS.md](DECISIONS.md).
- No user accounts, comments or analytics-heavy tracking.
- No blog in the first release (may come later, see [BACKLOG.md](BACKLOG.md)).
- No support for legacy browsers (IE, pre-2022 Safari).

## Owner

- Name: Anna Papros-Matejuk
- GitHub: `Idelya` (repo: `github.com/Idelya/portfolio`)
- Hosting: Vercel, no custom domain yet (see [DECISIONS.md](DECISIONS.md)).
