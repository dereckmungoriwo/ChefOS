/* =========================
   CHEFOS POS - MENU DISPLAY & CART MANAGEMENT
   FIXED VERSION - Proper sync with kitchen
========================= */

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(initializeSystem, 100);
});

function initializeSystem() {
  const menuDiv = document.getElementById('menu');
  if (!menuDiv) return;

  // Initialize cart if doesn't exist
  if (!localStorage.getItem("chefos_cart")) {
    localStorage.setItem("chefos_cart", JSON.stringify([]));
  }

  setupCategoryTabs();
  setupSearchBar();
  setupSidebarLinks();
  loadMenu('breakfast'); // Load breakfast by default
  updateCartDisplay();
}

/* ================= SEARCH BAR ================= */
function setupSearchBar() {
  const searchInput = document.getElementById('menuSearchInput');
  const searchClear  = document.getElementById('menuSearchClear');
  if (!searchInput) return;

  searchInput.addEventListener('input', function () {
    const q = this.value.trim();
    searchClear.style.display = q ? 'flex' : 'none';

    if (q.length === 0) {
      // nothing typed → restore current category view
      const activeTab = document.querySelector('.category-tab.active');
      loadMenu(activeTab ? activeTab.dataset.category : 'breakfast');
    } else {
      searchMenu(q);
    }
  });

  searchClear.addEventListener('click', function () {
    searchInput.value = '';
    searchClear.style.display = 'none';
    const activeTab = document.querySelector('.category-tab.active');
    loadMenu(activeTab ? activeTab.dataset.category : 'breakfast');
  });
}

function searchMenu(query) {
  const menuDiv = document.getElementById('menu');
  if (!menuDiv) return;

  const q = query.toLowerCase();
  const results = menuItems.filter(item =>
    item.name.toLowerCase().includes(q) ||
    (item.description && item.description.toLowerCase().includes(q))
  );

  menuDiv.innerHTML = '';

  if (results.length === 0) {
    menuDiv.innerHTML = `
      <div class="no-items-message">
        <i class="fas fa-search fa-3x"></i>
        <p>No items match "<strong>${query}</strong>"</p>
      </div>
    `;
    return;
  }

  results.forEach(item => {
    const div = document.createElement('div');
    div.className = 'menu-item';

    const inventory = JSON.parse(localStorage.getItem("chefos_inventory")) || {};
    let canOrder = true;
    if (item.ingredients) {
      for (let [ingredient, qty] of Object.entries(item.ingredients)) {
        if ((inventory[ingredient] || 0) < qty) { canOrder = false; break; }
      }
    }

    div.innerHTML = `
      <div class="menu-item-image">
        <img src="${item.image}" alt="${item.name}" onerror="this.parentElement.innerHTML='<div class=\\'item-image-placeholder\\'><i class=\\'fas fa-utensils\\'></i></div>'">
      </div>
      <div class="menu-item-content">
        <h4>${item.name}</h4>
        <p>${item.description || ''}</p>
        <div class="price">R${item.price.toFixed(2)}</div>
        <button onclick="addToCart('${item.id}')" ${!canOrder ? 'disabled' : ''}>
          <i class="fas fa-${canOrder ? 'plus' : 'times'}"></i> ${canOrder ? 'ADD TO CART' : 'OUT OF STOCK'}
        </button>
      </div>
    `;
    menuDiv.appendChild(div);
  });
}

/* ================= CATEGORY UI ================= */
function setupCategoryTabs() {
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      // clear search when a tab is clicked
      const searchInput = document.getElementById('menuSearchInput');
      const searchClear  = document.getElementById('menuSearchClear');
      if (searchInput) { searchInput.value = ''; }
      if (searchClear)  { searchClear.style.display = 'none'; }

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
      
      // Sync with tabs
      document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
      });
    });
  });
}

/* ================= MENU LOAD - 3x2 GRID (6 items per category) ================= */
function loadMenu(category) {
  const menuDiv = document.getElementById('menu');
  if (!menuDiv) return;

  const categoryMap = {
    breakfast: 'Breakfast',
    main: 'Main Course',
    salads: 'Salads',
    desserts: 'Desserts',
    drinks: 'Drinks'
  };

  const items = menuItems.filter(i => i.category === categoryMap[category]);
  menuDiv.innerHTML = '';

  if (items.length === 0) {
    menuDiv.innerHTML = `
      <div class="no-items-message">
        <i class="fas fa-utensils fa-3x"></i>
        <p>No items available in this category</p>
      </div>
    `;
    return;
  }

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'menu-item';

    // Check if inventory is sufficient
    const inventory = JSON.parse(localStorage.getItem("chefos_inventory")) || {};
    let canOrder = true;
    
    if (item.ingredients) {
      for (let [ingredient, qty] of Object.entries(item.ingredients)) {
        if ((inventory[ingredient] || 0) < qty) {
          canOrder = false;
          break;
        }
      }
    }

    div.innerHTML = `
      <div class="menu-item-image">
        <img src="${item.image}" alt="${item.name}" onerror="this.parentElement.innerHTML='<div class=\\'item-image-placeholder\\'><i class=\\'fas fa-utensils\\'></i></div>'">
      </div>
      <div class="menu-item-content">
        <h4>${item.name}</h4>
        <p>${item.description || ''}</p>
        <div class="price">R${item.price.toFixed(2)}</div>
        <button onclick="addToCart('${item.id}')" ${!canOrder ? 'disabled' : ''}>
          <i class="fas fa-${canOrder ? 'plus' : 'times'}"></i> ${canOrder ? 'ADD TO CART' : 'OUT OF STOCK'}
        </button>
      </div>
    `;
    menuDiv.appendChild(div);
  });
}

/* ================= ADD TO CART ================= */
window.addToCart = function (id) {
  let cart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
  const item = menuItems.find(m => m.id === id);

  if (!item) {
    console.error("Item not found:", id);
    return;
  }

  // Check inventory before adding
  const inventory = JSON.parse(localStorage.getItem("chefos_inventory")) || {};
  if (item.ingredients) {
    for (let [ingredient, qty] of Object.entries(item.ingredients)) {
      if ((inventory[ingredient] || 0) < qty) {
        alert(`Sorry, ${item.name} is out of stock!`);
        return;
      }
    }
  }

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ 
      id: item.id, 
      name: item.name, 
      price: item.price, 
      qty: 1 
    });
  }

  localStorage.setItem("chefos_cart", JSON.stringify(cart));
  updateCartDisplay();
  
  // Visual feedback
  showToast(`${item.name} added to cart!`);
};

/* ================= UPDATE CART DISPLAY ================= */
function updateCartDisplay() {
  const cart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
  const cartDiv = document.getElementById('cart');
  const totalDiv = document.getElementById('total');

  if (!cartDiv || !totalDiv) return;

  let total = 0;
  cartDiv.innerHTML = '';

  if (cart.length === 0) {
    cartDiv.innerHTML = `
      <div class="empty-cart-message">
        <i class="fas fa-shopping-cart fa-3x"></i>
        <p>Your cart is empty</p>
        <small>Add items from the menu to get started</small>
      </div>
    `;
    totalDiv.textContent = 'Total: R0.00';
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-price">R${item.price.toFixed(2)} each</div>
      </div>
      <div class="qty-controls">
        <button onclick="updateCartQuantity(${index}, -1)" class="qty-decrease">-</button>
        <span class="qty">${item.qty}</span>
        <button onclick="updateCartQuantity(${index}, 1)" class="qty-increase">+</button>
      </div>
    `;
    cartDiv.appendChild(row);
  });

  totalDiv.textContent = `Total: R${total.toFixed(2)}`;
}

/* ================= UPDATE CART QUANTITY ================= */
window.updateCartQuantity = function (index, change) {
  let cart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
  
  if (!cart[index]) return;

  cart[index].qty += change;
  
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  
  localStorage.setItem("chefos_cart", JSON.stringify(cart));
  updateCartDisplay();
};

/* ================= TOAST NOTIFICATION ================= */
function showToast(message) {
  // Remove existing toast if any
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Add toast + search-bar styles if not already in CSS
if (!document.getElementById('toast-styles')) {
  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = `
    .toast-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.3);
      border-color: var(--primary);
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 10000;
      transform: translateX(400px);
      transition: transform 0.3s ease;
      font-weight: 600;
    }
    .toast-notification.show {
      transform: translateX(0);
    }
    .toast-notification i {
      font-size: 20px;
    }

    /* ---- Menu search bar ---- */
    .menu-search-box {
      position: relative;
      margin-bottom: 20px;
      border color: var(--primary);
    }
    .menu-search-box > i {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--primary);
      border color: var(--primary) !important;
      font-size: 15px;
      pointer-events: none;
    }
    .menu-search-box input {
      width: 100%;
      padding: 11px 40px 11px 42px;
      border: 1px solid var(--gray-light);
      border-radius: 9px;
      font-size: 14px;
      background: var(--white);
      color: var(--dark);
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .menu-search-box input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(30,111,92,0.15);
    }
    .menu-search-box input::placeholder {
      color: var(--gray);
    }
    .search-clear-btn {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--primary);
      font-size: 14px;
      cursor: pointer;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s, color 0.2s;
    }
    .search-clear-btn:hover {
      background: var(--gray-light);
      color: var(--dark);
    }
  `;
  document.head.appendChild(style);
}

console.log("✅ ChefOS Menu system initialized");
