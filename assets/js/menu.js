/* =========================
   CHEFOS POS - MENU & CART MANAGEMENT
========================= */
const menuDiv = document.getElementById("menu");
// REMOVE these duplicate lines:
// let cart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
// let inventory = JSON.parse(localStorage.getItem("chefos_inventory")) || {};

// Use the cart and inventory from menuItems.js instead
let currentCategory = "breakfast"; // Match HTML data-category values

/* =========================
   DOM READY
========================= */
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded, initializing ChefOS POS...");
  
  // Initialize inventory if not already done
  if (!localStorage.getItem("chefos_inventory")) {
    localStorage.setItem("chefos_inventory", JSON.stringify(defaultInventory));
  }
  
  initializePage();
  setupEventListeners();
});

/* =========================
   INITIALIZE PAGE
========================= */
function initializePage() {
  console.log("Initializing page...");
  
  // Setup existing category tabs from HTML
  setupCategoryTabsFromHTML();
  setupSidebarCategoryLinks();
  renderMenu();
  renderCartSummary();
  updateCurrentOrderDisplay();
}

/* =========================
   GET CART FUNCTION
========================= */
function getCart() {
  return JSON.parse(localStorage.getItem("chefos_cart")) || [];
}

/* =========================
   GET INVENTORY FUNCTION
========================= */
function getInventory() {
  return JSON.parse(localStorage.getItem("chefos_inventory")) || {};
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
  
  // Theme toggle
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
   SETUP CATEGORY TABS FROM HTML
========================= */
function setupCategoryTabsFromHTML() {
  const categoryTabs = document.querySelectorAll('.category-tab');
  console.log(`Found ${categoryTabs.length} category tabs`);
  
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      console.log(`Category tab clicked: ${category}`);
      switchCategory(category);
    });
  });
}

/* =========================
   SETUP SIDEBAR CATEGORY LINKS
========================= */
function setupSidebarCategoryLinks() {
  document.querySelectorAll('.sidebar .category-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const category = this.getAttribute('data-category');
      console.log(`Sidebar category clicked: ${category}`);
      switchCategory(category);
    });
  });
}

/* =========================
   INVENTORY CHECK
========================= */
function canMakeItem(item) {
  const inventory = getInventory();
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
  
  let cart = getCart();
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
   SWITCH CATEGORY
========================= */
function switchCategory(categoryName) {
  currentCategory = categoryName;
  console.log(`Switching to category: ${categoryName}`);
  
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
    const linkCategory = link.getAttribute('data-category') || 
                         link.getAttribute('href')?.replace('#', '');
    if (linkCategory === categoryName) {
      link.classList.add('active');
    }
  });
  
  renderMenu();
}

/* =========================
   RENDER MENU BY CATEGORY
========================= */
function renderMenu() {
  if (!menuDiv) {
    console.error("Menu div not found!");
    return;
  }
  
  console.log(`Rendering category: ${currentCategory}`);
  
  // Map menu item categories to match HTML data-category values
  const categoryMap = {
    'Breakfast': 'breakfast',
    'Main Course': 'main',
    'Salads': 'salads',
    'Desserts': 'desserts',
    'Drinks': 'drinks'
  };
  
  // Filter items by current category
  const categoryItems = menuItems.filter(item => {
    const itemCategory = categoryMap[item.category] || item.category.toLowerCase();
    return itemCategory === currentCategory;
  });

  console.log(`Found ${categoryItems.length} items for category ${currentCategory}`);
  
  // Clear menu
  menuDiv.innerHTML = "";

  if (categoryItems.length === 0) {
    menuDiv.innerHTML = `<div class="no-items-message">
      <i class="fas fa-utensils" style="font-size: 48px; margin-bottom: 15px; color: var(--gray);"></i>
      <p>No items found for ${currentCategory} category</p>
    </div>`;
    return;
  }

  // Render all items for the category
  categoryItems.forEach(item => {
    const available = canMakeItem(item);
    const itemDiv = document.createElement("div");
    itemDiv.className = "menu-item";
    
    // Use image if available, otherwise placeholder
    let imageHTML = '';
    if (item.image) {
      imageHTML = `
        <div class="menu-item-image">
          <img src="${item.image}" alt="${item.name}" 
               onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\"item-image-placeholder\"><i class=\"fas fa-utensils\"></i></div>';">
        </div>
      `;
    } else {
      imageHTML = `
        <div class="item-image-placeholder">
          <i class="fas fa-utensils"></i>
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

/* =========================
   UPDATE CURRENT ORDER DISPLAY
========================= */
function updateCurrentOrderDisplay() {
  const cartContainer = document.getElementById("cart");
  if (!cartContainer) return;
  
  const cart = getCart();
  cartContainer.innerHTML = "";
  
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart-message">
        <i class="fas fa-shopping-cart" style="font-size: 48px; margin-bottom: 15px; color: var(--gray);"></i>
        <p>No items added yet</p>
        <small>Click on menu items to add them to your order</small>
      </div>
    `;
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
        <button class="qty-remove" data-index="${index}" title="Remove item">×</button>
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
  let cart = getCart();
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
  let cart = getCart();
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
  const cart = getCart();
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
  const cart = getCart();
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
  let inventory = getInventory();
  
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
