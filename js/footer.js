(() => {
  const footerStyles = document.createElement('link');
  footerStyles.rel = 'stylesheet';
  footerStyles.href = '/css/footer.css';
  document.head.append(footerStyles);

  const root = new URL('/', window.location.href).href;
  const toRoot = (path) => new URL(path, root).href;
  const existing = document.querySelector('.site-footer, footer.footer');
  const footer = existing || document.body.appendChild(document.createElement('footer'));
  footer.className = 'editorial-footer';
  footer.id = 'footer';
  footer.innerHTML = `
    <div class="footer-grid">
      <section>
        <p class="footer-kicker">Newsletter</p>
        <p class="footer-copy">A note when something new arrives. No noise, no filler.</p>
        <form class="footer-subscribe" data-footer-subscribe novalidate>
          <input name="email" type="email" autocomplete="email" placeholder="E-mail" aria-label="Email address" required>
          <button type="submit">Subscribe</button>
          <p class="footer-message" aria-live="polite"></p>
        </form>
        <nav class="footer-social" aria-label="Social links">
          <a href="#footer" aria-label="Instagram"><img src="${toRoot('assets/icons/instagram.svg')}" alt=""></a>
          <a href="#footer" aria-label="WhatsApp"><img src="${toRoot('assets/icons/whatsapp.svg')}" alt=""></a>
          <a href="#footer" aria-label="TikTok"><img src="${toRoot('assets/icons/tiktok.svg')}" alt=""></a>
        </nav>
      </section>
      <nav class="footer-nav" aria-label="Shop footer navigation">
        <p class="footer-kicker">Shop</p>
        <a href="${toRoot('collections/')}">Collections</a>
        <a href="${toRoot('collections/')}">T-shirts</a>
        <a href="${toRoot('collections/')}">Hoodies</a>
      </nav>
      <nav class="footer-nav" aria-label="Information footer navigation">
        <p class="footer-kicker">Information</p>
        <a href="${toRoot('world/')}">Our world</a>
        <a href="${toRoot('contact/')}">Contact</a>
        <a href="${toRoot('bag/')}">Shipping &amp; returns</a>
        <a href="${toRoot('contact/')}">Customer care</a>
      </nav>
      <section class="footer-about">
        <p class="footer-kicker">About INNOCNT</p>
        <p>Innocnt is for people who still want to feel deeply, even when that makes no sense. We make pieces for the tender, the strange, and the part of you that refuses to become ordinary.</p>
        <img class="footer-signature" src="${toRoot('assets/identity/rabbit-signature.svg')}" alt="INNOCNT rabbit mark">
      </section>
    </div>
    <div class="footer-meta">
      <p class="footer-location">Mumbai, India / INR</p>
      <img class="footer-mark" src="${toRoot('assets/identity/wordmark.svg')}" alt="INNOCNT">
      <div class="footer-payment" aria-label="Accepted payment methods">
        <img class="payment-icon payment-icon--visa" src="${toRoot('assets/icons/visa.svg')}" alt="Visa">
        <img class="payment-icon payment-icon--mastercard" src="${toRoot('assets/icons/mastercard.svg')}" alt="Mastercard">
        <img class="payment-icon payment-icon--upi" src="${toRoot('assets/icons/upi.svg')}" alt="UPI">
        <img class="payment-icon payment-icon--amex" src="${toRoot('assets/icons/americanexpress.svg')}" alt="American Express">
      </div>
    </div>`;

  footer.querySelector('[data-footer-subscribe]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const message = form.querySelector('.footer-message');
    if (!form.email.validity.valid) { message.textContent = 'Use a valid email address.'; form.email.focus(); return; }
    message.textContent = 'You are on the list.';
    form.reset();
  });
})();
