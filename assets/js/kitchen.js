/* =========================
   CHEFOS KITCHEN DISPLAY SYSTEM (KDS)
   FIXED VERSION - Proper order sync
========================= */

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
    if (String(order.id) === String(orderId)) {
      const currentStatus = (order.status || "pending").toLowerCase();
      
      // Status flow: pending → preparing → ready → completed
      if (currentStatus === "pending" && newStatus === "preparing") {
        order.status = "preparing";
        order.prepStartTime = new Date().toISOString();
      } else if (currentStatus === "preparing" && newStatus === "ready") {
        order.status = "ready";
        order.readyTime = new Date().toISOString();
      } else if (currentStatus === "ready" && newStatus === "completed") {
        order.status = "completed";
        order.completedTime = new Date().toISOString();
      }
    }
    return order;
  });
  
  saveOrders(orders);
  renderOrders();
}

/* =========================
   COMPLETE ORDER (REMOVE FROM DISPLAY)
========================= */
function completeOrder(orderId) {
  let orders = getOrders();
  
  // Archive completed orders instead of deleting
  let completedOrders = JSON.parse(localStorage.getItem("chefos_completed_orders")) || [];
  const orderToComplete = orders.find(o => String(o.id) === String(orderId));
  
  if (orderToComplete) {
    orderToComplete.status = "completed";
    orderToComplete.completedTime = new Date().toISOString();
    completedOrders.push(orderToComplete);
    localStorage.setItem("chefos_completed_orders", JSON.stringify(completedOrders));
  }
  
  // Remove from active orders
  orders = orders.filter(order => String(order.id) !== String(orderId));
  saveOrders(orders);
  renderOrders();
  
  // Show notification
  showKitchenNotification(`Order #${orderId} completed!`, 'success');
}

/* =========================
   RENDER ORDERS BY STATUS COLUMNS
========================= */
function renderOrders() {
  if (!ordersDiv) return;

  const orders = getOrders();
  ordersDiv.innerHTML = "";

  if (!orders.length) {
    ordersDiv.innerHTML = `
      <div class="no-orders-message">
        <i class="fas fa-utensils fa-4x"></i>
        <h3>No Active Orders</h3>
        <p>Waiting for new orders from POS...</p>
      </div>
    `;
    return;
  }

  // Group orders by status
  const pendingOrders = orders.filter(o => (o.status || "pending").toLowerCase() === "pending");
  const preparingOrders = orders.filter(o => (o.status || "").toLowerCase() === "preparing");
  const readyOrders = orders.filter(o => (o.status || "").toLowerCase() === "ready");

  // Create columns layout
  const columnsHTML = `
    <div class="kds-columns">
      <div class="kds-column pending-column">
        <h3><i class="fas fa-clock"></i> New Orders (${pendingOrders.length})</h3>
        <div class="orders-list" id="pending-list"></div>
      </div>
      
      <div class="kds-column preparing-column">
        <h3><i class="fas fa-fire"></i> Preparing (${preparingOrders.length})</h3>
        <div class="orders-list" id="preparing-list"></div>
      </div>
      
      <div class="kds-column ready-column">
        <h3><i class="fas fa-check-circle"></i> Ready (${readyOrders.length})</h3>
        <div class="orders-list" id="ready-list"></div>
      </div>
    </div>
  `;

  ordersDiv.innerHTML = columnsHTML;

  // Render orders in each column
  renderOrdersInColumn(pendingOrders, 'pending-list', 'pending');
  renderOrdersInColumn(preparingOrders, 'preparing-list', 'preparing');
  renderOrdersInColumn(readyOrders, 'ready-list', 'ready');
}

/* =========================
   RENDER ORDERS IN SPECIFIC COLUMN
========================= */
function renderOrdersInColumn(orders, containerId, status) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = `<p class="empty-column-message">No orders ${status}</p>`;
    return;
  }

  orders.forEach(order => {
    const orderDiv = document.createElement("div");
    orderDiv.className = `order-card status-${status}`;
    
    // Calculate time elapsed
    const orderTime = new Date(order.fullTimestamp || order.orderTime);
    const elapsed = getElapsedTime(orderTime);

    const itemsList = (order.items || [])
      .map(item => `
        <li>
          <span class="item-qty">${item.qty}x</span>
          <span class="item-name">${item.name}</span>
          <span class="item-price">R${(item.price * item.qty).toFixed(2)}</span>
        </li>
      `)
      .join("");

    orderDiv.innerHTML = `
      <div class="order-header">
        <h4>Order #${order.id.substring(order.id.length - 6)}</h4>
        <span class="badge badge-${status}">${status.toUpperCase()}</span>
      </div>
      
      <div class="order-info">
        <p><i class="fas fa-chair"></i> <strong>Table:</strong> ${order.table || "Takeaway"}</p>
        <p><i class="fas fa-clock"></i> <strong>Time:</strong> ${order.timestamp || "--:--"}</p>
        <p class="elapsed-time ${elapsed > 15 ? 'warning' : ''}">
          <i class="fas fa-hourglass-half"></i> ${elapsed} min ago
        </p>
      </div>
      
      <div class="order-items">
        <h5><i class="fas fa-list"></i> Items:</h5>
        <ul>${itemsList}</ul>
      </div>
      
      <div class="order-total">
        <strong>Total:</strong> R${Number(order.total || 0).toFixed(2)}
      </div>
      
      <div class="kitchen-actions">
        ${status === "pending" 
          ? `<button data-id="${order.id}" class="prep-btn"><i class="fas fa-play"></i> Start Preparing</button>` 
          : ""}
        ${status === "preparing" 
          ? `<button data-id="${order.id}" class="ready-btn"><i class="fas fa-check"></i> Mark Ready</button>` 
          : ""}
        ${status === "ready" 
          ? `<button data-id="${order.id}" class="complete-btn"><i class="fas fa-thumbs-up"></i> Complete Order</button>` 
          : ""}
      </div>
    `;
    
    container.appendChild(orderDiv);
  });
}

/* =========================
   CALCULATE ELAPSED TIME
========================= */
function getElapsedTime(orderTime) {
  const now = new Date();
  const diff = Math.floor((now - orderTime) / 1000 / 60); // minutes
  return diff;
}

/* =========================
   BUTTON HANDLING
========================= */
if (ordersDiv) {
  ordersDiv.addEventListener("click", (e) => {
    const id = e.target.dataset.id || e.target.closest('button')?.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("prep-btn") || e.target.closest('.prep-btn')) {
      updateStatus(id, "preparing");
      showKitchenNotification(`Order #${id.substring(id.length - 6)} started!`, 'info');
    }
    
    if (e.target.classList.contains("ready-btn") || e.target.closest('.ready-btn')) {
      updateStatus(id, "ready");
      showKitchenNotification(`Order #${id.substring(id.length - 6)} is ready!`, 'success');
    }
    
    if (e.target.classList.contains("complete-btn") || e.target.closest('.complete-btn')) {
      completeOrder(id);
    }
  });
}

/* =========================
   KITCHEN NOTIFICATION
========================= */
function showKitchenNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `kitchen-notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add('show'), 100);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/* =========================
   AUTO REFRESH (REAL-TIME)
========================= */
let refreshInterval;
if (!window.kitchenRefreshSet) {
  window.kitchenRefreshSet = true;
  refreshInterval = setInterval(renderOrders, 2000); // Refresh every 2 seconds
}

/* =========================
   LISTEN FOR STORAGE CHANGES (MULTI-TAB SYNC)
========================= */
window.addEventListener('storage', (e) => {
  if (e.key === 'chefos_orders') {
    renderOrders();
  }
});

/* =========================
   SOUND NOTIFICATION FOR NEW ORDERS
========================= */
let lastOrderCount = 0;

function checkForNewOrders() {
  const orders = getOrders();
  if (orders.length > lastOrderCount) {
    playNotificationSound();
    showKitchenNotification(`${orders.length - lastOrderCount} new order(s) received!`, 'info');
  }
  lastOrderCount = orders.length;
}

function playNotificationSound() {
  // Simple beep sound (you can replace with actual audio file)
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

setInterval(checkForNewOrders, 3000);

/* =========================
   INIT
========================= */
renderOrders();
lastOrderCount = getOrders().length;

console.log("✅ ChefOS Kitchen Display System initialized");
