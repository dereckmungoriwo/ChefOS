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
  cartDiv.innerHTML = "";
  total = 0;

  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "cart-row";

    row.innerHTML = `
      <p>${item.name} - R${item.price.toFixed(2)}</p>
      <div class="qty-controls">
        <button data-index="${index}" class="decrease">-</button>
        <span>${item.qty}</span>
        <button data-index="${index}" class="increase">+</button>
      </div>
    `;

    cartDiv.appendChild(row);
    total += item.price * item.qty;
  });

  totalDiv.textContent = `Total: R${total.toFixed(2)}`;
}

/* =========================
   UPDATE QUANTITY
========================= */
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

/* =========================
   SAVE CART
========================= */
function saveCart() {
  localStorage.setItem("chefos_cart", JSON.stringify(cart));
  renderCart();
}

/* =========================
   INVENTORY DEDUCTION
========================= */
function deductInventory(orderItems) {
  orderItems.forEach(orderItem => {
    const menuItem = menuItems.find(m => m.id === orderItem.id);
    if (!menuItem) return;

    Object.entries(menuItem.ingredients).forEach(([ingredient, qty]) => {
      inventory[ingredient] -= qty * orderItem.qty;
    });
  });

  localStorage.setItem("chefos_inventory", JSON.stringify(inventory));
}

/* =========================
   PLACE ORDER
========================= */
placeOrderBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Cart is empty.");
    return;
  }

  let orders = JSON.parse(localStorage.getItem("chefos_orders")) || [];

  const tableNumber =
    document.getElementById("tableNumber").value || "Takeaway";

  const order = {
    id: "T" + Date.now(),          // Ticket ID
    items: cart,
    total: total,
    status: "Pending",
    table: tableNumber,
    timestamp: new Date().toLocaleTimeString()
  };

  orders.push(order);

  localStorage.setItem("chefos_orders", JSON.stringify(orders));

  deductInventory(cart);

  localStorage.removeItem("chefos_cart");
  cart = [];

  alert("Order sent to kitchen!");
  window.location.href = "kds.html";
});

/* =========================
   INIT
========================= */
renderCart();
