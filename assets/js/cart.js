/* =========================
   CHEFOS POS - CART & ORDER MANAGEMENT
   FIXED VERSION - Proper kitchen sync
========================= */

const cartDiv = document.getElementById("cart");
const totalDiv = document.getElementById("total");
const placeOrderBtn = document.getElementById("placeOrder");

let cart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
let inventory = JSON.parse(localStorage.getItem("chefos_inventory")) || {};
let total = 0;

/* =========================
   RENDER CART
========================= */
function renderCart() {
  if (!cartDiv || !totalDiv) return;
  
  cart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
  cartDiv.innerHTML = "";
  total = 0;

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
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-price">R${Number(item.price).toFixed(2)} each</div>
      </div>
      <div class="qty-controls">
        <button data-index="${index}" class="qty-decrease">-</button>
        <span class="qty">${item.qty}</span>
        <button data-index="${index}" class="qty-increase">+</button>
      </div>
    `;
    cartDiv.appendChild(row);
    total += Number(item.price) * item.qty;
  });

  totalDiv.textContent = `Total: R${total.toFixed(2)}`;
}

/* =========================
   UPDATE QUANTITY
========================= */
if (cartDiv) {
  cartDiv.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (index === undefined) return;

    cart = JSON.parse(localStorage.getItem("chefos_cart")) || [];

    if (e.target.classList.contains("qty-increase")) {
      cart[index].qty += 1;
    }
    
    if (e.target.classList.contains("qty-decrease")) {
      if (cart[index].qty > 1) {
        cart[index].qty -= 1;
      } else {
        cart.splice(index, 1);
      }
    }
    
    saveCart();
  });
}

/* =========================
   SAVE CART
========================= */
function saveCart() {
  localStorage.setItem("chefos_cart", JSON.stringify(cart));
  renderCart();
}

/* =========================
   INVENTORY DEDUCTION (SAFE)
========================= */
function deductInventory(orderItems) {
  if (!window.menuItems) return;

  orderItems.forEach(orderItem => {
    const menuItem = menuItems.find(m => m.id === orderItem.id);
    if (!menuItem || !menuItem.ingredients) return;

    Object.entries(menuItem.ingredients).forEach(([ingredient, qty]) => {
      if (inventory[ingredient] == null) inventory[ingredient] = 0;
      inventory[ingredient] -= qty * orderItem.qty;
      if (inventory[ingredient] < 0) inventory[ingredient] = 0;
    });
  });

  localStorage.setItem("chefos_inventory", JSON.stringify(inventory));
}

/* =========================
   PLACE ORDER - FIXED VERSION
   This fixes the "cart is empty" bug
========================= */
if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", () => {
    // Get fresh cart data
    const currentCart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
    
    // Validate cart is not empty
    if (currentCart.length === 0) {
      alert("❌ Cart is empty. Please add items first.");
      return;
    }

    // Get table number
    const tableNumberInput = document.getElementById("tableNumber");
    const tableNumber = tableNumberInput?.value?.trim() || "Takeaway";

    if (!tableNumberInput?.value?.trim()) {
      const confirmOrder = confirm("No table number entered. Continue with Takeaway order?");
      if (!confirmOrder) return;
    }

    // Create deep copy of cart items to prevent reference issues
    const orderItems = currentCart.map(item => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      qty: Number(item.qty)
    }));

    // Calculate total
    const orderTotal = orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Create order object with proper structure for kitchen sync
    const order = {
      id: "ORD" + Date.now(),
      items: orderItems,
      total: orderTotal,
      status: "pending",  // ✅ lowercase for kitchen.js compatibility
      table: tableNumber,
      timestamp: new Date().toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      fullTimestamp: new Date().toISOString(),
      orderTime: new Date().getTime()
    };

    // Get existing orders
    let orders = JSON.parse(localStorage.getItem("chefos_orders")) || [];
    
    // Add new order
    orders.push(order);
    
    // Save orders to localStorage
    localStorage.setItem("chefos_orders", JSON.stringify(orders));

    // Deduct inventory
    deductInventory(orderItems);

    // Clear cart AFTER saving order
    localStorage.setItem("chefos_cart", JSON.stringify([]));
    cart = [];
    
    // Clear table number
    if (tableNumberInput) {
      tableNumberInput.value = '';
    }

    // Update UI
    renderCart();

    // Show success message
    alert(`✅ Order #${order.id} sent to kitchen!\n\nTable: ${tableNumber}\nItems: ${orderItems.length}\nTotal: R${orderTotal.toFixed(2)}`);

    // Redirect to kitchen screen
    setTimeout(() => {
      window.location.href = "kds.html";
    }, 500);
  });
}

/* =========================
   REAL-TIME SYNC
========================= */
// Listen for storage changes (for multi-tab sync)
window.addEventListener('storage', (e) => {
  if (e.key === 'chefos_cart') {
    renderCart();
  }
});

/* =========================
   INIT
========================= */
renderCart();

// Auto-refresh cart every 2 seconds for real-time updates
setInterval(() => {
  const newCart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
  if (JSON.stringify(newCart) !== JSON.stringify(cart)) {
    renderCart();
  }
}, 2000);

console.log("✅ ChefOS Cart system initialized");
