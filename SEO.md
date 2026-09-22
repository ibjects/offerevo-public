# Sitemap and crawler discovery

The static files work when deploying the repository root or the output of `npm run build` (`dist/`).

- `/sitemap.xml` lists every current canonical public HTML page on `offerevo.com`.
- `/sitemap.html` links to the website pages, homepage sections, help centre, all 10 help categories, and `https://app.offerevo.com/`. All navigation is present in HTML without requiring JavaScript.
- `/robots.txt` allows crawlers, including AI crawlers that respect the wildcard rule, to fetch public content and advertises the XML sitemap. It excludes the archived `/backup/` directory from crawling. Robots rules are not access controls and do not guarantee that blocked URLs disappear from search results.
- `/llms.txt` provides a concise product summary and useful links for AI tools. This is a supplementary, proposed convention; it does not guarantee indexing, rankings or inclusion in AI answers.

## After deployment

Check that the four URLs above return HTTP 200 with their actual content, then submit `https://offerevo.com/sitemap.xml` in the site's Google Search Console and Bing Webmaster Tools properties.

## App subdomain

This repository only deploys `offerevo.com`. The app entry point is linked in the HTML sitemap, AI overview and homepage structured data. The app's live routes and crawler settings were not verified during this change.

The app needs its own `https://app.offerevo.com/sitemap.xml` and `robots.txt`, deployed in the app project. Include only public, canonical, indexable pages there; do not list private account or dashboard routes. Verify public routes before adding them. The main website's robots rules do not configure the app subdomain.

Keep each XML sitemap scoped to its host unless cross-site submission has been configured and ownership verified. Do not add unverified app routes or a nonexistent app sitemap to this site's crawler files.

## Maintenance

Use the visible, active content in `index.html` and the detailed answers in `help/faqs.json` as the product sources for sitemap descriptions and `llms.txt`. Do not promote commented-out features or archived pages as current functionality. Product details in these files describe the supplied content; they have not been independently verified against the app implementation.

The FAQs clarify that browsing is public, Google is the only current sign-in method, saving/creating/redeeming require sign-in, each person can redeem an offer once, and an account can manage multiple businesses. Offer archiving is permanent; business archiving is reversible and does not extend offer expiry dates. Keep these distinctions when updating summaries.

Run `npm run build:help` after editing `help/faqs.json`, and include the generated `help/*.html` pages when committing for repository-root hosting. `npm run build` also regenerates them automatically and copies the help pages, stylesheet and FAQ JSON into `dist/help/`. Each answer is included directly in HTML and in matching FAQ structured data; search does not need to fetch the JSON over the network.

The help generator currently has an empty `tawk-embed` placeholder, with no form integration configured. A visible email link provides a working support contact. Connect and verify the intended contact form before describing it as available.

The existing privacy and terms pages still refer to waitlists and an early-stage concept, while the homepage describes public beta. Their policy language needs review by the site owner; this sitemap change does not rewrite those policies.

When adding a public page, update `sitemap.xml`, `sitemap.html`, `llms.txt` and, when needed, the build copy list in `package.json`. New help categories are generated and copied automatically, but still need links in both sitemaps and `llms.txt`. Use canonical HTTPS URLs in XML and AI references; use relative file links in HTML navigation so it also works when opened locally. Homepage fragments belong in the HTML sitemap, not separate XML entries. Do not list archived pages, missing routes or tracking URLs. If adding `lastmod`, use the date of the page's actual meaningful content change rather than the build date.

References: [Sitemap protocol](https://www.sitemaps.org/protocol.html), [Google robots.txt guidance](https://developers.google.com/search/docs/crawling-indexing/robots/intro), [llms.txt proposal](https://llmstxt.org/).
