/* ═══════════════════════════════════════════
   ÚNICA ORGANIZAÇÃO — Hero Animation (Canvas 2D)
   Substitui Three.js r128 (~600KB) por ~3KB.
   Reproduz o mesmo conceito: formas geométricas
   flutuantes com parallax do mouse, adaptado para
   light/dark mode.
   ═══════════════════════════════════════════ */

(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Respeita preferência de redução de movimento
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const isLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

  // Paleta — replica as cores do Three.js original
  // Cada shape: { sides (0=círculo), color, opacity, wire, r=raio, x/y=posição relativa, z=profundidade }
  const palette = isLight ? {
    shapes: [
      { sides: 0,  color: '#f0f4f1', opacity: 0.20, wire: false, r: 90,  x: 0.75, y: 0.35, z: 0.7 },
      { sides: 4,  color: '#f7de8e', opacity: 0.32, wire: true,  r: 75,  x: 0.15, y: 0.42, z: 0.5 },
      { sides: 12, color: '#ffffff', opacity: 0.15, wire: false, r: 60,  x: 0.68, y: 0.70, z: 0.8 },
      { sides: 3,  color: '#f7de8e', opacity: 0.25, wire: true,  r: 55,  x: 0.28, y: 0.78, z: 0.6 },
      { sides: 0,  color: '#3b493f', opacity: 0.08, wire: true,  r: 130, x: 0.85, y: 0.18, z: 0.3 },
      { sides: 4,  color: '#f0f4f1', opacity: 0.22, wire: false, r: 40,  x: 0.50, y: 0.28, z: 0.9 }
    ],
    particle: 'rgba(255,255,255,0.30)'
  } : {
    shapes: [
      { sides: 0,  color: '#76927d', opacity: 0.22, wire: false, r: 90,  x: 0.75, y: 0.35, z: 0.7 },
      { sides: 4,  color: '#f7de8e', opacity: 0.28, wire: true,  r: 75,  x: 0.15, y: 0.42, z: 0.5 },
      { sides: 12, color: '#94aa98', opacity: 0.18, wire: false, r: 60,  x: 0.68, y: 0.70, z: 0.8 },
      { sides: 3,  color: '#f7de8e', opacity: 0.22, wire: true,  r: 55,  x: 0.28, y: 0.78, z: 0.6 },
      { sides: 0,  color: '#4d6655', opacity: 0.16, wire: true,  r: 130, x: 0.85, y: 0.18, z: 0.3 },
      { sides: 4,  color: '#94aa98', opacity: 0.25, wire: false, r: 40,  x: 0.50, y: 0.28, z: 0.9 }
    ],
    particle: 'rgba(247,222,142,0.35)'
  };

  // State interno: rotação e fase de bobbing aleatórias
  const shapes = palette.shapes.map(s => ({
    ...s,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.006,
    bobPhase: Math.random() * Math.PI * 2,
    bobSpeed: 0.25 + Math.random() * 0.35
  }));

  // Partículas — 200 pontos (era 300 no Three.js, reduzido pra perf no Canvas 2D)
  const particles = Array.from({ length: 200 }, () => ({
    x: Math.random(),
    y: Math.random(),
    z: 0.2 + Math.random() * 0.8
  }));

  let W = 0, H = 0;
  function resize() {
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // Mouse parallax (com suavização)
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  document.addEventListener('mousemove', e => {
    tmx = (e.clientX / window.innerWidth  - 0.5) * 2;
    tmy = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function drawShape(cx, cy, r, sides, rotation, color, opacity, wire) {
    ctx.beginPath();
    if (sides === 0) {
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
    } else {
      for (let i = 0; i < sides; i++) {
        const a = rotation + (i * Math.PI * 2 / sides);
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }
    ctx.globalAlpha = opacity;
    if (wire) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else {
      ctx.fillStyle = color;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // Ordena uma vez (z não muda) para render trás → frente
  shapes.sort((a, b) => a.z - b.z);

  let t = 0;
  let lastFrame = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    // Throttle leve: ~60fps mas tolerante a frames perdidos
    const dt = now - lastFrame;
    if (dt < 14) return;
    lastFrame = now;

    t += 0.016;
    mx += (tmx - mx) * 0.04;
    my += (tmy - my) * 0.04;

    ctx.clearRect(0, 0, W, H);

    // Partículas (fundo)
    ctx.fillStyle = palette.particle;
    for (const p of particles) {
      const px = p.x * W + mx * 30 * p.z;
      const py = p.y * H + my * 20 * p.z;
      ctx.beginPath();
      ctx.arc(px, py, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shapes (frente)
    for (const s of shapes) {
      s.rot += s.rotSpeed;
      const bob = Math.sin(t * s.bobSpeed + s.bobPhase) * 6;
      const cx = s.x * W + mx * 60 * s.z;
      const cy = s.y * H + my * 40 * s.z + bob;
      drawShape(cx, cy, s.r, s.sides, s.rot, s.color, s.opacity, s.wire);
    }
  }
  requestAnimationFrame(frame);
})();
