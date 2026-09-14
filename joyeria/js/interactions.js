/* ==========================================================================
   INTERACTIONS.JS — custom cursor, mouse parallax, magnetic buttons
   All effects are skipped on touch devices and reduced-motion preference.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (window.NOCTURNE.isTouch) return;
  initCustomCursor();
  if (!window.NOCTURNE.prefersReducedMotion) {
    initHeroParallax();
    initMagneticButtons();
    initProductTilt();
  }
});

/* ---------- Custom Cursor ---------- */
function initCustomCursor() {
  const cursor = document.querySelector('.cursor');
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const label = document.querySelector('.cursor-label');
  if (!cursor) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });

  window.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
  window.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'));

  function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  const hoverTargets = 'a, button, .product-card, [data-cursor]';
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(hoverTargets);
    if (target) {
      cursor.classList.add('is-active');
      label.textContent = target.dataset.cursor || (target.classList.contains('product-card') ? 'Ver' : '');
    }
  });
  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(hoverTargets);
    if (target) {
      cursor.classList.remove('is-active');
      label.textContent = '';
    }
  });
}

/* ---------- Hero mouse parallax + idle float (subtle) ----------
   Runs on a dedicated inner wrapper (.jewel-inner) so it never fights
   with the GSAP scroll-driven scale/y/opacity tween on the outer
   .hero-jewel-stage element — each layer owns its own transform. */
function initHeroParallax() {
  const stage = document.getElementById('jewelStage');
  const inner = document.getElementById('jewelInner');
  const glow = document.getElementById('heroGlow');
  const hero = document.getElementById('hero') || document.querySelector('.hero');
  if (!stage || !inner || !hero) return;

  let targetX = 0, targetY = 0, curX = 0, curY = 0;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    targetX = px * 16;
    targetY = py * 12;
    if (glow) {
      glow.style.transform = `translate(calc(-50% + ${px * 40}px), calc(-50% + ${py * 30}px))`;
    }
  });

  hero.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });

  const start = performance.now();
  function tick(now) {
    curX += (targetX - curX) * 0.06;
    curY += (targetY - curY) * 0.06;
    const t = (now - start) / 1000;
    const bob = Math.sin(t * 0.9) * 7; // gentle idle float, ~7s cycle
    inner.style.transform = `translateY(${bob}px) rotateY(${curX}deg) rotateX(${-curY}deg)`;
    requestAnimationFrame(tick);
  }
  hero.style.perspective = '1000px';
  requestAnimationFrame(tick);
}

/* ---------- Product card 3D tilt on hover ---------- */
function initProductTilt() {
  document.querySelectorAll('.product-media').forEach((media) => {
    const card = media.closest('.product-card');
    let raf = null;

    media.addEventListener('mousemove', (e) => {
      const rect = media.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`;
      });
    });

    media.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      card.style.transform = '';
    });
  });
}

/* ---------- Magnetic buttons ---------- */
function initMagneticButtons() {
  document.querySelectorAll('.btn, .collection-card').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${relX * 0.18}px, ${relY * 0.28}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });
}
