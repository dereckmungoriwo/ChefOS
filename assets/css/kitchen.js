const ordersDiv = document.getElementById("orders");
let orders = JSON.parse(localStorage.getItem("orders")) || [];

function updateStatus(id, status) {
  orders = orders.map(o => o.id === id ? {...o, status} : o);
  localStorage.setItem("orders", JSON.stringify(orders));
  render();
}

function render() {
  ordersDiv.innerHTML = "";
  orders.forEach(o => {
    const div = document.createElement("div");
    div.className = "menu-item status-" + o.status.toLowerCase();
    div.innerHTML = `<h3>Order #${o.id}</h3><p>Status: ${o.status}</p>
    <button onclick="updateStatus(${o.id}, 'Preparing')">Preparing</button>
    <button onclick="updateStatus(${o.id}, 'Ready')">Ready</button>`;
    ordersDiv.appendChild(div);
  });
}
render();