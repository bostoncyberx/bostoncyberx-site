# BCX Concept Sites — shared build brief

Five design-exploration homepages for bostoncyberx (BCX). Each lives at
`/Users/home/Claude/bostoncyberx/site/concepts/<name>/index.html` and is served by the
dev server at `http://localhost:4173/concepts/<name>/`.

## Hard rules (every concept)

- ONE self-contained file: all CSS and JS inline in index.html. No build step, no external JS libraries.
- Typeface: Archivo (Google Fonts, `wght@100..900` variable axis allowed via
  `https://fonts.googleapis.com/css2?family=Archivo:wght@200;300;400;500;600;700;800;900&display=swap`).
  Concept may exploit extreme weights (200 vs 900) and scale, but it is Archivo only —
  EXCEPT concept "dawn" which is explicitly authorized to add `Instrument Serif` italic as a provocation.
- Wordmark: use the artwork files, never rebuild the lockup in CSS text.
  - On dark backgrounds: `/assets/img/bcx-wordmark-line.svg` (paper text + red line)
  - On light backgrounds: `/assets/img/bcx-wordmark-line-ink.svg` (ink text + red line)
  - Standalone red X mark: `/assets/img/bcx-x-red.svg`
- The X is red. Red (#FF3B30 bright / #E02D22 action) is identity + interaction. Buttons that
  are primary CTAs are red with white text unless the concept's art direction says otherwise below.
- Copy rule: NO em dashes or en dashes anywhere in user-facing copy. Restructure sentences instead.
- Responsive: flawless at 390px, 768px, 1280px, 1600px. No horizontal scroll ever.
- `prefers-reduced-motion: reduce` must disable ambient/scroll animation (render final states).
- Accessibility: one h1, semantic landmarks, skip link, visible focus states, AA contrast for body text.
- Head: `<title>bostoncyberx | <Concept Name> concept</title>`, viewport meta, favicon
  `<link rel="icon" type="image/svg+xml" href="/assets/img/bcx-mark.svg">`.
- Footer of each concept includes a small quiet link back to `/concepts/` labeled "All concepts".
- Nav links may point to the real pages (/services/, /platform/, /industries/, /resources/, /insights/, /about/, /discovery/, /ai-readiness-assessment/).

## Shared photography (already on the server, all dark ink cinematic with red accents)

- /assets/img/bg-skyline.jpg   Boston skyline at dusk
- /assets/img/bg-harbor.jpg    Boston harbor
- /assets/img/bg-transform.jpg /assets/img/bg-defend.jpg /assets/img/bg-achieve.jpg  pillar scenes
- /assets/img/bg-horizon.jpg   closing horizon scene
- /assets/img/agenda-grow.jpg agenda-risk.jpg agenda-productivity.jpg agenda-transform.jpg agenda-next.jpg
  (five cinematic scenes: rising city light trails / lighthouse red dome over ships / atrium light
  streams / stone-to-steel bridge / pre-dawn observatory)

Note: photography is dark. Light-theme concepts should use it sparingly (inside framed media
blocks) or not at all, unless the direction below says otherwise.

## Content (use this copy verbatim where a section exists; you may trim, never invent facts)

KICKER: The AI-native transformation partner
H1 (tri-verb): Transform with AI. Defend with AI. Achieve with AI.
LEAD: We are an AI-native firm. We run our own company on the technology we recommend, and we
help businesses achieve meaningful outcomes through AI transformation, secured by proactive
defense and fortified by enterprise resilience.
PRIMARY CTA: Schedule a 30-minute discovery call → /discovery/
SECONDARY CTA: Take the free AI Assessment → /ai-readiness-assessment/

CEO AGENDA (five needs, each with question + link):
01 I need to grow. / How do I grow revenue, improve profitability, and create new business opportunities? / See the AI use cases in your industry → /industries/
02 I need to reduce risk. / How do I protect my business, customers, reputation, and operations while enabling growth? / See how bcxBastion holds the line → /platform/
03 I need to become more productive. / How do I help my people accomplish more while improving quality and reducing costs? / See the working playbook → /services/
04 I need to transform my business. / How do I modernize my business, operating model, and technology without disrupting what already works? / See how FORGE stages the change → /services/
05 I need to prepare for what's next. / How do I harness AI and emerging technologies responsibly while positioning my organization for the future? / Take the free AI Assessment → /ai-readiness-assessment/

PILLAR 1 Transform / "Put AI to work." / Strategy, governance, and deployment from a fractional
AI office. The use cases that pay, the policies that protect, the rollout your people actually adopt.
Bullets: An AI roadmap your board can read (Use cases ranked by return, owners and dates attached) ·
Governance that speeds you up (Clear rules end the quiet chaos of unapproved tools) ·
Adoption, not shelfware (Training and guardrails so the rollout sticks)
Link: Explore AI consulting → /services/ai-consulting-boston/

PILLAR 2 Defend / "Hold the line." / Security leadership on retainer and AI-powered operations
that never clock out. The same intelligence attackers use, working for you.
Bullets: A CISO in the seat (Fractional leadership without the $250K hire) ·
Insurance renewals without drama (Evidence ready before the underwriter asks) ·
Watched around the clock (bcxBastion detection and response, 24/7)
Link: Explore security leadership → /services/vciso-boston/

PILLAR 3 Achieve / "Show the board." / Outcomes in writing, every month. Measured productivity
from AI, measured risk reduction, deadlines met with room to spare.
Bullets: Fixed scopes, published ranges (You know the price before you commit) ·
Deliverables in writing (What you get each month, named in advance) ·
Board-ready reporting (One page that answers the questions directors ask)
Link: How we stay accountable → /about/

FORGE: One framework runs through everything. FORGE.
Thesis: You cannot adopt trustworthy AI without cybersecurity, and you cannot defend your
organization from disruption without AI. FORGE is the one framework we run across both, from
first readiness check to enterprise-grade scale.
Stages: F Foundations (Are we ready?) · O Objectives (What are we solving for?) · R Rapid Pilots
(Can we prove it fast?) · G Growth (How do we scale it?) · E Enterprise-Grade (Is it safe long-term?)
Footnote: Raw material gets shaped, tempered, and hardened. Each stage adds strength, and a
typical mid-sized company runs the full journey in nine to twelve months.

BASTION: bcxBastion never closes. / Everything watched in one place, AI-assisted triage, and a
24/7 response path. Senior analysts, not a ticket queue.
Rows: Monitoring 24/7/365 · Telemetry One console · Triage AI-assisted, human-decided ·
Reporting Monthly, board-ready. Link: Explore the platform → /platform/

CLOSING: Your next move is a conversation. / Thirty minutes with a senior practitioner, no pitch
deck, no obligation. Or start on your own: fourteen questions, ten minutes, and the free AI
Assessment shows where you stand across seven pillars.

FOOTER: wordmark artwork, tri-verb line, One Marina Park Drive, Boston, MA 02210 ·
617.241.5445 · info@bostoncyberx.com · © 2026 bostoncyberx. All rights reserved. ·
Boston · New York · Los Angeles · Jacksonville

Optional extra facts you may surface as data: 25 to 1,000 employees · three-week bcxCompass
assessment · 90-day roadmap · seven pillars · nine to twelve months FORGE journey ·
partner bench: Google SecOps, CrowdStrike, Palo Alto Networks.
