/* ═══════════════════════════════════════════
   ÚNICA ORGANIZAÇÃO — Shared JavaScript
   ═══════════════════════════════════════════ */

// ── CURSOR ───────────────────────────────────
const cD = document.getElementById('cDot');
const cR = document.getElementById('cRing');
if (cD && cR) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cD.style.transform = `translate(${mx}px,${my}px)`;
  });
  (function aC() {
    rx += (mx - rx) * .12; ry += (my - ry) * .12;
    cR.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(aC);
  })();
  document.querySelectorAll('a,button,.serv-card,.dica-card,.tip-card,.dep-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cR.style.width = '60px'; cR.style.height = '60px'; cR.style.opacity = '.25'; });
    el.addEventListener('mouseleave', () => { cR.style.width = '38px'; cR.style.height = '38px'; cR.style.opacity = '.7'; });
  });

  // Esconde cursor ao entrar em iframes (ex: mapa), mostra ao sair
  function hideCursor() { cD.style.opacity = '0'; cR.style.opacity = '0'; }
  function showCursor() { cD.style.opacity = '1'; cR.style.opacity = '.7'; }
  document.querySelectorAll('iframe').forEach(iframe => {
    iframe.addEventListener('mouseenter', hideCursor);
    iframe.addEventListener('mouseleave', showCursor);
  });
  // Garante que volta ao sair do iframe pela borda (blur do documento)
  window.addEventListener('blur', hideCursor);
  window.addEventListener('focus', showCursor);
}

// ── NAV SCROLL ───────────────────────────────
const navEl = document.getElementById('nav');
if (navEl) {
  // No mobile, adiciona .scrolled imediatamente (nav sempre sólida)
  if (window.innerWidth <= 960) {
    navEl.classList.add('scrolled');
  }
  window.addEventListener('scroll', () => {
    navEl.classList.toggle('scrolled', window.scrollY > 1);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 960) navEl.classList.add('scrolled');
  });
}

// ── MOBILE MENU ──────────────────────────────
function toggleMob() {
  document.getElementById('mobMenu').classList.toggle('open');
}
function closeMob() {
  document.getElementById('mobMenu').classList.remove('open');
}

// ── SCROLL REVEAL ────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
}, { threshold: .1 });
document.querySelectorAll('.rv, .rvl, .rvr').forEach(el => revealObs.observe(el));

// ── CONTACT FORM ─────────────────────────────
function enviar(e) {
  e.preventDefault();
  const b = e.target.querySelector('.btn-form');
  b.innerHTML = 'Mensagem enviada! ✓';
  b.style.background = '#5A6B48';
  setTimeout(() => {
    b.innerHTML = 'Enviar mensagem <span class="arr">→</span>';
    b.style.background = '';
  }, 3500);
  return false;
}

// ── DEPOIMENTOS SCROLL ───────────────────────
function scrollDep(dir) {
  const t = document.getElementById('depTrack');
  if (t) t.scrollBy({ left: dir * 480, behavior: 'smooth' });
}

// Drag to scroll para depoimentos
const depTrack = document.getElementById('depTrack');
if (depTrack) {
  let isDown = false;
  let startX;
  let scrollLeft;

  depTrack.addEventListener('mousedown', (e) => {
    isDown = true;
    depTrack.style.cursor = 'grabbing';
    depTrack.style.userSelect = 'none';
    startX = e.pageX - depTrack.offsetLeft;
    scrollLeft = depTrack.scrollLeft;
    depTrack.style.scrollSnapType = 'none';
  });
  
  const stopDrag = () => {
    isDown = false;
    depTrack.style.cursor = '';
    depTrack.style.userSelect = '';
    depTrack.style.scrollSnapType = '';
  };

  depTrack.addEventListener('mouseleave', stopDrag);
  depTrack.addEventListener('mouseup', stopDrag);
  
  depTrack.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - depTrack.offsetLeft;
    const walk = (x - startX) * 1.5;
    depTrack.scrollLeft = scrollLeft - walk;
  });
}