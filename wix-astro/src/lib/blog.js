/**
 * Wix Blog helpers for the live Wix-managed Astro project.
 *
 * Copy to src/lib/blog.js on site 58909a01-8b53-415a-918a-6184ede50ac8.
 * Uses @wix/blog (already available on Wix-managed headless). Visitor
 * auth is injected by the Astro integration. Only published posts return.
 *
 * Do not publish the reserved custom-article drafts. Those stay at their
 * static /insights/<slug> Astro pages.
 */
import { posts } from '@wix/blog';

export const RESERVED_SLUGS = [
  'grok-bot-client-zero',
  'shadow-ai-what-to-do-when-employees-use-chatgpt',
  '201-cmr-17-compliance-checklist-massachusetts',
];

export const CUSTOM_CARDS = [
  {
    slug: 'grok-bot-client-zero',
    title: 'What bostoncyberx Learned Running a Small Staff on Grok Bot',
    excerpt:
      'bcx operates on the frontier of AI so we can help our clients achieve faster time to value with reduced risk. Read about our somewhat surprising experiences with this new agent.',
    kicker: 'Client Zero · Agents',
    date: '2026-09-01',
  },
  {
    slug: 'shadow-ai-what-to-do-when-employees-use-chatgpt',
    title: 'Shadow AI: What to Do When Employees Use ChatGPT with Company Data',
    excerpt:
      'About 55% of employees use AI tools their company never approved, and roughly 35% of what they paste in is sensitive. Banning it fails. Here is a 30-day plan that works instead.',
    kicker: 'Defend · AI Security',
    date: '2026-08-15',
  },
  {
    slug: '201-cmr-17-compliance-checklist-massachusetts',
    title: '201 CMR 17.00 Compliance Checklist for Massachusetts Businesses',
    excerpt:
      'If you hold personal information on even one Massachusetts resident, you need a written information security program. The full checklist, what enforcement costs, and how insurers use it.',
    kicker: 'Compliance · Massachusetts',
    date: '2026-08-03',
  },
];

const FIELDSETS = ['URL', 'RICH_CONTENT', 'CONTENT_TEXT', 'SEO'];

export async function listPublishedPosts() {
  const result = await posts.listPosts({
    fieldsets: ['URL', 'CONTENT_TEXT'],
    paging: { limit: 50, offset: 0 },
  });
  return result.posts ?? [];
}

export async function getPostBySlug(slug) {
  const result = await posts.getPostBySlug(slug, { fieldsets: FIELDSETS });
  return result.post ?? result;
}

export function insightsHref(slug) {
  return `/insights/${slug}`;
}

export function hubEntries(published) {
  const fromBlog = (published ?? [])
    .filter((post) => post.slug && !RESERVED_SLUGS.includes(post.slug))
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || '',
      kicker: 'Insights',
      date: (post.firstPublishedDate || '').slice(0, 10),
      source: 'blog',
    }));
  const reserved = CUSTOM_CARDS.filter(
    (card) => !fromBlog.some((item) => item.slug === card.slug)
  ).map((card) => ({ ...card, source: 'custom' }));
  return [...fromBlog, ...reserved].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}
