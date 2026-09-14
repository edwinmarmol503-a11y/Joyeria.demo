/* ==========================================================================
   NAVIGATION.JS — mobile fullscreen menu, search overlay, filter drawer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSearch();
  initFiltersDrawer();
});

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  const open = () => {
    menu.classList.add('is-open');
    menu.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    menu.querySelector('a')?.focus();
  };
  const close = () => {
    menu.classList.remove('is-open');
    menu.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    toggle.getAttribute('aria-expanded') === 'true' ? close() : open();
  });

  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') close();
  });
}

/* ---------- Search Overlay ---------- */
function initSearch() {
  const toggle = document.getElementById('searchToggle');
  const overlay = document.getElementById('searchOverlay');
  const closeBtn = document.getElementById('searchClose');
  const input = document.getElementById('searchInput');
  const resultsEl = document.getElementById('searchResults');
  const form = document.getElementById('searchForm');
  if (!toggle || !overlay) return;

  const open = () => {
    overlay.classList.add('is-open');
    overlay.removeAttribute('inert');
    setTimeout(() => input.focus(), 350);
  };
  const close = () => {
    overlay.classList.remove('is-open');
    overlay.setAttribute('inert', '');
    input.value = '';
    resultsEl.innerHTML = '';
  };

  toggle.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });

  form.addEventListener('submit', (e) => e.preventDefault());

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { resultsEl.innerHTML = ''; return; }

    const products = window.NOCTURNE?.products || [];
    const matches = products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.collection.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q)
    );

    if (!matches.length) {
      resultsEl.innerHTML = `<p class="search-empty">Sin resultados para "${escapeHTML(input.value)}".</p>`;
      return;
    }

    resultsEl.innerHTML = matches.map((p) => `
      <div class="search-result-item" data-id="${p.id}" role="button" tabindex="0">
        <img src="${p.imgA}" alt="" loading="lazy" onerror="this.style.display='none'">
        <div>
          <p style="margin:0;font-size:.85rem;">${p.name}</p>
          <p class="muted small" style="margin:0;">${p.collection} · ${p.material}</p>
        </div>
      </div>`).join('');

    resultsEl.querySelectorAll('.search-result-item').forEach((el) => {
      const go = () => { close(); window.dispatchEvent(new CustomEvent('nocturne:openProduct', { detail: el.dataset.id })); document.dispatchEvent(new CustomEvent('nocturne:openProductNow', { detail: el.dataset.id })); };
      el.addEventListener('click', go);
    });
  });
}

document.addEventListener('nocturne:openProductNow', (e) => {
  if (typeof openProductModal === 'function') openProductModal(e.detail);
});

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- Filters Drawer ---------- */
function initFiltersDrawer() {
  const openBtn = document.getElementById('filtersOpen');
  const closeBtn = document.getElementById('filtersClose');
  const panel = document.getElementById('filtersPanel');
  const scrim = document.getElementById('scrim');
  if (!openBtn || !panel) return;

  const open = () => {
    panel.classList.add('is-open');
    panel.removeAttribute('inert');
    scrim.classList.add('is-open');
  };
  const close = () => {
    panel.classList.remove('is-open');
    panel.setAttribute('inert', '');
    scrim.classList.remove('is-open');
  };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  scrim.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) close();
  });
}
