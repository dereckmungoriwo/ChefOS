/* =========================
   CHEFOS POS - MENU & CART MANAGEMENT
   USING YOUR IMAGES FROM menuItems.js
========================= */

console.log("=== CHEFOS POS LOADING ===");

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
  
  console.log("Found menu container");
  
  // Check if menuItems.js loaded correctly
  if (typeof menuItems === 'undefined') {
    console.error("menuItems.js not loaded! Using fallback data.");
    showError("Menu data not loaded. Using fallback menu.");
    useFallbackMenu();
    return;
  }
  
  console.log(`Menu items loaded: ${menuItems.length} items`);
  
  // Initialize cart
  if (!localStorage.getItem("chefos_cart")) {
    localStorage.setItem("chefos_cart", JSON.stringify([]));
  }
  
  // Initialize inventory if needed
  if (!localStorage.getItem("chefos_inventory") && typeof defaultInventory !== 'undefined') {
    localStorage.setItem("chefos_inventory", JSON.stringify(defaultInventory));
    console.log("Inventory initialized from default");
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
  
  // Map HTML category names to menuItems.js category names
  const categoryMap = {
    'breakfast': 'Breakfast',
    'main': 'Main Course',
    'salads': 'Salads',
    'desserts': 'Desserts',
    'drinks': 'Drinks'
  };
  
  const menuCategory = categoryMap[category] || category;
  
  // Filter items by category
  let items = [];
  if (typeof menuItems !== 'undefined') {
    items = menuItems.filter(item => item.category === menuCategory);
    console.log(`Found ${items.length} items in ${menuCategory} category`);
  }
  
  if (items.length === 0) {
    console.warn(`No items found for category: ${menuCategory}, using fallback`);
    items = getFallbackItems(category);
  }
  
  // Clear menu
  menuDiv.innerHTML = '';
  
  // Add items to menu
  items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'menu-item';
    
    // Get category color for fallback
    const colors = {
      'breakfast': '#e67e22',
      'main': '#e74c3c',
      'salads': '#27ae60',
      'desserts': '#9b59b6',
      'drinks': '#3498db'
    };
    
    const color = colors[category] || '#1e6f5c';
    
    // Get icon based on category
    const icons = {
      'breakfast': 'fa-sun',
      'main': 'fa-utensils',
      'salads': 'fa-leaf',
      'desserts': 'fa-ice-cream',
      'drinks': 'fa-glass-whiskey'
    };
    
    const icon = icons[category] || 'fa-utensils';
    
    // Use item image if available, otherwise use placeholder with category color
    let imageHTML = '';
    if (item.image) {
      imageHTML = `
        <div class="menu-item-image">
          <img src="${item.image}" alt="${item.name}" 
               onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\"image-fallback\" style=\"background: linear-gradient(135deg, ${color}, ${color}99);\"><i class=\"fas ${icon}\"></i></div>';">
        </div>
      `;
    } else {
      imageHTML = `
        <div class="image-fallback" style="background: linear-gradient(135deg, ${color}, ${color}99);">
          <i class="fas ${icon}"></i>
        </div>
      `;
    }
    
    itemDiv.innerHTML = `
      ${imageHTML}
      <div class="menu-item-content">
        <h4>${item.name}</h4>
        <p>${item.description}</p>
        <div class="price">R${item.price.toFixed(2)}</div>
        <button onclick="addToCart('${item.id}', '${item.name}', ${item.price})">
          <i class="fas fa-plus"></i> ADD TO ORDER
        </button>
      </div>
    `;
    
    menuDiv.appendChild(itemDiv);
  });
  
  console.log(`Displayed ${items.length} items for ${category}`);
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
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
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
          <button onclick="removeFromCart(${index})" class="remove-btn">×</button>
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

// Fallback functions in case menuItems.js doesn't load
function useFallbackMenu() {
  console.log("Using fallback menu system");
  setupCategoryTabs();
  setupSidebarLinks();
  setupOrderButton();
  loadMenu('breakfast');
  updateCartDisplay();
}

function getFallbackItems(category) {
  const fallbackData = {
    breakfast: [
      { id: 'pancakes_fb', name: "Classic Pancakes", description: "Fluffy pancakes with maple syrup", price: 65, image: "assets/images/pancakes.jpg" },
      { id: 'eggs_fb', name: "Eggs Benedict", description: "Poached eggs with hollandaise", price: 95, image: "assets/images/eggs-benedict.jpg" },
      { id: 'burrito_fb', name: "Breakfast Burrito", description: "Eggs, bacon, cheese in tortilla", price: 75, image: "assets/images/breakfast-burrito.jpg" }
    ],
    main: [
      { id: 'burger_fb', name: "Beef Burger", description: "Grilled beef with cheese", price: 85, image: "assets/images/burger.jpg" },
      { id: 'salmon_fb', name: "Grilled Salmon", description: "Atlantic salmon with vegetables", price: 145, image: "assets/images/salmon.jpg" },
      { id: 'pasta_fb', name: "Chicken Alfredo", description: "Creamy pasta with grilled chicken", price: 110, image: "assets/images/pasta.jpg" }
    ],
    salads: [
      { id: 'caesar_fb', name: "Caesar Salad", description: "Romaine with parmesan & croutons", price: 75, image: "assets/images/caesar-salad.jpg" },
      { id: 'greek_fb', name: "Greek Salad", description: "Feta, olives, cucumber, tomato", price: 70, image: "assets/images/greek-salad.jpg" },
      { id: 'caprese_fb', name: "Caprese Salad", description: "Mozzarella, tomato, basil", price: 80, image: "assets/images/caprese-salad.jpg" }
    ],
    desserts: [
      { id: 'cake_fb', name: "Chocolate Lava Cake", description: "Warm cake with molten center", price: 65, image: "assets/images/chocolate-cake.jpg" },
      { id: 'cheesecake_fb', name: "New York Cheesecake", description: "Creamy cheesecake with berries", price: 70, image: "assets/images/cheesecake.jpg" },
      { id: 'tiramisu_fb', name: "Classic Tiramisu", description: "Coffee-flavored Italian dessert", price: 75, image: "assets/images/tiramisu.jpg" }
    ],
    drinks: [
      { id: 'coffee_fb', name: "Cappuccino", description: "Freshly brewed Italian coffee", price: 35, image: "assets/images/cappuccino.jpg" },
      { id: 'juice_fb', name: "Fresh Orange Juice", description: "Freshly squeezed orange juice", price: 25, image: "assets/images/orange-juice.jpg" },
      { id: 'smoothie_fb', name: "Berry Smoothie", description: "Mixed berries with yogurt", price: 40, image: "assets/images/smoothie.jpg" }
    ]
  };
  
  return fallbackData[category] || [];
}

function showError(message) {
  const menuDiv = document.getElementById('menu');
  if (menuDiv) {
    menuDiv.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Error Loading Menu</h3>
        <p>${message}</p>
        <button onclick="location.reload()">Reload Page</button>
      </div>
    `;
  }
}

console.log("Menu.js setup complete, waiting for DOM...");