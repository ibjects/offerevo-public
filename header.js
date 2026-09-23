document.querySelectorAll('.oe-header').forEach(header => {
  const toggle = header.querySelector('.oe-header__toggle');
  const nav = header.querySelector('.oe-header__nav');
  if (!toggle || !nav) return;

  const closeMenu = () => {
    header.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  };

  header.classList.add('oe-header--interactive');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closeMenu();
  });
  window.matchMedia('(max-width: 1080px)').addEventListener('change', closeMenu);
});
