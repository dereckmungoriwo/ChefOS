/* =========================
   CHEFOS POS - MENU & CART MANAGEMENT
========================= */
const menuDiv = document.getElementById("menu");
let cart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
let inventory = JSON.parse(localStorage.getItem("chefos_inventory")) || {};
let currentCategory = "Breakfast"; // Default category

/* =========================
   DOM READY
========================= */
document.addEventListener('DOMContentLoaded', function() {
  initializePage();
  setupEventListeners();
});

/* =========================
   INITIALIZE PAGE
========================= */
function initializePage() {
  createCategoryTabs();
  setupSidebarCategoryLinks();
  initSidebarCategories();
  renderMenu();
  renderCartSummary();
  updateCurrentOrderDisplay();
}

/* =========================
   SETUP EVENT LISTENERS
========================= */
function setupEventListeners() {
  // Place Order button
  const placeOrderBtn = document.getElementById('placeOrder');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', placeOrder);
  }
  
  // Theme toggle (from new HTML)
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('change', function() {
      if (this.checked) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      }
    });
  }
}

/* =========================
   INVENTORY CHECK
========================= */
function canMakeItem(item) {
  return Object.entries(item.ingredients).every(
    ([ingredient, qty]) => inventory[ingredient] >= qty
  );
}

/* =========================
   ADD ITEM TO ORDER
========================= */
function addToCart(item) {
  if (!canMakeItem(item)) {
    alert("Insufficient ingredients.");
    return;
  }
  
  const existing = cart.find(c => c.id === item.id);
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
  renderCartSummary();
  updateCurrentOrderDisplay();
}

/* =========================
   CREATE CATEGORY TABS (FOR MAIN MENU AREA)
========================= */
function createCategoryTabs() {
  const menuArea = document.querySelector(".menu-area");
  if (!menuArea) return;
  
  const h2 = menuArea.querySelector("h2");
  if (!h2) return;
  
  // Group items by category and count them
  const categories = {};
  menuItems.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = 0;
    }
    categories[item.category]++;
  });

  // Create tabs container if it doesn't exist
  let tabsContainer = menuArea.querySelector('.category-tabs');
  if (!tabsContainer) {
    tabsContainer = document.createElement("div");
    tabsContainer.className = "category-tabs";
    h2.after(tabsContainer);
  }

  // Clear existing tabs
  tabsContainer.innerHTML = '';

  // Create tabs for each category
  Object.keys(categories).forEach(categoryName => {
    const tab = document.createElement("button");
    tab.className = `category-tab ${categoryName === currentCategory ? 'active' : ''}`;
    tab.setAttribute('data-category', categoryName);
    tab.textContent = categoryName;
    tab.addEventListener("click", () => switchCategory(categoryName));
    tabsContainer.appendChild(tab);
  });
}

/* =========================
   SETUP SIDEBAR CATEGORY LINKS
========================= */
function setupSidebarCategoryLinks() {
  document.querySelectorAll('.sidebar .nav-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const category = this.getAttribute('href').replace('#', '');
      switchCategory(category);
    });
  });
}

/* =========================
   INITIALIZE SIDEBAR CATEGORIES
========================= */
function initSidebarCategories() {
  const sidebarNav = document.querySelector('.sidebar-nav .nav-links');
  if (!sidebarNav) return;
  
  // Get unique categories from menu items
  const categories = [...new Set(menuItems.map(item => item.category))];
  
  // Check if category links already exist
  const existingCategoryLinks = sidebarNav.querySelectorAll('a[href^="#"]');
  if (existingCategoryLinks.length > 0) return; // Already initialized
  
  // Create category section if it doesn't exist
  let categorySection = document.querySelector('.nav-section:nth-child(3)');
  if (!categorySection) {
    categorySection = document.createElement('div');
    categorySection.className = 'nav-section';
    categorySection.innerHTML = '<h3>Categories</h3><ul class="nav-links"></ul>';
    document.querySelector('.sidebar-nav').appendChild(categorySection);
  }
  
  const categoryList = categorySection.querySelector('.nav-links');
  
  // Add category links
  categories.forEach(category => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${category}`;
    
    // Set icon based on category
    let icon = 'fa-utensils';
    if (category === 'Breakfast') icon = 'fa-sun';
    if (category === 'Main Course') icon = 'fa-hamburger';
    if (category === 'Salads') icon = 'fa-leaf';
    if (category === 'Desserts') icon = 'fa-ice-cream';
    
    link.innerHTML = `<i class="fas ${icon}"></i> ${category}`;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchCategory(category);
    });
    
    li.appendChild(link);
    categoryList.appendChild(li);
  });
}

/* =========================
   SWITCH CATEGORY
========================= */
function switchCategory(categoryName) {
  currentCategory = categoryName;
  
  // Update active tab in main menu area
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.getAttribute('data-category') === categoryName) {
      tab.classList.add('active');
    }
  });
  
  // Update active link in sidebar
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${categoryName}`) {
      link.classList.add('active');
    }
  });
  
  renderMenu();
}

/* =========================
   RENDER MENU BY CATEGORY
========================= */
function renderMenu() {
  if (!menuDiv) return;
  
  // Filter items by current category
  const categoryItems = menuItems.filter(item => item.category === currentCategory);

  // Clear menu
  menuDiv.innerHTML = "";

  // Render items in 2 rows × 3 columns grid (6 items max)
  categoryItems.slice(0, 6).forEach(item => {
    const available = canMakeItem(item);
    const itemDiv = document.createElement("div");
    itemDiv.className = "menu-item";
    
    // Use Font Awesome icon if image doesn't exist
    let imageHTML = `<div class="item-image-placeholder"><i class="fas fa-utensils"></i></div>`;
    
    itemDiv.innerHTML = `
      ${imageHTML}
      <div class="menu-item-content">
        <h4>${item.name}</h4>
        <p>${item.description}</p>
        <div class="price">R${item.price.toFixed(2)}</div>
        <button ${available ? "" : "disabled"}>
          ${available ? "ADD" : "Out of Stock"}
        </button>
      </div>
    `;
    
    // Add event listener for Add button
    const addButton = itemDiv.querySelector("button");
    if (available) {
      addButton.addEventListener("click", () => addToCart(item));
    }
    
    menuDiv.appendChild(itemDiv);
  });
}

/* =========================
   UPDATE CURRENT ORDER DISPLAY
========================= */
function updateCurrentOrderDisplay() {
  const cartContainer = document.getElementById("cart");
  if (!cartContainer) return;
  
  cartContainer.innerHTML = "";
  
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 20px;">No items added yet</p>';
    return;
  }
  
  cart.forEach((item, index) => {
    const cartRow = document.createElement("div");
    cartRow.className = "cart-row";
    cartRow.innerHTML = `
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-price">R${item.price.toFixed(2)} each</div>
      </div>
      <div class="qty-controls">
        <button class="qty-decrease" data-index="${index}">-</button>
        <span class="qty">${item.qty}</span>
        <button class="qty-increase" data-index="${index}">+</button>
        <button class="qty-remove" data-index="${index}" style="background: #e74c3c; margin-left: 10px;">×</button>
      </div>
    `;
    
    cartContainer.appendChild(cartRow);
  });
  
  // Add event listeners for quantity controls
  cartContainer.querySelectorAll('.qty-decrease').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      updateQuantity(index, -1);
    });
  });
  
  cartContainer.querySelectorAll('.qty-increase').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      updateQuantity(index, 1);
    });
  });
  
  cartContainer.querySelectorAll('.qty-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      removeItem(index);
    });
  });
}

/* =========================
   UPDATE ITEM QUANTITY
========================= */
function updateQuantity(index, change) {
  if (cart[index]) {
    cart[index].qty += change;
    
    // Remove item if quantity reaches 0
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    
    localStorage.setItem("chefos_cart", JSON.stringify(cart));
    renderCartSummary();
    updateCurrentOrderDisplay();
  }
}

/* =========================
   REMOVE ITEM FROM CART
========================= */
function removeItem(index) {
  if (cart[index]) {
    cart.splice(index, 1);
    localStorage.setItem("chefos_cart", JSON.stringify(cart));
    renderCartSummary();
    updateCurrentOrderDisplay();
  }
}

/* =========================
   CART SUMMARY (TOTAL)
========================= */
function renderCartSummary() {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalEl = document.getElementById("total");
  if (totalEl) {
    totalEl.innerHTML = `<span>Total</span><span>R${total.toFixed(2)}</span>`;
  }
}

/* =========================
   PLACE ORDER
========================= */
function placeOrder() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }
  
  const tableNumber = document.getElementById('tableNumber').value;
  if (!tableNumber) {
    alert("Please enter a table number!");
    return;
  }
  
  // Create order object
  const order = {
    id: Date.now(),
    table: parseInt(tableNumber),
    items: [...cart],
    total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    timestamp: new Date().toISOString(),
    status: 'pending'
  };
  
  // Get existing orders
  const orders = JSON.parse(localStorage.getItem('chefos_orders')) || [];
  orders.push(order);
  localStorage.setItem('chefos_orders', JSON.stringify(orders));
  
  // Update inventory
  updateInventoryForOrder(order);
  
  // Clear cart
  cart = [];
  localStorage.removeItem('chefos_cart');
  
  // Reset UI
  renderCartSummary();
  updateCurrentOrderDisplay();
  renderMenu();
  document.getElementById('tableNumber').value = '';
  
  // Show success message
  alert(`Order #${order.id} sent to kitchen for Table ${tableNumber}!`);
}

/* =========================
   UPDATE INVENTORY AFTER ORDER
========================= */
function updateInventoryForOrder(order) {
  let inventory = JSON.parse(localStorage.getItem("chefos_inventory"));
  
  order.items.forEach(item => {
    const menuItem = menuItems.find(m => m.id === item.id);
    if (menuItem) {
      Object.entries(menuItem.ingredients).forEach(([ingredient, qty]) => {
        inventory[ingredient] -= qty * item.qty;
      });
    }
  });
  
  localStorage.setItem("chefos_inventory", JSON.stringify(inventory));
}

/* =========================
   EXPORT FUNCTIONS (FOR OTHER FILES)
========================= */
// These functions can be called from other JS files if needed
window.ChefOS = window.ChefOS || {};
window.ChefOS.Menu = {
  getCart: () => cart,
  getInventory: () => inventory,
  refreshMenu: () => renderMenu(),
  refreshCart: () => {
    renderCartSummary();
    updateCurrentOrderDisplay();
  }
};

/* =========================
   RENDER MENU BY CATEGORY WITH CATEGORY ICONS
========================= */
function renderMenu() {
  if (!menuDiv) return;
  
  // Filter items by current category
  const categoryItems = menuItems.filter(item => item.category === currentCategory);

  // Clear menu
  menuDiv.innerHTML = "";

  // Get category icon mapping
  const categoryIcons = {
    'Breakfast': 'fa-sun',
    'Main Course': 'fa-utensils',
    'Salads': 'fa-leaf',
    'Desserts': 'fa-ice-cream',
    'Drinks': 'fa-glass-whiskey'
  };

  // Get category colors for badges
  const categoryColors = {
    'Breakfast': '#e67e22',
    'Main Course': '#e74c3c',
    'Salads': '#27ae60',
    'Desserts': '#9b59b6',
    'Drinks': '#3498db'
  };

  // Render items in 2 rows × 3 columns grid (6 items max)
  categoryItems.slice(0, 6).forEach(item => {
    const available = canMakeItem(item);
    const itemDiv = document.createElement("div");
    itemDiv.className = `menu-item category-${item.category.toLowerCase().replace(' ', '-')}`;
    
    // Get icon for this category
    const categoryIcon = categoryIcons[item.category] || 'fa-utensils';
    const categoryColor = categoryColors[item.category] || var(--primary);
    
    // Use real image if available, otherwise placeholder with category icon
    let imageHTML = '';
    if (item.image && item.image !== 'assets/images/placeholder.jpg') {
      imageHTML = `
        <div class="menu-item-image">
          <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.parentElement.className='menu-item-image placeholder'; this.parentElement.innerHTML='<i class=\"fas ${categoryIcon}\"></i>';" />
          <div class="category-badge">
            <i class="fas ${categoryIcon}"></i>
          </div>
        </div>
      `;
    } else {
      imageHTML = `
        <div class="menu-item-image placeholder" style="background: linear-gradient(135deg, ${categoryColor}, ${categoryColor}99);">
          <i class="fas ${categoryIcon}"></i>
          <div class="category-badge">
            <i class="fas ${categoryIcon}"></i>
          </div>
        </div>
      `;
    }
    
    itemDiv.innerHTML = `
      ${imageHTML}
      <div class="menu-item-content">
        <h4>${item.name}</h4>
        <p>${item.description}</p>
        <div class="price">R${item.price.toFixed(2)}</div>
        <button ${available ? "" : "disabled"}>
          <i class="fas fa-plus"></i> ${available ? "ADD TO ORDER" : "OUT OF STOCK"}
        </button>
      </div>
    `;
    
    // Add event listener for Add button
    const addButton = itemDiv.querySelector("button");
    if (available) {
      addButton.addEventListener("click", () => addToCart(item));
    }
    
    menuDiv.appendChild(itemDiv);
  });
}

// Handle sidebar category clicks
document.querySelectorAll('.category-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const category = this.getAttribute('data-category');
    
    // Switch to that category
    if (window.switchCategory) {
      window.switchCategory(category);
    }
    
    // Update active states
    document.querySelectorAll('.category-link').forEach(l => {
      l.classList.remove('active');
    });
    this.classList.add('active');
    
    // Also update the category tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
      tab.classList.remove('active');
      if (tab.getAttribute('data-category') === category) {
        tab.classList.add('active');
      }
    });
  });
});
