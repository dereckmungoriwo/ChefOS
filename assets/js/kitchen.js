const ordersDiv = document.getElementById("orders");

let orders = JSON.parse(localStorage.getItem("orders")) || [];

function updateStatus(orderId, newStatus) {
  orders = orders.map(order => {
    if (order.id === orderId) {
      order.status = newStatus;
    }
    return order;
  });

  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();
}

function renderOrders() {
  ordersDiv.innerHTML = "";

  if (orders.length === 0) {
    ordersDiv.innerHTML = "<p>No active orders.</p>";
    return;
  }

  orders.forEach(order => {
    const orderDiv = document.createElement("div");
    orderDiv.className = `menu-item status-${order.status.toLowerCase()}`;

    let itemsList = order.items.map(item => `<li>${item.name}</li>`).join("");

    orderDiv.innerHTML = `
      <h3>Order #${order.id}</h3>
      <p><strong>Time:</strong> ${order.timestamp}</p>
      <ul>${itemsList}</ul>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <button onclick="updateStatus(${order.id}, 'Preparing')">Preparing</button>
      <button onclick="updateStatus(${order.id}, 'Ready')">Ready</button>
    `;

    ordersDiv.appendChild(orderDiv);
  });
}

renderOrders();