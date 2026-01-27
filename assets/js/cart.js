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

  cartDiv.innerHTML = "";
  total = 0;

  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "cart-row";

    row.innerHTML = `
      <p>${item.name} - R${Number(item.price).toFixed(2)}</p>
      <div class="qty-controls">
        <button data-index="${index}" class="decrease">-</button>
        <span>${item.qty}</span>
        <button data-index="${index}" class="increase">+</button>
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

    if (e.target.classList.contains("increase")) {
      cart[index].qty += 1;
    }

    if (e.target.classList.contains("decrease")) {
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
   PLACE ORDER (SYSTEM FIX)
========================= */
if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    let orders = JSON.parse(localStorage.getItem("chefos_orders")) || [];

    const tableNumber =
      document.getElementById("tableNumber")?.value || "Takeaway";

    // 🔧 clone items to avoid reference wipe
    const orderItems = cart.map(item => ({ ...item }));

    const order = {
      id: "T" + Date.now(),
      items: orderItems,
      total: total,
      status: "pending",          // 🔧 lowercase for system match
      table: tableNumber,
      timestamp: new Date().toISOString() // 🔧 full date for reports
    };

    orders.push(order);
    localStorage.setItem("chefos_orders", JSON.stringify(orders));

    deductInventory(orderItems);

    cart = [];
    saveCart(); // 🔧 keeps UI synced

    alert("Order sent to kitchen!");
    window.location.href = "kds.html";
  });
}

/* =========================
   INIT
========================= */
renderCart();
