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
   RENDER MENU BY CATEGORIES
========================= */
function renderMenu() {
  // Group items by category
  const categories = {};
  menuItems.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });

  // Clear menu
  menuDiv.innerHTML = "";

  // Define category order
  const categoryOrder = ["Breakfast", "Main Course", "Desserts"];

  // Render each category
  categoryOrder.forEach(categoryName => {
    if (categories[categoryName]) {
      // Create category section
      const categorySection = document.createElement("div");
      categorySection.className = "menu-category";
      
      // Category title
      const categoryTitle = document.createElement("h3");
      categoryTitle.textContent = categoryName;
      categorySection.appendChild(categoryTitle);

      // Category items grid
      const categoryGrid = document.createElement("div");
      categoryGrid.id = "menu";
      categoryGrid.style.display = "grid";
      categoryGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(280px, 1fr))";
      categoryGrid.style.gap = "20px";

      // Add items to category
      categories[categoryName].forEach(item => {
        const available = canMakeItem(item);
        const itemDiv = document.createElement("div");
        itemDiv.className = "menu-item";
        
        itemDiv.innerHTML = `
          <img src="${item.image}" alt="${item.name}" />
          <div class="menu-item-content">
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <div class="price">R${item.price.toFixed(2)}</div>
            <button ${available ? "" : "disabled"}>
              ${available ? "Add to Order" : "Out of Stock"}
            </button>
          </div>
        `;
        
        if (available) {
          itemDiv.querySelector("button")
            .addEventListener("click", () => addToCart(item));
        }
        
        categoryGrid.appendChild(itemDiv);
      });

      categorySection.appendChild(categoryGrid);
      menuDiv.appendChild(categorySection);
    }
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
