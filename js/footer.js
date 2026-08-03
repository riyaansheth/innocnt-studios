(() => {
  const footerStyles = document.createElement('link');
  footerStyles.rel = 'stylesheet';
  footerStyles.href = '/css/footer.css';
  document.head.append(footerStyles);

  const root = new URL('/', window.location.href).href;
  const toRoot = (path) => new URL(path, root).href;
  const existing = document.querySelector('.site-footer, footer.footer, .editorial-footer');
  const footer = existing || document.body.appendChild(document.createElement('footer'));
  footer.className = 'editorial-footer';
  footer.id = 'footer';
  footer.innerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">
        <img class="footer-signature" src="${toRoot('assets/identity/rabbit-black.svg')}" alt="INNOCNT rabbit mark">
      </div>
      <nav class="footer-col" aria-label="Information">
        <p class="footer-kicker">Information</p>
        <a href="${toRoot('world/')}">About Us</a>
        <a href="${toRoot('contact/')}">Shipping &amp; Returns</a>
        <a href="${toRoot('contact/')}">Customer Care</a>
        <a href="${toRoot('contact/')}">Contact</a>
      </nav>
      <nav class="footer-col" aria-label="Socials">
        <p class="footer-kicker">Socials</p>
        <a href="#footer">Instagram</a>
        <a href="#footer">Whatsapp</a>
        <a href="#footer">Youtube</a>
        <a href="#footer">X</a>
      </nav>
    </div>
    <div class="footer-meta">
      <p class="footer-copyright">©INNOCNT CLOTHING LIMITED</p>
      <div class="footer-payment" aria-label="Accepted payment methods">
        <img class="payment-icon payment-icon--visa" src="${toRoot('assets/icons/visa.svg')}" alt="Visa">
        <img class="payment-icon payment-icon--mastercard" src="${toRoot('assets/icons/mastercard.svg')}" alt="Mastercard">
        <img class="payment-icon payment-icon--upi" src="${toRoot('assets/icons/upi.svg')}" alt="UPI">
        <img class="payment-icon payment-icon--amex" src="${toRoot('assets/icons/americanexpress.svg')}" alt="American Express">
      </div>
    </div>`;
})();
