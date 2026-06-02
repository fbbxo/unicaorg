/* ═══════════════════════════════════════════
   ÚNICA ORGANIZAÇÃO — Shared JavaScript
   ═══════════════════════════════════════════ */

// Constante centralizada do WhatsApp
const WHATSAPP_NUMBER = '5563981117530';

// ── CURSOR (apenas em dispositivos com mouse fino) ───────────────────────
const supportsFinePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const cD = document.getElementById('cDot');
const cR = document.getElementById('cRing');
if (cD && cR && supportsFinePointer) {
  document.body.style.cursor = 'none';
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

  const hideCursor = () => { cD.style.opacity = '0'; cR.style.opacity = '0'; };
  const showCursor = () => { cD.style.opacity = '1'; cR.style.opacity = '.7'; };
  document.querySelectorAll('iframe').forEach(iframe => {
    iframe.addEventListener('mouseenter', hideCursor);
    iframe.addEventListener('mouseleave', showCursor);
  });
  window.addEventListener('blur', hideCursor);
  window.addEventListener('focus', showCursor);
} else if (cD && cR) {
  cD.style.display = 'none';
  cR.style.display = 'none';
}

// ── NAV SCROLL ───────────────────────────────
const navEl = document.getElementById('nav');
if (navEl) {
  if (window.innerWidth <= 960) navEl.classList.add('scrolled');
  window.addEventListener('scroll', () => {
    navEl.classList.toggle('scrolled', window.scrollY > 1);
  }, { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 960) navEl.classList.add('scrolled');
  });
}

// ── MOBILE MENU (event listeners ao invés de onclick inline) ─────────────
const mobMenu = document.getElementById('mobMenu');
const toggleMob = () => mobMenu && mobMenu.classList.toggle('open');
const closeMob  = () => mobMenu && mobMenu.classList.remove('open');

// Hamburger (clique + teclado: Enter/Espaço)
document.querySelectorAll('.hamburger').forEach(el => {
  el.addEventListener('click', toggleMob);
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMob(); }
  });
});

// Fechar menu: botão X, qualquer link dentro do menu, ou Esc
document.querySelectorAll('.mob-close').forEach(el => el.addEventListener('click', closeMob));
if (mobMenu) mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMob));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMob(); });

// ── SCROLL REVEAL ────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); revealObs.unobserve(e.target); } });
}, { threshold: .1 });
document.querySelectorAll('.rv, .rvl, .rvr').forEach(el => revealObs.observe(el));

// ── PACOTES — Botão "Quero este pacote" ──────────────────────────────────
// Cada card tem data-pacote="<nome do pacote>". Ao clicar, abre o WhatsApp
// com uma mensagem pré-preenchida identificando o pacote de interesse.
document.querySelectorAll('[data-pacote]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const nome = btn.dataset.pacote;
    const msg = `Olá! Vim pelo site da Única Organização.\n\nTenho interesse no pacote *${nome}* e gostaria de saber mais detalhes (disponibilidade, agendamento e o que precisa para começar).`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
});

// ── CURSOS — Botão "Compre aqui" / "Garanta sua vaga" ────────────────────
// Cada botão tem href="#" (placeholder) ou href="https://..." (link real).
// Quando href ainda é "#" ou vazio, abre o WhatsApp identificando o curso.
// Quando o usuário trocar para uma URL real (Hotmart, Eduzz, etc), o link
// passa a abrir aquele destino diretamente — basta editar o atributo href.
document.querySelectorAll('[data-curso]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const href = btn.getAttribute('href');
    // Se href está vazio ou ainda é o placeholder "#", intercepta e abre WhatsApp
    if (!href || href === '#' || href.trim() === '') {
      e.preventDefault();
      const nome = btn.dataset.curso;
      const msg = `Olá! Vim pelo site da Única Organização.\n\nTenho interesse no curso *${nome}* e gostaria de saber mais detalhes (próxima turma, formas de pagamento e como me inscrever).`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    // Caso contrário (href com URL real), deixa o navegador seguir o link normalmente
  });
});

// ── DEPOIMENTOS — SETAS (via data-scroll-dep) ────────────────────────────
const depTrack = document.getElementById('depTrack');
document.querySelectorAll('[data-scroll-dep]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!depTrack) return;
    const dir = parseInt(btn.dataset.scrollDep, 10) || 1;
    depTrack.scrollBy({ left: dir * 480, behavior: 'smooth' });
  });
});

// Drag-to-scroll dos depoimentos
if (depTrack) {
  let isDown = false, startX, scrollLeft;

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
    depTrack.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
}

// ── MÁSCARA DE TELEFONE BR ───────────────────────────────────────────────
// Formato: (XX) X XXXX-XXXX (celular) ou (XX) XXXX-XXXX (fixo)
function maskBrazilianPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2)  return `(${digits}`;
  if (digits.length <= 6)  return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  // 11 dígitos = celular com 9 na frente
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
}
document.querySelectorAll('input[type="tel"]').forEach(input => {
  input.addEventListener('input', e => {
    const cursorAtEnd = e.target.selectionStart === e.target.value.length;
    e.target.value = maskBrazilianPhone(e.target.value);
    if (cursorAtEnd) e.target.setSelectionRange(e.target.value.length, e.target.value.length);
  });
});

// ── CONTACT FORM (Web3Forms) ─────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const statusEl = document.getElementById('formStatus');
  // Botão do submit de e-mail é especificamente o type="submit"; o do WhatsApp é type="button"
  const btn = contactForm.querySelector('button[type="submit"]');
  const btnOriginalHTML = btn ? btn.innerHTML : '';

  const setStatus = (msg, kind) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.display = 'block';
    statusEl.style.color = kind === 'error' ? '#c0392b' : (kind === 'success' ? '#5A6B48' : '');
  };

  // ── Coleta os dados do form em um objeto plano ───────────────────────
  const collectFormData = () => {
    const data = {};
    contactForm.querySelectorAll('input, select, textarea').forEach(el => {
      if (!el.name || el.type === 'hidden' || el.type === 'checkbox') return;
      data[el.name] = (el.value || '').trim();
    });
    return data;
  };

  // ── Monta a mensagem do WhatsApp a partir do form ────────────────────
  // Usa apenas campos preenchidos para não enviar linhas vazias.
  const buildWhatsAppMessage = (data) => {
    const lines = ['Olá! Vim pelo site da Única Organização.', ''];
    if (data.nome)      lines.push(`*Nome:* ${data.nome}`);
    if (data.email)     lines.push(`*E-mail:* ${data.email}`);
    if (data.whatsapp)  lines.push(`*WhatsApp:* ${data.whatsapp}`);
    if (data.interesse) lines.push(`*Interesse:* ${data.interesse}`);
    if (data.mensagem) {
      lines.push('');
      lines.push(`*Mensagem:*`);
      lines.push(data.mensagem);
    }
    return lines.join('\n');
  };

  // ── Validação mínima para o envio via WhatsApp ───────────────────────
  // E-mail e nome são marcados como required no form; só o select de
  // interesse também é importante. WhatsApp dispensa o e-mail formal.
  const validateForWhatsApp = () => {
    const required = [
      { el: contactForm.querySelector('#nome'),      label: 'nome' },
      { el: contactForm.querySelector('#interesse'), label: 'interesse' }
    ];
    for (const { el, label } of required) {
      if (el && !el.value.trim()) {
        el.focus();
        setStatus(`Por favor, preencha o campo "${label}" antes de enviar pelo WhatsApp.`, 'error');
        return false;
      }
    }
    return true;
  };

  // ── HANDLER: Botão WhatsApp ──────────────────────────────────────────
  const waBtn = document.getElementById('sendWhatsApp');
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      if (!validateForWhatsApp()) return;

      const data = collectFormData();
      const msg = buildWhatsAppMessage(data);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

      // Abre em nova aba/janela. No mobile, o sistema redireciona pro app
      // do WhatsApp; no desktop, abre web.whatsapp.com.
      window.open(url, '_blank', 'noopener,noreferrer');
      setStatus('Abrindo o WhatsApp com sua mensagem pronta...', 'success');
    });
  }

  // ── HANDLER: Submit por e-mail (Web3Forms) ───────────────────────────
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const honey = contactForm.querySelector('input[name="botcheck"]');
    if (honey && honey.checked) return;

    const accessKey = contactForm.querySelector('input[name="access_key"]');
    if (!accessKey || accessKey.value.startsWith('COLE-')) {
      setStatus('⚠️ E-mail ainda não configurado. Por enquanto, use o botão "Enviar pelo WhatsApp" ao lado, ou configure a access_key do Web3Forms em contato.html.', 'error');
      return;
    }

    if (!contactForm.reportValidity()) return;

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = 'Enviando...';
    }
    setStatus('Enviando sua mensagem...', 'info');

    try {
      const formData = new FormData(contactForm);
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        contactForm.reset();
        if (btn) {
          btn.innerHTML = 'Mensagem enviada! ✓';
          btn.style.background = '#5A6B48';
        }
        setStatus('Obrigada pelo contato! Em breve a Luana retorna sua mensagem.', 'success');
      } else {
        throw new Error(data.message || 'Falha no envio');
      }
    } catch (err) {
      setStatus('Não foi possível enviar agora. Tente novamente ou use o WhatsApp ao lado.', 'error');
      if (btn) btn.innerHTML = 'Tentar novamente';
    } finally {
      setTimeout(() => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = btnOriginalHTML;
          btn.style.background = '';
        }
      }, 4000);
    }
  });
}
