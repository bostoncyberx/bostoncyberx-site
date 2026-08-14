# bostoncyberx — house rules for AI assistants

This repository IS the live website. Every commit to `main` publishes to
bostoncyberx.netlify.app within about a minute. There is no draft step.
Read this file fully before editing anything.

## Who works here

- **Faris (FarisBat)** and **Scott (scottmccarthy-bcx)** are equal owners.
  Either of them, through their own AI assistant, has full autonomy over
  this site: copy, structure, new pages, layout, nav, footer, anything.
  Neither routes through the other. This file exists so any assistant can
  make ANY change, including structural ones, safely and on-brand alone.
- Both are non-developers. Explain changes in plain English, verify before
  pushing, and keep the site coherent for them.

## What this site is

bostoncyberx (BCX): a Boston consultancy combining AI transformation and
AI-powered cyber defense in one engagement. Platform line: "Transform with
AI. Defend with AI. Achieve with AI." Thesis: "You cannot adopt trustworthy
AI without cybersecurity, and you cannot defend your organization from
disruption without AI." Offerings: bcxCompass (fixed-fee assessment),
Transform retainer (fractional AI office / vCAIO), Defend retainer (vCISO),
bcxBastion (managed detection on Google SecOps + CrowdStrike + Palo Alto
Networks), projects (pen testing, AI security assessment, tabletops, CMMC).

## Brand laws (non-negotiable)

- **Wordmark**: lowercase "bostoncyberx" with the red trailing x, always the
  artwork file (`assets/img/bcx-wordmark-line.svg`), never rebuilt in CSS or
  typed as plain text. Short form: BCX.
- **Type**: Archivo (variable, width 112) for display, Inter for body,
  mono (Geist/IBM Plex) for data labels and numerals. No other typefaces.
- **Colors**: ink #0A0E1A background world, paper #F8FAFC text. Pillar
  accents: Signal Blue #3B82F6 = Transform, Electric Cyan #22D3EE = Defend,
  Guard Green #34D399 = Achieve. Alert Amber #FBBF24 = threats only.
- **Red grammar**: Brand Red #FF3B30 is identity and defense action ONLY —
  the x, bcx prefixes, interactive affordances (buttons use Action Red
  #E02D22), wayfinding punctuation, the signal line, interception beams.
  Red never decorates headings, charts, or section backgrounds. Content
  headings are always paper. One accent per surface; all three pillar
  colors appear together only in the logo X and the tri-verb lockup.
- **Voice**: no em dashes or en dashes anywhere in user-facing copy —
  restructure the sentence instead (commas, colons, periods). Confident,
  measured, no hype, no hoodie/padlock/glowing-brain imagery ever.
- **NAP (identity facts)**: One Marina Park Drive, Boston, MA 02210 ·
  617.241.5445 · info@bostoncyberx.com. Cities line: Boston · New York ·
  Los Angeles · Jacksonville. Home title phrase: "AI and Cybersecurity
  Transformation Services" (must match top and bottom of page). Change
  these only when the owner asking for the edit says so explicitly.

## How the site is built

Plain static HTML/CSS/JS. No framework, no build step: what is in the repo
is what ships. Netlify publishes the repo root. Shared assets live in
`assets/` (css, js, img). Key JS: `field.js` (ambient particle canvas on
every page, hue follows scroll red→blue→cyan→green), `constellation.js`
(hero X particles), `agenda.js` (CEO agenda carousel), `forge.js`,
`motion.js` (scroll reveals), `signal.js`. The intro logo animation lives
inline in `index.html` (`#intro`, SMIL SVG, once per session).

**Generated page sets are regenerable from inside this repo**: the
`industries/` and `use-cases/` pages are written by `tools/
build_industries.py` and `tools/build_use_cases.py` (Python 3, stdlib
only). To change those sections, edit the data or templates in the script,
run it (`python3 tools/build_industries.py`), and commit script + output
together. Verified: running them unchanged reproduces the live pages
byte-identically. Never hand-edit those pages without making the same
change in the script, or the next regeneration will silently undo it.

## Doing structural work solo (the checklist)

Any assistant may add sections, pages, or rework layout on its own.
Sitewide consistency is mechanical; here is how to keep it:

1. **Nav and footer are duplicated in every page's HTML.** When you change
   either, apply it to ALL pages: the hand-authored ones (grep for the nav
   or footer markup across `**/index.html`) AND the generator templates in
   `tools/` (then re-run them). A change applied to some pages only is the
   main way this site rots.
2. **New page**: copy the structure of a similar existing page (head block,
   fonts, `field.js`, header, footer), keep the shared CSS/JS includes, add
   it to `sitemap.xml`, and link it from wherever users should find it.
3. **Keep the title-phrase rule**: the positioning phrase in a page's
   `<title>` and the footer terminology must match.
4. Never remove accessibility attributes, `prefers-reduced-motion`
   handling, or Netlify form markup (`data-netlify` forms on /discovery/
   and /contact/).
5. After editing, check your HTML (balanced tags, working links, no stray
   characters). If you can, preview locally (`python3 -m http.server` from
   the repo root works fine). Commits go straight to production.
6. If a deploy breaks something, Netlify keeps every previous deploy:
   reverting the commit (`git revert`) and pushing restores the site.

## Costs and courtesy

- Each production deploy costs 15 Netlify credits from a shared monthly
  pool of 1,000. Batch related edits into one commit rather than many tiny
  ones. For commits that do not change site output (docs like this file),
  include `[skip netlify]` in the commit message so no deploy runs.
- Big visual overhauls are fair game for either owner; a heads-up to the
  other in the commit message body is good manners, not a permission slip.
- Do not add analytics, scripts, or third-party embeds unless the owner
  requesting it confirms both owners agree.

## Related things this repo does NOT control

- Hosting, domains, and deploy settings live in Faris's Netlify account.
- The v2 "First Light" scroll-film homepage prototype is a separate,
  private project and is not part of this repo.
