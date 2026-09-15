/* ==========================================================================
   ANIMATIONS.JS — GSAP ScrollTrigger: reveals, text split, parallax, story
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  if (window.NOCTURNE.prefersReducedMotion) {
    document.querySelectorAll('[data-reveal], [data-line], [data-split]').forEach((el) => {
      el.style.opacity = 1;
    });
    return;
  }

  splitTextElements();
  if (document.querySelector('.hero')) initHeroReveal();
  initScrollReveals();
  initStoryText();
  initParallaxImages();
  initGalleryReveal();
});

/* ---------- Split text into lines/words for reveal animation ---------- */
function splitTextElements() {
  document.querySelectorAll('[data-split]').forEach((el) => {
    const html = el.innerHTML;
    const lines = html.split('<br>');
    el.innerHTML = lines.map((line) => `<span class="split-line"><span>${line}</span></span>`).join('<br>');
  });
}

/* ---------- Hero entrance (plays after intro finishes) ---------- */
function initHeroReveal() {
  const play = () => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-jewel-stage', { opacity: 0, y: 40, duration: 1.2 })
      .from('.hero-eyebrow', { opacity: 0, y: 16, duration: 0.8 }, '-=0.6')
      .from('.hero-title .line', { opacity: 0, y: 30, duration: 0.9 }, '-=0.5')
      .from('.hero-sub', { opacity: 0, y: 16, duration: 0.8 }, '-=0.5')
      .from('.hero-cta', { opacity: 0, y: 16, duration: 0.8 }, '-=0.5')
      .from('.scroll-cue', { opacity: 0, duration: 0.8 }, '-=0.3');

    // Hero exit / scale on scroll — created only once the entrance settles,
    // otherwise the scrub tween captures mid-transition values as its "start".
    tl.eventCallback('onComplete', () => {
      gsap.set('.hero-jewel-stage', { clearProps: 'transform,opacity' });
      gsap.set('.hero-copy', { clearProps: 'transform,opacity' });

      gsap.to('.hero-jewel-stage', {
        scale: 1.15, y: -60, opacity: 0.3,
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero-copy', {
        y: -40, opacity: 0,
        scrollTrigger: { trigger: '.hero', start: 'top top', end: '60% top', scrub: true },
      });
    });
  };

  if (document.querySelector('.intro.is-done')) { play(); return; }
  document.addEventListener('nocturne:introDone', play, { once: true });
  // fallback if intro already skipped before listener attached
  setTimeout(() => { if (!NOCTURNE._heroPlayed) { NOCTURNE._heroPlayed = true; play(); } }, 200);
  document.addEventListener('nocturne:introDone', () => { NOCTURNE._heroPlayed = true; }, { once: true });
}

/* ---------- Generic scroll reveals ---------- */
function initScrollReveals() {
  gsap.utils.toArray('.featured-copy, .about-copy, .cta-title').forEach((el) => {
    gsap.from(el, {
      opacity: 0, y: 40, duration: 1,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  gsap.utils.toArray('.section-head').forEach((el) => {
    gsap.from(el.children, {
      opacity: 0, y: 24, duration: 0.9, stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  gsap.utils.toArray('.product-card').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, y: 50, duration: 0.9, delay: (i % 4) * 0.05,
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });

  gsap.utils.toArray('.craft-step').forEach((el) => {
    gsap.from(el, {
      opacity: 0, y: 40, duration: 0.9,
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  gsap.utils.toArray('.review-card, .collection-card').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, y: 30, duration: 0.8, delay: (i % 4) * 0.06,
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });
}

/* ---------- Story chapter text reveal, word by word ---------- */
function initStoryText() {
  document.querySelectorAll('.story-text .split-line > span').forEach((span) => {
    gsap.set(span, { y: '110%' });
  });

  document.querySelectorAll('.story').forEach((section) => {
    const spans = section.querySelectorAll('.split-line > span');
    const index = section.querySelector('.story-index');

    gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 65%' },
    })
      .from(index, { opacity: 0, y: 10, duration: 0.6 })
      .to(spans, { y: '0%', duration: 1, stagger: 0.12, ease: 'power4.out' }, '-=0.2');
  });

  const cta = document.querySelector('.cta-title');
  if (cta) {
    cta.querySelectorAll('.split-line > span').forEach((span) => gsap.set(span, { y: '110%' }));
    gsap.to(cta.querySelectorAll('.split-line > span'), {
      y: '0%', duration: 1, stagger: 0.1, ease: 'power4.out',
      scrollTrigger: { trigger: cta, start: 'top 80%' },
    });
  }
}

/* ---------- Parallax on editorial images ---------- */
function initParallaxImages() {
  gsap.utils.toArray('[data-parallax-img] img').forEach((img) => {
    gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: img.closest('[data-parallax-img]'), start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* ---------- Lookbook grid staggered reveal ---------- */
function initGalleryReveal() {
  gsap.utils.toArray('.lookbook-item').forEach((item, i) => {
    gsap.from(item, {
      opacity: 0, scale: 0.94, duration: 1, delay: (i % 4) * 0.08,
      scrollTrigger: { trigger: item, start: 'top 88%' },
    });
  });
}
