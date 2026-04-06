const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealSelector = [
  '.site-header',
  '.hero-left > *',
  '.hero-right',
  '.services-section .section-head',
  '.service-card',
  '.about-media',
  '.about-content > *',
  '.about-point',
  '.skill',
  '.contact-section .section-head',
  '.contact-card',
  '.contact-form',
  '.stat'
].join(',');

const revealItems = document.querySelectorAll(revealSelector);

revealItems.forEach((el, index) => {
  el.classList.add('reveal');
  el.style.setProperty('--reveal-delay', `${(index % 6) * 80}ms`);
});

const playedCounter = new WeakSet();

function animateStatNumber(el) {
  if (reduceMotion || playedCounter.has(el)) return;
  playedCounter.add(el);

  const raw = el.textContent.trim();
  const target = parseInt(raw.replace(/[^\d]/g, ''), 10);
  if (Number.isNaN(target)) return;
  const suffix = raw.replace(String(target), '');

  const duration = 1100;
  const start = performance.now();

  const frame = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = `${Math.round(target * eased)}${suffix}`;
    if (t < 1) requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
}

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('is-visible');

      if (entry.target.classList.contains('stat')) {
        const number = entry.target.querySelector('h3');
        if (number) animateStatNumber(number);
      }

      obs.unobserve(entry.target);
    });
  },
  { threshold: 0.16, rootMargin: '0px 0px -40px 0px' }
);

revealItems.forEach((el) => observer.observe(el));

if (!reduceMotion) {
  const heroRight = document.querySelector('.hero-right');

  if (heroRight) {
    heroRight.addEventListener('mousemove', (e) => {
      const rect = heroRight.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14;

      heroRight.style.setProperty('--mx', `${x.toFixed(1)}px`);
      heroRight.style.setProperty('--my', `${y.toFixed(1)}px`);
    });

    heroRight.addEventListener('mouseleave', () => {
      heroRight.style.setProperty('--mx', '0px');
      heroRight.style.setProperty('--my', '0px');
    });
  }
}