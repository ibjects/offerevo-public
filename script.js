const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  navigation.classList.toggle('open', !open);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const tiltCard = document.querySelector('.tilt-card');
const heroStage = document.querySelector('.hero-stage');

if (heroStage && tiltCard && window.matchMedia('(pointer: fine)').matches) {
  heroStage.addEventListener('pointermove', (event) => {
    const bounds = heroStage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    tiltCard.style.transform = `perspective(1100px) rotateY(${x * 10 - 4}deg) rotateX(${-y * 8 + 2}deg) translateY(-3px)`;
  });
  heroStage.addEventListener('pointerleave', () => {
    tiltCard.style.transform = 'perspective(1100px) rotateY(-7deg) rotateX(3deg)';
  });
}

const labState = {
  product: 'Bean There Café',
  desire: 'Bring a friend',
};

document.querySelectorAll('.choice-row').forEach((row) => {
  row.querySelectorAll('.choice').forEach((choice) => {
    choice.addEventListener('click', () => {
      row.querySelectorAll('.choice').forEach((item) => item.classList.remove('active'));
      choice.classList.add('active');
      labState[row.dataset.control] = choice.dataset.value;
    });
  });
});

const businessCopy = {
  'Bean There Café': 'Your favorite corner café deserves to be their favorite too. Share this card and make the introduction.',
  'Northside Barber': 'A great neighborhood cut should never stay a secret. Send this to the friend who keeps asking.',
  'Paper Trail Books': 'Help a friend find their next favorite read—and a local bookstore worth returning to.',
};

const evolveButton = document.querySelector('#evolve-button');
const objectionSelect = document.querySelector('#objection');
const labResult = document.querySelector('.lab-result');

evolveButton?.addEventListener('click', () => {
  const perk = objectionSelect.value;
  const score = 92 + Math.floor(Math.random() * 8);
  const perkSentence = perk.charAt(0).toUpperCase() + perk.slice(1);

  document.querySelector('#result-business').textContent = `${labState.product} · Shared by you`;
  document.querySelector('#result-title').textContent = `${labState.desire}. ${perkSentence}.`;
  document.querySelector('#result-copy').textContent = businessCopy[labState.product];
  document.querySelector('#result-promise').textContent = perkSentence;
  document.querySelector('#result-score').textContent = `Offer #${Math.floor(1000 + Math.random() * 9000)}`;
  document.querySelector('#result-number').textContent = score;
  document.querySelector('#result-bar').style.width = `${score}%`;
  document.querySelector('#result-risk').textContent = 'Timing and limits set on approval';

  labResult.classList.remove('flash');
  requestAnimationFrame(() => labResult.classList.add('flash'));
});

document.querySelectorAll('.use-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.use-tab').forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    document.querySelector('#case-tag').textContent = tab.dataset.tag;
    document.querySelector('#case-copy').textContent = tab.dataset.copy;
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();
