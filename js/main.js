/* ==========================================================================
   MAIN.JS — bootstrap: Lenis smooth scroll, intro sequence, nav scroll state
   ========================================================================== */

const NOCTURNE = (window.NOCTURNE = window.NOCTURNE || {});
NOCTURNE.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
NOCTURNE.isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
NOCTURNE.isSmallScreen = window.innerWidth < 768;

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.remove('no-js');
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

  initLenis();
  initNavScrollState();
  runIntro();
});

/* ---------- Lenis smooth scroll ---------- */
function initLenis() {
  if (NOCTURNE.prefersReducedMotion || typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
    touchMultiplier: 1.2,
  });
  NOCTURNE.lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  if (window.gsap && window.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -80 });
        }
      }
    });
  });
}

/* ---------- Nav background on scroll ---------- */
function initNavScrollState() {
  const nav = document.getElementById('siteNav');
  if (!nav) return;
  const toggle = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
}

/* ---------- Cinematic intro sequence ----------
   Plays once per browser session. Coming back to Inicio later (via the nav)
   skips straight to finish() so only the lightweight page-transition loader
   from transitions.js is seen — the full 7-phase cinematic is a first-visit
   moment, not something replayed on every trip back to the homepage. */
function runIntro() {
  const intro = document.getElementById('intro');
  if (!intro) return;

  const finish = () => {
    intro.classList.add('is-done');
    intro.setAttribute('aria-hidden', 'true');
    intro.style.display = 'none';
    document.body.style.overflow = '';
    NOCTURNE.markIntroSeen?.();
    document.dispatchEvent(new CustomEvent('nocturne:introDone'));
  };

  if (NOCTURNE.hasSeenIntro?.()) {
    finish();
    return;
  }

  document.body.style.overflow = 'hidden';

  if (NOCTURNE.prefersReducedMotion || typeof gsap === 'undefined') {
    finish();
    return;
  }

  const spark = intro.querySelector('.intro-spark');
  const jewel = intro.querySelector('.intro-jewel');
  const word = intro.querySelector('.intro-word');
  const progress = intro.querySelector('.intro-progress');
  const progressBar = progress.querySelector('span');

  const tl = gsap.timeline({ onComplete: finish, defaults: { ease: 'power2.out' } });

  tl.set(spark, { x: 0, y: -40, opacity: 0 })
    // FASE 1-2: negro -> pequeña iluminación dorada
    .to(spark, { opacity: 1, duration: 0.9, ease: 'power1.in' }, 0.2)
    .to(spark, { scale: 6, duration: 1.1, ease: 'power1.out' }, '>-0.1')
    // FASE 3: se revela la joya
    .to(jewel, { opacity: 1, scale: 1, duration: 1.3, ease: 'power3.out' }, '<0.1')
    .to(spark, { opacity: 0, duration: 0.6 }, '<0.2')
    // FASE 4: acercamiento sutil (scale up)
    .to(jewel, { scale: 1.12, duration: 1.4, ease: 'sine.inOut' }, '>-0.2')
    // FASE 5: nombre de la marca
    .to(word, { opacity: 1, duration: 1, ease: 'power2.out' }, '<0.3')
    // FASE 6: progreso / mensaje corto
    .to(progress, { opacity: 1, duration: 0.4 }, '<0.2')
    .to(progressBar, { width: '100%', duration: 1.1, ease: 'power1.inOut' }, '<')
    // FASE 7: fade out -> nav & hero
    .to([jewel, word, progress], { opacity: 0, duration: 0.6, ease: 'power1.in' }, '+=0.3')
    .to(intro, { autoAlpha: 0, duration: 0.8, ease: 'power2.inOut' }, '<0.1');

  // Safety timeout in case something stalls
  setTimeout(() => { if (!intro.classList.contains('is-done')) finish(); }, 9000);
}
