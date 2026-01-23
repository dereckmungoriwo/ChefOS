const menuDiv = document.getElementById("menu");
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let inventory = JSON.parse(localStorage.getItem("inventory"));

function canMakeItem(item) {
  return Object.entries(item.ingredients).every(
    ([ingredient, qty]) => inventory[ingredient] >= qty
  );
}

function addToCart(item) {
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(item.name + " added to cart");
}

menuItems.forEach(item => {
  const available = canMakeItem(item);

  const itemDiv = document.createElement("div");
  itemDiv.className = "menu-item";

  itemDiv.innerHTML = `
    <h3>${item.name}</h3>
    <p>${item.description}</p>
    <p>$${item.price.toFixed(2)}</p>
    <button ${available ? "" : "disabled"}>
      ${available ? "Add to Cart" : "Out of Stock"}
    </button>
  `;

  if (available) {
    itemDiv.querySelector("button")
      .addEventListener("click", () => addToCart(item));
  }

  menuDiv.appendChild(itemDiv);
});