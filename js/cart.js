/* ==========================================================================
   CART.JS — shared cart state, persisted across pages via localStorage.
   Loads on every page (the cart icon lives in the nav everywhere), while
   the product catalog itself only loads on colecciones.html (products.js).
   Visual only — no real payments or inventory, as requested.
   ========================================================================== */

window.NOCTURNE = window.NOCTURNE || {};
const CART_KEY = 'nocturne_cart_v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(NOCTURNE.cart));
  } catch (e) {
    /* localStorage unavailable (private mode, etc.) — cart just won't persist */
  }
}

NOCTURNE.cart = loadCart();

function priceLabel(p) {
  return p.price ? `$${p.price.toLocaleString('es')}` : '[AGREGAR PRECIO]';
}

function addToCart(p) {
  NOCTURNE.cart.push(p);
  saveCart();
  updateCartCount();
  renderCartPanel();
  showToast(`${p.name} añadido al carrito`);
}

function removeFromCart(id) {
  const idx = NOCTURNE.cart.findIndex((item) => item.id === id);
  if (idx > -1) NOCTURNE.cart.splice(idx, 1);
  saveCart();
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
  updateCartCount();
  renderCartPanel();
  initCartDrawer();
});
