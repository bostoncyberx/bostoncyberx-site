#!/usr/bin/env python3
"""Generate leftover-repo Insights pages from published Wix Blog posts.

This repo is leftover static HTML. Live www.bostoncyberx.com is Wix-managed
Astro. This script is the fallback when a dynamic /insights/<slug> route is
not yet released on that Astro project.

Usage:
  python3 tools/build_insights_from_blog.py

Writes:
  insights/index.html          (Latest articles cards + JSON-LD)
  insights/<slug>/index.html   (published Blog posts that are not reserved)
"""
from __future__ import annotations

import html
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from insights_blog import (
    RESERVED_SLUGS,
    get_post_by_slug,
    hub_cards,
    list_published_posts,
    post_body_html,
    public_insights_url,
    format_long_date,
    format_month,
)

ROOT = os.path.join(os.path.dirname(__file__), "..")
HUB = os.path.join(ROOT, "insights", "index.html")
SITEMAP = os.path.join(ROOT, "sitemap.xml")

CARDS_START = "<!-- INSIGHTS_BLOG_CARDS_START -->"
CARDS_END = "<!-- INSIGHTS_BLOG_CARDS_END -->"

NAV = """<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap">
    <a class="logo" href="/"><img class="logo-img" src="/assets/img/bcx-wordmark-line.svg" alt="bostoncyberx"></a>
    <button class="menu-btn" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav class="nav" id="site-nav" aria-label="Main">
      <a href="/services/">Solutions</a>
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
      <a class="btn btn-primary cta" href="https://www.bostoncyberx.com/discovery">Book a Discovery Call</a>
    </nav>
  </div>
  <div class="scan-accent" aria-hidden="true"></div>
</header>"""

FOOTER = """<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="logo" href="/"><img class="logo-img" src="/assets/img/bcx-wordmark-line.svg" alt="bostoncyberx"></a>
        <p style="margin-top:1rem"><span class="fv-t">Transform</span> with AI. <span class="fv-d">Defend</span> with AI. <span class="fv-a">Achieve</span> with AI.</p>
        <p style="margin-top:.45rem;font-size:.85rem">AI and cybersecurity transformation services.</p>
        <p class="mono" style="margin-top:.8rem">One Marina Park Drive, Boston, MA 02210<br><a href="tel:+16172415445">617.241.5445</a> · <a href="mailto:info@bostoncyberx.com">info@bostoncyberx.com</a></p>
      </div>
      <div>
        <h4>Solutions</h4>
        <ul>
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
          <li><a href="/ai-readiness-assessment/">Business AI Maturity</a></li>
          <li><a href="/privacy/">Privacy Policy</a></li>
          <li><a href="/accessibility/">Accessibility</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-legal">
      <span>© 2026 bostoncyberx. All rights reserved.</span>
      <span class="mono">Boston · New York · Los Angeles · Jacksonville</span>
    </div>
  </div>
</footer>"""


def card_html(card):
    href = f"/insights/{card['slug']}/"
    accent = f" {card['accent']}" if card.get("accent") else ""
    kicker_class = card.get("kicker_class") or "kicker"
    return (
        f'        <article class="card{accent}">\n'
        f'          <span class="{kicker_class}" style="margin-bottom:.2rem">{html.escape(card["kicker"])}</span>\n'
        f'          <h3><a href="{href}" style="color:inherit">{html.escape(card["title"])}</a></h3>\n'
        f'          <p>{html.escape(card["excerpt"])}</p>\n'
        f'          <p class="mono muted" style="font-size:.8rem;margin-bottom:0">{html.escape(card["byline"])}</p>\n'
        f'          <a class="more" href="{href}">Read the article →</a>\n'
        f"        </article>"
    )


def replace_marked(text, start, end, inner):
    block = f"{start}\n{inner}\n          {end}"
    if start in text and end in text:
        return re.sub(
            re.escape(start) + r".*?" + re.escape(end),
            block,
            text,
            count=1,
            flags=re.S,
        )
    raise RuntimeError(f"Missing markers {start} / {end}")


def update_hub(cards):
    with open(HUB, encoding="utf-8") as f:
        src = f.read()
    grid = "\n".join(card_html(c) for c in cards)
    src = replace_marked(src, CARDS_START, CARDS_END, grid)
    items = []
    for i, card in enumerate(cards, 1):
        items.append(
            {
                "@type": "ListItem",
                "position": i,
                "name": card["title"],
                "url": public_insights_url(card["slug"]),
            }
        )
    jsonld = json.dumps(items, indent=8)
    src = re.sub(
        r'("itemListElement":\s*)\[[^\]]*\]',
        r"\1" + jsonld.replace("\\", r"\\"),
        src,
        count=1,
        flags=re.S,
    )
    src = src.replace('<div class="cards two">', '<div class="cards">')
    with open(HUB, "w", encoding="utf-8") as f:
        f.write(src)


def write_article(post):
    slug = post["slug"]
    if slug in RESERVED_SLUGS:
        return None
    title = post.get("title") or slug
    excerpt = post.get("excerpt") or ""
    url = public_insights_url(slug)
    published = (post.get("firstPublishedDate") or "")[:10] or "2026-09-13"
    byline = f"bcx Research Team · {format_long_date(post.get('firstPublishedDate')) or format_month(post.get('firstPublishedDate'))}"
    short_crumbs = {
        "trusted-execution-environment-ai-personal-data": "Trusted Execution Environments",
    }
    crumb = short_crumbs.get(slug, html.escape(title))
    body = post_body_html(post)
    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)} | bostoncyberx</title>
<meta name="description" content="{html.escape(excerpt)}">
<link rel="canonical" href="{url}">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(excerpt)}">
<meta property="og:url" content="{url}">
<meta property="og:site_name" content="bostoncyberx">
<meta property="og:type" content="article">
<meta property="og:image" content="https://www.bostoncyberx.com/assets/img/og-default.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="/assets/img/bcx-mark.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/bcx.css">
<script type="application/ld+json">
{json.dumps({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": f"{url}#article",
      "headline": title,
      "description": excerpt,
      "url": url,
      "mainEntityOfPage": url,
      "datePublished": published,
      "dateModified": (post.get("lastPublishedDate") or published)[:10],
      "author": {"@type": "Organization", "name": "bcx Research Team", "url": "https://www.bostoncyberx.com/about"},
      "publisher": {"@id": "https://www.bostoncyberx.com/#org"},
      "image": "https://www.bostoncyberx.com/assets/img/og-default.png"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.bostoncyberx.com/"},
        {"@type": "ListItem", "position": 2, "name": "Insights", "item": "https://www.bostoncyberx.com/insights"},
        {"@type": "ListItem", "position": 3, "name": title, "item": url}
      ]
    }
  ]
}, indent=2)}
</script>
</head>
<body>
{NAV}

<main id="main">
  <article class="article">
    <nav aria-label="Breadcrumb" class="mono muted" style="font-size:.8rem;margin-bottom:1.6rem">
      <a href="/">Home</a> / <a href="/insights/">Insights</a> / <span aria-current="page">{crumb}</span>
    </nav>
    <h1>{html.escape(title)}</h1>
    <p class="byline">{html.escape(byline)}</p>
    {body}
    <h2>Next step</h2>
    <p>Map which data classes leave the firm when people and agents talk to hosted models. Book a Discovery Call and we will scope whether confidential compute is the right control for your workloads.</p>
    <p><a class="btn btn-primary" href="https://www.bostoncyberx.com/discovery">Book a Discovery Call</a></p>
  </article>

  <section class="cta-band">
    <h2>Protect the data that trains your advantage.</h2>
    <p>A 30-minute Discovery Call with a senior practitioner. No deck, no pitch theater.</p>
    <a class="btn btn-green" href="https://www.bostoncyberx.com/discovery">Book a Discovery Call</a>
  </section>
</main>

{FOOTER}
<script src="/assets/js/field.js" defer></script>
<script src="/assets/js/main.js" defer></script>
<script src="/assets/js/motion.js" defer></script>
</body>
</html>
"""
    dest_dir = os.path.join(ROOT, "insights", slug)
    os.makedirs(dest_dir, exist_ok=True)
    dest = os.path.join(dest_dir, "index.html")
    with open(dest, "w", encoding="utf-8") as f:
        f.write(page)
    return dest


def update_sitemap(slugs):
    with open(SITEMAP, encoding="utf-8") as f:
        src = f.read()
    for slug in slugs:
        loc = f"https://www.bostoncyberx.com/insights/{slug}/"
        if loc in src:
            continue
        src = src.replace(
            "</urlset>",
            f"  <url><loc>{loc}</loc><lastmod>2026-09-13</lastmod></url>\n</urlset>",
        )
    with open(SITEMAP, "w", encoding="utf-8") as f:
        f.write(src)


def main():
    posts = list_published_posts()
    print(f"Published Blog posts: {len(posts)}")
    for post in posts:
        print(f"  - {post.get('slug')}  {post.get('title')}")

    cards = hub_cards(posts)
    update_hub(cards)
    print(f"Hub cards: {len(cards)}")

    written = []
    for summary in posts:
        slug = summary.get("slug")
        if not slug or slug in RESERVED_SLUGS:
            print(f"Skip reserved or empty slug: {slug}")
            continue
        full = get_post_by_slug(slug)
        if not full:
            raise SystemExit(f"Get Post By Slug failed for {slug}")
        path = write_article(full)
        if path:
            written.append(slug)
            print(f"Wrote {path}")

    update_sitemap(written)
    print("Done.")


if __name__ == "__main__":
    main()
