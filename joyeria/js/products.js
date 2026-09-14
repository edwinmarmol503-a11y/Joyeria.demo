/* ==========================================================================
   PRODUCTS.JS — product data, editorial gallery render, filtering, quick-view
   Images: free-license stock placeholders (Unsplash). Replace with real
   product photography before launch — see fallback labels in the UI.
   ========================================================================== */

window.NOCTURNE = window.NOCTURNE || {};

window.NOCTURNE.products = [
  {
    id: 'p1', name: 'Anillo Eclipse', collection: 'Eclipse', category: 'anillos',
    material: 'Oro Amarillo · Diamante', price: null, inStock: true, size: 'lg',
    imgA: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
    imgB: 'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'p2', name: 'Collar Medianoche', collection: 'Medianoche', category: 'collares',
    material: 'Oro Blanco · Perla', price: null, inStock: true, size: 'md',
    imgA: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80',
    imgB: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'p3', name: 'Pulsera Ascua', collection: 'Ascua', category: 'pulseras',
    material: 'Plata · Rubí', price: null, inStock: false, size: 'md',
    imgA: 'https://images.unsplash.com/photo-1620656798579-1984d9e87df7?auto=format&fit=crop&w=900&q=80',
    imgB: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'p4', name: 'Aretes Vesper', collection: 'Eclipse', category: 'aretes',
    material: 'Oro Amarillo · Zafiro', price: null, inStock: true, size: 'md',
    imgA: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=900&q=80',
    imgB: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'p5', name: 'Anillo Solsticio', collection: 'Medianoche', category: 'anillos',
    material: 'Oro Blanco · Diamante', price: null, inStock: true, size: 'xl',
    imgA: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1200&q=80',
    imgB: 'https://images.unsplash.com/photo-1610375461369-d613b564f4c4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'p6', name: 'Collar Ascua', collection: 'Ascua', category: 'collares',
    material: 'Oro Amarillo · Rubí', price: null, inStock: true, size: 'md',
    imgA: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&w=900&q=80',
    imgB: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'p7', name: 'Pulsera Eclipse', collection: 'Eclipse', category: 'pulseras',
    material: 'Plata · Diamante', price: null, inStock: true, size: 'md',
    imgA: 'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?auto=format&fit=crop&w=900&q=80',
    imgB: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'p8', name: 'Aretes Medianoche', collection: 'Medianoche', category: 'aretes',
    material: 'Oro Blanco · Perla', price: null, inStock: true, size: 'md',
    imgA: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=80',
    imgB: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=900&q=80',
  },
];

const sizeToClass = { md: '', lg: 'size-lg', xl: 'size-xl' };

function priceLabel(p) {
  return p.price ? `$${p.price.toLocaleString('es')}` : '[AGREGAR PRECIO]';
}

function productCardHTML(p) {
  const sizeClass = sizeToClass[p.size] || '';
  return `
    <article class="product-card ${sizeClass}" data-id="${p.id}" data-category="${p.category}" tabindex="0" role="button" aria-label="Ver ${p.name}">
      <div class="product-media" data-cursor="Ver">
        <img class="img-a" src="${p.imgA}" alt="${p.name} — fotografía de producto [REEMPLAZAR CON FOTOGRAFÍA REAL]" loading="lazy"
             onerror="this.parentElement.classList.add('img-fallback'); this.remove();">
        <img class="img-b" src="${p.imgB}" alt="" loading="lazy" onerror="this.remove();">
        <span class="fallback-label">[AGREGAR FOTOGRAFÍA DE PRODUCTO]</span>
        <div class="product-glow" aria-hidden="true"></div>
        <span class="product-view-tag">Ver</span>
      </div>
      <div class="product-info">
        <p class="product-collection">${p.collection}</p>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-material">${p.material}</p>
        <p class="product-price">${priceLabel(p)}</p>
        <p class="product-stock ${p.inStock ? 'in' : 'out'}">${p.inStock ? 'Disponible' : 'Agotado'}</p>
      </div>
    </article>`;
}

function renderProducts() {
  const gallery = document.getElementById('productGallery');
  if (!gallery) return;
  gallery.innerHTML = NOCTURNE.products.map(productCardHTML).join('');
  attachProductCardEvents();
}

function attachProductCardEvents() {
  document.querySelectorAll('.product-card').forEach((card) => {
    const open = () => openProductModal(card.dataset.id);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });
}

/* ---------- Filtering ---------- */
function applyCategoryFilter(cat) {
  document.querySelectorAll('.product-card').forEach((card) => {
    card.classList.toggle('is-hidden', cat !== 'todos' && card.dataset.category !== cat);
  });
}

function initFilterTabs() {
  const tabs = document.getElementById('filterTabs');
  if (!tabs) return;
  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-tab');
    if (!btn) return;
    tabs.querySelectorAll('.filter-tab').forEach((t) => t.classList.remove('is-active'));
    btn.classList.add('is-active');
    applyCategoryFilter(btn.dataset.filter);
  });

  // Nav links / collection cards with data-cat jump + filter
  document.querySelectorAll('[data-cat]').forEach((link) => {
    link.addEventListener('click', () => {
      const cat = link.dataset.cat;
      const tab = tabs.querySelector(`.filter-tab[data-filter="${cat}"]`);
      if (tab) tab.click();
    });
  });
}

/* ---------- Advanced filter panel (checkboxes) ---------- */
function initFilterPanelLogic() {
  const applyBtn = document.getElementById('filtersApply');
  const clearBtn = document.getElementById('filtersClear');
  const panel = document.getElementById('filtersPanel');
  if (!applyBtn || !panel) return;

  applyBtn.addEventListener('click', () => {
    const checkedCats = [...panel.querySelectorAll('input[name="cat"]:checked')].map((i) => i.value);
    const checkedStock = [...panel.querySelectorAll('input[name="stock"]:checked')].map((i) => i.value);

    document.querySelectorAll('.product-card').forEach((card) => {
      const p = NOCTURNE.products.find((pr) => pr.id === card.dataset.id);
      let visible = true;
      if (checkedCats.length && !checkedCats.includes(card.dataset.category)) visible = false;
      if (checkedStock.length) {
        const stockVal = p.inStock ? 'disponible' : 'agotado';
        if (!checkedStock.includes(stockVal)) visible = false;
      }
      card.classList.toggle('is-hidden', !visible);
    });

    document.getElementById('scrim').classList.remove('is-open');
    panel.classList.remove('is-open');
    panel.setAttribute('inert', '');
  });

  clearBtn.addEventListener('click', () => {
    panel.querySelectorAll('input[type="checkbox"]').forEach((i) => (i.checked = false));
    document.querySelectorAll('.product-card').forEach((card) => card.classList.remove('is-hidden'));
    document.querySelectorAll('.filter-tab').forEach((t) => t.classList.remove('is-active'));
    document.querySelector('.filter-tab[data-filter="todos"]')?.classList.add('is-active');
  });
}

/* ---------- Quick-view modal ---------- */
function openProductModal(id) {
  const p = NOCTURNE.products.find((pr) => pr.id === id);
  if (!p) return;
  const modal = document.getElementById('productModal');
  document.getElementById('modalImg').src = p.imgA;
  document.getElementById('modalImg').alt = `${p.name} — fotografía de producto`;
  document.getElementById('modalCollection').textContent = p.collection;
  document.getElementById('modalName').textContent = p.name;
  document.getElementById('modalMaterial').textContent = p.material;
  document.getElementById('modalPrice').textContent = priceLabel(p);
  const stockEl = document.getElementById('modalStock');
  stockEl.textContent = p.inStock ? 'Disponible' : 'Agotado';
  stockEl.className = `stock ${p.inStock ? 'in' : 'out'}`;

  const addBtn = document.getElementById('modalAddCart');
  addBtn.disabled = !p.inStock;
  addBtn.textContent = p.inStock ? 'Añadir al Carrito' : 'Agotado';
  addBtn.onclick = () => { addToCart(p); };

  modal.classList.add('is-open');
  modal.removeAttribute('inert');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  modal.classList.remove('is-open');
  modal.setAttribute('inert', '');
  document.body.style.overflow = '';
}

/* ---------- Cart (visual only — no real payments/inventory) ---------- */
NOCTURNE.cart = [];

function addToCart(p) {
  NOCTURNE.cart.push(p);
  updateCartCount();
  renderCartPanel();
  showToast(`${p.name} añadido al carrito`);
}

function removeFromCart(id) {
  const idx = NOCTURNE.cart.findIndex((item) => item.id === id);
  if (idx > -1) NOCTURNE.cart.splice(idx, 1);
  updateCartCount();
  renderCartPanel();
}

function updateCartCount() {
  const countEl = document.getElementById('cartCount');
  if (countEl) countEl.textContent = NOCTURNE.cart.length;
}

function renderCartPanel() {
  const itemsEl = document.getElementById('cartItems');
  const summaryEl = document.getElementById('cartSummary');
  if (!itemsEl) return;

  if (!NOCTURNE.cart.length) {
    itemsEl.innerHTML = '<p class="cart-empty" id="cartEmpty">Tu carrito está vacío. Descubre una pieza que te espere.</p>';
    if (summaryEl) summaryEl.hidden = true;
    return;
  }

  const grouped = [];
  NOCTURNE.cart.forEach((p) => {
    const existing = grouped.find((g) => g.id === p.id);
    if (existing) existing.qty += 1;
    else grouped.push({ ...p, qty: 1 });
  });

  itemsEl.innerHTML = grouped.map((p) => `
    <div class="cart-item" data-id="${p.id}">
      <img src="${p.imgA}" alt="${p.name}" loading="lazy" onerror="this.style.visibility='hidden'">
      <div>
        <p class="cart-item-name">${p.name}</p>
        <p class="cart-item-meta">${p.collection} · ${p.material} · Cant. ${p.qty}</p>
        <p class="cart-item-price">${priceLabel(p)}</p>
      </div>
      <button class="cart-item-remove" data-remove="${p.id}">Quitar</button>
    </div>`).join('');

  itemsEl.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.remove));
  });

  if (summaryEl) {
    summaryEl.hidden = false;
    const anyPriced = grouped.some((p) => p.price);
    document.getElementById('cartSubtotal').textContent = anyPriced
      ? `$${grouped.reduce((sum, p) => sum + (p.price || 0) * p.qty, 0).toLocaleString('es')}`
      : '[AGREGAR PRECIO]';
  }
}

function initCartDrawer() {
  const toggle = document.getElementById('cartToggle');
  const panel = document.getElementById('cartPanel');
  const closeBtn = document.getElementById('cartClose');
  const scrim = document.getElementById('cartScrim');
  if (!toggle || !panel) return;

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

  toggle.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  scrim.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) close();
  });

  document.getElementById('cartCheckout')?.addEventListener('click', () => {
    showToast('Checkout de demostración — [PENDIENTE: integrar pasarela de pago]');
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('is-visible');
  clearTimeout(NOCTURNE._toastTimer);
  NOCTURNE._toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  initFilterTabs();
  initFilterPanelLogic();
  initCartDrawer();
  document.getElementById('modalClose')?.addEventListener('click', closeProductModal);
  document.getElementById('productModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'productModal') closeProductModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProductModal();
  });
});
