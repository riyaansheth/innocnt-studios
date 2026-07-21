document.querySelectorAll('.page-hero').forEach((hero) => {
  hero.style.setProperty('--hero', "url('../assets/images/homepage-hero.png')");
});

const menu = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');
if (nav) {
  const homeLink = document.createElement('a');
  homeLink.href = new URL('/', window.location.href);
  homeLink.textContent = 'Homepage';
  nav.prepend(homeLink);
}
if (document.querySelector('.contact-grid')) {
  const contactStyles = document.createElement('link');
  contactStyles.rel = 'stylesheet';
  contactStyles.href = new URL('../css/contact.css', window.location.href);
  document.head.append(contactStyles);
}
menu?.addEventListener('click',()=>nav.classList.toggle('open'));

document.querySelectorAll('[data-filter]').forEach((button)=>button.addEventListener('click',()=>{
  const group=button.closest('[data-filters]'); const value=button.dataset.filter;
  group.querySelectorAll('button').forEach((item)=>item.classList.toggle('active',item===button));
  document.querySelectorAll('[data-product-category]').forEach((card)=>card.hidden=value!=='all'&&card.dataset.productCategory!==value);
}));

document.querySelectorAll('[data-size]').forEach((button)=>button.addEventListener('click',()=>button.parentElement.querySelectorAll('button').forEach((item)=>item.classList.toggle('active',item===button))));

document.querySelectorAll('[data-demo-form]').forEach((form)=>form.addEventListener('submit',(event)=>{event.preventDefault();const message=form.querySelector('[data-message]');message.textContent=form.dataset.demoForm==='contact'?'Message received. We will get back to you.':form.dataset.demoForm==='shipping'?'Shipping details saved. Continue to payment.':form.dataset.demoForm==='payment'?'Payment accepted. Your order is confirmed.':'Your try-on is ready to preview.';}));

const target=document.querySelector('[data-countdown]');
if(target){let seconds=target.dataset.countdown*1||86400;const render=()=>{const units=[[86400,'d'],[3600,'h'],[60,'m'],[1,'s']];target.innerHTML=units.map(([n,label])=>`<div><strong>${String(Math.floor(seconds/n)% (label==='d'?365:60)).padStart(2,'0')}</strong><span>${label}</span></div>`).join('');seconds=Math.max(0,seconds-1)};render();setInterval(render,1000)}
