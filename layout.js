const siteHeader = `
<header class="sticky top-0 z-50 border-b border-ink bg-paper">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="index.html" class="flex items-center gap-2">
            <img src="./images/offer-evo.png" alt="Offer Evo" class="w-34 object-contain" />
        </a>
        <nav class="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="how-it-works.html" class="hover:text-flame">How it works</a>
            <a href="for-business.html" class="hover:text-flame">For businesses</a>
        </nav>
        <a href="join-waitlist.html"
            class="inline-flex items-center gap-2 border-[1.5px] border-ink bg-ink px-4 py-2 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5">
            Join waitlist →
        </a>
    </div>
</header>`;

const siteFooter = `
<footer class="bg-paper">
    <div class="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-12 md:flex-row md:items-end">
        <div>
            <div class="flex items-center gap-2">
                <img src="./images/offer-evo.png" alt="Offer Evo" class="w-34 object-contain" />
            </div>
            <p class="mt-3 max-w-sm text-sm text-ink/60">
                Help businesses grow by posting and sharing offers for the spots you love. OfferEvo is free for
                customers and small businesses.
            </p>
        </div>
        <div class="flex flex-wrap gap-8 font-mono text-xs uppercase tracking-widest">
            <a href="how-it-works.html" class="hover:text-flame">How it works</a>
            <a href="for-business.html" class="hover:text-flame">For businesses</a>
            <a href="join-waitlist.html" class="hover:text-flame">Join</a>
            <a href="privacy.html" class="hover:text-flame">Privacy</a>
            <a href="terms.html" class="hover:text-flame">Terms</a>
        </div>
    </div>
    <div class="border-t border-ink py-4 text-center font-mono text-[11px] uppercase tracking-widest text-ink/60">
        © 2026 OfferEVO · Made in Malaysia · All rights reserved
    </div>
</footer>`;

function mountSiteLayout() {
  document.querySelectorAll("[data-site-header]").forEach((slot) => {
    slot.outerHTML = siteHeader;
  });

  document.querySelectorAll("[data-site-footer]").forEach((slot) => {
    slot.outerHTML = siteFooter;
  });
}

function loadHubSpotForms() {
  const targets = [...document.querySelectorAll("[data-hubspot-form]")];

  if (!targets.length) {
    return;
  }

  const mountForms = () => {
    if (!window.hbspt) {
      return;
    }

    targets.forEach((target, index) => {
      if (!target.id) {
        target.id = `hubspot-waitlist-container-${index + 1}`;
      }

      if (target.dataset.hubspotMounted === "true") {
        return;
      }

      window.hbspt.forms.create({
        region: "na2",
        portalId: "246619724",
        formId: "c38d6c11-f282-4186-b919-7fc07a1f6b67",
        target: `#${target.id}`,
      });

      target.dataset.hubspotMounted = "true";
    });
  };

  if (window.hbspt) {
    mountForms();
    return;
  }

  const existingScript = document.querySelector(
    "script[src='https://js.hsforms.net/forms/embed/v2.js']",
  );

  if (existingScript) {
    existingScript.addEventListener("load", mountForms, { once: true });
    return;
  }

  const script = document.createElement("script");
  script.src = "https://js.hsforms.net/forms/embed/v2.js";
  script.charset = "utf-8";
  script.type = "text/javascript";
  script.addEventListener("load", mountForms);
  document.head.appendChild(script);
}

document.addEventListener("DOMContentLoaded", () => {
  mountSiteLayout();
  loadHubSpotForms();
});
