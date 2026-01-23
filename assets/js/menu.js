const menuDiv = document.getElementById("menu");
let cart = JSON.parse(localStorage.getItem("chefos_cart")) || [];
let inventory = JSON.parse(localStorage.getItem("chefos_inventory")) || {};
let currentCategory = "Breakfast"; // Default category

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
   CREATE CATEGORY TABS
========================= */
function createCategoryTabs() {
  const menuArea = document.querySelector(".menu-area");
  const h2 = menuArea.querySelector("h2");
  
  // Group items by category and count them
  const categories = {};
  menuItems.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = 0;
    }
    categories[item.category]++;
  });

  // Define category order
  const categoryOrder = ["Breakfast", "Main Course", "Salads", "Desserts"];

  // Create tabs container
  const tabsContainer = document.createElement("div");
  tabsContainer.className = "category-tabs";

  // Create tabs
  categoryOrder.forEach(categoryName => {
    if (categories[categoryName]) {
      const tab = document.createElement("button");
      tab.className = `category-tab ${categoryName === currentCategory ? 'active' : ''}`;
      tab.innerHTML = `${categoryName} <span class="item-count">(${categories[categoryName]})</span>`;
      tab.addEventListener("click", () => switchCategory(categoryName));
      tabsContainer.appendChild(tab);
    }
  });

  // Insert tabs after h2
  h2.after(tabsContainer);
}

/* =========================
   SWITCH CATEGORY
========================= */
function switchCategory(categoryName) {
  currentCategory = categoryName;
  
  // Update active tab
  document.querySelectorAll(".category-tab").forEach(tab => {
    tab.classList.remove("active");
    if (tab.textContent.includes(categoryName)) {
      tab.classList.add("active");
    }
  });

  // Render menu for selected category
  renderMenu();
}

/* =========================
   RENDER MENU BY CATEGORY
========================= */
function renderMenu() {
  // Filter items by current category
  const categoryItems = menuItems.filter(item => item.category === currentCategory);

  // Clear menu
  menuDiv.innerHTML = "";

  // Render items in 2 rows × 3 columns grid (6 items max)
  categoryItems.slice(0, 6).forEach(item => {
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
          ${available ? "ADD" : "Out of Stock"}
        </button>
      </div>
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
    totalEl.innerHTML = `<span>Total</span><span>R${total.toFixed(2)}</span>`;
  }
}

/* =========================
   INITIALIZE PAGE
========================= */
createCategoryTabs();
renderMenu();
renderCartSummary();
