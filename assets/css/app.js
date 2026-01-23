const inventory = JSON.parse(localStorage.getItem("inventory"));
const menuDiv = document.getElementById("menu");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function canMakeItem(item) {
  return Object.entries(item.ingredients).every(([ing, qty]) => inventory[ing] >= qty);
}

function addToCart(item) {
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(item.name + " added to cart");
}

menuItems.forEach(item => {
  const available = canMakeItem(item);
  const div = document.createElement("div");
  div.className = "menu-item";
  div.innerHTML = `<h3>${item.name}</h3><p>${item.description}</p><p>$${item.price}</p>
  <button ${available ? "" : "disabled"}>${available ? "Add to Cart" : "Out of Stock"}</button>`;
  if (available) div.querySelector("button").onclick = () => addToCart(item);
  menuDiv.appendChild(div);
});