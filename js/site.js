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

const productPageFixes = document.createElement('link');
productPageFixes.rel = 'stylesheet';
productPageFixes.href = '/css/product-page-fixes.css';
document.head.append(productPageFixes);

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
  const productName = details.querySelector('h1');
  if (productName) productName.textContent = productName.innerText.replace(/\s+/g, ' ').trim();
  const collectionByProduct = {
    'God’s Child Hoodie': 'God’s Child',
    'Child Hoodie': 'God’s Child',
    'Broken Visions Tee': 'Broken Visions',
    'Black Tracks': 'Broken Visions',
    'Battery Long Sleeve': 'Broken Visions',
    'Washed Tracks': 'Broken Visions',
    'Tiremark Tracks': 'Broken Visions',
    'Too Innocnt Tee': 'Broken Visions',
  };
  const collectionLabel = details.querySelector('.eyebrow');
  const collection = collectionByProduct[productName?.textContent];
  if (collectionLabel && collection) collectionLabel.textContent = `Collection: ${collection}`;
  details.querySelector('.try-on')?.remove();
  [...details.querySelectorAll('a.button')].find((button) => /buy now/i.test(button.textContent))?.remove();
  const sizeLabel = [...details.children].find((element) => element.matches('.eyebrow') && /size guide/i.test(element.textContent));
  const sizes = details.querySelector('.sizes');
  const action = [...details.querySelectorAll('p')].find((element) => /add to bag/i.test(element.textContent));
  if (sizeLabel && sizes && action && !document.querySelector('.product-page')) {
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
  if (document.querySelector('.product-page') && sizes) {
    if (![...sizes.querySelectorAll('button')].some((button) => button.textContent.trim() === 'XXL')) {
      const xxl = document.createElement('button');
      xxl.type = 'button';
      xxl.dataset.size = '';
      xxl.textContent = 'XXL';
      sizes.append(xxl);
    }
    if (!details.querySelector('.size-availability')) {
      const availability = document.createElement('p');
      availability.className = 'size-availability';
      availability.textContent = 'S is unavailable';
      const detailsLabel = document.createElement('p');
      detailsLabel.className = 'details-label';
      detailsLabel.textContent = 'Details';
      sizes.after(availability, detailsLabel);
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
const redHoodieImage = '/assets/images/gods-child-hoodie-innocnt-red.webp';
document.querySelectorAll('img[src*="ref4-gods-child-hoodie.webp"]').forEach((image) => {
  image.src = redHoodieImage;
});

const storefrontRefinementStyles = document.createElement('link');
storefrontRefinementStyles.rel = 'stylesheet';
storefrontRefinementStyles.href = '/css/storefront-refinement.css';
document.head.append(storefrontRefinementStyles);

const navigationLayoutStyles = document.createElement('link');
navigationLayoutStyles.rel = 'stylesheet';
navigationLayoutStyles.href = '/css/navigation-layout.css';
document.head.append(navigationLayoutStyles);

if (document.querySelector('.product-page')) {
  const productPageReferenceStyles = document.createElement('link');
  productPageReferenceStyles.rel = 'stylesheet';
  productPageReferenceStyles.href = '/css/product-page-reference.css';
  document.head.append(productPageReferenceStyles);
}

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
  sharedNav.className = 'page-nav page-nav--left';
  sharedNav.dataset.nav = '';
  sharedNav.setAttribute('aria-label', 'Primary navigation');
  [
    ['/world/', 'About'],
    ['/collections/', 'Shop'],
  ].forEach(([href, label]) => {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    if (new URL(href, window.location.origin).pathname === window.location.pathname) {
      link.setAttribute('aria-current', 'page');
    }
    sharedNav.append(link);
  });

  const secondaryNav = document.createElement('nav');
  secondaryNav.className = 'page-nav page-nav--right';
  secondaryNav.setAttribute('aria-label', 'Secondary navigation');
  const contactLink = document.createElement('a');
  contactLink.href = '/contact/';
  contactLink.textContent = 'Contact';
  if (window.location.pathname === '/contact/') contactLink.setAttribute('aria-current', 'page');
  secondaryNav.append(contactLink);

  const searchButton = document.createElement('button');
  searchButton.type = 'button';
  searchButton.className = 'nav-icon';
  searchButton.setAttribute('aria-label', 'Search');
  searchButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>';
  secondaryNav.append(searchButton);

  const bag = existingBag || document.createElement('a');
  bag.className = 'page-bag nav-icon';
  if (!bag.getAttribute('href')) bag.href = '/bag/';
  bag.setAttribute('aria-label', 'Shopping bag');
  bag.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg><span class="bag-count">(0)</span>';
  secondaryNav.append(bag);
  header.replaceChildren(brand, menuButton, sharedNav, secondaryNav);
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
const pageNavs = document.querySelectorAll('.page-nav');
if (nav) {
  const findNavLink = (path, label) => (
    nav.querySelector(`a[href*="${path}"]`)
    || [...nav.links].find((link) => link.textContent.trim() === label)
  );

  const navItems = [
    findNavLink('world/', 'About'),
    findNavLink('collections/', 'Shop'),
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
  worldStyles.href = new URL('../css/world-section-layout.css?revision=world-subtext-align-20260729', window.location.href);
  document.head.append(worldStyles);

  worldMain.querySelectorAll('.section-head').forEach((heading) => {
    heading.querySelector('.eyebrow')?.remove();
    heading.querySelector(':scope > p')?.remove();
  });
}
menu?.addEventListener('click',()=>pageNavs.forEach((navigation) => navigation.classList.toggle('open')));

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

// The cart drawer lives in one shared module loaded on every page (js/cart-drawer.js).
const cartDrawerScript = document.createElement('script');
cartDrawerScript.src = '/js/cart-drawer.js';
document.body.append(cartDrawerScript);

document.querySelectorAll('.button, .contact-form button').forEach((button) => {
  if (/[↗↘→]/.test(button.textContent)) return;
  const arrow = document.createElement('span');
  arrow.className = 'button-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '↗';
  button.append(arrow);
});

document.querySelectorAll('[data-demo-form]').forEach((form)=>form.addEventListener('submit',(event)=>{event.preventDefault();const message=form.querySelector('[data-message]');message.textContent=form.dataset.demoForm==='contact'?'Message received. We will get back to you.':form.dataset.demoForm==='shipping'?'Shipping details saved. Continue to payment.':form.dataset.demoForm==='payment'?'Payment accepted. Your order is confirmed.':'Your try-on is ready to preview.';}));

const target=document.querySelector('[data-countdown]');
if(target){let seconds=target.dataset.countdown*1||86400;const render=()=>{const units=[[86400,'d'],[3600,'h'],[60,'m'],[1,'s']];target.innerHTML=units.map(([n,label])=>`<div><strong>${String(Math.floor(seconds/n)% (label==='d'?365:60)).padStart(2,'0')}</strong><span>${label}</span></div>`).join('');seconds=Math.max(0,seconds-1)};render();setInterval(render,1000)}

const navigationContrastScript = document.createElement('script');
navigationContrastScript.src = '/js/navigation-contrast.js';
document.body.append(navigationContrastScript);
