const menuDiv = document.getElementById("menu");

let cart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
let inventory = JSON.parse(localStorage.getItem("chefos_inventory")) || {};

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
}

/* =========================
   RENDER MENU
========================= */
function renderMenu() {
  menuDiv.innerHTML = "";

  menuItems.forEach(item => {
    const available = canMakeItem(item);

    const itemDiv = document.createElement("div");
    itemDiv.className = "menu-item";

    itemDiv.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <p><strong>R${item.price.toFixed(2)}</strong></p>
      <button ${available ? "" : "disabled"}>
        ${available ? "Add" : "Out of Stock"}
      </button>
    `;

    if (available) {
      itemDiv.querySelector("button")
        .addEventListener("click", () => addToCart(item));
    }

    menuDiv.appendChild(itemDiv);
  });
}

/* =========================
   CART SUMMARY (POS PANEL)
========================= */
function renderCartSummary() {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const totalEl = document.getElementById("total");
  if (totalEl) {
    totalEl.textContent = "Total: R" + total.toFixed(2);
  }
}

/* =========================
   INITIALIZE PAGE
========================= */
renderMenu();
renderCartSummary();
