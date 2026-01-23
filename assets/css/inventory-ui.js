const inventoryDiv = document.getElementById("inventory");
const inventory = JSON.parse(localStorage.getItem("inventory"));
Object.entries(inventory).forEach(([ing, qty]) => {
  const p = document.createElement("p");
  p.innerHTML = `<strong>${ing}</strong>: ${qty}`;
  inventoryDiv.appendChild(p);
});