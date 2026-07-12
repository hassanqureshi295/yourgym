/* =========================================================
   IRONVAULT GYM — interactions
   ========================================================= */

/* ---------- Logo (SVG monogram, injected into every .logo-badge) ---------- */
const LOGO_SVG = `
<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <path id="ivTopCurve" d="M 16,64 A 44,44 0 0 1 104,64" fill="none"/>
    <path id="ivBotCurve" d="M 22,74 A 38,38 0 0 0 98,74" fill="none"/>
  </defs>
  <circle cx="60" cy="60" r="57" fill="#0a0806" stroke="#d9b24c" stroke-width="2"/>
  <circle cx="60" cy="60" r="47" fill="none" stroke="#d9b24c" stroke-width="1"/>
  <text font-family="Bebas Neue, sans-serif" font-size="13.5" letter-spacing="2.5" fill="#d9b24c">
    <textPath href="#ivTopCurve" startOffset="50%" text-anchor="middle">IRONVAULT</textPath>
  </text>
  <text font-family="Bebas Neue, sans-serif" font-size="12" letter-spacing="3" fill="#d9b24c">
    <textPath href="#ivBotCurve" startOffset="50%" text-anchor="middle">GYM</textPath>
  </text>
  <g stroke="#d9b24c" stroke-width="2.4" stroke-linecap="round" fill="none">
    <line x1="38" y1="60" x2="82" y2="60"/>
    <line x1="38" y1="52" x2="38" y2="68"/>
    <line x1="82" y1="52" x2="82" y2="68"/>
    <line x1="30" y1="56" x2="30" y2="64"/>
    <line x1="90" y1="56" x2="90" y2="64"/>
  </g>
</svg>`;

document.querySelectorAll('[data-logo]').forEach(el => el.innerHTML = LOGO_SVG);

/* ---------- Mobile drawer ---------- */
const burger = document.getElementById('burgerBtn');
const drawer = document.getElementById('drawer');
const drawerClose = document.getElementById('drawerClose');
const drawerScrim = document.getElementById('drawerScrim');

function openDrawer(){ drawer.classList.add('open'); drawerScrim.classList.add('show'); }
function closeDrawer(){ drawer.classList.remove('open'); drawerScrim.classList.remove('show'); }

burger?.addEventListener('click', openDrawer);
drawerClose?.addEventListener('click', closeDrawer);
drawerScrim?.addEventListener('click', closeDrawer);
drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

/* ---------- Sticky header shrink on scroll ---------- */
const header = document.getElementById('siteHeader');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 40);
  lastY = y;
}, { passive: true });

/* ---------- Hero play / pause ---------- */
const playToggle = document.getElementById('playToggle');
const heroBg = document.getElementById('heroBg');
const playLabel = document.getElementById('playLabel');
const playIcon = document.getElementById('playIcon');
let playing = true;

playToggle?.addEventListener('click', () => {
  playing = !playing;
  heroBg.classList.toggle('paused', !playing);
  playLabel.textContent = playing ? 'PAUSE' : 'PLAY';
  playIcon.innerHTML = playing
    ? '<path d="M8 5v14l11-7z"/>'
    : '<rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>';
});

/* ---------- Gallery slides ---------- */
const slidesData = [
  { caption: 'Free Weights Deck',  swatch: ['#2a2010', '#0e0c08'] },
  { caption: 'Reception',          swatch: ['#3a2c11', '#1a140b'] },
  { caption: 'Dumbbell Wall',      swatch: ['#221a0d', '#0a0806'] },
  { caption: 'Cardio Terrace',     swatch: ['#332611', '#120e08'] },
  { caption: 'Recovery Suite',     swatch: ['#241c10', '#0d0b07'] },
];

const galleryTrack = document.getElementById('galleryTrack');
slidesData.forEach((s, i) => {
  const el = document.createElement('div');
  el.className = 'slide' + (i % 2 === 1 ? ' small' : '');
  el.innerHTML = `<div class="slide-art" style="background:
      repeating-linear-gradient(120deg, rgba(217,178,76,.10) 0 2px, transparent 2px 34px),
      linear-gradient(160deg, ${s.swatch[0]}, ${s.swatch[1]})"></div>
      <span class="slide-caption">${s.caption}</span>`;
  galleryTrack.appendChild(el);
});

document.getElementById('galNext')?.addEventListener('click', () => {
  galleryTrack.scrollBy({ left: 340, behavior: 'smooth' });
});
document.getElementById('galPrev')?.addEventListener('click', () => {
  galleryTrack.scrollBy({ left: -340, behavior: 'smooth' });
});

/* ---------- Plans mobile carousel ---------- */
const plansTrack = document.getElementById('plansTrack');
document.getElementById('plansNext')?.addEventListener('click', () => {
  plansTrack.scrollBy({ left: plansTrack.clientWidth * 0.85, behavior: 'smooth' });
});
document.getElementById('plansPrev')?.addEventListener('click', () => {
  plansTrack.scrollBy({ left: -plansTrack.clientWidth * 0.85, behavior: 'smooth' });
});
function togglePlansNav(){
  const mobile = window.innerWidth <= 1024;
  document.querySelectorAll('.plans-nav').forEach(b => b.style.display = mobile ? 'flex' : 'none');
  plansTrack.style.overflowX = mobile ? 'auto' : 'visible';
}
togglePlansNav();
window.addEventListener('resize', togglePlansNav);

/* ---------- FAQ accordion ---------- */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ---------- Consent nub ---------- */
const consentNub = document.getElementById('consentNub');
const consentPanel = document.getElementById('consentPanel');
consentNub?.addEventListener('click', () => consentPanel.classList.toggle('show'));
document.getElementById('consentAccept')?.addEventListener('click', () => consentPanel.classList.remove('show'));
document.getElementById('consentDecline')?.addEventListener('click', () => consentPanel.classList.remove('show'));
