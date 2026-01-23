const ordersDiv = document.getElementById("orders");

/* =========================
   LOAD ORDERS
========================= */
function getOrders() {
  return JSON.parse(localStorage.getItem("chefos_orders")) || [];
}

/* =========================
   SAVE ORDERS
========================= */
function saveOrders(orders) {
  localStorage.setItem("chefos_orders", JSON.stringify(orders));
}

/* =========================
   STATUS TRANSITIONS
========================= */
function updateStatus(orderId, newStatus) {
  let orders = getOrders();

  orders = orders.map(order => {
    if (order.id === orderId) {
      // Enforce workflow order
      if (order.status === "Pending" && newStatus === "Preparing") {
        order.status = "Preparing";
      } else if (order.status === "Preparing" && newStatus === "Ready") {
        order.status = "Ready";
      }
    }
    return order;
  });

  saveOrders(orders);
  renderOrders();
}

/* =========================
   COMPLETE ORDER (REMOVE)
========================= */
function completeOrder(orderId) {
  let orders = getOrders();
  orders = orders.filter(order => order.id !== orderId);
  saveOrders(orders);
  renderOrders();
}

/* =========================
   RENDER KITCHEN ORDERS
========================= */
function renderOrders() {
  const orders = getOrders();
  ordersDiv.innerHTML = "";

  if (orders.length === 0) {
    ordersDiv.innerHTML = "<p>No active orders.</p>";
    return;
  }

  orders.forEach(order => {
    const orderDiv = document.createElement("div");
    orderDiv.className = `order-box status-${order.status.toLowerCase()}`;

    const itemsList = order.items
      .map(item => `<li>${item.qty} × ${item.name}</li>`)
      .join("");

    orderDiv.innerHTML = `
      <h3>Ticket ${order.id}</h3>
      <p><strong>Table:</strong> ${order.table}</p>
      <p><strong>Time:</strong> ${order.timestamp}</p>
      <ul>${itemsList}</ul>
      <p><strong>Total:</strong> R${order.total.toFixed(2)}</p>
      <span class="badge badge-${order.status.toLowerCase()}">
        ${order.status}
      </span>
      <div class="kitchen-actions">
        ${
          order.status === "Pending"
            ? `<button data-id="${order.id}" class="prep-btn">Start Prep</button>`
            : ""
        }
        ${
          order.status === "Preparing"
            ? `<button data-id="${order.id}" class="ready-btn">Mark Ready</button>`
            : ""
        }
        ${
          order.status === "Ready"
            ? `<button data-id="${order.id}" class="complete-btn">Complete</button>`
            : ""
        }
      </div>
    `;

    ordersDiv.appendChild(orderDiv);
  });
}

/* =========================
   BUTTON HANDLING
========================= */
ordersDiv.addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains("prep-btn")) {
    updateStatus(id, "Preparing");
  }

  if (e.target.classList.contains("ready-btn")) {
    updateStatus(id, "Ready");
  }

  if (e.target.classList.contains("complete-btn")) {
    completeOrder(id);
  }
});

/* =========================
   AUTO REFRESH (REAL KDS)
========================= */
setInterval(renderOrders, 3000);

/* =========================
   INIT
========================= */
renderOrders();
