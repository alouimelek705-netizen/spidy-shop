/* script.js: the site logic (cart, pop-up, dark/light, web background) */
const $ = s => document.querySelector(s);
const money = n => n + ' ' + CONFIG.currency;
const slot = (src, label, alt) => src ? `<img class="slotimg" src="${src}" alt="${alt||label}">` : label;
const slotBox = (src, label, cls) => `<div class="slot ${cls||''}">${slot(src, label)}</div>`;

/* logo */
$('#logoHeader').innerHTML = slot(CONFIG.logo, 'LOGO', 'Spidy Shop');
if (CONFIG.logo) $('#logoHeader').style.border = 'none';

/* nav */
$('#nav').innerHTML = Object.keys(CATS).map(k => `<a href="#" data-cat="${k}">${CATS[k].title.split(' &')[0]}</a>`).join('') + '<a href="#about">About</a>';

/* pages */
function home() {
  return `
  <div class="hero">
    <div class="slot" id="heroLogo">${slot(CONFIG.logo, 'YOUR LOGO HERE', 'Spidy Shop')}</div>
    <h1>SPIDY</h1>
    <p>3D printed accessories with a bite. Pick a style, order on WhatsApp.</p>
    <div><a class="btn" href="#shop">Shop the drop</a></div>
  </div>
  <div class="ticker"><span>3D PRINTED &nbsp;•&nbsp; MADE TO ORDER &nbsp;•&nbsp; CUSTOM COLORS &nbsp;•&nbsp; WEB-SLINGING STYLE &nbsp;•&nbsp; 3D PRINTED &nbsp;•&nbsp; MADE TO ORDER &nbsp;•&nbsp; CUSTOM COLORS &nbsp;•&nbsp; WEB-SLINGING STYLE &nbsp;•&nbsp;</span></div>
  <section id="shop"><h2>Choose your category</h2>
    <div class="cats">${Object.keys(CATS).map(k => `
      <a class="cat" href="#" data-cat="${k}">${slotBox(CATS[k].image, 'CATEGORY PICTURE')}<h3>${CATS[k].title}</h3><p>${CATS[k].blurb.split('.')[0]}.</p></a>`).join('')}
    </div></section>
  <section id="about"><div class="about"><h2>Made layer by layer</h2><p>Every Spidy Shop piece is designed and printed in small batches. Want another color or your own name on it? Add it in the notes when you order and we confirm everything on WhatsApp before printing.</p></div></section>`;
}
function route() {
  const h = location.hash.slice(1);
  $('#view').innerHTML = home();
  const t = h === 'about' || h === 'shop' ? $('#' + h) : null;
  t ? t.scrollIntoView() : window.scrollTo(0, 0);
}
/* pop-up with the 4 choices of a category */
function openCat(k) {
  const d = CATS[k];
  $('#panel').innerHTML = `<button class="x" id="mclose" aria-label="Close">&times;</button><h1>${d.title}</h1><p>${d.blurb} Pick one of the 4 choices.</p>
  <div class="mgrid">${d.items.slice(0, 4).map((p, i) => `
    <article class="item">${slotBox(p[3], 'PRODUCT PHOTO')}<div class="b"><h3>${p[0]}</h3><p>${p[1]}</p>
    <div class="row"><span class="price">${money(p[2])}</span><button class="add" data-k="${k}" data-i="${i}">Add to cart</button></div></div></article>`).join('')}</div>`;
  $('#modal').classList.add('open'); $('#mclose').focus();
}
const closeCat = () => $('#modal').classList.remove('open');
addEventListener('hashchange', route);

/* cart */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('spidy') || '[]'); } catch (e) {}
const save = () => { try { localStorage.setItem('spidy', JSON.stringify(cart)); } catch (e) {} drawCart(); };
function drawCart() {
  $('#n').textContent = cart.reduce((a, c) => a + c.q, 0);
  $('#lines').innerHTML = cart.length ? cart.map((c, i) => `<div class="ln"><span>${c.name}<br><small>${money(c.p)}</small></span><span><button data-i="${i}" data-d="-1" aria-label="Less">&minus;</button> ${c.q} <button data-i="${i}" data-d="1" aria-label="More">+</button></span></div>`).join('') : '<p class="empty">Nothing here yet. Pick something from a category.</p>';
  $('#total').textContent = 'Total: ' + money(cart.reduce((a, c) => a + c.p * c.q, 0));
}
$('#lines').onclick = e => { const b = e.target.closest('button'); if (!b) return; const c = cart[b.dataset.i]; c.q += +b.dataset.d; if (c.q < 1) cart.splice(b.dataset.i, 1); save(); };
document.addEventListener('click', e => {
  const c = e.target.closest('[data-cat]');
  if (c) { e.preventDefault(); openCat(c.dataset.cat); return; }
  if (e.target.id === 'modal' || e.target.closest('#mclose')) { closeCat(); return; }
  const b = e.target.closest('.add'); if (!b) return;
  const p = CATS[b.dataset.k].items[b.dataset.i], x = cart.find(c => c.name === p[0]);
  x ? x.q++ : cart.push({ name: p[0], p: p[2], q: 1 }); save();
  b.textContent = 'Added'; setTimeout(() => b.textContent = 'Add to cart', 1000);
});
addEventListener('keydown', e => { if (e.key === 'Escape') { closeCat(); $('#drawer').classList.remove('open'); } });
$('#open').onclick = () => $('#drawer').classList.add('open');
$('#close').onclick = () => $('#drawer').classList.remove('open');
$('#send').onclick = () => {
  if (!cart.length) return alert('Add at least one product first.');
  const t = cart.reduce((a, c) => a + c.p * c.q, 0);
  const msg = `Hello Spidy Shop! I want to order:\n` + cart.map(c => `- ${c.name} x${c.q} (${money(c.p * c.q)})`).join('\n') + `\n\nTotal: ${money(t)}\nName: ${$('#nm').value || '-'}\nNotes: ${$('#nt').value || '-'}`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
};

/* live spider-web background that follows the cursor */
(() => {
  const c = $('#web'), x = c.getContext('2d'); let W, H; const m = { x: -999, y: -999 };
  const P = [...Array(55)].map(() => ({ x: Math.random() * 2000, y: Math.random() * 1200, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4 }));
  const fit = () => { W = c.width = innerWidth; H = c.height = innerHeight; }; fit(); addEventListener('resize', fit);
  addEventListener('pointermove', e => { m.x = e.clientX; m.y = e.clientY; });
  const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
  (function f() {
    x.clearRect(0, 0, W, H); x.strokeStyle = '#e11d2e';
    P.forEach(a => {
      if (!still) { a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1; }
      [...P, m].forEach(b => { const d = Math.hypot(a.x - b.x, a.y - b.y), r = b === m ? 200 : 120; if (d < r) { x.globalAlpha = 1 - d / r; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke(); } });
    });
    x.globalAlpha = 1; requestAnimationFrame(f);
  })();
})();

/* dark / light switch (remembers your choice) */
const root = document.documentElement;
function setTheme(t) {
  root.dataset.theme = t; $('#theme').textContent = t === 'dark' ? 'Light mode' : 'Dark mode';
  try { localStorage.setItem('spidyTheme', t); } catch (e) {}
}
let saved = 'dark'; try { saved = localStorage.getItem('spidyTheme') || 'dark'; } catch (e) {}
setTheme(saved);
$('#theme').onclick = () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');

drawCart(); route();
