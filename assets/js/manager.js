/* ==========================================
   CHEFOS MANAGER INSIGHTS — PRODUCTION LOGIC
========================================== */

function getOrders() {
  const active = JSON.parse(localStorage.getItem('chefos_orders')) || [];
  const completed = JSON.parse(localStorage.getItem('chefos_completed_orders')) || [];
  return [...active, ...completed];
}

function parseDate(order) {
  return new Date(order.fullTimestamp || order.orderTime);
}

function inRange(date, start, end) {
  return date >= start && date <= end;
}

/* ---------- DATA AGGREGATION ENGINE ---------- */

function aggregateData(orders) {
  const data = {
    revenue: 0,
    orders: orders.length,
    itemsSold: 0,
    tableStats: {},
    itemStats: {},
    categoryStats: {},
    hourly: Array(24).fill(0),
    daily: {}
  };

  orders.forEach(order => {
    data.revenue += order.total;

    const date = parseDate(order);
    const hour = date.getHours();
    const dayKey = date.toLocaleDateString();

    data.hourly[hour] += order.total;
    data.daily[dayKey] = (data.daily[dayKey] || 0) + order.total;

    data.tableStats[order.table] = (data.tableStats[order.table] || 0) + 1;

    order.items.forEach(item => {
      data.itemsSold += item.qty;

      if (!data.itemStats[item.name]) {
        data.itemStats[item.name] = { qty: 0, revenue: 0 };
      }
      data.itemStats[item.name].qty += item.qty;
      data.itemStats[item.name].revenue += item.qty * item.price;

      const category = item.category || "Other";
      data.categoryStats[category] = (data.categoryStats[category] || 0) + item.qty;
    });
  });

  return data;
}

/* ---------- KPI RENDER ---------- */

function renderKPIs(data) {
  document.getElementById('totalRevenue').textContent = `R${data.revenue.toFixed(2)}`;
  document.getElementById('totalOrders').textContent = data.orders;
  document.getElementById('averageOrder').textContent =
    `R${data.orders ? (data.revenue / data.orders).toFixed(2) : '0.00'}`;

  const busiest = Object.entries(data.tableStats).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById('busiestTable').textContent = busiest ? `Table ${busiest[0]}` : 'N/A';
  document.getElementById('tableOrders').textContent = busiest ? `${busiest[1]} orders` : '0 orders';
}

/* ---------- TOP ITEMS ---------- */

function renderTopItems(data) {
  const list = document.getElementById('topItemsList');
  list.innerHTML = '';

  const items = Object.entries(data.itemStats)
    .map(([name, val]) => ({ name, ...val }))
    .sort((a,b)=>b.qty-a.qty)
    .slice(0,5);

  if (!items.length) {
    list.innerHTML = `<div class="empty-state"><p>No sales data</p></div>`;
    return;
  }

  items.forEach((item,i)=>{
    const el = document.createElement('div');
    el.className='top-item-card';
    el.innerHTML = `
      <div class="item-rank">${i+1}</div>
      <div class="item-info">
        <h4>${item.name}</h4>
        <p>${item.qty} sold • R${item.revenue.toFixed(2)}</p>
      </div>
      <div class="item-stats">
        <div class="progress-bar">
          <div class="progress-fill" style="width:${(item.qty/items[0].qty)*100}%"></div>
        </div>
      </div>`;
    list.appendChild(el);
  });
}

/* ---------- CHARTS ---------- */

let revenueChart, categoryChart;

function initCharts() {
  revenueChart = new Chart(document.getElementById('revenueChart'), {
    type: 'line',
    data: { labels: [], datasets: [{ label: 'Revenue', data: [] }] }
  });

  categoryChart = new Chart(document.getElementById('categoryChart'), {
    type: 'doughnut',
    data: { labels: [], datasets: [{ data: [] }] }
  });
}

function updateCharts(data) {
  const labels = Object.keys(data.daily);
  const values = Object.values(data.daily);

  revenueChart.data.labels = labels;
  revenueChart.data.datasets[0].data = values;
  revenueChart.update();

  categoryChart.data.labels = Object.keys(data.categoryStats);
  categoryChart.data.datasets[0].data = Object.values(data.categoryStats);
  categoryChart.update();
}

/* ---------- SUMMARY CARDS ---------- */

function renderSummary(data) {
  const peak = document.getElementById('peakHours');
  const topHours = data.hourly
    .map((v,i)=>({hour:i,val:v}))
    .sort((a,b)=>b.val-a.val)
    .slice(0,3);

  peak.innerHTML = topHours.map(h=>`
    <div class="peak-hour">
      <span>${h.hour}:00</span>
      <span>R${h.val.toFixed(0)}</span>
    </div>`).join('');

  const tables = document.getElementById('popularTables');
  const topTables = Object.entries(data.tableStats)
    .sort((a,b)=>b[1]-a[1]).slice(0,3);

  tables.innerHTML = topTables.map(t=>`
    <div class="popular-table">
      <span>Table ${t[0]}</span>
      <span>${t[1]} orders</span>
    </div>`).join('');
}

/* ---------- SALES TABLE ---------- */

function renderTable(orders) {
  const body = document.getElementById('salesTableBody');
  body.innerHTML = '';

  orders.sort((a,b)=>parseDate(b)-parseDate(a));

  orders.forEach(order=>{
    const row = document.createElement('tr');
    const d = parseDate(order);

    row.innerHTML = `
      <td>${d.toLocaleDateString()}<br><small>${d.toLocaleTimeString()}</small></td>
      <td>#${order.id.toString().slice(-6)}</td>
      <td>Table ${order.table}</td>
      <td>${order.items.reduce((s,i)=>s+i.qty,0)} items</td>
      <td><strong>R${order.total.toFixed(2)}</strong></td>
      <td>${order.status}</td>
      <td>—</td>`;
    body.appendChild(row);
  });
}

/* ---------- MAIN LOAD ---------- */

function loadReportData(startDate, endDate) {
  const orders = getOrders().filter(o => inRange(parseDate(o), startDate, endDate));
  const data = aggregateData(orders);

  renderKPIs(data);
  renderTopItems(data);
  updateCharts(data);
  renderSummary(data);
  renderTable(orders);
}

/* ---------- INIT ---------- */

document.addEventListener('DOMContentLoaded', ()=>{
  initCharts();
});
