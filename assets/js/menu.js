/* =========================
   CHEFOS POS - MENU & CART MANAGEMENT
   SYSTEM-INTEGRATED VERSION
========================= */

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(initializeSystem, 100);
});

function initializeSystem() {
  const menuDiv = document.getElementById('menu');
  if (!menuDiv) return;

  if (!localStorage.getItem("chefos_cart")) {
    localStorage.setItem("chefos_cart", JSON.stringify([]));
  }

  setupCategoryTabs();
  setupSidebarLinks();
  setupOrderButton();
  loadMenu('breakfast');
  updateCartDisplay();
}

/* ================= CATEGORY UI ================= */
function setupCategoryTabs() {
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      loadMenu(this.dataset.category);
    });
  });
}

function setupSidebarLinks() {
  document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const category = link.dataset.category;
      loadMenu(category);
      document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
      });
    });
  });
}

/* ================= MENU LOAD ================= */
function loadMenu(category) {
  const menuDiv = document.getElementById('menu');
  const categoryMap = {
    breakfast: 'Breakfast',
    main: 'Main Course',
    salads: 'Salads',
    desserts: 'Desserts',
    drinks: 'Drinks'
  };

  const items = menuItems.filter(i => i.category === categoryMap[category]);
  menuDiv.innerHTML = '';

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'menu-item';

    div.innerHTML = `
      <div class="menu-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="menu-item-content">
        <h4>${item.name}</h4>
        <p>${item.description || ''}</p>
        <div class="price">R${item.price.toFixed(2)}</div>
        <button onclick="addToCart('${item.id}')">
          <i class="fas fa-plus"></i> ADD
        </button>
      </div>
    `;
    menuDiv.appendChild(div);
  });
}

/* ================= CART ================= */
window.addToCart = function (id) {
  let cart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
  const item = menuItems.find(m => m.id === id);

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1; // ✅ use qty not quantity
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
  }

  localStorage.setItem("chefos_cart", JSON.stringify(cart));
  updateCartDisplay();
};

function updateCartDisplay() {
  const cart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
  const cartDiv = document.getElementById('cart');
  const totalDiv = document.getElementById('total');

  let total = 0;
  cartDiv.innerHTML = '';

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    cartDiv.innerHTML += `
      <div class="cart-row">
        <div>${item.name}</div>
        <div class="qty-controls">
          <button onclick="updateCartQuantity(${index},-1)">-</button>
          <span>${item.qty}</span>
          <button onclick="updateCartQuantity(${index},1)">+</button>
        </div>
      </div>
    `;
  });

  totalDiv.textContent = `Total: R${total.toFixed(2)}`;
}

window.updateCartQuantity = function (index, change) {
  let cart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
  cart[index].qty += change;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  localStorage.setItem("chefos_cart", JSON.stringify(cart));
  updateCartDisplay();
};

/* ================= ORDER PIPELINE (RESTORED) ================= */
function setupOrderButton() {
  const btn = document.getElementById('placeOrder');
  if (!btn) return;

  btn.addEventListener('click', () => {
    let cart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
    if (cart.length === 0) return alert("Cart is empty.");

    let orders = JSON.parse(localStorage.getItem("chefos_orders")) || [];

    const order = {
      id: "T" + Date.now(),
      items: cart,
      total: cart.reduce((t, i) => t + i.price * i.qty, 0),
      status: "Pending",
      table: document.getElementById("tableNumber").value || "Takeaway",
      timestamp: new Date().toLocaleTimeString()
    };

    orders.push(order);
    localStorage.setItem("chefos_orders", JSON.stringify(orders));
    localStorage.removeItem("chefos_cart");

    alert("Order sent to kitchen!");
    window.location.href = "kds.html";
  });
}
