const inventoryDiv = document.getElementById("inventory");
const inventory = JSON.parse(localStorage.getItem("inventory"));

Object.entries(inventory).forEach(([ingredient, qty]) => {
  const p = document.createElement("p");
  p.className = qty <= 3 ? "low-stock" : "";
  p.innerHTML = `<strong>${ingredient.replace("_", " ")}</strong>: ${qty}`;
  inventoryDiv.appendChild(p);
});