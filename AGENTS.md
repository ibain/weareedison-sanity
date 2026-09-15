# AGENTS.md

Sanity CMS + copy-paste Squarespace snippets for the We Are Edison PTA site. Squarespace cannot do granular edits; this repo is the backend that can. **Not a website repo.** Live site lives in Squarespace. This repo: Studio schemas, Studio UI, and frontend snippets humans paste into Squarespace.

Keep this file short. Details live in the files listed at the bottom. After you change schema, snippets, deploy, IDs, or content types: update this file in the same change, then prune anything now wrong. Do not grow it. Do not duplicate README.

## Pickup

| | |
|---|---|
| Studio | https://weareedison.sanity.studio |
| Site | https://www.weareedison.org |
| Project / dataset | `u8cybb7l` / `production` |
| Public GROQ | `https://u8cybb7l.api.sanity.io/v2024-01-01/data/query/production` (no token) |
| Node | >=22.18.0 (`.nvmrc`: 22; native TypeScript stripping for validation tests). `nvm use` then `npm i` |
| Dev | `npm run dev` → http://localhost:3333 |
| Check | `npm run lint` and `npm test` (`test` = meeting validation tests + `sanity build`) |

Content types (`schemas/`, registered in `schemas/index.ts`):

| `_type` | File | Notes |
|---|---|---|
| `events` | `schemas/events.ts` | `excerpt` is portable text (`blockContent`). `featured` → home slider. |
| `slides` | `schemas/slide.ts` | Evergreen home slider slides. |
| `garden` | `schemas/garden.ts` | Singleton `documentId: 'garden'`. Intro / What's Going On / FAQ. |
| `gardenPlant` | `schemas/gardenPlant.ts` | A–Z index + QR (`/garden-plants#slug`). Spanish fields stored, English renders. |
| `meetingSettings` | `schemas/meetingSettings.ts` | Singleton `documentId: 'meetingSettings'`. Zoom join details and optional original `zoomInviteUrl` for meet.weareedison.org. |

Desk: `deskStructure.ts`. Public URLs for plant QR: `lib/site.ts`.

**Not in this repo:** Squarespace pages/theme. **meet.weareedison.org** (Vercel Zoom join) — this repo only stores meeting fields; Zoom SDK keys stay on Vercel. Squarespace footer banner (`SquareSpace Code/global-footer-injection.html`) hits `https://meet.weareedison.org/api/zoom/status`, not Sanity directly.

Security overrides in `package.json` pin patched archive/YAML/TOML dependencies used by Studio tooling.

Meeting schedule validators live in `schemas/meetingValidation.ts`; recurring day/times must be valid before publishing. Published notes are public. Event browser-join buttons and the five-minute banner refresh require re-pasting the Events Code Block and Site Footer snippets after this change.

## Two deploy paths

1. **Studio / schema** — push `main` → `.github/workflows/deploy.yml` → `npx sanity deploy --yes`. Secret: `SANITY_AUTH_TOKEN`. CI (lint/build/audit) on every push/PR: `.github/workflows/ci.yml`.
2. **Squarespace** — no CI. Copy a file from `SquareSpace Code/` and paste into the matching Code Block / Header / Footer injection. Placement map: `SquareSpace Code/README.md`. Schema or GROQ change with no re-paste = live site stale or broken.

Do not deploy `SquareSpace Code/sanity-test.js` or `SquareSpace Code/original-slider-code.txt`.

## Agent rules

- **Code wins over README.** Root `README.md` is for humans and can lag (e.g. Node version). Fix README when you notice drift; do not copy it into this file.
- **Rename a schema field → update GROQ in `SquareSpace Code/` in the same change.** Tell the human to re-paste. Snippets are vanilla JS, no build.
- Events/slides images: 16:9 crop + alt required. Plant QR uses slug, not `_id`.
- Dataset is publicly readable. Do not put Zoom SDK secrets, write tokens, or `.env` in this repo.
- If browser fetches fail: check Sanity CORS allowlist for `weareedison.org`. Probe GROQ in Studio Vision.
- One-off data migrations: `scripts/` + `scripts/README.md`. Need a logged-in Sanity user with write access.
- Renovate automerges minor/patch when CI passes.

## Where to look (do not inline)

- Humans / content workflow: `README.md`
- Paste targets + snippet behavior: `SquareSpace Code/README.md`
- Excerpt migration: `scripts/README.md`
- Calendar subscribe UX: `SquareSpace Code/calendar-integration-guide.md`
