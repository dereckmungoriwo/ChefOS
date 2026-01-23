const salesDiv = document.getElementById("sales");
const topItemsDiv = document.getElementById("topItems");
const historyDiv = document.getElementById("orderHistory");

/* =========================
   LOAD DATA
========================= */
function getOrders() {
  return JSON.parse(localStorage.getItem("chefos_orders")) || [];
}

/* =========================
   RENDER SALES METRICS
========================= */
function renderSales(orders) {
  if (orders.length === 0) {
    salesDiv.innerHTML = "<p>No sales data yet.</p>";
    return;
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  salesDiv.innerHTML = `
    <p><strong>Total Orders:</strong> ${orders.length}</p>
    <p><strong>Total Revenue:</strong> R${totalRevenue.toFixed(2)}</p>
    <p><strong>Average Order Value:</strong> R${(totalRevenue / orders.length).toFixed(2)}</p>
  `;
}

/* =========================
   TOP SELLING ITEMS
========================= */
function renderTopItems(orders) {
  topItemsDiv.innerHTML = "";

  let itemCount = {};

  orders.forEach(order => {
    order.items.forEach(item => {
      itemCount[item.name] = (itemCount[item.name] || 0) + item.qty;
    });
  });

  const sortedItems = Object.entries(itemCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (sortedItems.length === 0) {
    topItemsDiv.innerHTML = "<p>No item data yet.</p>";
    return;
  }

  sortedItems.forEach(([name, qty]) => {
    const p = document.createElement("p");
    p.textContent = `${name}: ${qty} sold`;
    topItemsDiv.appendChild(p);
  });
}

/* =========================
   ORDER HISTORY
========================= */
function renderHistory(orders) {
  historyDiv.innerHTML = "";

  if (orders.length === 0) {
    historyDiv.innerHTML = "<p>No orders recorded.</p>";
    return;
  }

  orders
    .slice()
    .reverse() // newest first
    .forEach(order => {
      const div = document.createElement("div");
      div.className = "menu-item";

      div.innerHTML = `
        <h3>Ticket ${order.id}</h3>
        <p><strong>Table:</strong> ${order.table}</p>
        <p><strong>Total:</strong> R${order.total.toFixed(2)}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Time:</strong> ${order.timestamp}</p>
      `;

      historyDiv.appendChild(div);
    });
}

/* =========================
   INIT
========================= */
function initDashboard() {
  const orders = getOrders();
  renderSales(orders);
  renderTopItems(orders);
  renderHistory(orders);
}

initDashboard();
