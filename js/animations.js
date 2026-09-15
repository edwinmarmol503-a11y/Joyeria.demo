/* ESTILO'S SALÓN — Cinematic intro, logo depth illusion, scroll reveals */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';

  /* ---------------------------------------------------
     1. INTRO — CINEMATOGRAPHIC LOGO REVEAL
  --------------------------------------------------- */
  const intro = document.getElementById('intro');
  const skipBtn = document.getElementById('skipIntro');
  const navbar = document.getElementById('navbar');

  let introTl = null;

  function revealMainContent() {
    if (navbar) {
      navbar.style.opacity = '1';
      navbar.style.transform = 'none';
    }
    document.querySelectorAll('.reveal-up').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  function endIntro() {
    if (!intro || intro.dataset.done === '1') return;
    intro.dataset.done = '1';
    document.body.classList.remove('no-scroll');
    intro.classList.add('is-leaving');
    revealMainContent();

    if (hasGSAP) {
      gsap.to(intro, {
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        onComplete: () => intro.remove(),
      });
    } else {
      intro.style.transition = 'opacity .6s ease';
      intro.style.opacity = '0';
      setTimeout(() => intro.remove(), 650);
    }
  }

  function playIntro() {
    document.body.classList.add('no-scroll');

    if (reduceMotion || !hasGSAP) {
      // Skip straight to content for reduced-motion / no-GSAP fallback
      if (navbar) { navbar.style.opacity = '1'; navbar.style.transform = 'none'; }
      document.querySelectorAll('.reveal-up').forEach((el) => (el.style.opacity = '1'));
      endIntro();
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    introTl = tl;

    tl.set('.intro-ambient', { opacity: 0 })
      .set('.logo-3d__symbol', { opacity: 0, y: 14, filter: 'drop-shadow(0 0 0 rgba(0,175,255,0))' })
      .set('.wm-word', { opacity: 0, y: 14 })
      .set('.logo-3d__halo', { opacity: 0, scale: 0.7 })
      .set('.logo-3d__rule', { width: 0 })
      .set('.intro-tagline', { opacity: 0, y: 10 })
      .set('.intro-skip', { opacity: 0 })

      // FASE 1-2: ambient blue light rises out of black
      .to('.intro-ambient', { opacity: 1, duration: 2.0 }, 0.3)
      .to('.logo-3d__halo', { opacity: 1, scale: 1, duration: 2.0, ease: 'power1.out' }, 0.5)

      // FASE 3: symbol reveals
      .to('.logo-3d__symbol', {
        opacity: 1,
        y: 0,
        filter: 'drop-shadow(0 0 18px rgba(0,175,255,0.55))',
        duration: 1.3,
        ease: 'power3.out',
      }, 1.1)

      // sweep of light across the symbol
      .fromTo('.logo-3d__sweep', { left: '-60%' }, { left: '140%', duration: 1.1, ease: 'power2.inOut' }, 1.9)

      // FASE 4: wordmark letters
      .to('.wm-word', { opacity: 1, y: 0, duration: 0.9, stagger: 0.18, ease: 'power3.out' }, 2.0)

      // FASE 5-6: depth + rule light sweep
      .to('.logo-3d__rule', { width: 140, duration: 0.9, ease: 'power2.out' }, 2.5)

      // FASE 8: tagline
      .to('.intro-tagline', { opacity: 1, y: 0, duration: 1.0 }, 3.1)
      .to('.intro-skip', { opacity: 1, duration: 0.6 }, 3.1)

      // hold moment — logo floating
      .to({}, { duration: 0.9 })

      // FASE 9-10: interface appears, intro logo hands off to navbar
      .add(() => {
        if (navbar) {
          gsap.to(navbar, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' });
        }
      }, '+=0')
      .to('.intro-stage', { y: -20, opacity: 0, duration: 0.8, ease: 'power2.in' }, '+=0.2')
      .add(endIntro, '-=0.2')
      .add(() => {
        gsap.to('.reveal-up', {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.08,
          ease: 'power3.out',
        });
      }, '-=0.5');
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      if (introTl) introTl.kill();
      endIntro();
    });
  }
  // Safety net: never trap the user in the intro
  window.addEventListener('load', () => setTimeout(() => {
    if (intro && intro.dataset.done !== '1') {
      if (introTl) introTl.kill();
      endIntro();
    }
  }, 9000));

  playIntro();

  /* ---------------------------------------------------
     2. LOGO 3D DEPTH — mouse-reactive tilt (desktop only)
  --------------------------------------------------- */
  const logo3d = document.getElementById('introLogo');
  if (logo3d && !isCoarsePointer && !reduceMotion) {
    let rafId = null;
    let targetX = 0, targetY = 0, curX = 0, curY = 0;

    document.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetX = nx * 6;   // rotateY range
      targetY = -ny * 5;  // rotateX range
      if (!rafId) rafId = requestAnimationFrame(tick);
    });

    function tick() {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      logo3d.style.transform = `rotateY(${curX}deg) rotateX(${curY}deg)`;
      if (Math.abs(targetX - curX) > 0.01 || Math.abs(targetY - curY) > 0.01) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    }
  }

  /* ---------------------------------------------------
     3. AMBIENT PARTICLES (hero) — minimal, elegant
  --------------------------------------------------- */
  const particleField = document.getElementById('heroParticles');
  if (particleField && !reduceMotion) {
    const count = isCoarsePointer ? 10 : 22;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'hero__particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animation = `particleDrift ${6 + Math.random() * 6}s ease-in-out infinite`;
      p.style.animationDelay = (Math.random() * 5) + 's';
      particleField.appendChild(p);
    }
  }

  /* ---------------------------------------------------
     4. SCROLL REVEALS — GSAP ScrollTrigger
  --------------------------------------------------- */
  if (hasGSAP && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.hero .reveal-up').forEach((el) => {
      gsap.set(el, { y: 22 });
    });

    const scrollGroups = document.querySelectorAll(
      '.about, .services, .gallery, .branches, .contact, .footer'
    );

    scrollGroups.forEach((section) => {
      const targets = section.querySelectorAll('.reveal-up');
      if (!targets.length) return;
      gsap.set(targets, { y: 26 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          once: true,
        },
      });
    });

    // Service cards + branches + gallery items pop in with slight delay
    ['.service', '.branch', '.gallery__item'].forEach((sel) => {
      const els = document.querySelectorAll(sel);
      if (!els.length) return;
      gsap.set(els, { opacity: 0, y: 30 });
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: els[0].closest('section'),
          start: 'top 75%',
          once: true,
        },
      });
    });

    // Subtle parallax on hero glows
    if (!reduceMotion && !isCoarsePointer) {
      gsap.to('.hero__glow--1', {
        y: 80,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      });
      gsap.to('.hero__glow--2', {
        y: -60,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      });
    }
  } else {
    // No ScrollTrigger available — reveal everything via IntersectionObserver fallback
    const els = document.querySelectorAll('.reveal-up');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.transition = 'opacity .8s ease, transform .8s ease';
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'none';
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      els.forEach((el) => io.observe(el));
    } else {
      els.forEach((el) => (el.style.opacity = '1'));
    }
  }
})();
