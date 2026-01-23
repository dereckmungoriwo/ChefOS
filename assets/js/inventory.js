const inventoryDiv = document.getElementById("inventory");

let inventory = JSON.parse(localStorage.getItem("chefos_inventory")) || {};

/* =========================
   RENDER INVENTORY
========================= */
function renderInventory() {
  inventoryDiv.innerHTML = "";

  Object.entries(inventory).forEach(([ingredient, qty]) => {
    const row = document.createElement("div");
    row.className = "cart-row";

    const isLow = qty <= 3;

    row.innerHTML = `
      <p>
        <strong>${formatName(ingredient)}</strong>
        <span class="${isLow ? "low-stock" : ""}">(${qty})</span>
      </p>
      <div class="qty-controls">
        <button data-item="${ingredient}" class="decrease">-</button>
        <button data-item="${ingredient}" class="increase">+</button>
      </div>
    `;

    inventoryDiv.appendChild(row);
  });
}

/* =========================
   FORMAT LABELS
========================= */
function formatName(name) {
  return name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

/* =========================
   UPDATE STOCK
========================= */
inventoryDiv.addEventListener("click", (e) => {
  const item = e.target.dataset.item;
  if (!item) return;

  if (e.target.classList.contains("increase")) {
    inventory[item] += 1;
  }

  if (e.target.classList.contains("decrease")) {
    if (inventory[item] > 0) inventory[item] -= 1;
  }

  saveInventory();
});

/* =========================
   SAVE INVENTORY
========================= */
function saveInventory() {
  localStorage.setItem("chefos_inventory", JSON.stringify(inventory));
  renderInventory();
}

/* =========================
   INIT
========================= */
renderInventory();
