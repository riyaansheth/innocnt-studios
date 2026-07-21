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

const footerScript = document.createElement('script');
footerScript.src = '/js/footer.js';
document.head.append(footerScript);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  document.body.classList.add('page-motion');
}

document.querySelectorAll('.page-hero').forEach((hero) => {
  hero.style.setProperty('--hero', "url('../assets/images/homepage-hero.png')");
});

// Keep every use of the God’s Child campaign shot on the red studio backdrop.
const redHoodieImage = '/assets/images/gods-child-hoodie-innocnt-red.png';
document.querySelectorAll('img[src*="ref4-gods-child-hoodie.png"]').forEach((image) => {
  image.src = redHoodieImage;
});

document.querySelectorAll('.product-page .gallery').forEach((gallery) => {
  const [modelImage, flatImage] = gallery.querySelectorAll('img');
  if (!modelImage || !flatImage) return;

  const stageSources = [modelImage, flatImage, null, null, null];
  const frames = stageSources.map((source, index) => {
    if (!source) {
      const placeholder = document.createElement('div');
      placeholder.className = 'gallery-frame gallery-placeholder';
      placeholder.dataset.galleryStage = String(index + 1);
      placeholder.setAttribute('role', 'img');
      placeholder.setAttribute('aria-label', `Product image ${index + 1} coming soon`);
      placeholder.innerHTML = '<span>Image coming soon</span>';
      return placeholder;
    }

    const frame = source.cloneNode();
    frame.classList.add('gallery-frame');
    frame.dataset.galleryStage = String(index + 1);
    frame.alt = index === 0
      ? 'God’s Child Hoodie campaign view'
      : 'God’s Child Hoodie product detail';
    return frame;
  });

  gallery.replaceChildren(...frames);
  gallery.classList.add('gallery--sequence');

  const progress = document.createElement('nav');
  progress.className = 'gallery-progress';
  progress.setAttribute('aria-label', 'Product image sequence');
  let activeStage = 0;
  const setActiveStage = (index) => {
    const nextStage = Math.max(0, Math.min(index, frames.length - 1));
    activeStage = nextStage;
    dots.forEach((dot, dotIndex) => dot.setAttribute('aria-current', String(dotIndex === nextStage)));
    frames.forEach((frame, frameIndex) => frame.classList.toggle('is-gallery-active', frameIndex === nextStage));
  };

  const dots = frames.map((frame, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.dataset.galleryDot = String(index + 1);
    dot.setAttribute('aria-label', `Show product image ${index + 1} of ${frames.length}`);
    dot.setAttribute('aria-current', index === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => setActiveStage(index));
    progress.append(dot);
    return dot;
  });
  gallery.closest('.product-layout')?.append(progress);
  setActiveStage(0);

  let wheelLocked = false;
  gallery.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaY) < 5 || wheelLocked) return;
    event.preventDefault();
    setActiveStage(activeStage + (event.deltaY > 0 ? 1 : -1));
    wheelLocked = true;
    window.setTimeout(() => { wheelLocked = false; }, 650);
  }, { passive: false });
  gallery.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    setActiveStage(activeStage + (event.key === 'ArrowDown' ? 1 : -1));
  });
});

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
    ['/', 'Homepage'],
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
  const homeLink = document.createElement('a');
  homeLink.href = new URL('/', window.location.href);
  homeLink.textContent = 'Homepage';
  const findNavLink = (path, label) => (
    nav.querySelector(`a[href*="${path}"]`)
    || [...nav.links].find((link) => link.textContent.trim() === label)
  );

  const navItems = [
    homeLink,
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
      <div><p class="cart-drawer__product-name">God’s Child Hoodie</p><p class="cart-drawer__price">₹8,500</p><p class="cart-drawer__variant">Washed black · M</p><div class="cart-drawer__controls"><div class="cart-drawer__quantity"><button type="button" data-cart-quantity="decrease" aria-label="Decrease quantity">−</button><output data-cart-count>1</output><button type="button" data-cart-quantity="increase" aria-label="Increase quantity">+</button></div><button class="cart-drawer__remove" type="button">Remove</button></div></div>
    </section>
    <section class="cart-drawer__recommendation"><h3>Complete with</h3><div class="cart-drawer__suggestion"><img src="/assets/images/products/washed-tracks-on-model.png" alt="Washed Tracks"><div><p>Washed Tracks</p><span>₹6,800</span><a href="/collections/">Add to bag</a></div></div></section>
    <footer class="cart-drawer__footer"><p class="cart-drawer__note">Add order note</p><p class="cart-drawer__shipping-note">Taxes and shipping calculated at checkout</p><input class="cart-drawer__discount" type="text" placeholder="Discount code" aria-label="Discount code"><a class="cart-drawer__checkout" href="/checkout/shipping/">Checkout · ₹<span data-cart-total>8,500</span></a></footer>
  </div>`;
document.body.append(cartDrawer);

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
