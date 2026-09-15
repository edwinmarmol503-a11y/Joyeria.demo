/* ==========================================================================
   TRANSITIONS.JS — cross-page loading animation.
   Every page carries the same #pageTransition overlay. On load it plays a
   brief reveal (the overlay is visible-by-default in CSS so it works even
   if this script fails to run); on any internal navigation click it plays
   the reverse (cover) animation before actually changing page, so moving
   between Inicio / Colecciones / Nosotros / Contacto feels like one
   continuous experience instead of a hard page jump.
   ========================================================================== */

window.NOCTURNE = window.NOCTURNE || {};

const SEEN_KEY = 'nocturne_intro_seen';
NOCTURNE.hasSeenIntro = () => {
  try { return sessionStorage.getItem(SEEN_KEY) === '1'; } catch (e) { return false; }
};
NOCTURNE.markIntroSeen = () => {
  try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) { /* ignore */ }
};

document.addEventListener('DOMContentLoaded', () => {
  initPageEnter();
  initPageExitOnLinks();
});

/* ---------- Reveal on arrival ----------
   Always the same short reveal. On index.html's very first visit this sits
   quietly underneath the taller #intro (higher z-index) and is long gone
   by the time that cinematic sequence finishes, so the two never visually
   collide. */
function initPageEnter() {
  const overlay = document.getElementById('pageTransition');
  if (!overlay) return;
  requestAnimationFrame(() => {
    setTimeout(() => overlay.classList.add('is-hidden'), 60);
  });
}

/* ---------- Cover before navigating away ---------- */
function initPageExitOnLinks() {
  const overlay = document.getElementById('pageTransition');
  if (!overlay) return;

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.target && link.target !== '_self') return;
    if (link.hasAttribute('data-no-transition')) return;

    let url;
    try { url = new URL(href, window.location.href); } catch (err) { return; }
    if (url.origin !== window.location.origin) return;

    // Same-page anchor-only difference (e.g. "contacto.html" -> "contacto.html")
    const isSamePage = url.pathname === window.location.pathname;
    if (isSamePage && url.hash) return; // let in-page anchors behave normally

    e.preventDefault();
    overlay.classList.remove('is-hidden');

    setTimeout(() => { window.location.href = url.href; }, NOCTURNE.prefersReducedMotion ? 60 : 480);
  });
}
