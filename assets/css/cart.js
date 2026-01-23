const cartDiv = document.getElementById("cart");
const totalDiv = document.getElementById("total");
const placeOrderBtn = document.getElementById("placeOrder");
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;

cart.forEach(item => {
  const p = document.createElement("p");
  p.textContent = `${item.name} - $${item.price}`;
  cartDiv.appendChild(p);
  total += item.price;
});
totalDiv.textContent = `Total: $${total}`;

function deductInventory(orderItems) {
  let inventory = JSON.parse(localStorage.getItem("inventory"));
  orderItems.forEach(item => {
    Object.entries(item.ingredients).forEach(([ing, qty]) => inventory[ing] -= qty);
  });
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

placeOrderBtn.onclick = () => {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push({ id: Date.now(), items: cart, total: total, status: "Pending" });
  localStorage.setItem("orders", JSON.stringify(orders));
  deductInventory(cart);
  localStorage.removeItem("cart");
  alert("Order sent to kitchen!");
  window.location.href = "index.html";
};