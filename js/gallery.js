/* ESTILO'S SALÓN — Gallery lightbox */
(function () {
  'use strict';

  const items = document.querySelectorAll('.gallery__item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxLabel = document.getElementById('lightboxLabel');
  const closeBtn = document.getElementById('lightboxClose');
  if (!lightbox || !items.length) return;

  let lastFocused = null;

  function openLightbox(caption, imgSrc, imgAlt) {
    lastFocused = document.activeElement;
    lightboxLabel.textContent = caption || '';
    if (imgSrc) {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = imgAlt || caption || '';
    }
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocused) lastFocused.focus();
  }

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      openLightbox(item.dataset.caption, img ? img.src : null, img ? img.alt : null);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
})();
