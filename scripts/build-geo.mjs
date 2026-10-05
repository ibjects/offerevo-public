// Regenerate machine-readable product references from the public source content.
// Run after editing index.html, llms.txt or help/faqs.json: node scripts/build-geo.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const write = (name, data) => fs.writeFileSync(path.join(root, name), data);
const html = read('index.html');
const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
const app = graph.find(item => item['@type'] === 'WebApplication');
const page = graph.find(item => item['@type'] === 'WebPage');
const org = graph.find(item => item['@type'] === 'Organization');
const guide = graph.find(item => item['@type'] === 'Article');
const updated = page.dateModified;
const { categories, faqs } = JSON.parse(read('help/faqs.json'));
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);
const json = (name, value) => write(name, JSON.stringify(value, null, 2) + '\n');
fs.mkdirSync(path.join(root, 'ai'), { recursive: true });
fs.mkdirSync(path.join(root, '.well-known'), { recursive: true });
json('ai/summary.json', {
  name: org.name, url: org.url, description: app.description,
  appUrl: app.url, language: 'en', status: 'public beta', dateModified: updated,
  location: org.address, contact: { email: org.email, url: 'https://offerevo.com/about.html#contact' },
  pricing: { customer: 'Free', businessOwner: 'Free' },
  features: app.featureList,
  account: { publicBrowsing: true, signIn: 'Google', requiredFor: ['saving', 'creating', 'redeeming', 'managing a business'] },
  limits: { headlineCharacters: 42, conditionCharacters: 120, redemptionsPerPersonPerOffer: 1, manualCodeCharacters: 8 },
  references: ['https://offerevo.com/', 'https://offerevo.com/about.html', 'https://offerevo.com/help/', 'https://offerevo.com/llms-full.txt']
});
json('ai/faq.json', { name: 'OfferEvo help centre FAQs', url: 'https://offerevo.com/help/', dateModified: updated,
  faqs: faqs.map(f => ({ question: f.q, answer: f.a, category: f.c, url: `https://offerevo.com/help/${f.c}.html#${slug(f.q)}` })) });
json('ai/service.json', {
  name: app.name, url: app.url, description: app.description, dateModified: updated,
  capabilities: [
    { name: 'Browse offers', description: 'Browse public deals and profiles without signing in.', url: app.url },
    { name: 'Suggest an offer', description: 'Sign in with Google and submit an offer for a listed venue. Owner approval is required.', documentation: 'https://offerevo.com/help/creating-offers.html' },
    { name: 'Approve offers', description: 'Owners review customer submissions and decide what becomes public.', documentation: 'https://offerevo.com/help/approval.html' },
    { name: 'Share an offer', description: 'Share public links or Square, Story and Wide images. Options depend on the device and browser.', documentation: 'https://offerevo.com/help/sharing.html' },
    { name: 'Redeem in store', description: 'Show a QR or eight-character code for staff validation at the named venue. One redemption per person per offer.', documentation: 'https://offerevo.com/help/redeeming.html' },
    { name: 'Manage a business', description: 'Use the same account for venue profiles, approvals, customer records and analytics.', documentation: 'https://offerevo.com/help/business-managing.html' }
  ],
  interface: { type: 'web application', authentication: 'Google sign-in', documentation: 'https://offerevo.com/help/', publicApi: false },
  limitations: ['Submitted offers cannot be edited.', 'Archiving an offer is permanent.', 'Expired or sold-out offers cannot be redeemed.', 'Availability depends on participating venues near the customer.']
});
write('.well-known/ai.txt', `# OfferEvo AI discovery\nName: OfferEvo\nWebsite: https://offerevo.com/\nApp: https://app.offerevo.com/\nSummary: https://offerevo.com/ai/summary.json\nFAQ: https://offerevo.com/ai/faq.json\nServices: https://offerevo.com/ai/service.json\nIndex: https://offerevo.com/llms.txt\nFull-Reference: https://offerevo.com/llms-full.txt\nSitemap: https://offerevo.com/sitemap.xml\nUpdates: https://offerevo.com/feed.xml\nContact: hello@offerevo.com\n\nPublic website crawling is permitted subject to https://offerevo.com/robots.txt.\nThis supplementary discovery file does not replace robots.txt, grant access to private accounts, or configure the app subdomain.\n`);
write('llms-full.txt', read('llms.txt') + '\n## Complete help centre reference\n\n' + categories.map(c =>
  `### ${c.title}\n\nSource: https://offerevo.com/help/${c.slug}.html\n\n` + faqs.filter(f => f.c === c.slug).map(f => `#### ${f.q}\n\n${f.a}\n`).join('\n')
).join('\n'));
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
write('feed.xml', `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>OfferEvo product updates</title><link>https://offerevo.com/</link>
<description>Published OfferEvo product guides and website documentation updates.</description><language>en</language>
<atom:link href="https://offerevo.com/feed.xml" rel="self" type="application/rss+xml"/>
<item><title>${esc(guide.headline)}</title><link>https://offerevo.com/#offer-guide</link><guid isPermaLink="true">https://offerevo.com/#offer-guide</guid><pubDate>${new Date(guide.datePublished + 'T12:00:00+08:00').toUTCString()}</pubDate><description>${esc(guide.description)}</description></item>
<item><title>About OfferEvo: local places and customer ideas</title><link>https://offerevo.com/about.html</link><guid isPermaLink="true">https://offerevo.com/about.html</guid><pubDate>Fri, 02 Oct 2026 04:00:00 GMT</pubDate><description>Why we built OfferEvo, who it serves, how the platform works and how to contact us.</description></item>
</channel></rss>\n`);
console.log(`GEO references generated from ${faqs.length} FAQs; content date ${updated}.`);
