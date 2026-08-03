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

/* ---- Working search overlay (loads on every footer-bearing page) ---------- */
(() => {
  if (window.__innocntSearch) return;
  window.__innocntSearch = true;

  const root = new URL('/', window.location.href).href;
  const to = (p) => new URL(p, root).href;
  const PRODUCTS = [
    { n: "God's Child Hoodie",  u: 'products/gods-child-hoodie/',  p: '₹8,500', i: 'assets/images/products/gods-child-hoodie-flat.png' },
    { n: 'Broken Visions Tee',  u: 'products/broken-visions-tee/', p: '₹4,200', i: 'assets/images/products/broken-visions-tee-flat.png' },
    { n: 'Black Tracks',        u: 'products/black-tracks/',       p: '₹6,800', i: 'assets/images/products/black-tracks-flat.png' },
    { n: 'Battery Long Sleeve', u: 'products/battery-long-sleeve/',p: '₹5,400', i: 'assets/images/products/battery-long-sleeve-flat.png' },
    { n: 'Washed Tracks',       u: 'products/washed-tracks/',      p: '₹6,800', i: 'assets/images/products/washed-tracks-flat.png' },
    { n: 'Tiremark Tracks',     u: 'products/tiremark-tracks/',    p: '₹7,200', i: 'assets/images/products/tiremark-tracks-flat.png' },
    { n: 'Child Hoodie',        u: 'products/child-hoodie/',       p: '₹8,700', i: 'assets/images/products/child-hoodie-flat.png' },
    { n: 'Too Innocnt Tee',     u: 'products/too-innocnt-tee/',    p: '₹4,400', i: 'assets/images/products/too-innocnt-tee-flat.jpg' },
  ];

  const style = document.createElement('style');
  style.textContent = `
    .search-overlay{position:fixed;inset:0;z-index:200;display:none}
    .search-overlay.is-open{display:block}
    .search-overlay__backdrop{position:absolute;inset:0;background:rgba(0,0,0,.4)}
    .search-panel{position:absolute;top:0;left:0;right:0;background:#fff;color:#111;
      padding:clamp(20px,4vw,40px) clamp(16px,4vw,64px) clamp(28px,4vw,48px);
      transform:translateY(-100%);transition:transform .4s cubic-bezier(.16,1,.3,1)}
    .search-overlay.is-open .search-panel{transform:translateY(0)}
    .search-bar{display:flex;align-items:center;gap:16px;border-bottom:1px solid #111;padding-bottom:14px}
    .search-bar svg{width:22px;height:22px;flex:none}
    .search-bar input{flex:1;border:0;outline:0;background:none;font:400 clamp(15px,1.4vw,18px) var(--body,Arial);color:#111}
    .search-bar input::placeholder{color:#bbb}
    .search-close{border:0;background:none;font:24px/1 Arial;color:#111;cursor:pointer}
    .search-results{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:22px;margin-top:26px}
    .search-results a{display:grid;gap:8px}
    .search-results .thumb{aspect-ratio:3/4;background:#f2f2f2;overflow:hidden;display:grid;place-items:center}
    .search-results .thumb img{width:100%;height:100%;object-fit:contain;padding:8%}
    .search-results .nm{font-size:13px}
    .search-results .pr{font-size:13px;color:#6f6f6f}
    .search-empty{margin-top:26px;color:#8a8a8a;font-size:14px}`;
  document.head.append(style);

  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="search-overlay__backdrop" data-search-close></div>
    <div class="search-panel" role="dialog" aria-modal="true" aria-label="Search products">
      <div class="search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>
        <input type="text" placeholder="Search for pieces" aria-label="Search for pieces" autocomplete="off">
        <button class="search-close" type="button" aria-label="Close search" data-search-close>&times;</button>
      </div>
      <div class="search-results" data-search-results></div>
    </div>`;
  document.body.append(overlay);

  const input = overlay.querySelector('input');
  const results = overlay.querySelector('[data-search-results]');

  const render = (q) => {
    const query = q.trim().toLowerCase();
    const list = query ? PRODUCTS.filter(p => p.n.toLowerCase().includes(query)) : PRODUCTS;
    if (!list.length) { results.innerHTML = `<p class="search-empty">No pieces match “${q}”.</p>`; return; }
    results.innerHTML = list.map(p => `
      <a href="${to(p.u)}">
        <span class="thumb"><img src="${to(p.i)}" alt="${p.n}" loading="lazy"></span>
        <span class="nm">${p.n}</span><span class="pr">${p.p}</span>
      </a>`).join('');
  };

  const open = () => {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    render('');
    input.value = '';
    setTimeout(() => input.focus(), 60);
  };
  const close = () => {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  input.addEventListener('input', () => render(input.value));
  overlay.addEventListener('click', (e) => { if (e.target.closest('[data-search-close]')) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('is-open')) close(); });

  const bind = () => document.querySelectorAll('[aria-label="Search"]').forEach(btn => {
    if (btn.dataset.searchBound) return;
    btn.dataset.searchBound = '1';
    btn.addEventListener('click', (e) => { e.preventDefault(); open(); });
  });
  bind();
  // inner-page nav is rebuilt by site.js after load; re-bind shortly after
  setTimeout(bind, 300);
})();
