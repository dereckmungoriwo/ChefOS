const ordersDiv = document.getElementById("orders");

/* =========================
   LOAD ORDERS (SYSTEM KEY)
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
    if (String(order.id) === String(orderId)) {
      const status = (order.status || "new").toLowerCase();

      if ((status === "new" || status === "pending") && newStatus === "preparing") {
        order.status = "preparing";
      } else if (status === "preparing" && newStatus === "ready") {
        order.status = "ready";
      }
    }
    return order;
  });

  saveOrders(orders);
  renderOrders();
}

/* =========================
   COMPLETE ORDER
========================= */
function completeOrder(orderId) {
  let orders = getOrders();
  orders = orders.filter(order => String(order.id) !== String(orderId));
  saveOrders(orders);
  renderOrders();
}

/* =========================
   RENDER ORDERS
========================= */
function renderOrders() {
  if (!ordersDiv) return;

  const orders = getOrders();
  ordersDiv.innerHTML = "";

  if (!orders.length) {
    ordersDiv.innerHTML = "<p>No active orders.</p>";
    return;
  }

  orders.forEach(order => {
    const status = (order.status || "new").toLowerCase();

    const orderDiv = document.createElement("div");
    orderDiv.className = `order-box status-${status}`;

    const itemsList = (order.items || [])
      .map(item => `<li>${item.qty} × ${item.name}</li>`)
      .join("");

    orderDiv.innerHTML = `
      <h3>Ticket ${order.id}</h3>
      <p><strong>Table:</strong> ${order.table || "N/A"}</p>
      <p><strong>Time:</strong> ${order.timestamp || "--:--"}</p>
      <ul>${itemsList || "<li>No items</li>"}</ul>
      <p><strong>Total:</strong> R${Number(order.total || 0).toFixed(2)}</p>
      <span class="badge badge-${status}">${status.toUpperCase()}</span>
      <div class="kitchen-actions">
        ${(status === "new" || status === "pending")
          ? `<button data-id="${order.id}" class="prep-btn">Start Prep</button>`
          : ""}
        ${status === "preparing"
          ? `<button data-id="${order.id}" class="ready-btn">Mark Ready</button>`
          : ""}
        ${status === "ready"
          ? `<button data-id="${order.id}" class="complete-btn">Complete</button>`
          : ""}
      </div>
    `;

    ordersDiv.appendChild(orderDiv);
  });
}

/* =========================
   BUTTON HANDLING
========================= */
if (ordersDiv) {
  ordersDiv.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("prep-btn")) {
      updateStatus(id, "preparing");
    }
    if (e.target.classList.contains("ready-btn")) {
      updateStatus(id, "ready");
    }
    if (e.target.classList.contains("complete-btn")) {
      completeOrder(id);
    }
  });
}

/* =========================
   AUTO REFRESH
========================= */
if (!window.ordersIntervalSet) {
  window.ordersIntervalSet = true;
  setInterval(renderOrders, 3000);
}

/* =========================
   INIT
========================= */
renderOrders();
