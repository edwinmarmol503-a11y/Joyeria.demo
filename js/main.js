/* ESTILO'S SALÓN — Custom cursor + misc init */
(function () {
  'use strict';

  const isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const isNarrow = window.matchMedia('(max-width: 900px)').matches;

  if (isCoarsePointer || isNarrow) {
    document.documentElement.classList.add('no-custom-cursor');
  } else {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    if (dot && ring) {
      let mx = 0, my = 0, rx = 0, ry = 0;

      window.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      });

      function loop() {
        rx += (mx - rx) * 0.16;
        ry += (my - ry) * 0.16;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
      }
      loop();

      const interactive = 'a, button, input, textarea, select, .gallery__item, .service';
      document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactive)) ring.classList.add('is-active');
      });
      document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactive)) ring.classList.remove('is-active');
      });
      document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
      });
      document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      });
    }
  }

  /* Contact form — placeholder submit handler (no backend wired yet) */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.contact__submit span');
      if (btn) {
        const original = btn.textContent;
        btn.textContent = 'Solicitud registrada';
        setTimeout(() => (btn.textContent = original), 2400);
      }
      form.reset();
    });
  }
})();
