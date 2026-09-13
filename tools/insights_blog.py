# Shared Wix Blog helpers for Insights.
# Fetches published posts from the live site (58909a01-8b53-415a-918a-6184ede50ac8)
# using a visitor token. Does not publish drafts.
from __future__ import annotations

import html
import json
import ssl
import urllib.parse
import urllib.request
from datetime import datetime

SITE_ID = "58909a01-8b53-415a-918a-6184ede50ac8"
SITE_ORIGIN = "https://www.bostoncyberx.com"
BLOG_APP_ID = "14bcded7-0066-7c35-14d7-466cb3f09103"
LIST_POSTS = "https://www.wixapis.com/blog/v3/posts"
GET_BY_SLUG = "https://www.wixapis.com/blog/v3/posts/slugs/{slug}"

# Live custom Insights pages. Matching Blog drafts stay UNPUBLISHED.
RESERVED_SLUGS = (
    "grok-bot-client-zero",
    "shadow-ai-what-to-do-when-employees-use-chatgpt",
    "201-cmr-17-compliance-checklist-massachusetts",
)

CUSTOM_CARDS = [
    {
        "slug": "grok-bot-client-zero",
        "title": "What bostoncyberx Learned Running a Small Staff on Grok Bot",
        "excerpt": "bcx operates on the frontier of AI so we can help our clients achieve faster time to value with reduced risk. Read about our somewhat surprising experiences with this new agent.",
        "kicker": "Client Zero · Agents",
        "accent": "",
        "byline": "bcx Research Team · September 2026",
        "date": "2026-09-01",
    },
    {
        "slug": "shadow-ai-what-to-do-when-employees-use-chatgpt",
        "title": "Shadow AI: What to Do When Employees Use ChatGPT with Company Data",
        "excerpt": "About 55% of employees use AI tools their company never approved, and roughly 35% of what they paste in is sensitive. Banning it fails. Here is a 30-day plan that works instead.",
        "kicker": "Defend · AI Security",
        "accent": "accent-d",
        "byline": "bostoncyberx Research Team · August 2026",
        "date": "2026-08-15",
    },
    {
        "slug": "201-cmr-17-compliance-checklist-massachusetts",
        "title": "201 CMR 17.00 Compliance Checklist for Massachusetts Businesses",
        "excerpt": "If you hold personal information on even one Massachusetts resident, you need a written information security program. The full checklist, what enforcement costs, and how insurers use it.",
        "kicker": "Compliance · Massachusetts",
        "accent": "accent-t",
        "kicker_class": "kicker t",
        "byline": "bostoncyberx Research Team · August 2026",
        "date": "2026-08-03",
    },
]

CTX = ssl.create_default_context()


def visitor_token():
    req = urllib.request.Request(f"{SITE_ORIGIN}/_api/v2/dynamicmodel")
    with urllib.request.urlopen(req, context=CTX, timeout=30) as resp:
        model = json.load(resp)
    apps = model.get("apps") or {}
    blog = apps.get(BLOG_APP_ID) or next(iter(apps.values()))
    token = blog.get("accessToken") or blog.get("instance")
    if not token:
        raise RuntimeError("No visitor token in dynamicmodel")
    return token, model.get("metaSiteId") or SITE_ID


def _get(url, token, site_id):
    req = urllib.request.Request(
        url,
        headers={
            "Authorization": token,
            "wix-site-id": site_id,
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req, context=CTX, timeout=30) as resp:
        return json.load(resp)


def list_published_posts(limit=50):
    token, site_id = visitor_token()
    qs = urllib.parse.urlencode(
        [("fieldsets", "URL"), ("fieldsets", "SEO"), ("paging.limit", str(limit))]
    )
    data = _get(f"{LIST_POSTS}?{qs}", token, site_id)
    return data.get("posts") or []


def get_post_by_slug(slug):
    token, site_id = visitor_token()
    qs = urllib.parse.urlencode(
        [
            ("fieldsets", "URL"),
            ("fieldsets", "RICH_CONTENT"),
            ("fieldsets", "CONTENT_TEXT"),
            ("fieldsets", "SEO"),
        ]
    )
    encoded = urllib.parse.quote(slug, safe="")
    data = _get(f"{GET_BY_SLUG.format(slug=encoded)}?{qs}", token, site_id)
    return data.get("post")


def public_insights_path(slug):
    return f"/insights/{slug}"


def public_insights_url(slug):
    return f"{SITE_ORIGIN}/insights/{slug}"


def format_month(iso):
    if not iso:
        return ""
    dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
    return dt.strftime("%B %Y")


def format_long_date(iso):
    if not iso:
        return ""
    dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
    return dt.strftime("%B %-d, %Y")


def media_url(image_id):
    if not image_id:
        return ""
    if str(image_id).startswith("http"):
        return image_id
    return f"https://static.wixstatic.com/media/{image_id}"


def _decorated_text(node):
    data = node.get("textData") or {}
    text = data.get("text") or ""
    if not text:
        return ""
    out = html.escape(text)
    href = None
    bold = italic = False
    for dec in data.get("decorations") or []:
        kind = dec.get("type")
        if kind == "BOLD":
            bold = True
        elif kind == "ITALIC":
            italic = True
        elif kind == "LINK":
            link = ((dec.get("linkData") or {}).get("link")) or {}
            href = link.get("url") or ""
            if href.startswith(f"{SITE_ORIGIN}/post/"):
                href = href.replace("/post/", "/insights/", 1)
            elif href.startswith("/post/"):
                href = href.replace("/post/", "/insights/", 1)
    if href:
        out = f'<a href="{html.escape(href, quote=True)}">{out}</a>'
    if italic:
        out = f"<em>{out}</em>"
    if bold:
        out = f"<strong>{out}</strong>"
    return out


def _inline(nodes):
    return "".join(
        _decorated_text(n) if n.get("type") == "TEXT" else ricos_html([n])
        for n in nodes or []
    )


def ricos_html(nodes):
    chunks = []
    for node in nodes or []:
        kind = node.get("type")
        children = node.get("nodes") or []
        if kind == "PARAGRAPH":
            inner = _inline(children).strip()
            if not inner:
                continue
            plain = "".join(
                (c.get("textData") or {}).get("text") or "" for c in children
            ).strip()
            if plain.lower() in {
                "book a 30-minute discovery call",
                "book a discovery call",
            }:
                chunks.append(
                    '<p><a class="btn btn-primary" href="https://www.bostoncyberx.com/discovery">Book a Discovery Call</a></p>'
                )
                continue
            chunks.append(f"<p>{inner}</p>\n")
        elif kind == "HEADING":
            level = int((node.get("headingData") or {}).get("level") or 2)
            level = min(max(level, 2), 4)
            inner = _inline(children).strip()
            if inner:
                chunks.append(f"<h{level}>{inner}</h{level}>\n")
        elif kind == "BULLETED_LIST":
            items = "".join(ricos_html([item]) for item in children)
            chunks.append(f"<ul>\n{items}</ul>\n")
        elif kind == "ORDERED_LIST":
            items = "".join(ricos_html([item]) for item in children)
            chunks.append(f"<ol>\n{items}</ol>\n")
        elif kind == "LIST_ITEM":
            inner = _inline(children) if all(c.get("type") == "TEXT" for c in children) else ricos_html(children)
            inner = inner.replace("<p>", "").replace("</p>", "")
            chunks.append(f"<li>{inner}</li>")
        elif kind == "IMAGE":
            data = node.get("imageData") or {}
            src_id = ((data.get("image") or {}).get("src") or {}).get("id")
            alt = data.get("altText") or ""
            src = media_url(src_id)
            if src:
                chunks.append(
                    f'<p><img src="{html.escape(src, quote=True)}" alt="{html.escape(alt, quote=True)}" style="max-width:100%;height:auto"></p>'
                )
        elif kind == "BLOCKQUOTE":
            inner = ricos_html(children)
            chunks.append(f"<blockquote>{inner}</blockquote>")
        elif children:
            chunks.append(ricos_html(children))
    return "".join(chunks)


def post_body_html(post):
    nodes = ((post.get("richContent") or {}).get("nodes")) or []
    rendered = ricos_html(nodes)
    if rendered.strip():
        return rendered
    text = post.get("contentText") or ""
    paras = [html.escape(p.strip()) for p in text.split("\n") if p.strip()]
    return "".join(f"<p>{p}</p>" for p in paras)


def hub_cards(posts):
    cards = []
    seen = set()
    for post in posts:
        slug = post.get("slug")
        if not slug or slug in RESERVED_SLUGS:
            continue
        cards.append(
            {
                "slug": slug,
                "title": post.get("title") or slug,
                "excerpt": post.get("excerpt") or "",
                "kicker": "Insights",
                "accent": "accent-d",
                "byline": f"bcx Research Team · {format_month(post.get('firstPublishedDate'))}",
                "date": (post.get("firstPublishedDate") or "")[:10],
                "source": "blog",
            }
        )
        seen.add(slug)
    for custom in CUSTOM_CARDS:
        if custom["slug"] in seen:
            continue
        item = dict(custom)
        item["source"] = "custom"
        cards.append(item)
    cards.sort(key=lambda c: c.get("date") or "", reverse=True)
    return cards
