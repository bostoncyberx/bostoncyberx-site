# Insights on the live Wix Astro project

Live www.bostoncyberx.com is a Wix-managed headless Astro site
(site `58909a01-8b53-415a-918a-6184ede50ac8`). Pages are files under
`src/pages/`, registered at `/_wix/pages.json`. This GitHub repo is
leftover Netlify HTML. Netlify must stay 404.

## Why /blog and /post 404

Wix Blog is installed and the TEE post is published. Harmony/Editorless
never added the Blog feed or post app pages, and this Astro project has
no `/blog` or `/post/[slug]` routes. Native Blog URLs stay
`/blog` and `/post/<slug>`. Those prefixes cannot both become
`/insights`, so Insights stays a custom Astro reader.

Velo routers are not available. Harmony sites do not support site code.
The dynamic route that works here is an Astro page:
`src/pages/insights/[slug].astro` with `prerender = false`.

## What to copy into the Wix project

Someone with Wix CLI access to the live project (Faris's account) should:

1. Copy `src/lib/blog.js` to the live `src/lib/blog.js`.
2. Copy `src/pages/insights/[slug].astro` to the live
   `src/pages/insights/[slug].astro`.
3. Merge `src/pages/insights/HUB_SNIPPET.astro` into the live
   `src/pages/insights/index.astro` and set
   `export const prerender = false` on that hub.
4. Confirm `@wix/blog` and `@wix/astro-ricos` are in the live
   `package.json`. Add them only if missing.
5. Align the `Layout` import if the live file is not
   `src/layouts/Layout.astro`.
6. Run `wix build` then `wix release` (or the dashboard Publish
   control for this headless project).

After release, the public URL is:

https://www.bostoncyberx.com/insights/trusted-execution-environment-ai-personal-data

Future published Blog posts appear at `/insights/<seoSlug>` with no new
folder. The three reserved custom pages stay live:

- `/insights/grok-bot-client-zero`
- `/insights/shadow-ai-what-to-do-when-employees-use-chatgpt`
- `/insights/201-cmr-17-compliance-checklist-massachusetts`

Do not publish their matching Blog drafts. That would create
`/post/<slug>` duplicates if Blog app pages are added later.

## Wix dashboard clicks still required

1. Open the live Wix project in the CLI or dashboard (Faris).
2. Copy the files above and release. This GitHub PR cannot publish
   Astro files to Wix by itself.
3. Optional: in Blog settings, leave feed/post pages uninstalled so
   `/blog` and `/post/<slug>` stay unused.
4. Optional: add a 301 from `/post/<slug>` to `/insights/<slug>` in
   SEO > Redirects if those paths are ever created.

No ClickFlow drafts. No merge to `main` from this work.
