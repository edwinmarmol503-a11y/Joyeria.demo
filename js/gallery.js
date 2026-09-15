/* ==========================================================================
   GALLERY.JS — lookbook lightbox (click to zoom)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', initLookbookLightbox);

function initLookbookLightbox() {
  const items = document.querySelectorAll('.lookbook-item img, .craft-media img, .featured-image img');
  if (!items.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Imagen ampliada');
  overlay.innerHTML = `
    <button class="overlay-close" aria-label="Cerrar">&times;</button>
    <img alt="">
  `;
  Object.assign(overlay.style, {
    position: 'fixed', inset: '0', zIndex: '900', background: 'rgba(3,3,3,0.94)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: '0', visibility: 'hidden', transition: 'opacity .4s ease, visibility .4s',
    padding: '5vh 5vw',
  });
  const img = overlay.querySelector('img');
  Object.assign(img.style, { maxWidth: '90vw', maxHeight: '88vh', objectFit: 'contain' });
  document.body.appendChild(overlay);

  const open = (src, alt) => {
    img.src = src;
    img.alt = alt || '';
    overlay.style.opacity = '1';
    overlay.style.visibility = 'visible';
  };
  const close = () => {
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
  };

  items.forEach((el) => {
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', () => open(el.currentSrc || el.src, el.alt));
  });

  overlay.querySelector('.overlay-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}
