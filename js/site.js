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

if (document.querySelector('.product-page .gallery')) {
  const productGalleryStyles = document.createElement('link');
  productGalleryStyles.rel = 'stylesheet';
  productGalleryStyles.href = '/css/product-gallery.css';
  document.head.append(productGalleryStyles);

  document.querySelectorAll('.product-page .gallery').forEach((gallery) => {
    gallery.tabIndex = 0;
    gallery.setAttribute('aria-label', 'Product photos. Scroll to view the next image.');
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

  const stageSources = [modelImage, modelImage, modelImage, flatImage, flatImage];
  const frames = stageSources.map((source, index) => {
    const frame = source.cloneNode();
    frame.classList.add('gallery-frame');
    frame.dataset.galleryStage = String(index + 1);
    frame.alt = index < 3
      ? `God’s Child Hoodie campaign view ${index + 1}`
      : `God’s Child Hoodie product detail ${index - 2}`;
    return frame;
  });

  gallery.replaceChildren(...frames);
  gallery.classList.add('gallery--sequence');

  const progress = document.createElement('nav');
  progress.className = 'gallery-progress';
  progress.setAttribute('aria-label', 'Product image sequence');
  const dots = frames.map((frame, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.dataset.galleryDot = String(index + 1);
    dot.setAttribute('aria-label', `Show product image ${index + 1} of ${frames.length}`);
    dot.setAttribute('aria-current', index === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => {
      gallery.scrollTo({ top: frame.offsetTop, behavior: 'smooth' });
    });
    progress.append(dot);
    return dot;
  });
  gallery.closest('.product-layout')?.append(progress);

  const setActiveDot = (index) => {
    dots.forEach((dot, dotIndex) => dot.setAttribute('aria-current', String(dotIndex === index)));
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActiveDot(frames.indexOf(entry.target));
    });
  }, { root: gallery, threshold: .65 });
  frames.forEach((frame) => observer.observe(frame));
});

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

document.querySelectorAll('[data-demo-form]').forEach((form)=>form.addEventListener('submit',(event)=>{event.preventDefault();const message=form.querySelector('[data-message]');message.textContent=form.dataset.demoForm==='contact'?'Message received. We will get back to you.':form.dataset.demoForm==='shipping'?'Shipping details saved. Continue to payment.':form.dataset.demoForm==='payment'?'Payment accepted. Your order is confirmed.':'Your try-on is ready to preview.';}));

const target=document.querySelector('[data-countdown]');
if(target){let seconds=target.dataset.countdown*1||86400;const render=()=>{const units=[[86400,'d'],[3600,'h'],[60,'m'],[1,'s']];target.innerHTML=units.map(([n,label])=>`<div><strong>${String(Math.floor(seconds/n)% (label==='d'?365:60)).padStart(2,'0')}</strong><span>${label}</span></div>`).join('');seconds=Math.max(0,seconds-1)};render();setInterval(render,1000)}
