// Generates /help from faqs.json. No dependencies, no framework.
//   node help/build.mjs
// Answers are written INTO the HTML, because a crawler will not run the search
// script. Re-run and commit the output after editing faqs.json.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const SITE = "https://offerevo.com";

const { categories, faqs } = JSON.parse(
  fs.readFileSync(path.join(HERE, "faqs.json"), "utf8"),
);

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const scriptJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c");

/** Stable, readable anchor: "How do I redeem an offer?" -> how-do-i-redeem-an-offer */
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);

function shell({ title, description, canonical, body, jsonLd }) {
  return `<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${canonical}">
  <link rel="sitemap" type="application/xml" href="../sitemap.xml">
  <link rel="describedby" type="text/plain" href="../llms.txt">
  <link rel="icon" type="image/svg+xml" href="../images/offerevo-icon.svg">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${SITE}/images/OfferEvo-preview.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&amp;family=Inter:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@500;600&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./help.css">
  <link rel="stylesheet" href="../footer.css">
  <link rel="stylesheet" href="../header.css">
  <script src="../header.js" defer></script>
${jsonLd ? `  <script type="application/ld+json">${jsonLd}</script>\n` : ""}</head>

<body>
  <a class="skip" href="#main">Skip to main content</a>

  <header class="oe-header">
    <a class="oe-header__home" href="../index.html" aria-label="OfferEvo home">
      <img class="oe-header__logo" src="../images/offer-evo.png" alt="OfferEvo" width="154" height="52">
    </a>
    <nav class="oe-header__nav" id="site-navigation" aria-label="Main navigation">
      <a href="../index.html#how">How it works</a>
      <a href="../index.html#benefits">For businesses</a>
      <a href="../index.html#product">Who it’s for</a>
      <a href="../index.html#faq">FAQ</a>
      <a href="../help/index.html">Help</a>
    </nav>
    <div class="oe-header__actions">
      <a class="oe-header__login" href="https://app.offerevo.com/">Sign in</a>
      <a class="oe-header__cta" href="https://app.offerevo.com/">Get started ↗</a>
    </div>
    <button class="oe-header__toggle" type="button" aria-expanded="false" aria-controls="site-navigation" aria-label="Open navigation">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" focusable="false">
        <path d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
  </header>

  <main id="main" tabindex="-1">
${body}
  </main>

  <footer class="oe-footer">
    <div class="oe-footer__top">
      <div class="oe-footer__brand">
        <a class="oe-footer__home" href="../index.html" aria-label="OfferEvo home">
          <img class="oe-footer__logo" src="../images/offer-evo.png" alt="OfferEvo" width="154" height="52">
        </a>
        <p class="oe-footer__tagline">Local deals that help small businesses grow.</p>
      </div>
      <nav class="oe-footer__nav" aria-label="Footer">
        <a href="https://app.offerevo.com/">Get started</a>
        <a href="../help/index.html">Help centre</a>
        <a href="../privacy.html">Privacy</a>
        <a href="../terms.html">Terms</a>
        <a href="../sitemap.html">Sitemap</a>
      </nav>
    </div>
    <div class="oe-footer__bottom">
      <p class="oe-footer__copyright">© <span id="year">2026</span> OfferEvo</p>
      <a class="oe-footer__social" href="https://www.instagram.com/offer.evo/" target="_blank" rel="noopener noreferrer"
        aria-label="OfferEvo on Instagram (opens in a new tab)" title="OfferEvo on Instagram">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" focusable="false">
          <rect x="3" y="3" width="18" height="18" rx="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
        </svg>
      </a>
    </div>
  </footer>

  <script>
    document.querySelector('#year').textContent = new Date().getFullYear();
    function openAnswer() {
      const answer = document.getElementById(location.hash.slice(1));
      if (answer && answer.tagName === 'DETAILS') answer.open = true;
    }
    openAnswer();
    window.addEventListener('hashchange', openAnswer);
  </script>
</body>

</html>
`;
}

// ---------------------------------------------------------------- category --

for (const category of categories) {
  const mine = faqs.filter((f) => f.c === category.slug);

  const items = mine
    .map(
      (f) => `      <details id="${slug(f.q)}">
        <summary><span>${esc(f.q)}</span></summary>
        <p>${esc(f.a)}</p>
        <a class="permalink" href="#${slug(f.q)}">Link to this answer</a>
      </details>`,
    )
    .join("\n");

  // Keep structured answers identical to the visible FAQ content.
  const jsonLd = scriptJson({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: mine.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  const body = `    <section class="shell hero-help">
      <nav class="crumbs"><a href="../index.html">Home</a> / <a href="./index.html">Help centre</a> / <span>${esc(category.title)}</span></nav>
      <h1>${esc(category.title)}</h1>
      <p class="lede">${esc(category.blurb)}</p>
      <p class="count">${String(mine.length)} questions</p>
    </section>

    <section class="shell faq-list">
${items}
    </section>

    <section class="shell contact-card" id="contact">
      <h2>Still stuck?</h2>
      <p>Send us a message and we will get back to you. No extra account needed.</p>
      <a class="btn btn-primary" href="./index.html#contact">Contact support</a>
    </section>`;

  fs.writeFileSync(
    path.join(ROOT, "help", `${category.slug}.html`),
    shell({
      title: `${category.title} — OfferEvo Help`,
      description: category.blurb,
      canonical: `${SITE}/help/${category.slug}.html`,
      body,
      jsonLd,
    }),
  );
}

// ------------------------------------------------------------------- index --

const cards = categories
  .map((c) => {
    const n = faqs.filter((f) => f.c === c.slug).length;

    return `        <a class="cat" href="./${c.slug}.html">
          <h3>${esc(c.title)}</h3>
          <p>${esc(c.blurb)}</p>
          <span>${String(n)} questions</span>
        </a>`;
  })
  .join("\n");

const indexBody = `    <section class="shell hero-help">
      <h1>How can we help?</h1>
      <p class="lede">Search ${String(faqs.length)} answers, or pick a topic.</p>

      <label class="search">
        <span class="sr">Search the help centre</span>
        <input id="q" type="search" placeholder="Search, e.g. redeem a code" autocomplete="off">
      </label>

      <div id="results" class="results" hidden></div>
    </section>

    <section class="shell cats">
${cards}
    </section>

    <section class="shell contact-card" id="contact">
      <h2>Contact support</h2>
      <p>Cannot find an answer? Send us your question and we will get back to you.</p>
      <div id="tawk-embed" class="tawk-embed"></div>
      <p>Email <a href="mailto:hello@offerevo.com">hello@offerevo.com</a> for help.</p>
    </section>

    <script id="faq-index" type="application/json">${scriptJson(
      faqs.map((f) => ({ q: f.q, a: f.a, c: f.c, s: slug(f.q) })),
    )}</script>

    <script>
      // Search the embedded FAQ index without a network request.
      (function () {
        const data = JSON.parse(document.getElementById('faq-index').textContent);
        const box = document.getElementById('q');
        const out = document.getElementById('results');

        box.addEventListener('input', function () {
          const term = box.value.trim().toLowerCase();

          if (term.length < 2) { out.hidden = true; out.innerHTML = ''; return; }

          const hits = data.filter(function (f) {
            return (f.q + ' ' + f.a).toLowerCase().includes(term);
          }).slice(0, 25);

          out.hidden = false;
          out.replaceChildren();
          hits.forEach(function (f) {
            const link = document.createElement('a');
            link.href = './' + f.c + '.html#' + f.s;
            const question = document.createElement('strong');
            question.textContent = f.q;
            const answer = document.createElement('span');
            answer.textContent = f.a.slice(0, 110) + '…';
            link.append(question, answer);
            out.append(link);
          });
          if (!hits.length) {
            const empty = document.createElement('p');
            empty.className = 'none';
            empty.textContent = 'No answers matched. Try fewer words, or contact support below.';
            out.append(empty);
          }
        });
      })();
    </script>`;

fs.writeFileSync(
  path.join(ROOT, "help", "index.html"),
  shell({
    title: "OfferEvo Help Centre",
    description:
      "Answers about creating offers, approval, redeeming codes, sharing and running your business on OfferEvo.",
    canonical: `${SITE}/help/`,
    body: indexBody,
  }),
);

console.log(
  `help: ${String(categories.length)} category pages + index, ${String(faqs.length)} questions`,
);
