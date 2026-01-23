const cartDiv = document.getElementById("cart");
const totalDiv = document.getElementById("total");
const placeOrderBtn = document.getElementById("placeOrder");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;

cart.forEach(item => {
  const p = document.createElement("p");
  p.textContent = `${item.name} - $${item.price.toFixed(2)}`;
  cartDiv.appendChild(p);
  total += item.price;
});

totalDiv.textContent = `Total: $${total.toFixed(2)}`;

function deductInventory(orderItems) {
  let inventory = JSON.parse(localStorage.getItem("inventory"));

  orderItems.forEach(item => {
    Object.entries(item.ingredients).forEach(([ingredient, qty]) => {
      inventory[ingredient] -= qty;
    });
  });

  localStorage.setItem("inventory", JSON.stringify(inventory));
}

placeOrderBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  orders.push({
    id: Date.now(),
    items: cart,
    total: total,
    status: "Pending",
    timestamp: new Date().toLocaleTimeString()
  });

  localStorage.setItem("orders", JSON.stringify(orders));
  deductInventory(cart);
  localStorage.removeItem("cart");

  alert("Order sent to kitchen!");
  window.location.href = "index.html";
});