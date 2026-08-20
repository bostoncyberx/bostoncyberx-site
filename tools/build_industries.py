# bostoncyberx industries builder v1.0
# Generates /industries/ hub + one page per industry from the founder's
# "Industry AI Use Cases" deck (docs/industry-ai-use-cases.pptx).
# Edit data below and re-run; writes site/industries/**/index.html
import os, html

SITE = os.path.join(os.path.dirname(__file__), "..")

IND = [
 {"slug":"tour-operators","name":"Tour Operators","h1":"Where tour operators are betting on AI.",
  "lead":"Six use cases driving measurable productivity and growth across the tour operator value chain.",
  "hook":"Deflect half of tier-one contacts and defend share as one in three travelers now plans with AI.",
  "note":"Figures are directional industry benchmarks from 2025 to 2026 travel and hospitality AI deployments. We verify against your baseline before they appear in any proposal.",
  "uses":[
   ("Agentic customer service","Always-on agents resolve booking changes, pre-departure questions and post-trip follow-up across languages, escalating only exceptions to human consultants.","45 to 58% of tier-1 contacts deflected; about 90% lower cost per resolution"),
   ("AI itinerary design and dynamic packaging","Generative models assemble personalized itineraries and bundle lodging, transfers and activities from traveler intent and live inventory.","Quote turnaround from days to minutes; higher attach rate per booking"),
   ("Dynamic pricing and yield optimization","Models price departures against demand signals, pacing, events and weather, replacing static seasonal rate cards with continuous optimization.","8 to 15% yield and RevPAR lift within the first 12 months"),
   ("Disruption and supplier orchestration","Agents monitor bookings, detect supplier failures and cancellations, then re-accommodate travelers and reconcile supplier records automatically.","Up to 30% less revenue leakage from cancellations and rebookings"),
   ("AI marketing content engine","Localized campaign copy, destination content and personalized offers produced at channel scale and tuned to segment, season and source market.","Lower content production cost; conversion lift from 1:1 personalization"),
   ("Agentic distribution readiness","Structuring inventory, pricing and policy data so consumer AI assistants can discover, compare and book product directly from the operator.","Defends share as about 1 in 3 travelers now plan trips with generative AI"),
  ]},
 {"slug":"banking","name":"Banking","h1":"Where banks are betting on AI.",
  "lead":"Six use cases driving measurable productivity and growth across the banking value chain.",
  "hook":"Cut process cycle times by half and false positives by 60% while expanding lending capacity.",
  "note":"Figures are directional industry benchmarks from 2025 to 2026 banking AI deployments. We verify against your baseline before they appear in any proposal.",
  "uses":[
   ("Agentic customer servicing","Agents resolve disputes, payment issues and multi-step account changes end to end across channels, routing only exceptions and regulated decisions to staff.","40 to 60% shorter process cycle times; sharply lower cost to serve"),
   ("Fraud and AML transaction monitoring","Models replace brittle rules engines, scoring behavior in context and letting agents assemble and triage investigation packages for analysts.","About 60% fewer false positives; 2 to 4x more true positives detected"),
   ("KYC and client onboarding","Extraction, validation and risk classification of identity documents, proof of address and beneficial ownership records, with full audit trail.","40 to 60% faster onboarding; material reduction in compliance staff cost"),
   ("Credit underwriting and loan origination","Models read financial statements, tax filings and legal documents, flag inconsistencies and draft structured underwriting recommendations for credit officers.","Faster time to decision and expanded thin-file lending capacity"),
   ("Relationship manager and advisor copilots","Meeting prep, portfolio and pricing analysis, next-best-action prompts and compliant client communications drafted from the bank's own data.","27 to 35% front-office productivity gain in targeted applications"),
   ("Engineering agents and core modernization","Coding agents document, test and refactor legacy core and mainframe estates, the constraint holding back most other digital initiatives.","Cited as the highest-ROI AI deployment in financial services today"),
  ]},
 {"slug":"healthcare","name":"Healthcare","h1":"Where healthcare organizations are betting on AI.",
  "lead":"Twelve use cases across care delivery, payer operations and the back office, where agentic systems compound the productivity gain.",
  "hook":"Return two hours a day to clinicians and cut the cost to collect by up to half.",
  "note":"Figures are directional industry benchmarks from 2025 to 2026 healthcare and life sciences AI deployments. We verify against your baseline before they appear in any proposal.",
  "uses":[
   ("Ambient clinical documentation","AI scribes listen to the encounter and draft the note, orders and coding directly into the EHR, returning clinician time to patient care.","2+ hours per day of charting time saved"),
   ("Agentic revenue cycle","Agents handle coding, claim scrubbing, prior authorization and denial appeals end to end, escalating only exceptions to billing staff.","30 to 50% lower cost to collect"),
   ("Patient access and scheduling","Voice and chat agents run 24/7 intake, triage, referral routing, reminders and rescheduling across languages.","40 to 60% call deflection; 15 to 25% fewer no-shows"),
   ("Diagnostic and imaging AI","Models pre-read imaging, pathology and ECGs, triaging urgent findings and auto-drafting structured reports for radiologist sign-off.","20 to 40% faster read turnaround"),
   ("Population health and care management","Predictive risk stratification plus outreach agents target rising-risk patients, close care gaps and manage post-discharge follow-up.","10 to 20% fewer readmissions"),
   ("R&D and trial acceleration","AI screens candidate molecules, drafts protocols and matches patients to trials from unstructured records.","30 to 50% faster trial enrollment"),
  ],
  "uses2_title":"The next six value pools",
  "uses2_lead":"Beyond the clinical front line: operational, payer and back-office use cases where the gains compound.",
  "uses2":[
   ("Nurse workforce and staffing","Agents forecast census, build shift schedules, fill open slots and automate handoff summaries, easing nurse administrative load and agency spend.","15 to 25% lower agency labor spend"),
   ("Payer operations","Agentic workflows handle utilization review, claims adjudication, appeals and member service across payer back-office queues.","35 to 50% faster claim cycle time"),
   ("Supply chain and procurement","Demand forecasting and sourcing agents manage PAR levels, substitutions and contract compliance for high-value clinical supplies.","5 to 12% supply cost reduction"),
   ("Virtual care and remote monitoring","AI triages remote monitoring signals, drafts escalation summaries and runs asynchronous virtual visits between clinician touchpoints.","20 to 35% more panel capacity"),
   ("Pharmacy and medication management","Agents automate refill authorization, adherence outreach, formulary checks and interaction screening across the medication lifecycle.","10 to 18% better adherence rates"),
   ("Compliance, privacy and audit","Continuous AI monitoring of PHI access, coding integrity and regulatory reporting flags anomalies before they become findings.","50%+ faster audit preparation"),
  ]},
 {"slug":"real-estate","name":"Real Estate","h1":"Where real estate firms are betting on AI.",
  "lead":"Six use cases driving measurable productivity and growth across the real estate investment and operating value chain.",
  "hook":"Screen five times more deals per analyst and cut lease abstraction effort by 85%.",
  "note":"Figures are directional industry benchmarks from 2025 to 2026 real estate and property technology AI deployments. We verify against your baseline before they appear in any proposal.",
  "uses":[
   ("Deal sourcing and underwriting","Agents screen listings, rent rolls and market data, auto-populate underwriting models and surface off-market opportunities that fit the mandate.","3 to 5x more deals screened per analyst"),
   ("Lease abstraction and admin","AI extracts clauses, options, escalations and critical dates from lease PDFs into a structured, auditable portfolio record.","70 to 85% less abstraction effort"),
   ("Leasing and tenant experience agents","Always-on agents answer prospect enquiries, qualify leads, schedule tours and handle tenant service requests across channels.","2x lead-to-tour conversion"),
   ("Property operations and maintenance","Predictive models flag equipment failures and agents triage work orders, dispatch vendors and verify completion automatically.","10 to 20% lower operating expense"),
   ("Energy and ESG optimization","AI tunes HVAC and lighting to occupancy signals and auto-compiles emissions and ESG disclosure reporting across the portfolio.","8 to 15% energy cost reduction"),
   ("Portfolio analytics and valuation","Continuous AVM refresh, scenario modeling and covenant monitoring give investment committees a live view of asset performance.","Days to hours for portfolio reporting"),
  ]},
 {"slug":"property-management","name":"Property Management","h1":"Where property managers are betting on AI.",
  "lead":"Six use cases driving measurable productivity and growth across leasing, operations and back-office functions.",
  "hook":"Lease up in half the time and keep renewals five to ten points higher.",
  "note":"Figures are directional industry benchmarks from 2025 to 2026 property management and proptech AI deployments. We verify against your baseline before they appear in any proposal.",
  "uses":[
   ("Leasing and tenant intake","Agents answer inbound enquiries around the clock, qualify prospects, book tours and chase applications through to signature.","30 to 50% faster lease-up"),
   ("Maintenance and work orders","Agents triage resident requests, diagnose common faults, dispatch the right vendor and track jobs to completion.","20 to 35% lower work order cost"),
   ("Rent collection and arrears","Models score delinquency risk early and agents run personalized reminders, payment plans and escalation workflows.","10 to 20% fewer late payments"),
   ("Resident retention","Always-on assistants resolve resident questions, detect dissatisfaction signals and trigger targeted renewal outreach.","5 to 10 points higher renewals"),
   ("Building and energy ops","Models tune HVAC and lighting to occupancy and tariffs, and flag equipment faults before they become emergency call-outs.","10 to 20% lower energy spend"),
   ("Owner reporting","Agents reconcile invoices, code expenses and draft owner statements with variance commentary for accountant review.","40 to 60% less reporting effort"),
  ]},
 {"slug":"biotech","name":"Biotech","h1":"Where biotech companies are betting on AI.",
  "lead":"Six use cases driving measurable productivity and growth across the biotech R&D, clinical and commercial value chain.",
  "hook":"Compress hit-to-lead by half and run two to three times more experiments per scientist.",
  "note":"Figures are directional industry benchmarks from 2025 to 2026 biopharma and life sciences AI deployments. We verify against your baseline before they appear in any proposal.",
  "uses":[
   ("Target discovery","Agents mine omics, literature and assay data to nominate targets and design candidate molecules, compressing hit-to-lead cycles.","30 to 50% faster hit-to-lead"),
   ("Trial design and recruitment","Agents match patients to protocols from EHR and registry data, model site feasibility and stress-test inclusion criteria.","25 to 40% faster enrollment"),
   ("Regulatory and medical writing","Agents draft INDs, CSRs and safety narratives from source data with traceable citations, so authors review rather than write.","40 to 60% less drafting time"),
   ("Lab automation","Self-driving lab agents plan assays, orchestrate instruments and triage results, closing the design-make-test-analyze loop.","2 to 3x experiments per scientist"),
   ("Manufacturing and quality","Models predict batch deviations, tune bioprocess parameters live and auto-draft deviation and CAPA documentation for QA review.","15 to 25% lower batch failure"),
   ("Commercial and medical affairs","Agents personalize HCP engagement, synthesize field insights and answer medical information queries at scale with audit trails.","20 to 35% more field capacity"),
  ]},
 {"slug":"manufacturing","name":"Manufacturing","h1":"Where manufacturers are betting on AI.",
  "lead":"Six use cases driving measurable productivity and growth across the plant floor, supply chain and engineering functions.",
  "hook":"Cut unplanned downtime by 40% and catch defects before they escape the line.",
  "note":"Figures are directional industry benchmarks from 2025 to 2026 industrial and discrete manufacturing AI deployments. We verify against your baseline before they appear in any proposal.",
  "uses":[
   ("Predictive maintenance","Models read sensor and vibration data to forecast asset failure, and agents raise work orders and stage spares in advance.","20 to 40% less unplanned downtime"),
   ("Quality and visual inspection","Vision models catch defects in-line at full speed and trace root causes back to machine, batch and shift conditions.","30 to 50% fewer escaped defects"),
   ("Supply chain planning","Agents rebalance demand forecasts, supplier lead times and inventory targets, and flag disruption exposure early.","10 to 20% lower inventory carry"),
   ("Production scheduling","Optimization agents resequence orders against changeovers, labor and materials, and replan live when the line slips.","5 to 15% higher throughput"),
   ("Engineering and design","Generative design and simulation agents explore part variants, cut prototype cycles and auto-draft engineering change records.","25 to 40% faster design cycles"),
   ("Frontline knowledge","Copilots surface SOPs, machine manuals and past fixes at the line, cutting time to competence for new operators.","30 to 50% faster issue resolution"),
  ]},
 {"slug":"government","name":"Government","h1":"Where towns and cities are betting on AI.",
  "lead":"Six use cases improving staff productivity and constituent experience across municipal service delivery.",
  "hook":"Self-serve half of constituent contacts and answer records requests 70% faster.",
  "note":"Figures are directional benchmarks from 2025 to 2026 state and local government AI deployments. We verify against your baseline, and against applicable public records, privacy and procurement rules, before they appear in any proposal.",
  "uses":[
   ("311 and constituent service","Agents answer resident questions in plain language across phone, web and text, and open service requests without a queue.","40 to 60% of contacts self-served"),
   ("Permits and licensing","Agents pre-check applications for completeness, route reviews across departments and keep applicants updated on status.","30 to 50% faster permit turnaround"),
   ("Public works and assets","Models prioritize road, water and fleet repairs from work history and sensor data, and schedule crews against risk.","15 to 25% lower maintenance cost"),
   ("Public safety support","Agents draft incident reports, triage non-emergency calls and surface patterns for staffing and prevention planning.","5 to 8 hours saved per officer per week"),
   ("Finance and procurement","Agents reconcile invoices, draft budget variance narratives and screen bids against solicitation requirements.","30 to 45% less manual processing"),
   ("Records and transparency","Agents search archives, draft public records responses with redaction flags and summarize meeting minutes for residents.","50 to 70% faster records response"),
  ]},
 {"slug":"retail","name":"Retailers","h1":"Where retailers are betting on AI.",
  "lead":"Six use cases driving measurable productivity and growth across merchandising, supply chain, store and customer operations.",
  "hook":"Cut stockouts by a third and produce catalogue content 70% faster.",
  "note":"Figures are directional industry benchmarks from 2025 to 2026 retail and consumer AI deployments. We verify against your baseline before they appear in any proposal.",
  "uses":[
   ("Demand and inventory","Models forecast demand by store and SKU, and agents rebalance allocation, replenishment and markdowns as signals shift.","20 to 30% fewer stockouts"),
   ("Personalization and search","Agents tailor product discovery, recommendations and offers to each shopper in session across web, app and email.","5 to 15% higher conversion"),
   ("Customer service","Agents resolve order, return and delivery queries end to end, escalating only the exceptions to human staff.","40 to 60% of contacts deflected"),
   ("Store operations","Copilots build labor schedules, guide task execution and use shelf vision to flag out-of-stocks and planogram gaps.","10 to 20% more selling hours"),
   ("Pricing and promotion","Models set price and promo depth by elasticity, competitor moves and inventory cover, with margin guardrails enforced.","2 to 5% margin improvement"),
   ("Content and marketing","Agents generate product copy, imagery variants and campaign assets at catalogue scale under brand and legal review.","50 to 70% faster content cycles"),
  ]},
 {"slug":"startups","name":"Startups","h1":"Where startups are betting on AI.",
  "lead":"Six use cases that let small teams ship faster, sell wider and stay lean as they scale.",
  "hook":"Ship at larger-team pace and build three to five times more pipeline per rep.",
  "note":"Figures are directional benchmarks from 2025 to 2026 venture-backed and early-stage company AI adoption. We verify against your baseline before they appear in any proposal.",
  "uses":[
   ("Engineering velocity","Coding agents scaffold features, write tests and clear review comments, letting small teams ship at larger-team pace.","25 to 40% more features shipped"),
   ("Go-to-market motion","Agents research accounts, personalize outbound sequences and qualify inbound leads before a rep ever picks up.","3 to 5x pipeline per rep"),
   ("Customer support","Agents resolve tier-one tickets from docs and past threads, so founders and engineers stay out of the inbox.","50 to 70% of tickets auto-resolved"),
   ("Product and user insight","Agents synthesize interviews, tickets and usage telemetry into themes that direct the roadmap week by week.","Days to hours for research"),
   ("Content and demand gen","Agents draft launch content, SEO pages and lifecycle campaigns at a cadence a two-person marketing team cannot match.","5 to 10x content output"),
   ("Back office and finance","Agents handle bookkeeping, invoicing, board reporting and investor updates without adding headcount.","1 to 2 FTE of work absorbed"),
  ]},
 {"slug":"home-services","name":"Home Services","h1":"Where home services firms are betting on AI.",
  "lead":"Six use cases driving measurable productivity and growth for landscaping, painting, plumbing and electrical contractors.",
  "hook":"Answer every call, quote the same day, and fit one or two more jobs per truck.",
  "note":"Figures are directional benchmarks from 2025 to 2026 field service and home services AI deployments. We verify against your baseline before they appear in any proposal.",
  "uses":[
   ("Call answering and booking","Voice agents answer every call day or night, qualify the job, quote a window and book it straight onto the schedule.","20 to 40% fewer missed jobs"),
   ("Estimating and quoting","Agents turn photos, measurements and job notes into itemized estimates and send them before the crew leaves the driveway.","Same-day quotes instead of 2 to 3 days"),
   ("Dispatch and routing","Agents match jobs to the nearest qualified tech, resequence routes around cancellations and cut windshield time.","1 to 2 extra jobs per truck per day"),
   ("Technician copilot","Field techs query manuals, parts and past service history by voice, and get diagnostic prompts on unfamiliar equipment.","15 to 25% higher first-time fix"),
   ("Reviews and repeat work","Agents run follow-up, review requests and seasonal maintenance reminders so past customers keep coming back.","10 to 20% more repeat revenue"),
   ("Office and collections","Agents handle invoicing, payment chasing, payroll prep and supplier bills without an added admin hire.","5 to 10 admin hours saved weekly"),
  ]},
]

NAV = '''<header class="site-header">
  <div class="wrap">
    <a class="logo" href="/"><img class="logo-img" src="/assets/img/bcx-wordmark-line.svg" alt="bostoncyberx"></a>
    <button class="menu-btn" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav class="nav" id="site-nav" aria-label="Main">
      <div class="nav-drop">
      <a href="/services/">Solutions</a>
      <div class="drop"><div class="drop-panel drop-mega drop-solutions">
        <div class="dgroup">
          <a class="dhead" href="/services/#offerings">Transform &rarr;</a>
          <a href="/services/ai-value-accelerator/">AI Value Accelerator</a>
          <a href="/services/ai-at-scale/">AI at Scale</a>
        </div>
        <div class="dgroup">
          <a class="dhead" href="/services/#offerings">Defend &rarr;</a>
          <a href="/services/intelligent-cyber-defense/">Intelligent Cyber Defense</a>
          <a href="/services/ai-trust/">AI Trust</a>
        </div>
        <div class="dgroup">
          <a class="dhead" href="/services/#offerings">Achieve &rarr;</a>
          <a href="/services/intelligent-operations-accelerator/">Intelligent Operations Accelerator</a>
          <a href="/services/business-resilience-assurance/">Business Resilience Assurance</a>
        </div>
        <div class="dgroup dgroup-also">
          <a class="dhead" href="/services/">More &rarr;</a>
          <a href="/services/ai-consulting-boston/">AI Consulting</a>
          <a href="/services/ai-security-assessment/">AI Security Assessment</a>
          <a href="/services/vciso-boston/">vCISO</a>
          <a href="/services/cybersecurity-consulting-boston/">Cybersecurity Consulting</a>
        </div>
      </div></div>
      </div>
      <div class="nav-drop">
      <a href="/use-cases/">Use Cases</a>
      <div class="drop"><div class="drop-panel drop-mega">
        <div class="dgroup">
          <a class="dhead" href="/use-cases/">Use Cases &rarr;</a>
          <a href="/use-cases/finance/">Finance</a>
          <a href="/use-cases/sales/">Sales</a>
          <a href="/use-cases/marketing/">Marketing</a>
          <a href="/use-cases/operations/">Operations</a>
          <a href="/use-cases/product-development/">Product Development</a>
          <a href="/use-cases/engineering/">Engineering</a>
        </div>
        <div class="dgroup">
          <a class="dhead" href="/industries/">Industries &rarr;</a>
          <a href="/industries/tour-operators/">Tour Operators</a>
          <a href="/industries/banking/">Banking</a>
          <a href="/industries/healthcare/">Healthcare</a>
          <a href="/industries/real-estate/">Real Estate</a>
          <a href="/industries/property-management/">Property Management</a>
          <a href="/industries/biotech/">Biotech</a>
          <a href="/industries/manufacturing/">Manufacturing</a>
          <a href="/industries/government/">Government</a>
          <a href="/industries/retail/">Retailers</a>
          <a href="/industries/startups/">Startups</a>
          <a href="/industries/home-services/">Home Services</a>
        </div>
      </div></div>
      </div>
      <a href="/platform/">Platform</a>
      <a href="/forge/">FORGE</a>
      <a href="/insights/">Insights</a>
      <a href="/about/">About bcx</a>
      <a href="/careers/">Careers</a>
      <a class="btn btn-primary cta" href="/discovery/">Book a Discovery Call</a>
    </nav>
  </div>
  <div class="scan-accent" aria-hidden="true"></div>
</header>'''

FOOTER = '''<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="logo" href="/"><img class="logo-img" src="/assets/img/bcx-wordmark-line.svg" alt="bostoncyberx"></a>
        <p style="margin-top:1rem"><span class="fv-t">Transform</span> with AI. <span class="fv-d">Defend</span> with AI. <span class="fv-a">Achieve</span> with AI.</p>
        <p style="margin-top:.45rem;font-size:.85rem">AI and cybersecurity transformation services.</p>
        <p class="mono" style="margin-top:.8rem">One Marina Park Drive, Boston, MA 02210<br><a href="tel:+16172415445">617.241.5445</a> &middot; <a href="mailto:info@bostoncyberx.com">info@bostoncyberx.com</a></p>
      </div>
      <div>
        <h4>Solutions</h4>
        <ul>
          <li><a href="/services/ai-value-accelerator/">AI Value Accelerator</a></li>
          <li><a href="/services/ai-at-scale/">AI at Scale</a></li>
          <li><a href="/services/intelligent-cyber-defense/">Intelligent Cyber Defense</a></li>
          <li><a href="/services/ai-trust/">AI Trust</a></li>
          <li><a href="/services/intelligent-operations-accelerator/">Intelligent Operations Accelerator</a></li>
          <li><a href="/services/business-resilience-assurance/">Business Resilience Assurance</a></li>
          <li><a href="/services/ai-consulting-boston/">AI Consulting</a></li>
          <li><a href="/services/ai-security-assessment/">AI Security Assessment</a></li>
          <li><a href="/services/vciso-boston/">vCISO</a></li>
          <li><a href="/services/cybersecurity-consulting-boston/">Cybersecurity Consulting</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="/about/">About bcx</a></li>
          <li><a href="/partners/">Partners</a></li>
          <li><a href="/platform/">bcxBastion</a></li>
          <li><a href="/forge/">FORGE</a></li>
          <li><a href="/contact/">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4>Insights</h4>
        <ul>
          <li><a href="/insights/">Blog</a></li>
          <li><a href="/resources/">Whitepapers</a></li>
          <li><a href="/ai-readiness-assessment/">AI Readiness Assessment</a></li>
          <li><a href="/privacy/">Privacy Policy</a></li>
          <li><a href="/accessibility/">Accessibility</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-legal">
      <span>&copy; 2026 bostoncyberx. All rights reserved.</span>
      <span class="mono">Boston &middot; New York &middot; Los Angeles &middot; Jacksonville</span>
    </div>
  </div>
</footer>
<script src="/assets/js/field.js" defer></script>
<script src="/assets/js/main.js" defer></script>
<script src="/assets/js/motion.js" defer></script>
</body>
</html>'''

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
      {{"@type": "ListItem", "position": 2, "name": "Industries", "item": "https://www.bostoncyberx.com/industries/"}}{crumb}
    ]}}
  ]
}}
</script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
''' + NAV

def uses_grid(uses, start=1):
    cards = []
    for i, (h, b, m) in enumerate(uses):
        cards.append(f'''      <div class="use">
        <span class="n">{start+i:02d}</span>
        <h3>{html.escape(h)}</h3>
        <p>{html.escape(b)}</p>
        <p class="m">{html.escape(m)}</p>
      </div>''')
    return '<div class="uses">\n' + '\n'.join(cards) + '\n    </div>'

def industry_page(d):
    path = f"/industries/{d['slug']}/"
    title = f"AI for {d['name']} | Use Cases | bostoncyberx"
    desc = (d['hook'] + ' ' + d['lead'])[:158]
    crumb = f''',\n      {{"@type": "ListItem", "position": 3, "name": "{d['name']}", "item": "https://www.bostoncyberx.com{path}"}}'''
    second = ''
    if d.get('uses2'):
        second = f'''
  <section class="section">
    <div class="wrap">
      <div class="section-head"><h2>{html.escape(d['uses2_title'])}.</h2><p class="lead">{html.escape(d['uses2_lead'])}</p></div>
      {uses_grid(d['uses2'], start=7)}
    </div>
  </section>'''
    return head(title, desc, path, crumb) + f'''

<main id="main">
  <section class="hero">
    <div class="wrap">
      <span class="kicker">Industries &middot; {html.escape(d['name'])}</span>
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
      <p class="src" style="margin-top:1.6rem;font-size:.8rem;color:var(--slate);opacity:.85">{html.escape(d['note'])}</p>
    </div>
  </section>{second}

  <section class="cta-band">
    <h2>Bring these use cases into your plan.</h2>
    <p>Thirty minutes with a senior practitioner turns this list into your shortlist. Or start with the free AI Assessment and see where you stand.</p>
    <a class="btn btn-primary" href="/discovery/">Schedule a 30-minute discovery call</a>
  </section>
</main>

''' + FOOTER

def hub_page():
    path = "/industries/"
    cards = []
    for d in IND:
        cards.append(f'''      <a class="card ind" href="/industries/{d['slug']}/">
        <h3>{html.escape(d['name'])}</h3>
        <p>{html.escape(d['hook'])}</p>
        <span class="go" style="color:var(--red);font-family:var(--font-display);font-weight:600;margin-top:auto">See the use cases &rarr;</span>
      </a>''')
    return head("Industries We Serve | AI Use Cases by Sector | bostoncyberx",
        "Where your industry is betting on AI: quantified use cases for tour operators, banking, healthcare, real estate, biotech, manufacturing, government, retail, startups and more.",
        path, '') + f'''

<main id="main">
  <section class="hero">
    <div class="wrap">
      <span class="kicker">Industries</span>
      <h1>Your industry is already<br><span class="dim">betting on AI.</span></h1>
      <p class="lead" style="margin-top:1.4rem;max-width:44rem">Pick your sector to see the use cases your peers are deploying now, with the outcomes they are seeing, and what it takes to run them safely.</p>
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
    <h2>Not sure where your sector stands?</h2>
    <p>Thirty minutes with a senior practitioner, or fourteen questions on your own. Both end with a clear next move.</p>
    <a class="btn btn-primary" href="/discovery/">Schedule a 30-minute discovery call</a>
  </section>
</main>

''' + FOOTER

os.makedirs(os.path.join(SITE, "industries"), exist_ok=True)
with open(os.path.join(SITE, "industries", "index.html"), "w") as f:
    f.write(hub_page())
for d in IND:
    os.makedirs(os.path.join(SITE, "industries", d["slug"]), exist_ok=True)
    with open(os.path.join(SITE, "industries", d["slug"], "index.html"), "w") as f:
        f.write(industry_page(d))
print(f"built hub + {len(IND)} industry pages")
