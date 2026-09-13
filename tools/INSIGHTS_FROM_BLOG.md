# Insights generator (leftover HTML fallback)

Live Insights pages are Wix-managed Astro files, not this repo. See
`wix-astro/README.md` for the dynamic `/insights/<slug>` route.

This leftover repo cannot host a dynamic route. The generator writes a
static Insights page from published Wix Blog content so the public URL
pattern is visible here, and so TEE can be previewed without hand-authoring
another custom article (the PR 14 path).

## Command

```
python3 tools/build_insights_from_blog.py
```

It reads published posts from the live Blog API (visitor token via
`https://www.bostoncyberx.com/_api/v2/dynamicmodel`), then:

1. Rebuilds the Latest articles cards on `insights/index.html`.
2. Writes `insights/<slug>/index.html` for each published post that is
   not one of the three reserved custom articles.
3. Adds those URLs to `sitemap.xml`.

Reserved slugs (do not overwrite, do not publish their Blog drafts):

- `grok-bot-client-zero`
- `shadow-ai-what-to-do-when-employees-use-chatgpt`
- `201-cmr-17-compliance-checklist-massachusetts`

## TEE

Published Blog post id `5e5750a6-217e-4953-b9b0-b64ab219248a`, slug
`trusted-execution-environment-ai-personal-data`.

Public URL after the live Astro route is released:

https://www.bostoncyberx.com/insights/trusted-execution-environment-ai-personal-data

This generator's HTML copy lives at
`insights/trusted-execution-environment-ai-personal-data/index.html`.
Merging this leftover HTML to `main` does not publish it on Wix.
Netlify stays 404.
