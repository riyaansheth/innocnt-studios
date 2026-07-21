const toggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('is-open', !open);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  toggle?.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
}));

document.querySelector('[data-newsletter-form]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const message = form.querySelector('[data-form-message]');
  const email = form.elements.email;
  if (!email.validity.valid) {
    message.textContent = 'Use a valid email address.';
    email.focus();
    return;
  }
  message.textContent = 'You are on the list.';
  form.reset();
});

document.querySelectorAll('[data-product-carousel]').forEach((shell) => {
  const track = shell.querySelector('.product-carousel');
  const cards = [...track.querySelectorAll('.product-card')];
  const previous = shell.querySelector('[data-carousel-prev]');
  const next = shell.querySelector('[data-carousel-next]');
  const current = shell.querySelector('[data-carousel-current]');

  const updateControls = () => {
    const index = Math.round(track.scrollLeft / (cards[0].offsetWidth + 16));
    current.textContent = String(Math.min(index + 1, cards.length)).padStart(2, '0');
    previous.disabled = track.scrollLeft < 4;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };

  const move = (direction) => track.scrollBy({ left: direction * (track.clientWidth * .86), behavior: reduceMotion ? 'auto' : 'smooth' });
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', updateControls, { passive: true });
  window.addEventListener('resize', updateControls);
  updateControls();
});

if (!reduceMotion) {
  document.documentElement.classList.add('has-motion');

  const revealGroups = [
    ['.section-heading', 'left'],
    ['.category-card, .collection-card, .product-card', 'scale'],
    ['.world-copy, .newsletter > div', 'left'],
    ['.world-mark, .newsletter-form', 'right'],
    ['.footer-top, .footer-links, .footer-bottom', ''],
  ];

  revealGroups.forEach(([selector, direction]) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.dataset.reveal = direction || 'up';
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -7%' });

  document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));

  const heroImage = document.querySelector('.hero-image');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking || !heroImage) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      const offset = Math.min(window.scrollY * .11, 90);
      heroImage.style.transform = `translate3d(0, ${offset}px, 0) scale(1.03)`;
      ticking = false;
    });
  }, { passive: true });
}
