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
  <circle cx="60" cy="60" r="57" fill="#0a0806" stroke="#ffd400" stroke-width="2"/>
  <circle cx="60" cy="60" r="47" fill="none" stroke="#ffd400" stroke-width="1"/>
  <text font-family="Anton, sans-serif" font-size="13.5" letter-spacing="2.5" fill="#ffd400">
    <textPath href="#ivTopCurve" startOffset="50%" text-anchor="middle">IRONVAULT</textPath>
  </text>
  <text font-family="Anton, sans-serif" font-size="12" letter-spacing="3" fill="#ffd400">
    <textPath href="#ivBotCurve" startOffset="50%" text-anchor="middle">GYM</textPath>
  </text>
  <g stroke="#ffd400" stroke-width="2.4" stroke-linecap="round" fill="none">
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
const heroVideo = document.getElementById('heroVideo');
const playLabel = document.getElementById('playLabel');
const playIcon = document.getElementById('playIcon');
let playing = true;

playToggle?.addEventListener('click', () => {
  playing = !playing;
  if (heroVideo) { playing ? heroVideo.play().catch(()=>{}) : heroVideo.pause(); }
  playLabel.textContent = playing ? 'PAUSE' : 'PLAY';
  playIcon.innerHTML = playing
    ? '<path d="M8 5v14l11-7z"/>'
    : '<rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>';
});

// Safety net: some browsers pause background video on tab-switch, buffering
// hiccups, or autoplay re-checks. If the user hasn't explicitly hit pause
// (playing is still true), silently resume so the loop never visibly stalls.
if (heroVideo) {
  heroVideo.addEventListener('pause', () => {
    if (playing) heroVideo.play().catch(() => {});
  });
  // Manual loop fallback in case the native `loop` attribute doesn't fire
  // (e.g. certain codecs/older WebViews) — jump back to the start and continue.
  heroVideo.addEventListener('ended', () => {
    heroVideo.currentTime = 0;
    if (playing) heroVideo.play().catch(() => {});
  });
  // Resume automatically when the tab/window regains visibility or focus.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && playing && heroVideo.paused) heroVideo.play().catch(() => {});
  });
}

/* ---------- Gallery slides ---------- */
/* Swap the "img" path below for your own .png/.jpg files, e.g. 'images/gallery-1.png' */
const slidesData = [
  { caption: 'Free Weights Deck',  img: 'https://picsum.photos/seed/ironvault-gal1/900/700' },
  { caption: 'Reception',          img: 'https://picsum.photos/seed/ironvault-gal2/900/700' },
  { caption: 'Dumbbell Wall',      img: 'https://picsum.photos/seed/ironvault-gal3/900/700' },
  { caption: 'Cardio Terrace',     img: 'https://picsum.photos/seed/ironvault-gal4/900/700' },
  { caption: 'Recovery Suite',     img: 'https://picsum.photos/seed/ironvault-gal5/900/700' },
];

const galleryTrack = document.getElementById('galleryTrack');
slidesData.forEach((s, i) => {
  const el = document.createElement('div');
  el.className = 'slide' + (i % 2 === 1 ? ' small' : '');
  el.innerHTML = `<div class="slide-art" style="background-image:url('${s.img}')"></div>
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

/* ---------- Amenity cards: tap-to-flip on touch devices ---------- */
const noHover = window.matchMedia('(hover: none)').matches;
if (noHover) {
  document.querySelectorAll('.amenities .a-cell:not(.a-cell--headline)').forEach(cell => {
    cell.addEventListener('click', () => {
      const wasOpen = cell.classList.contains('flipped');
      document.querySelectorAll('.amenities .a-cell.flipped').forEach(c => c.classList.remove('flipped'));
      if (!wasOpen) cell.classList.add('flipped');
    });
  });
}

/* ---------- FAQ accordion ---------- */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ---------- Hours dropdown ---------- */
const hoursBtn = document.getElementById('hoursBtn');
const hoursPanel = document.getElementById('hoursPanel');
hoursBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  hoursPanel.classList.toggle('show');
});
document.addEventListener('click', (e) => {
  if (hoursPanel && !hoursPanel.contains(e.target) && e.target !== hoursBtn) {
    hoursPanel.classList.remove('show');
  }
});

/* ---------- Consent nub ---------- */
const consentNub = document.getElementById('consentNub');
const consentPanel = document.getElementById('consentPanel');
consentNub?.addEventListener('click', () => consentPanel.classList.toggle('show'));
document.getElementById('consentAccept')?.addEventListener('click', () => consentPanel.classList.remove('show'));
document.getElementById('consentDecline')?.addEventListener('click', () => consentPanel.classList.remove('show'));

/* ---------- TOOLS nav dropdown ---------- */
const toolsDropdown = document.getElementById('toolsDropdown');
const toolsTrigger = document.getElementById('toolsTrigger');
toolsTrigger?.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = toolsDropdown.classList.toggle('open');
  toolsTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});
document.addEventListener('click', (e) => {
  if (toolsDropdown && !toolsDropdown.contains(e.target)) {
    toolsDropdown.classList.remove('open');
    toolsTrigger?.setAttribute('aria-expanded', 'false');
  }
});

/* ---------- Tool modals: open / close ---------- */
const toolOverlay = document.getElementById('toolOverlay');
const toolModals = { bmi: document.getElementById('bmiModal'), calorie: document.getElementById('calorieModal') };

function openTool(name){
  if (!toolOverlay || !toolModals[name]) return;
  Object.values(toolModals).forEach(m => m.classList.remove('active'));
  toolModals[name].classList.add('active');
  toolOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  toolsDropdown?.classList.remove('open');
  closeDrawer();
}
function closeTool(){
  toolOverlay?.classList.remove('show');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-tool]').forEach(btn => {
  btn.addEventListener('click', () => openTool(btn.getAttribute('data-tool')));
});
toolOverlay?.addEventListener('click', (e) => { if (e.target === toolOverlay) closeTool(); });
document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', closeTool));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeTool(); });

/* ---------- Unit toggles (metric / imperial) shared by both calculators ---------- */
document.querySelectorAll('[data-unit-toggle]').forEach(toggle => {
  const key = toggle.getAttribute('data-unit-toggle');
  toggle.querySelectorAll('.unit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const unit = btn.getAttribute('data-unit');
      toggle.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelector(`[data-fields="${key}-metric"]`).style.display = unit === 'metric' ? 'grid' : 'none';
      document.querySelector(`[data-fields="${key}-imperial"]`).style.display = unit === 'imperial' ? 'grid' : 'none';
    });
  });
});

/* ---------- BMI calculator ---------- */
const bmiCalcBtn = document.getElementById('bmiCalcBtn');
bmiCalcBtn?.addEventListener('click', () => {
  const errorEl = document.getElementById('bmiError');
  const metricActive = document.querySelector('[data-unit-toggle="bmi"] .unit-btn.active').getAttribute('data-unit') === 'metric';
  let weightKg, heightM;

  if (metricActive) {
    weightKg = parseFloat(document.getElementById('bmiWeightKg').value);
    const cm = parseFloat(document.getElementById('bmiHeightCm').value);
    heightM = cm / 100;
  } else {
    const lb = parseFloat(document.getElementById('bmiWeightLb').value);
    const inches = parseFloat(document.getElementById('bmiHeightIn').value);
    weightKg = lb * 0.453592;
    heightM = (inches * 2.54) / 100;
  }

  if (!weightKg || !heightM || weightKg <= 0 || heightM <= 0) {
    errorEl.textContent = 'Please enter valid weight and height.';
    document.getElementById('bmiResult').classList.remove('show');
    return;
  }
  errorEl.textContent = '';

  const bmi = weightKg / (heightM * heightM);
  const bmiRounded = Math.round(bmi * 10) / 10;

  let category, pillClass, note;
  if (bmi < 18.5) {
    category = 'Underweight'; pillClass = 'bmi-pill--under';
    note = 'You\'re a little below the typical healthy range (18.5–24.9). A coach can help you build size safely.';
  } else if (bmi < 25) {
    category = 'Normal weight'; pillClass = 'bmi-pill--normal';
    note = 'You\'re within the typical healthy range of 18.5–24.9 for most adults.';
  } else if (bmi < 30) {
    category = 'Overweight'; pillClass = 'bmi-pill--over';
    note = 'You\'re just above the typical healthy range (18.5–24.9). A structured program can bring this down steadily.';
  } else {
    category = 'Obese'; pillClass = 'bmi-pill--obese';
    note = 'You\'re well above the typical healthy range (18.5–24.9). Our coaches can build you a safe, sustainable plan.';
  }

  document.getElementById('bmiValue').textContent = bmiRounded.toFixed(1);
  const categoryEl = document.getElementById('bmiCategory');
  categoryEl.textContent = category;
  categoryEl.className = 'bmi-pill ' + pillClass;
  document.getElementById('bmiNote').textContent = note;

  // map bmi (15–40 visual range) onto the 0–100% scale bar
  const pct = Math.max(0, Math.min(100, ((bmi - 15) / (40 - 15)) * 100));
  document.getElementById('bmiMarker').style.left = pct + '%';

  document.getElementById('bmiResult').classList.add('show');
});

/* ---------- Calorie calculator (Mifflin-St Jeor) ---------- */
const calCalcBtn = document.getElementById('calCalcBtn');
calCalcBtn?.addEventListener('click', () => {
  const errorEl = document.getElementById('calError');
  const metricActive = document.querySelector('[data-unit-toggle="calorie"] .unit-btn.active').getAttribute('data-unit') === 'metric';
  let weightKg, heightCm;

  if (metricActive) {
    weightKg = parseFloat(document.getElementById('calWeightKg').value);
    heightCm = parseFloat(document.getElementById('calHeightCm').value);
  } else {
    const lb = parseFloat(document.getElementById('calWeightLb').value);
    const inches = parseFloat(document.getElementById('calHeightIn').value);
    weightKg = lb * 0.453592;
    heightCm = inches * 2.54;
  }

  const age = parseInt(document.getElementById('calAge').value, 10);
  const sex = document.getElementById('calSex').value;
  const activity = parseFloat(document.getElementById('calActivity').value);

  if (!weightKg || !heightCm || !age || weightKg <= 0 || heightCm <= 0 || age <= 0) {
    errorEl.textContent = 'Please fill in weight, height, and age.';
    document.getElementById('calResult').classList.remove('show');
    return;
  }
  errorEl.textContent = '';

  const bmr = sex === 'male'
    ? (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5
    : (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;

  const maintenance = bmr * activity;

  document.getElementById('calBmr').textContent = Math.round(bmr).toLocaleString();
  document.getElementById('calMaint').textContent = Math.round(maintenance).toLocaleString();
  document.getElementById('calCut').textContent = Math.round(maintenance - 500).toLocaleString();
  document.getElementById('calBulk').textContent = Math.round(maintenance + 300).toLocaleString();

  document.getElementById('calResult').classList.add('show');
});

/* ---------- Before / After drag slider ---------- */
const baSlider = document.getElementById('baSlider');
const baHandle = document.getElementById('baHandle');

if (baSlider && baHandle) {
  let dragging = false;

  function setPos(clientX){
    const rect = baSlider.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    baSlider.style.setProperty('--pos', pct + '%');
    baHandle.setAttribute('aria-valuenow', Math.round(pct));
  }

  function onDown(e){
    dragging = true;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setPos(x);
  }
  function onMove(e){
    if (!dragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setPos(x);
    e.preventDefault();
  }
  function onUp(){ dragging = false; }

  baSlider.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);

  // keyboard accessibility
  baHandle.addEventListener('keydown', (e) => {
    const current = parseFloat(baSlider.style.getPropertyValue('--pos')) || 50;
    if (e.key === 'ArrowLeft') { baSlider.style.setProperty('--pos', Math.max(0, current - 5) + '%'); }
    if (e.key === 'ArrowRight') { baSlider.style.setProperty('--pos', Math.min(100, current + 5) + '%'); }
  });
}

