/* =========================
   CHEFOS POS - MENU & CART MANAGEMENT
   SIMPLE WORKING VERSION
========================= */

console.log("=== MENU.JS LOADED ===");

// Wait for everything to load
window.addEventListener('DOMContentLoaded', function() {
  console.log("Starting ChefOS POS initialization...");
  
  // Initialize with a slight delay to ensure everything is ready
  setTimeout(initializeSystem, 100);
});

function initializeSystem() {
  console.log("Initializing system...");
  
  // Get the menu container
  const menuDiv = document.getElementById('menu');
  if (!menuDiv) {
    console.error("ERROR: Cannot find #menu element!");
    showError("Cannot find menu container. Please check HTML structure.");
    return;
  }
  
  console.log("Found menu container:", menuDiv);
  
  // Initialize cart
  if (!localStorage.getItem("chefos_cart")) {
    localStorage.setItem("chefos_cart", JSON.stringify([]));
  }
  
  // Initialize inventory if needed
  if (!localStorage.getItem("chefos_inventory")) {
    localStorage.setItem("chefos_inventory", JSON.stringify({
      flour: 20, eggs: 30, milk: 15, butter: 10, bread: 20,
      beef_patty: 10, chicken: 12, lettuce: 20, tomato: 15,
      coffee: 20, sugar: 20, water: 50
    }));
  }
  
  // Setup category tabs
  setupCategoryTabs();
  
  // Setup sidebar links
  setupSidebarLinks();
  
  // Setup order button
  setupOrderButton();
  
  // Load initial menu (breakfast)
  loadMenu('breakfast');
  
  // Update cart display
  updateCartDisplay();
  
  console.log("System initialization complete!");
}

function setupCategoryTabs() {
  const tabs = document.querySelectorAll('.category-tab');
  console.log(`Found ${tabs.length} category tabs`);
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Add active to clicked tab
      this.classList.add('active');
      
      const category = this.getAttribute('data-category');
      console.log(`Loading category: ${category}`);
      loadMenu(category);
    });
  });
}

function setupSidebarLinks() {
  document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const category = this.getAttribute('data-category');
      console.log(`Sidebar category clicked: ${category}`);
      loadMenu(category);
      
      // Update active tab
      document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-category') === category) {
          tab.classList.add('active');
        }
      });
    });
  });
}

function setupOrderButton() {
  const orderBtn = document.getElementById('placeOrder');
  if (orderBtn) {
    orderBtn.addEventListener('click', function() {
      const cart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      
      const tableNumber = document.getElementById('tableNumber').value;
      if (!tableNumber) {
        alert("Please enter a table number!");
        return;
      }
      
      alert(`Order sent to kitchen for Table ${tableNumber}!`);
      localStorage.setItem("chefos_cart", JSON.stringify([]));
      updateCartDisplay();
    });
  }
}

function loadMenu(category) {
  console.log(`Loading menu for category: ${category}`);
  
  const menuDiv = document.getElementById('menu');
  if (!menuDiv) return;
  
  // Menu data - simplified version
  const menuData = {
    breakfast: [
      { id: 1, name: "Classic Pancakes", description: "Fluffy pancakes with maple syrup", price: 65, icon: "fa-pancakes" },
      { id: 2, name: "Eggs Benedict", description: "Poached eggs with hollandaise", price: 95, icon: "fa-egg" },
      { id: 3, name: "Breakfast Burrito", description: "Eggs, bacon, cheese in tortilla", price: 75, icon: "fa-burrito" },
      { id: 4, name: "French Toast", description: "Golden brioche with berries", price: 70, icon: "fa-bread-slice" },
      { id: 5, name: "Veggie Omelette", description: "Three eggs with vegetables", price: 60, icon: "fa-egg" },
      { id: 6, name: "Avocado Toast", description: "Smashed avocado on sourdough", price: 55, icon: "fa-avocado" }
    ],
    main: [
      { id: 7, name: "Beef Burger", description: "Grilled beef with cheese", price: 85, icon: "fa-hamburger" },
      { id: 8, name: "Grilled Salmon", description: "Atlantic salmon with vegetables", price: 145, icon: "fa-fish" },
      { id: 9, name: "Chicken Alfredo", description: "Creamy pasta with grilled chicken", price: 110, icon: "fa-utensils" },
      { id: 10, name: "Ribeye Steak", description: "12oz ribeye with mashed potatoes", price: 185, icon: "fa-steak" },
      { id: 11, name: "BBQ Ribs", description: "Slow-cooked ribs with coleslaw", price: 165, icon: "fa-drumstick" },
      { id: 12, name: "Fish & Chips", description: "Beer-battered fish with fries", price: 95, icon: "fa-fish" }
    ],
    salads: [
      { id: 13, name: "Caesar Salad", description: "Romaine with parmesan & croutons", price: 75, icon: "fa-leaf" },
      { id: 14, name: "Greek Salad", description: "Feta, olives, cucumber, tomato", price: 70, icon: "fa-leaf" },
      { id: 15, name: "Caprese Salad", description: "Mozzarella, tomato, basil", price: 80, icon: "fa-leaf" },
      { id: 16, name: "Cobb Salad", description: "Chicken, bacon, egg, avocado", price: 95, icon: "fa-leaf" },
      { id: 17, name: "Quinoa Power Bowl", description: "Quinoa with roasted vegetables", price: 85, icon: "fa-leaf" },
      { id: 18, name: "Asian Chicken Salad", description: "Grilled chicken with sesame dressing", price: 90, icon: "fa-leaf" }
    ],
    desserts: [
      { id: 19, name: "Chocolate Lava Cake", description: "Warm cake with molten center", price: 65, icon: "fa-cake" },
      { id: 20, name: "New York Cheesecake", description: "Creamy cheesecake with berries", price: 70, icon: "fa-cheese" },
      { id: 21, name: "Classic Tiramisu", description: "Coffee-flavored Italian dessert", price: 75, icon: "fa-mug-hot" },
      { id: 22, name: "Fudge Brownie", description: "Warm brownie with ice cream", price: 55, icon: "fa-cookie" },
      { id: 23, name: "Crème Brûlée", description: "Vanilla custard with caramel", price: 70, icon: "fa-ice-cream" },
      { id: 24, name: "Apple Pie", description: "Classic pie with vanilla ice cream", price: 60, icon: "fa-pie" }
    ],
    drinks: [
      { id: 25, name: "Cappuccino", description: "Freshly brewed Italian coffee", price: 35, icon: "fa-coffee" },
      { id: 26, name: "Fresh Orange Juice", description: "Freshly squeezed orange juice", price: 25, icon: "fa-glass-whiskey" },
      { id: 27, name: "Iced Tea", description: "Refreshing lemon iced tea", price: 20, icon: "fa-glass-whiskey" },
      { id: 28, name: "Berry Smoothie", description: "Mixed berries with yogurt", price: 40, icon: "fa-glass-whiskey" },
      { id: 29, name: "Coca Cola", description: "Classic cola drink", price: 15, icon: "fa-glass-whiskey" },
      { id: 30, name: "Mineral Water", description: "Sparkling mineral water", price: 10, icon: "fa-glass-whiskey" }
    ]
  };
  
  // Get items for selected category
  const items = menuData[category] || [];
  
  if (items.length === 0) {
    menuDiv.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #666;">
        <i class="fas fa-utensils" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
        <p>No items found for ${category} category</p>
      </div>
    `;
    return;
  }
  
  // Clear menu
  menuDiv.innerHTML = '';
  
  // Add items to menu
  items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'menu-item';
    
    // Category colors
    const colors = {
      breakfast: '#e67e22',
      main: '#e74c3c',
      salads: '#27ae60',
      desserts: '#9b59b6',
      drinks: '#3498db'
    };
    
    const color = colors[category] || '#1e6f5c';
    
    itemDiv.innerHTML = `
      <div class="menu-item-image" style="background: linear-gradient(135deg, ${color}, ${color}99);">
        <i class="fas ${item.icon || 'fa-utensils'}"></i>
      </div>
      <div class="menu-item-content">
        <h4>${item.name}</h4>
        <p>${item.description}</p>
        <div class="price">R${item.price.toFixed(2)}</div>
        <button onclick="addToCart(${item.id}, '${item.name}', ${item.price})">
          <i class="fas fa-plus"></i> ADD TO ORDER
        </button>
      </div>
    `;
    
    menuDiv.appendChild(itemDiv);
  });
  
  console.log(`Loaded ${items.length} items for ${category}`);
}

// Make addToCart available globally
window.addToCart = function(id, name, price) {
  console.log(`Adding to cart: ${name}`);
  
  let cart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
  
  // Check if item already in cart
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      quantity: 1
    });
  }
  
  localStorage.setItem("chefos_cart", JSON.stringify(cart));
  updateCartDisplay();
  
  // Show feedback
  const button = event.target.closest('button');
  if (button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> ADDED!';
    button.style.background = '#27ae60';
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = '';
    }, 1000);
  }
};

function updateCartDisplay() {
  const cart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
  const cartContainer = document.getElementById('cart');
  const totalElement = document.getElementById('total');
  
  if (!cartContainer || !totalElement) return;
  
  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalElement.innerHTML = `<span>Total</span><span>R${total.toFixed(2)}</span>`;
  
  // Update cart display
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: #666;">
        <i class="fas fa-shopping-cart" style="font-size: 48px; margin-bottom: 15px; opacity: 0.5;"></i>
        <p>No items added yet</p>
        <small>Click on menu items to add them to your order</small>
      </div>
    `;
    return;
  }
  
  let cartHTML = '';
  cart.forEach((item, index) => {
    cartHTML += `
      <div class="cart-row">
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-price">R${item.price.toFixed(2)} each</div>
        </div>
        <div class="qty-controls">
          <button onclick="updateCartQuantity(${index}, -1)">-</button>
          <span class="qty">${item.quantity}</span>
          <button onclick="updateCartQuantity(${index}, 1)">+</button>
          <button onclick="removeFromCart(${index})" style="background: #e74c3c;">×</button>
        </div>
      </div>
    `;
  });
  
  cartContainer.innerHTML = cartHTML;
}

window.updateCartQuantity = function(index, change) {
  let cart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
  
  if (cart[index]) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    
    localStorage.setItem("chefos_cart", JSON.stringify(cart));
    updateCartDisplay();
  }
};

window.removeFromCart = function(index) {
  let cart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
  
  if (cart[index]) {
    cart.splice(index, 1);
    localStorage.setItem("chefos_cart", JSON.stringify(cart));
    updateCartDisplay();
  }
};

function showError(message) {
  const menuDiv = document.getElementById('menu');
  if (menuDiv) {
    menuDiv.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #fee; border: 2px solid #e74c3c; border-radius: 10px; margin: 20px;">
        <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #e74c3c; margin-bottom: 20px;"></i>
        <h3 style="color: #c0392b;">Error Loading Menu</h3>
        <p>${message}</p>
        <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
}

console.log("Menu.js setup complete, waiting for DOM...");