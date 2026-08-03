/* One shared cart drawer for every page (homepage + inner).
   The bag icon anywhere opens this drawer — it never navigates to a bag page. */
(function () {
  if (window.__innocntCart) return;
  window.__innocntCart = true;

  if (!document.querySelector('link[href*="cart-drawer.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/cart-drawer.css';
    document.head.append(link);
  }

  const PRICE = 8500;
  let quantity = 1; // the demo bag holds one piece

  const drawer = document.createElement('aside');
  drawer.className = 'cart-drawer';
  drawer.hidden = true;
  drawer.setAttribute('aria-label', 'Shopping bag');
  drawer.innerHTML = `
    <button class="cart-drawer__backdrop" type="button" aria-label="Close bag"></button>
    <div class="cart-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title">
      <header class="cart-drawer__header"><h2 id="cart-drawer-title">Cart <span data-cart-title-count>(1)</span></h2><button class="cart-drawer__close" type="button" aria-label="Close bag">×</button></header>
      <section class="cart-drawer__item" aria-label="God’s Child Hoodie in bag">
        <img class="cart-drawer__image" src="/assets/images/gods-child-hoodie-innocnt-red.webp" alt="God’s Child Hoodie">
        <div class="cart-drawer__item-body">
          <p class="cart-drawer__product-name">God’s Child Hoodie</p>
          <p class="cart-drawer__variant">M</p>
          <div class="cart-drawer__controls">
            <div class="cart-drawer__quantity"><button type="button" data-cart-quantity="decrease" aria-label="Decrease quantity">−</button><output data-cart-count>1</output><button type="button" data-cart-quantity="increase" aria-label="Increase quantity">+</button></div>
            <button class="cart-drawer__remove" type="button" aria-label="Remove God’s Child Hoodie">Remove</button>
          </div>
        </div>
      </section>
      <section class="cart-drawer__recommendation" aria-label="You may also like">
        <h3>You May Also Like</h3>
        <div class="cart-drawer__reco-row">
          <article class="cart-drawer__reco">
            <a class="cart-drawer__reco-media" href="/products/broken-visions-tee/"><img src="/assets/images/products/broken-visions-tee-flat.webp" alt="Broken Visions Tee"><span class="cart-drawer__reco-add" aria-hidden="true">+</span></a>
            <p class="cart-drawer__reco-name">Broken Visions Tee</p>
            <p class="cart-drawer__reco-price">₹4,200</p>
          </article>
          <article class="cart-drawer__reco">
            <a class="cart-drawer__reco-media" href="/products/child-hoodie/"><img src="/assets/images/products/child-hoodie-flat.webp" alt="Child Hoodie"><span class="cart-drawer__reco-add" aria-hidden="true">+</span></a>
            <p class="cart-drawer__reco-name">Child Hoodie</p>
            <p class="cart-drawer__reco-price">₹8,700</p>
          </article>
        </div>
      </section>
      <footer class="cart-drawer__footer">
        <div class="cart-drawer__subtotal"><span>Subtotal</span><span>₹<span data-cart-total>8,500</span></span></div>
        <a class="cart-drawer__checkout" href="/checkout/shipping/">Checkout <span aria-hidden="true" style="margin-left:8px">&#8599;</span></a>
      </footer>
    </div>`;

  const mount = () => { if (!drawer.isConnected && document.body) document.body.append(drawer); };
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  const item = () => drawer.querySelector('.cart-drawer__item');
  const format = (value) => value.toLocaleString('en-IN');
  // The bag icon count everywhere: homepage + inner nav both use these hooks.
  const syncBagCount = () => document.querySelectorAll('.bag-count, .bag-link span, .page-bag span')
    .forEach((element) => { element.textContent = `(${quantity})`; });
  const syncDrawer = () => {
    const set = (selector, value) => { const node = drawer.querySelector(selector); if (node) node.textContent = value; };
    set('[data-cart-count]', quantity);
    set('[data-cart-total]', format(PRICE * quantity));
    set('[data-cart-title-count]', `(${quantity})`);
    item()?.toggleAttribute('hidden', quantity === 0);
  };
  const syncAll = () => { syncBagCount(); syncDrawer(); };

  let lastFocused;
  const openCart = (trigger) => {
    mount();
    lastFocused = trigger || document.activeElement;
    drawer.hidden = false;
    syncAll();
    requestAnimationFrame(() => drawer.classList.add('is-open'));
    document.body.classList.add('cart-open');
    drawer.querySelector('.cart-drawer__close')?.focus();
  };
  const closeCart = () => {
    drawer.classList.remove('is-open');
    document.body.classList.remove('cart-open');
    window.setTimeout(() => { drawer.hidden = true; lastFocused?.focus?.(); }, 500);
  };

  drawer.addEventListener('click', (event) => {
    if (event.target.closest('.cart-drawer__close, .cart-drawer__backdrop')) return closeCart();
    const change = event.target.closest('[data-cart-quantity]');
    if (change) {
      quantity = Math.max(0, quantity + (change.dataset.cartQuantity === 'increase' ? 1 : -1));
      return syncAll();
    }
    if (event.target.closest('.cart-drawer__remove')) { quantity = 0; syncAll(); }
  });

  // Delegated so it works whether the nav is static (homepage) or rebuilt by site.js.
  document.addEventListener('click', (event) => {
    const bag = event.target.closest('.bag-link, .page-bag');
    if (bag) { event.preventDefault(); return openCart(bag); }
    const add = event.target.closest('.button.dark');
    if (add && /add to bag/i.test(add.textContent)) {
      event.preventDefault();
      if (quantity === 0) quantity = 1;
      syncAll();
      openCart(add);
    }
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !drawer.hidden) closeCart(); });

  syncBagCount();
  document.addEventListener('DOMContentLoaded', syncBagCount);
  window.setTimeout(syncBagCount, 400); // inner nav is rebuilt by site.js after load
})();
