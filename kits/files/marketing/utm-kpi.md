# UTM Conventions and KPI Sheet

## UTM convention
`?utm_source={platform}&utm_medium={paid|organic|email}&utm_campaign={launch|renewal|cmmc|shadow-ai|forge}&utm_content={asset-slug}`
Examples:
- LinkedIn ad, renewal campaign: `utm_source=linkedin&utm_medium=paid&utm_campaign=renewal&utm_content=audit-headline`
- The Signal newsletter: `utm_source=signal&utm_medium=email&utm_campaign={issue-number}`
Rules: lowercase, hyphens, never spaces; every external link carries UTMs; never put personal data in URLs.

## KPI sheet (review monthly)
| Funnel stage | Metric | Source | Launch target |
|---|---|---|---|
| Reach | LinkedIn impressions + site sessions | LinkedIn, GA4 | trend up |
| Capture | Assessment starts | GA4 event | 25/quarter |
| Capture | Assessment completions with email | Netlify forms | 40% of starts |
| Capture | White paper downloads | Netlify forms | 30/quarter |
| Nurture | Newsletter subscribers / open rate | ESP | 150 subs, 45% opens |
| Pipeline | Qualified conversations | CRM/manual | 8/quarter |
| Revenue | Assessment to retainer conversion | manual | 20%+ |
