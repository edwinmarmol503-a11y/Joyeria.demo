/* ESTILO'S SALÓN — Navigation: sticky navbar, mobile menu, smooth anchors */
(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const burger = document.getElementById('navBurger');
  const navMenu = document.getElementById('navMenu');
  const links = document.querySelectorAll('.navbar__link');

  function onScroll() {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('no-scroll', isOpen);
    });
  }

  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      }
    });
  });

  // Section-to-section navigation: brief brand transition, then jump (like loading a new screen)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loader = document.getElementById('sectionLoader');
  let isTransitioning = false;

  function currentOffset() {
    return navbar && navbar.classList.contains('is-scrolled') ? 72 : 84;
  }

  function goToTarget(target) {
    const y = target.getBoundingClientRect().top + window.scrollY - currentOffset();

    if (reduceMotion || !loader) {
      window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
      return;
    }
    if (isTransitioning) return;
    isTransitioning = true;

    loader.classList.add('is-active');
    loader.setAttribute('aria-hidden', 'false');

    setTimeout(() => {
      window.scrollTo({ top: y, behavior: 'auto' });
      setTimeout(() => {
        loader.classList.remove('is-active');
        loader.setAttribute('aria-hidden', 'true');
        isTransitioning = false;
      }, 120);
    }, 420);
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      goToTarget(target);
    });
  });

  // Active link on scroll
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((l) => l.classList.remove('is-active'));
            const active = document.querySelector(`.navbar__link[href="#${entry.target.id}"]`);
            if (active) active.classList.add('is-active');
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
