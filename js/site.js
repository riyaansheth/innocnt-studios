const motionStyles = document.createElement('link');
motionStyles.rel = 'stylesheet';
motionStyles.href = '/css/pages-motion.css';
document.head.append(motionStyles);

const catalogueHoverStyles = document.createElement('link');
catalogueHoverStyles.rel = 'stylesheet';
catalogueHoverStyles.href = '/css/collection-product-hover.css';
document.head.append(catalogueHoverStyles);

const sharedNavigationStyles = document.createElement('link');
sharedNavigationStyles.rel = 'stylesheet';
sharedNavigationStyles.href = '/css/navigation-shared.css';
document.head.append(sharedNavigationStyles);

const cartDrawerStyles = document.createElement('link');
cartDrawerStyles.rel = 'stylesheet';
cartDrawerStyles.href = '/css/cart-drawer.css';
document.head.append(cartDrawerStyles);

const refinementStyles = document.createElement('link');
refinementStyles.rel = 'stylesheet';
refinementStyles.href = '/css/refinements.css';
document.head.append(refinementStyles);

const productSectionStyles = document.createElement('link');
productSectionStyles.rel = 'stylesheet';
productSectionStyles.href = '/css/product-section-overrides.css';
document.head.append(productSectionStyles);

const buttonStyles = document.createElement('link');
buttonStyles.rel = 'stylesheet';
buttonStyles.href = '/css/button-overrides.css';
document.head.append(buttonStyles);

const globalFontStyles = document.createElement('link');
globalFontStyles.rel = 'stylesheet';
globalFontStyles.href = '/css/font-overrides.css';
document.head.append(globalFontStyles);

if (document.querySelector('.product-page .gallery')) {
  const productGalleryStyles = document.createElement('link');
  productGalleryStyles.rel = 'stylesheet';
  productGalleryStyles.href = '/css/product-gallery.css';
  document.head.append(productGalleryStyles);

  document.querySelectorAll('.product-page .gallery').forEach((gallery) => {
    gallery.tabIndex = 0;
    gallery.setAttribute('aria-label', 'Product photos. Scroll to view the next image.');
  });

  document.querySelectorAll('.product-page > .section .section-head').forEach((heading) => {
    heading.querySelector('.eyebrow')?.remove();
    const title = heading.querySelector('h2');
    if (title) title.textContent = 'Keep it close.';
  });
}

document.querySelectorAll('.product-details').forEach((details) => {
  details.querySelector('.try-on')?.remove();
  [...details.querySelectorAll('a.button')].find((button) => /buy now/i.test(button.textContent))?.remove();
  const sizeLabel = [...details.children].find((element) => element.matches('.eyebrow') && /size guide/i.test(element.textContent));
  const sizes = details.querySelector('.sizes');
  const action = [...details.querySelectorAll('p')].find((element) => /add to bag/i.test(element.textContent));
  if (sizeLabel && sizes && action) {
    const purchase = document.createElement('div');
    purchase.className = 'purchase-row';
    const sizeSlot = document.createElement('div');
    sizeSlot.className = 'purchase-row__sizes';
    const actionSlot = document.createElement('div');
    actionSlot.className = 'purchase-row__action';
    sizeSlot.append(sizeLabel, sizes);
    actionSlot.append(action);
    purchase.append(sizeSlot, actionSlot);

    const productInfo = details.querySelector('.info-list');
    const sizeGuideRule = productInfo?.nextElementSibling;
    if (productInfo && sizeGuideRule?.matches('.rule')) {
      details.insertBefore(sizeGuideRule, productInfo);
      details.insertBefore(purchase, sizeGuideRule);
    } else {
      details.append(purchase);
    }
  }
  const page = details.closest('.product-page');
  if (page && !page.querySelector('.product-services')) {
    const services = document.createElement('section');
    services.className = 'product-services';
    services.setAttribute('aria-label', 'Customer care details');
    services.innerHTML = '<div><b aria-hidden="true">⌑</b><span>Express delivery</span><small>Tracked delivery across India and worldwide.</small></div><div><b aria-hidden="true">↺</b><span>Easy returns</span><small>Return eligible pieces within 30 days.</small></div><div><b aria-hidden="true">◌</b><span>Customer service</span><small>care@innocnt.com<br>Monday–Friday, 10:00–18:00 IST</small></div><div><b aria-hidden="true">▣</b><span>Secure payment</span><small>Protected checkout on every order.</small></div>';
    page.append(services);
  }
});

const footerScript = document.createElement('script');
footerScript.src = '/js/footer.js';
document.head.append(footerScript);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  document.body.classList.add('page-motion');
}

// Keep every use of the God’s Child campaign shot on the red studio backdrop.
const redHoodieImage = '/assets/images/gods-child-hoodie-innocnt-red.png';
document.querySelectorAll('img[src*="ref4-gods-child-hoodie.png"]').forEach((image) => {
  image.src = redHoodieImage;
});

const storefrontRefinementStyles = document.createElement('link');
storefrontRefinementStyles.rel = 'stylesheet';
storefrontRefinementStyles.href = '/css/storefront-refinement.css';
document.head.append(storefrontRefinementStyles);

document.querySelectorAll('.page-header').forEach((header) => {
  const existingBag = header.querySelector('.page-bag')?.cloneNode(true);
  const brand = document.createElement('a');
  brand.href = '/';
  brand.className = 'brand';
  brand.setAttribute('aria-label', 'INNOCNT home');
  brand.innerHTML = '<img src="/assets/identity/wordmark.svg" alt="INNOCNT">';

  const menuButton = document.createElement('button');
  menuButton.type = 'button';
  menuButton.className = 'menu';
  menuButton.dataset.menu = '';
  menuButton.textContent = 'Menu';

  const sharedNav = document.createElement('nav');
  sharedNav.className = 'page-nav';
  sharedNav.dataset.nav = '';
  sharedNav.setAttribute('aria-label', 'Primary navigation');
  [
    ['/world/', 'An Innocnt World'],
    ['/collections/', 'Collections'],
    ['/contact/', 'Contact'],
  ].forEach(([href, label]) => {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    if (new URL(href, window.location.origin).pathname === window.location.pathname) {
      link.setAttribute('aria-current', 'page');
    }
    sharedNav.append(link);
  });

  const bag = existingBag || document.createElement('a');
  bag.className = 'page-bag';
  if (!bag.getAttribute('href')) bag.href = '/bag/';
  if (!bag.textContent.trim()) bag.innerHTML = 'Bag <span>(0)</span>';
  header.replaceChildren(brand, menuButton, sharedNav, bag);
});

if (window.location.pathname.startsWith('/bag')) {
  document.body.classList.add('bag-page');
  const bagStyles = document.createElement('link');
  bagStyles.rel = 'stylesheet';
  bagStyles.href = '/css/bag-page.css';
  document.head.append(bagStyles);
  const bagTitle = document.querySelector('.bag-page .section-head .title');
  if (bagTitle) bagTitle.textContent = 'Your bag.';
}

const menu = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');
if (nav) {
  const findNavLink = (path, label) => (
    nav.querySelector(`a[href*="${path}"]`)
    || [...nav.links].find((link) => link.textContent.trim() === label)
  );

  const navItems = [
    findNavLink('world/', 'An Innocnt World'),
    findNavLink('collections/', 'Collections'),
    findNavLink('contact/', 'Contact'),
  ].filter(Boolean);

  // Each page contains legacy navigation markup. Replace it with the one
  // canonical sequence so navigation cannot revert when a new page loads.
  nav.replaceChildren(...navItems);
}
if (document.querySelector('.contact-grid')) {
  const contactStyles = document.createElement('link');
  contactStyles.rel = 'stylesheet';
  contactStyles.href = new URL('../css/contact.css', window.location.href);
  document.head.append(contactStyles);
}

const worldMain = document.querySelector('#main');
if (worldMain) {
  const worldStyles = document.createElement('link');
  worldStyles.rel = 'stylesheet';
  worldStyles.href = new URL('../css/world-section-layout.css', window.location.href);
  document.head.append(worldStyles);

  worldMain.querySelectorAll('.section-head').forEach((heading) => {
    heading.querySelector('.eyebrow')?.remove();
    heading.querySelector(':scope > p')?.remove();
  });
}
menu?.addEventListener('click',()=>nav.classList.toggle('open'));

if (!reduceMotion) {
  const revealSets = [
    ['.section-head', 'left'],
    ['.section > .split', 'scale'],
    ['.capsule-stat', 'up'],
    ['.product-layout', 'up'],
    ['.checkout', 'up'],
    ['.confirmation > div', 'up'],
    ['.footer-top', 'up'],
    ['.footer-bottom', 'up'],
    ['.cards > .product, .filter-grid > .product', 'up'],
  ];
  revealSets.forEach(([selector, direction]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.dataset.pageReveal = direction;
      if (selector.includes('.product')) element.style.transitionDelay = `${Math.min(index, 4) * 80}ms`;
    });
  });

  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      activeObserver.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px' });
  document.querySelectorAll('[data-page-reveal]').forEach((element) => observer.observe(element));
}

document.querySelectorAll('[data-filter]').forEach((button)=>button.addEventListener('click',()=>{
  const group=button.closest('[data-filters]'); const value=button.dataset.filter;
  group.querySelectorAll('button').forEach((item)=>item.classList.toggle('active',item===button));
  document.querySelectorAll('[data-product-category]').forEach((card)=>card.hidden=value!=='all'&&card.dataset.productCategory!==value);
}));

document.querySelectorAll('[data-size]').forEach((button)=>button.addEventListener('click',()=>button.parentElement.querySelectorAll('button').forEach((item)=>item.classList.toggle('active',item===button))));

const cartDrawer = document.createElement('aside');
cartDrawer.className = 'cart-drawer';
cartDrawer.hidden = true;
cartDrawer.setAttribute('aria-label', 'Shopping bag');
cartDrawer.innerHTML = `
  <button class="cart-drawer__backdrop" type="button" aria-label="Close bag"></button>
  <div class="cart-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title">
    <header class="cart-drawer__header"><h2 id="cart-drawer-title">Cart</h2><button class="cart-drawer__close" type="button" aria-label="Close bag">×</button></header>
    <section class="cart-drawer__item" aria-label="God’s Child Hoodie in bag">
      <img class="cart-drawer__image" src="/assets/images/gods-child-hoodie-innocnt-red.png" alt="God’s Child Hoodie">
      <div><p class="cart-drawer__product-name">God’s Child Hoodie</p><p class="cart-drawer__price">₹8,500</p><p class="cart-drawer__variant">Washed black · M</p><div class="cart-drawer__controls"><div class="cart-drawer__quantity"><button type="button" data-cart-quantity="decrease" aria-label="Decrease quantity">−</button><output data-cart-count>1</output><button type="button" data-cart-quantity="increase" aria-label="Increase quantity">+</button></div><button class="cart-drawer__remove" type="button" aria-label="Remove God’s Child Hoodie">⌫</button></div></div>
    </section>
    <footer class="cart-drawer__footer"><p class="cart-drawer__note">Add order note</p><p class="cart-drawer__shipping-note">Taxes and shipping calculated at checkout</p><input class="cart-drawer__discount" type="text" placeholder="Discount code" aria-label="Discount code"><a class="cart-drawer__checkout" href="/checkout/shipping/">Checkout · ₹<span data-cart-total>8,500</span></a></footer>
  </div>`;
document.body.append(cartDrawer);

document.querySelectorAll('.button, .cart-drawer__checkout, .contact-form button').forEach((button) => {
  if (/[↗↘→]/.test(button.textContent)) return;
  const arrow = document.createElement('span');
  arrow.className = 'button-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '↗';
  button.append(arrow);
});

let lastFocusedElement;
const updateCartTotal = (quantity) => {
  cartDrawer.querySelector('[data-cart-count]').textContent = quantity;
  cartDrawer.querySelector('[data-cart-total]').textContent = (8500 * quantity).toLocaleString('en-IN');
};
const setBagCount = (quantity) => document.querySelectorAll('.bag-link span, .page-bag span').forEach((count) => { count.textContent = `(${quantity})`; });
const closeCart = () => {
  cartDrawer.classList.remove('is-open');
  document.body.classList.remove('cart-open');
  window.setTimeout(() => { cartDrawer.hidden = true; lastFocusedElement?.focus(); }, 500);
};
const openCart = (trigger) => {
  lastFocusedElement = trigger;
  cartDrawer.hidden = false;
  setBagCount(1);
  requestAnimationFrame(() => cartDrawer.classList.add('is-open'));
  document.body.classList.add('cart-open');
  cartDrawer.querySelector('.cart-drawer__close').focus();
};
cartDrawer.querySelectorAll('.cart-drawer__close, .cart-drawer__backdrop').forEach((button) => button.addEventListener('click', closeCart));
cartDrawer.addEventListener('click', (event) => {
  const change = event.target.closest('[data-cart-quantity]');
  if (!change) return;
  const current = Number(cartDrawer.querySelector('[data-cart-count]').textContent);
  updateCartTotal(Math.max(1, current + (change.dataset.cartQuantity === 'increase' ? 1 : -1)));
});
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !cartDrawer.hidden) closeCart(); });
document.querySelectorAll('a.button.dark').forEach((link) => {
  if (!/add to bag/i.test(link.textContent)) return;
  link.addEventListener('click', (event) => { event.preventDefault(); openCart(link); });
});
document.querySelectorAll('.bag-link, .page-bag').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); openCart(link); }));

document.querySelectorAll('[data-demo-form]').forEach((form)=>form.addEventListener('submit',(event)=>{event.preventDefault();const message=form.querySelector('[data-message]');message.textContent=form.dataset.demoForm==='contact'?'Message received. We will get back to you.':form.dataset.demoForm==='shipping'?'Shipping details saved. Continue to payment.':form.dataset.demoForm==='payment'?'Payment accepted. Your order is confirmed.':'Your try-on is ready to preview.';}));

const target=document.querySelector('[data-countdown]');
if(target){let seconds=target.dataset.countdown*1||86400;const render=()=>{const units=[[86400,'d'],[3600,'h'],[60,'m'],[1,'s']];target.innerHTML=units.map(([n,label])=>`<div><strong>${String(Math.floor(seconds/n)% (label==='d'?365:60)).padStart(2,'0')}</strong><span>${label}</span></div>`).join('');seconds=Math.max(0,seconds-1)};render();setInterval(render,1000)}

const navigationContrastScript = document.createElement('script');
navigationContrastScript.src = '/js/navigation-contrast.js';
document.body.append(navigationContrastScript);
