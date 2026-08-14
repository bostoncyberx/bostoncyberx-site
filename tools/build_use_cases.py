# bostoncyberx use-cases builder v1.0
# Generates /use-cases/ hub + one page per business domain (Solutions > Use Cases).
# Shares NAV/FOOTER chrome with build_industries.py. Edit data and re-run.
import os, html
import importlib.util

_spec = importlib.util.spec_from_file_location("bi", os.path.join(os.path.dirname(__file__), "build_industries.py"))
# Import only the chrome constants without running the page build:
NAV = None; FOOTER = None
_src = open(os.path.join(os.path.dirname(__file__), "build_industries.py")).read()
NAV = _src.split("NAV = '''")[1].split("'''")[0]
FOOTER = _src.split("FOOTER = '''")[1].split("'''")[0]

SITE = os.path.join(os.path.dirname(__file__), "..")

DOM = [
 {"slug":"finance","name":"Finance","h1":"Where finance teams are betting on AI.",
  "lead":"Six use cases taking the manual grind out of the office of the CFO while tightening control.",
  "hook":"Close the books in half the time and audit 100% of transactions instead of samples.",
  "uses":[
   ("Autonomous close and reconciliation","Agents match transactions across systems, clear routine exceptions, and draft journal entries with full audit trail, so controllers review instead of keying.","30 to 50% faster monthly close"),
   ("AP and AR automation","Invoice capture, three-way match, payment scheduling, and collections outreach run end to end, with only true exceptions reaching staff.","60 to 80% less manual invoice processing"),
   ("Forecasting and scenario planning","Driver-based models produce rolling forecasts and let leadership stress-test scenarios in minutes rather than quarters.","20 to 40% lower forecast error"),
   ("Spend and procurement intelligence","Agents benchmark contracts and prices, flag maverick spend, and surface renegotiation opportunities across the vendor base.","3 to 8% of addressable spend recovered"),
   ("Continuous fraud and expense audit","Anomaly models score every expense, payment, and vendor change, moving audit from quarterly samples to complete coverage.","Audit coverage from samples to 100% of transactions"),
   ("Board and investor reporting","Agents assemble variance narratives, KPI packs, and board pages from the actuals, ready for CFO review.","Days to hours for reporting packages"),
  ]},
 {"slug":"sales","name":"Sales","h1":"Where sales teams are betting on AI.",
  "lead":"Six use cases that put reps in more conversations with better-prepared buyers.",
  "hook":"Answer every lead in under a minute and give reps a day per week back to sell.",
  "uses":[
   ("Account research and targeting","Agents assemble account briefs from filings, news, hiring signals, and tech stacks, so territory planning starts from evidence.","Hours of research per account down to minutes"),
   ("Personalized outbound at scale","Sequences drafted per persona and trigger event, in the rep's voice, under human send control.","2 to 3x reply rates versus static templates"),
   ("Inbound qualification and routing","Instant enrichment, scoring, and meeting booking the moment a lead lands, at any hour.","Speed to lead from hours to under a minute"),
   ("Meeting prep and follow-through","Pre-call briefs, live notes, CRM hygiene, and next-step drafts handled by agents around every meeting.","4 to 6 hours per rep per week returned to selling"),
   ("Proposal and RFP drafting","First drafts built from your win library and product truth, with compliance flags for review.","50 to 70% less proposal effort"),
   ("Pipeline and forecast intelligence","Deal-risk scoring, slippage detection, and coverage math that updates itself before the Monday call.","10 to 20% better forecast accuracy"),
  ]},
 {"slug":"marketing","name":"Marketing","h1":"Where marketing teams are betting on AI.",
  "lead":"Six use cases that multiply output while keeping the brand and the claims under control.",
  "hook":"Ship five to ten times the content and know which half of the budget is working.",
  "uses":[
   ("The content engine","Briefs become drafts across blog, email, social, and sales enablement, in brand voice, under editorial review.","5 to 10x content output"),
   ("Campaign personalization","Segment-of-one messaging and offers across email, web, and ads, tuned continuously by response.","5 to 15% conversion lift"),
   ("Search and AI-answer visibility","Content structured for classic search and for the AI assistants buyers now ask first.","Compounding organic and AI-citation traffic"),
   ("Creative production at scale","Ad variants, imagery, and video cutdowns generated per channel spec under brand review.","50 to 70% faster creative cycles"),
   ("Analytics and attribution","Agents reconcile channel data into one view of what actually pays, with narratives a CMO can forward.","Days to hours for reporting; clearer budget calls"),
   ("Brand and compliance review","Automated checks of claims, tone, disclaimers, and trademark use before anything ships.","Review cycles from days to minutes"),
  ]},
 {"slug":"operations","name":"Operations","h1":"Where operations teams are betting on AI.",
  "lead":"Six use cases that take cycle time and error out of the processes the business runs on.",
  "hook":"Cut core process cycle times by half and push documents to straight-through processing.",
  "uses":[
   ("End-to-end workflow automation","Agents run multi-step back-office processes across systems, escalating only genuine exceptions to people.","30 to 60% cycle-time reduction on core processes"),
   ("Intelligent document processing","Extraction, validation, and filing from any document type, with confidence scoring and full traceability.","80 to 95% straight-through processing"),
   ("Customer operations","Tier-one service resolved by agents across channels, with warm handoff and context when a person takes over.","40 to 60% of contacts deflected"),
   ("Demand and inventory planning","Forecasting and replanning that react to signals in days, not planning cycles.","10 to 20% lower inventory carry"),
   ("Quality and compliance monitoring","Continuous checks of work against SOPs and policy, so findings surface before they become incidents.","Findings caught before they become incidents"),
   ("Workforce scheduling and capacity","Demand-matched schedules and load balancing that respect rules, skills, and preferences.","5 to 15% capacity unlocked"),
  ]},
 {"slug":"product-development","name":"Product Development","h1":"Where product teams are betting on AI.",
  "lead":"Six use cases that shorten the distance from customer signal to shipped product.",
  "hook":"Turn weeks of research into hours and triple experiment velocity.",
  "uses":[
   ("Customer insight synthesis","Agents distill interviews, tickets, reviews, and telemetry into themes that direct the roadmap weekly.","Days to hours for research synthesis"),
   ("Spec and PRD drafting","First-draft specs built from the insight base and strategy, so product managers edit instead of staring at blank pages.","40 to 60% faster from idea to spec"),
   ("Rapid prototyping","AI-assisted builds turn concepts into testable prototypes while the discussion is still warm.","Concept to testable prototype in days"),
   ("Experiment design and analysis","A/B designs with guardrails, plus readouts written for the decision, not the dashboard.","2 to 3x experiment velocity"),
   ("Roadmap and portfolio intelligence","Value and risk scoring, dependency mapping, and sequencing that keeps bets honest.","Clearer sequencing, fewer stalled bets"),
   ("Docs and release communication","Release notes, documentation, and enablement drafted from the actual change set.","Hours per release returned to building"),
  ]},
 {"slug":"engineering","name":"Engineering","h1":"Where engineering teams are betting on AI.",
  "lead":"Six use cases compounding through the software lifecycle, from backlog to production.",
  "hook":"Ship 25 to 40% more and cut incident recovery time in half.",
  "uses":[
   ("Coding agents in the SDLC","Agents scaffold features, implement well-scoped changes, and clear review comments under engineer control.","25 to 40% more features shipped"),
   ("Test generation and maintenance","Coverage lifted and flaky tests triaged automatically, so quality scales without added headcount.","2x coverage without added headcount"),
   ("Legacy modernization","Agents document, test, and refactor the legacy estates that block every other initiative.","30 to 50% faster migrations"),
   ("Incident response copilots","Triage, runbook execution, and postmortem drafts while responders focus on the fix.","30 to 50% lower mean time to recovery"),
   ("Security in the pipeline","AI review for vulnerabilities, secrets, and dependency risk on every merge request.","Vulnerabilities caught pre-merge, not in production"),
   ("Engineering intelligence","Cycle-time and bottleneck visibility that turns delivery debates into decisions.","Cycle time visible, and falling"),
  ]},
]

NOTE = "Figures are directional benchmarks from 2025 to 2026 enterprise AI deployments. We verify against your baseline before they appear in any proposal."

def head(title, desc, path, crumb):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="https://www.bostoncyberx.com{path}">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="https://www.bostoncyberx.com{path}">
<meta property="og:site_name" content="bostoncyberx">
<meta property="og:type" content="website">
<meta property="og:image" content="https://www.bostoncyberx.com/assets/img/og-default.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="/assets/img/bcx-mark.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/bcx.css">
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@graph": [
    {{"@type": "BreadcrumbList", "itemListElement": [
      {{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.bostoncyberx.com/"}},
      {{"@type": "ListItem", "position": 2, "name": "Use Cases", "item": "https://www.bostoncyberx.com/use-cases/"}}{crumb}
    ]}}
  ]
}}
</script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
''' + NAV

def uses_grid(uses):
    cards = []
    for i, (h, b, m) in enumerate(uses):
        cards.append(f'''      <div class="use">
        <span class="n">{i+1:02d}</span>
        <h3>{html.escape(h)}</h3>
        <p>{html.escape(b)}</p>
        <p class="m">{html.escape(m)}</p>
      </div>''')
    return '<div class="uses">\n' + '\n'.join(cards) + '\n    </div>'

def domain_page(d):
    path = f"/use-cases/{d['slug']}/"
    title = f"AI Use Cases for {d['name']} | bostoncyberx"
    desc = (d['hook'] + ' ' + d['lead'])[:158]
    crumb = f''',\n      {{"@type": "ListItem", "position": 3, "name": "{d['name']}", "item": "https://www.bostoncyberx.com{path}"}}'''
    return head(title, desc, path, crumb) + f'''

<main id="main">
  <section class="hero">
    <div class="wrap">
      <span class="kicker">Use cases &middot; {html.escape(d['name'])}</span>
      <h1>{html.escape(d['h1'])}</h1>
      <p class="lead" style="margin-top:1.4rem;max-width:44rem">{html.escape(d['lead'])}</p>
      <div class="hero-ctas">
        <a class="btn btn-primary" href="/discovery/">Schedule a 30-minute discovery call</a>
        <a class="btn btn-ghost" href="/ai-readiness-assessment/">Take the free AI Assessment</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      {uses_grid(d['uses'])}
      <p class="src" style="margin-top:1.6rem;font-size:.8rem;color:var(--slate);opacity:.85">{html.escape(NOTE)}</p>
    </div>
  </section>

  <section class="cta-band">
    <h2>Bring these use cases into your plan.</h2>
    <p>Thirty minutes with a senior practitioner turns this list into your shortlist. Or start with the free AI Assessment and see where you stand.</p>
    <a class="btn btn-primary" href="/discovery/">Schedule a 30-minute discovery call</a>
  </section>
</main>

''' + FOOTER

def hub_page():
    path = "/use-cases/"
    cards = []
    for d in DOM:
        cards.append(f'''      <a class="card ind" href="/use-cases/{d['slug']}/">
        <h3>{html.escape(d['name'])}</h3>
        <p>{html.escape(d['hook'])}</p>
        <span class="go" style="color:var(--red);font-family:var(--font-display);font-weight:600;margin-top:auto">See the use cases &rarr;</span>
      </a>''')
    return head("AI Use Cases by Business Function | bostoncyberx",
        "Where finance, sales, marketing, operations, product, and engineering teams are betting on AI: the top use cases per function with the outcomes they deliver.",
        path, '') + f'''

<main id="main">
  <section class="hero">
    <div class="wrap">
      <span class="kicker">Use cases</span>
      <h1>Every function has an<br><span class="dim">AI frontier.</span></h1>
      <p class="lead" style="margin-top:1.4rem;max-width:44rem">Pick a function to see the six use cases delivering measurable results right now, and what it takes to run them safely.</p>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="ind-grid">
{chr(10).join(cards)}
      </div>
    </div>
  </section>

  <section class="cta-band">
    <h2>Not sure which function to start with?</h2>
    <p>Thirty minutes with a senior practitioner, or fourteen questions on your own. Both end with a clear next move.</p>
    <a class="btn btn-primary" href="/discovery/">Schedule a 30-minute discovery call</a>
  </section>
</main>

''' + FOOTER

def solutions_page():
    path = "/solutions/"
    return head("Solutions | Industries and Use Cases | bostoncyberx",
        "Two ways into the work: AI use cases by industry, or by business function. Both quantified, both run safely.",
        path, '') + '''

<main id="main">
  <section class="hero">
    <div class="wrap">
      <span class="kicker">Solutions</span>
      <h1>Two ways into<br><span class="dim">the work.</span></h1>
      <p class="lead" style="margin-top:1.4rem;max-width:44rem">Start from your industry and see what your peers are deploying, or start from a business function and see where the returns are landing.</p>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="cards" style="grid-template-columns:1fr 1fr">
        <a class="card ind" href="/industries/">
          <h3>Industries</h3>
          <p>Tour operators, banking, healthcare, real estate, property management, biotech, manufacturing, government, retail, startups, and home services. Quantified use cases per sector.</p>
          <span class="go" style="color:var(--red);font-family:var(--font-display);font-weight:600;margin-top:auto">Browse industries &rarr;</span>
        </a>
        <a class="card ind" href="/use-cases/">
          <h3>Use Cases</h3>
          <p>Finance, sales, marketing, operations, product development, and engineering. The top six use cases inside each function, with the outcomes they deliver.</p>
          <span class="go" style="color:var(--red);font-family:var(--font-display);font-weight:600;margin-top:auto">Browse use cases &rarr;</span>
        </a>
      </div>
    </div>
  </section>

  <section class="cta-band">
    <h2>Or just tell us what you are trying to do.</h2>
    <p>Thirty minutes with a senior practitioner. No pitch deck, no obligation.</p>
    <a class="btn btn-primary" href="/discovery/">Schedule a 30-minute discovery call</a>
  </section>
</main>

''' + FOOTER

os.makedirs(os.path.join(SITE, "use-cases"), exist_ok=True)
with open(os.path.join(SITE, "use-cases", "index.html"), "w") as f:
    f.write(hub_page())
for d in DOM:
    os.makedirs(os.path.join(SITE, "use-cases", d["slug"]), exist_ok=True)
    with open(os.path.join(SITE, "use-cases", d["slug"], "index.html"), "w") as f:
        f.write(domain_page(d))
os.makedirs(os.path.join(SITE, "solutions"), exist_ok=True)
with open(os.path.join(SITE, "solutions", "index.html"), "w") as f:
    f.write(solutions_page())
print(f"built /solutions/ + /use-cases/ hub + {len(DOM)} domain pages")
