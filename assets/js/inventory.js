<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ChefOS Stock</title>
  <link rel="stylesheet" href="assets/css/styles.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <div class="app-container">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1><i class="fas fa-warehouse"></i> ChefOS Stock</h1>
      </div>
      
      <div class="sidebar-nav">
        <div class="nav-section">
          <h3>Menu</h3>
          <ul class="nav-links">
            <li><a href="pos.html"><i class="fas fa-cash-register"></i> POS</a></li>
            <li><a href="orders.html"><i class="fas fa-list"></i> Orders</a></li>
            <li><a href="kds.html"><i class="fas fa-utensils"></i> ChefOS Line</a></li>
          </ul>
        </div>
        
        <div class="nav-section">
          <h3>Management</h3>
          <ul class="nav-links">
            <li><a href="inventory.html" class="active"><i class="fas fa-boxes"></i> ChefOS Stock</a></li>
            <li><a href="reports.html"><i class="fas fa-chart-bar"></i> ChefOS Insights</a></li>
            <li><a href="settings.html"><i class="fas fa-cog"></i> Settings</a></li>
          </ul>
        </div>
      </div>
      
      <!-- HELP CENTER -->
      <div class="help-center">
        <h4><i class="fas fa-life-ring"></i> Help Center</h4>
        <div class="contact-info">
          <div><i class="fas fa-envelope"></i> support@chefos.com</div>
          <div><i class="fas fa-phone"></i> +1 (415) 123-4567</div>
        </div>
      </div>
      
      <a href="login.html" class="logout-btn">
        <i class="fas fa-sign-out-alt"></i> Logout
      </a>
    </aside>

    <!-- MAIN CONTENT -->
    <div class="main-content">
      <!-- TOP BAR -->
      <div class="top-bar">
        <div class="time-display" id="currentTime"></div>
        <div class="user-info">
          <div class="user-avatar">DM</div>
          <div>
            <div style="font-weight: 600;">Derek Mungoriwo</div>
            <div style="font-size: 14px; color: var(--gray);">Manager</div>
          </div>
        </div>
      </div>

      <!-- INVENTORY CONTAINER -->
      <div class="inventory-container">
        <div class="inventory-header">
          <h2><i class="fas fa-boxes"></i> Inventory Management</h2>
          <div class="inventory-actions">
            <button class="action-btn add-btn" id="addItemBtn">
              <i class="fas fa-plus"></i> Add Item
            </button>
            <button class="action-btn refresh-btn" id="refreshBtn">
              <i class="fas fa-sync-alt"></i> Refresh
            </button>
            <button class="action-btn restock-btn" id="lowStockBtn">
              <i class="fas fa-exclamation-triangle"></i> Low Stock
            </button>
          </div>
        </div>

        <!-- INVENTORY STATS -->
        <div class="inventory-stats">
          <div class="stat-card">
            <div class="stat-icon" style="background: #28a745;">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-info">
              <h3 id="totalItems">0</h3>
              <p>Total Items</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon" style="background: #ffc107;">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="stat-info">
              <h3 id="lowStockItems">0</h3>
              <p>Low Stock</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon" style="background: #e74c3c;">
              <i class="fas fa-times-circle"></i>
            </div>
            <div class="stat-info">
              <h3 id="outOfStockItems">0</h3>
              <p>Out of Stock</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon" style="background: #007bff;">
              <i class="fas fa-truck"></i>
            </div>
            <div class="stat-info">
              <h3 id="needRestock">0</h3>
              <p>Need Restock</p>
            </div>
          </div>
        </div>

        <!-- INVENTORY FILTERS -->
        <div class="inventory-filters">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="searchInput" placeholder="Search inventory items...">
          </div>
          <div class="filter-options">
            <select id="categoryFilter">
              <option value="all">All Categories</option>
              <option value="breakfast">Breakfast</option>
              <option value="main">Main Course</option>
              <option value="salads">Salads</option>
              <option value="desserts">Desserts</option>
              <option value="ingredients">Ingredients</option>
            </select>
            <select id="stockFilter">
              <option value="all">All Stock Levels</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
              <option value="good">Good Stock</option>
            </select>
          </div>
        </div>

        <!-- INVENTORY TABLE -->
        <div class="inventory-table-container">
          <table class="inventory-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Min Stock</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="inventory-list">
              <!-- Inventory items will be loaded here -->
            </tbody>
          </table>
          
          <div id="no-inventory" style="display: none; text-align: center; padding: 40px;">
            <i class="fas fa-box-open fa-3x" style="color: var(--gray);"></i>
            <h3 style="margin: 20px 0 10px; color: var(--gray);">No Inventory Items</h3>
            <p style="color: var(--gray);">Add items to manage your inventory.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ADD/EDIT ITEM MODAL -->
  <div id="itemModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3><span id="modalTitle">Add New Item</span></h3>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <form id="inventoryForm">
          <input type="hidden" id="editItemId">
          
          <div class="form-group">
            <label for="itemName">Item Name *</label>
            <input type="text" id="itemName" required placeholder="e.g., Flour, Eggs, Beef">
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="itemCategory">Category *</label>
              <select id="itemCategory" required>
                <option value="">Select Category</option>
                <option value="breakfast">Breakfast</option>
                <option value="main">Main Course</option>
                <option value="salads">Salads</option>
                <option value="desserts">Desserts</option>
                <option value="ingredients">Ingredients</option>
                <option value="beverages">Beverages</option>
                <option value="dairy">Dairy</option>
                <option value="produce">Produce</option>
                <option value="meat">Meat & Poultry</option>
                <option value="seafood">Seafood</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="itemUnit">Unit</label>
              <select id="itemUnit">
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="lbs">Pounds (lbs)</option>
                <option value="oz">Ounces (oz)</option>
                <option value="L">Liters (L)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="pcs">Pieces</option>
                <option value="box">Box</option>
                <option value="bottle">Bottle</option>
                <option value="can">Can</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="currentStock">Current Stock *</label>
              <input type="number" id="currentStock" required min="0" step="0.01" placeholder="0">
            </div>
            
            <div class="form-group">
              <label for="minStock">Minimum Stock *</label>
              <input type="number" id="minStock" required min="0" step="0.01" placeholder="10">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="supplier">Supplier</label>
              <input type="text" id="supplier" placeholder="Supplier name">
            </div>
            
            <div class="form-group">
              <label for="cost">Cost per Unit</label>
              <input type="number" id="cost" min="0" step="0.01" placeholder="0.00">
            </div>
          </div>
          
          <div class="form-group">
            <label for="itemNotes">Notes</label>
            <textarea id="itemNotes" rows="3" placeholder="Additional notes about this item..."></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary modal-close">Cancel</button>
        <button class="btn btn-primary" id="saveItemBtn">Save Item</button>
      </div>
    </div>
  </div>

  <!-- RESTOCK MODAL -->
  <div id="restockModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3><i class="fas fa-truck"></i> Restock Item</h3>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <form id="restockForm">
          <input type="hidden" id="restockItemId">
          
          <div class="restock-info">
            <h4 id="restockItemName"></h4>
            <p>Current Stock: <span id="restockCurrent"></span></p>
            <p>Minimum Stock: <span id="restockMin"></span></p>
          </div>
          
          <div class="form-group">
            <label for="restockQuantity">Quantity to Add *</label>
            <input type="number" id="restockQuantity" required min="1" step="0.01" placeholder="Enter quantity">
          </div>
          
          <div class="form-group">
            <label for="restockNotes">Restock Notes</label>
            <textarea id="restockNotes" rows="2" placeholder="Notes about this restock..."></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary modal-close">Cancel</button>
        <button class="btn btn-success" id="confirmRestockBtn">Confirm Restock</button>
      </div>
    </div>
  </div>

  <script>
    // DOM Elements
    const inventoryList = document.getElementById('inventory-list');
    const noInventoryMessage = document.getElementById('no-inventory');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const stockFilter = document.getElementById('stockFilter');
    const refreshBtn = document.getElementById('refreshBtn');
    const addItemBtn = document.getElementById('addItemBtn');
    const lowStockBtn = document.getElementById('lowStockBtn');
    
    // Statistics elements
    const totalItemsEl = document.getElementById('totalItems');
    const lowStockItemsEl = document.getElementById('lowStockItems');
    const outOfStockItemsEl = document.getElementById('outOfStockItems');
    const needRestockEl = document.getElementById('needRestock');
    
    // Modal elements
    const itemModal = document.getElementById('itemModal');
    const restockModal = document.getElementById('restockModal');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    
    // Form elements
    const inventoryForm = document.getElementById('inventoryForm');
    const saveItemBtn = document.getElementById('saveItemBtn');
    const confirmRestockBtn = document.getElementById('confirmRestockBtn');
    
    // Current state
    let inventoryData = [];
    let currentItemId = null;
    
    /* =========================
       LOAD INVENTORY
    ========================= */
    function loadInventory() {
      // Load from localStorage or use default
      inventoryData = JSON.parse(localStorage.getItem('chefos_inventory_detailed')) || [];
      
      // If empty, initialize with menu items ingredients
      if (inventoryData.length === 0) {
        initializeInventory();
      }
      
      // Apply filters
      applyFilters();
      
      // Update statistics
      updateInventoryStats();
    }
    
    /* =========================
       INITIALIZE INVENTORY FROM MENU ITEMS
    ========================= */
    function initializeInventory() {
      // Get all unique ingredients from menu items
      const allIngredients = new Set();
      
      if (typeof menuItems !== 'undefined') {
        menuItems.forEach(item => {
          Object.keys(item.ingredients).forEach(ingredient => {
            allIngredients.add(ingredient);
          });
        });
        
        // Convert to inventory items
        inventoryData = Array.from(allIngredients).map(ingredient => ({
          id: Date.now() + Math.random(),
          name: ingredient.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          category: getIngredientCategory(ingredient),
          currentStock: 20,
          minStock: 5,
          unit: 'pcs',
          supplier: '',
          cost: 0,
          notes: '',
          lastUpdated: new Date().toISOString(),
          history: []
        }));
      } else {
        // Default inventory items
        inventoryData = [
          {
            id: 1,
            name: 'Flour',
            category: 'ingredients',
            currentStock: 20,
            minStock: 5,
            unit: 'kg',
            supplier: 'Bakery Supplies Co',
            cost: 2.5,
            notes: 'All-purpose flour',
            lastUpdated: new Date().toISOString(),
            history: []
          },
          {
            id: 2,
            name: 'Eggs',
            category: 'breakfast',
            currentStock: 30,
            minStock: 10,
            unit: 'pcs',
            supplier: 'Fresh Farms',
            cost: 0.25,
            notes: 'Large eggs',
            lastUpdated: new Date().toISOString(),
            history: []
          },
          {
            id: 3,
            name: 'Beef Patty',
            category: 'meat',
            currentStock: 15,
            minStock: 5,
            unit: 'pcs',
            supplier: 'Quality Meats',
            cost: 3.5,
            notes: '80/20 beef patties',
            lastUpdated: new Date().toISOString(),
            history: []
          }
        ];
      }
      
      saveInventory();
    }
    
    /* =========================
       GET INGREDIENT CATEGORY
    ========================= */
    function getIngredientCategory(ingredient) {
      const categories = {
        // Breakfast
        'flour': 'ingredients',
        'eggs': 'breakfast',
        'milk': 'dairy',
        'butter': 'dairy',
        'bacon': 'meat',
        'bread': 'ingredients',
        
        // Main Course
        'beef_patty': 'meat',
        'chicken': 'meat',
        'salmon': 'seafood',
        'pasta': 'ingredients',
        'potato': 'produce',
        
        // Default
        'default': 'ingredients'
      };
      
      return categories[ingredient] || 'ingredients';
    }
    
    /* =========================
       SAVE INVENTORY
    ========================= */
    function saveInventory() {
      localStorage.setItem('chefos_inventory_detailed', JSON.stringify(inventoryData));
    }
    
    /* =========================
       APPLY FILTERS
    ========================= */
    function applyFilters() {
      const searchTerm = searchInput.value.toLowerCase();
      const category = categoryFilter.value;
      const stockLevel = stockFilter.value;
      
      let filteredItems = inventoryData.filter(item => {
        // Search filter
        if (searchTerm && !item.name.toLowerCase().includes(searchTerm)) {
          return false;
        }
        
        // Category filter
        if (category !== 'all' && item.category !== category) {
          return false;
        }
        
        // Stock level filter
        if (stockLevel !== 'all') {
          const stockStatus = getStockStatus(item);
          if (stockLevel === 'low' && stockStatus !== 'low') return false;
          if (stockLevel === 'out' && stockStatus !== 'out') return false;
          if (stockLevel === 'good' && stockStatus !== 'good') return false;
        }
        
        return true;
      });
      
      // Sort by stock status (low first)
      filteredItems.sort((a, b) => {
        const statusA = getStockStatus(a);
        const statusB = getStockStatus(b);
        const statusOrder = { 'out': 0, 'low': 1, 'good': 2 };
        return statusOrder[statusA] - statusOrder[statusB];
      });
      
      renderInventoryTable(filteredItems);
    }
    
    /* =========================
       GET STOCK STATUS
    ========================= */
    function getStockStatus(item) {
      if (item.currentStock <= 0) return 'out';
      if (item.currentStock <= item.minStock) return 'low';
      return 'good';
    }
    
    /* =========================
       RENDER INVENTORY TABLE
    ========================= */
    function renderInventoryTable(items) {
      // Clear table
      inventoryList.innerHTML = '';
      
      // Show/hide no items message
      if (items.length === 0) {
        noInventoryMessage.style.display = 'block';
      } else {
        noInventoryMessage.style.display = 'none';
        
        // Populate table
        items.forEach(item => {
          const row = document.createElement('tr');
          const stockStatus = getStockStatus(item);
          
          // Format last updated
          const lastUpdated = new Date(item.lastUpdated);
          const dateString = lastUpdated.toLocaleDateString();
          const timeString = lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          
          // Status badge
          let statusBadge = '';
          switch(stockStatus) {
            case 'good':
              statusBadge = '<span class="status-badge" style="background: #28a745;">Good</span>';
              break;
            case 'low':
              statusBadge = '<span class="status-badge" style="background: #ffc107;">Low</span>';
              break;
            case 'out':
              statusBadge = '<span class="status-badge" style="background: #e74c3c;">Out</span>';
              break;
          }
          
          // Stock indicator
          const stockIndicator = `
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 100px; height: 8px; background: var(--gray-light); border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; width: ${Math.min(100, (item.currentStock / (item.minStock * 3)) * 100)}%; 
                  background: ${stockStatus === 'good' ? '#28a745' : stockStatus === 'low' ? '#ffc107' : '#e74c3c'};">
                </div>
              </div>
              <span>${item.currentStock} ${item.unit}</span>
            </div>
          `;
          
          row.innerHTML = `
            <td><strong>${item.name}</strong></td>
            <td><span class="category-tag">${item.category}</span></td>
            <td>${stockIndicator}</td>
            <td>${item.minStock} ${item.unit}</td>
            <td>${statusBadge}</td>
            <td>${dateString}<br><small>${timeString}</small></td>
            <td>
              <div class="action-buttons">
                <button class="action-btn edit-btn" data-id="${item.id}">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn restock-action-btn" data-id="${item.id}">
                  <i class="fas fa-truck"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${item.id}">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          `;
          
          inventoryList.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
          btn.addEventListener('click', () => editItem(parseInt(btn.getAttribute('data-id'))));
        });
        
        document.querySelectorAll('.restock-action-btn').forEach(btn => {
          btn.addEventListener('click', () => openRestockModal(parseInt(btn.getAttribute('data-id'))));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
          btn.addEventListener('click', () => deleteItem(parseInt(btn.getAttribute('data-id'))));
        });
      }
    }
    
    /* =========================
       UPDATE INVENTORY STATISTICS
    ========================= */
    function updateInventoryStats() {
      let total = inventoryData.length;
      let low = 0;
      let out = 0;
      let needRestock = 0;
      
      inventoryData.forEach(item => {
        const status = getStockStatus(item);
        if (status === 'low') low++;
        if (status === 'out') out++;
        if (status === 'low' || status === 'out') needRestock++;
      });
      
      totalItemsEl.textContent = total;
      lowStockItemsEl.textContent = low;
      outOfStockItemsEl.textContent = out;
      needRestockEl.textContent = needRestock;
    }
    
    /* =========================
       ADD NEW ITEM
    ========================= */
    function addNewItem() {
      // Reset form
      inventoryForm.reset();
      document.getElementById('modalTitle').textContent = 'Add New Item';
      document.getElementById('editItemId').value = '';
      currentItemId = null;
      
      // Show modal
      itemModal.style.display = 'flex';
    }
    
    /* =========================
       EDIT ITEM
    ========================= */
    function editItem(itemId) {
      const item = inventoryData.find(i => i.id === itemId);
      if (!item) return;
      
      // Populate form
      document.getElementById('modalTitle').textContent = 'Edit Item';
      document.getElementById('editItemId').value = item.id;
      document.getElementById('itemName').value = item.name;
      document.getElementById('itemCategory').value = item.category;
      document.getElementById('itemUnit').value = item.unit;
      document.getElementById('currentStock').value = item.currentStock;
      document.getElementById('minStock').value = item.minStock;
      document.getElementById('supplier').value = item.supplier || '';
      document.getElementById('cost').value = item.cost || '';
      document.getElementById('itemNotes').value = item.notes || '';
      
      currentItemId = itemId;
      itemModal.style.display = 'flex';
    }
    
    /* =========================
       SAVE ITEM
    ========================= */
    function saveItem() {
      if (!inventoryForm.checkValidity()) {
        inventoryForm.reportValidity();
        return;
      }
      
      const itemData = {
        id: currentItemId || Date.now(),
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        unit: document.getElementById('itemUnit').value,
        currentStock: parseFloat(document.getElementById('currentStock').value),
        minStock: parseFloat(document.getElementById('minStock').value),
        supplier: document.getElementById('supplier').value,
        cost: parseFloat(document.getElementById('cost').value) || 0,
        notes: document.getElementById('itemNotes').value,
        lastUpdated: new Date().toISOString(),
        history: []
      };
      
      if (currentItemId) {
        // Update existing item
        const index = inventoryData.findIndex(i => i.id === currentItemId);
        if (index !== -1) {
          // Keep existing history
          itemData.history = inventoryData[index].history;
          inventoryData[index] = itemData;
        }
      } else {
        // Add new item
        inventoryData.push(itemData);
      }
      
      saveInventory();
      loadInventory();
      itemModal.style.display = 'none';
      
      alert(`Item "${itemData.name}" saved successfully!`);
    }
    
    /* =========================
       DELETE ITEM
    ========================= */
    function deleteItem(itemId) {
      if (!confirm('Are you sure you want to delete this item?')) return;
      
      inventoryData = inventoryData.filter(i => i.id !== itemId);
      saveInventory();
      loadInventory();
      
      alert('Item deleted successfully!');
    }
    
    /* =========================
       OPEN RESTOCK MODAL
    ========================= */
    function openRestockModal(itemId) {
      const item = inventoryData.find(i => i.id === itemId);
      if (!item) return;
      
      // Populate restock modal
      document.getElementById('restockItemId').value = item.id;
      document.getElementById('restockItemName').textContent = item.name;
      document.getElementById('restockCurrent').textContent = `${item.currentStock} ${item.unit}`;
      document.getElementById('restockMin').textContent = `${item.minStock} ${item.unit}`;
      document.getElementById('restockQuantity').value = '';
      document.getElementById('restockNotes').value = '';
      
      restockModal.style.display = 'flex';
    }
    
    /* =========================
       CONFIRM RESTOCK
    ========================= */
    function confirmRestock() {
      const itemId = parseInt(document.getElementById('restockItemId').value);
      const quantity = parseFloat(document.getElementById('restockQuantity').value);
      const notes = document.getElementById('restockNotes').value;
      
      if (!quantity || quantity <= 0) {
        alert('Please enter a valid quantity.');
        return;
      }
      
      const itemIndex = inventoryData.findIndex(i => i.id === itemId);
      if (itemIndex === -1) return;
      
      // Update stock
      const oldStock = inventoryData[itemIndex].currentStock;
      inventoryData[itemIndex].currentStock += quantity;
      inventoryData[itemIndex].lastUpdated = new Date().toISOString();
      
      // Add to history
      inventoryData[itemIndex].history.push({
        date: new Date().toISOString(),
        action: 'restock',
        quantity: quantity,
        oldStock: oldStock,
        newStock: inventoryData[itemIndex].currentStock,
        notes: notes
      });
      
      saveInventory();
      loadInventory();
      restockModal.style.display = 'none';
      
      alert(`Restocked ${quantity} ${inventoryData[itemIndex].unit} of "${inventoryData[itemIndex].name}"`);
    }
    
    /* =========================
       SHOW LOW STOCK ITEMS
    ========================= */
    function showLowStock() {
      stockFilter.value = 'low';
      applyFilters();
    }
    
    /* =========================
       UPDATE TIME
    ========================= */
    function updateTime() {
      const now = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      const timeEl = document.getElementById('currentTime');
      if (timeEl) {
        timeEl.textContent = now.toLocaleDateString('en-US', options);
      }
    }
    
    /* =========================
       EVENT LISTENERS
    ========================= */
    document.addEventListener('DOMContentLoaded', () => {
      loadInventory();
      updateTime();
      
      // Refresh every 30 seconds
      setInterval(loadInventory, 30000);
      setInterval(updateTime, 60000);
    });
    
    // Search and filter events
    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    stockFilter.addEventListener('change', applyFilters);
    
    // Button events
    refreshBtn.addEventListener('click', loadInventory);
    addItemBtn.addEventListener('click', addNewItem);
    lowStockBtn.addEventListener('click', showLowStock);
    
    // Form events
    saveItemBtn.addEventListener('click', saveItem);
    confirmRestockBtn.addEventListener('click', confirmRestock);
    
    // Modal close events
    modalCloseButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        itemModal.style.display = 'none';
        restockModal.style.display = 'none';
      });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
      if (event.target === itemModal) itemModal.style.display = 'none';
      if (event.target === restockModal) restockModal.style.display = 'none';
    });
  </script>

  <style>
    /* Additional CSS for inventory page */
    .inventory-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .inventory-header h2 {
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
    }
    
    .inventory-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .action-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    
    .add-btn {
      background: var(--primary);
      color: white;
    }
    
    .refresh-btn {
      background: #6c757d;
      color: white;
    }
    
    .restock-btn {
      background: #ffc107;
      color: #212529;
    }
    
    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    }
    
    .inventory-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .stat-card {
      background: var(--white);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      box-shadow: var(--shadow);
      border: 1px solid var(--gray-light);
    }
    
    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
    }
    
    .stat-info h3 {
      margin: 0;
      font-size: 24px;
      color: var(--dark);
    }
    
    .stat-info p {
      margin: 5px 0 0 0;
      color: var(--gray);
      font-size: 14px;
    }
    
    .inventory-filters {
      background: var(--white);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: var(--shadow);
      border: 1px solid var(--gray-light);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .search-box {
      flex: 1;
      min-width: 300px;
      position: relative;
    }
    
    .search-box i {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--gray);
    }
    
    .search-box input {
      width: 100%;
      padding: 12px 12px 12px 45px;
      border: 1px solid var(--gray-light);
      border-radius: 8px;
      font-size: 14px;
      background: var(--white);
      color: var(--dark);
    }
    
    .filter-options {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .filter-options select {
      padding: 10px 15px;
      border: 1px solid var(--gray-light);
      border-radius: 8px;
      background: var(--white);
      color: var(--dark);
      font-size: 14px;
      min-width: 150px;
    }
    
    .inventory-table-container {
      background: var(--white);
      border-radius: 15px;
      overflow: hidden;
      box-shadow: var(--shadow);
      border: 1px solid var(--gray-light);
      overflow-x: auto;
    }
    
    .inventory-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .inventory-table th {
      background: var(--primary);
      color: white;
      padding: 18px 15px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
    }
    
    .inventory-table td {
      padding: 15px;
      border-bottom: 1px solid var(--gray-light);
      vertical-align: middle;
    }
    
    .inventory-table tr:hover {
      background: var(--light);
    }
    
    .inventory-table tr:last-child td {
      border-bottom: none;
    }
    
    .category-tag {
      display: inline-block;
      padding: 5px 12px;
      background: var(--light);
      color: var(--dark);
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .action-buttons {
      display: flex;
      gap: 5px;
    }
    
    .action-buttons .action-btn {
      padding: 8px 12px;
      font-size: 14px;
    }
    
    .edit-btn {
      background: #007bff;
      color: white;
    }
    
    .restock-action-btn {
      background: #28a745;
      color: white;
    }
    
    .delete-btn {
      background: #e74c3c;
      color: white;
    }
    
    /* FORM STYLES */
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: var(--dark);
    }
    
    input, select, textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid var(--gray-light);
      border-radius: 8px;
      font-size: 14px;
      background: var(--white);
      color: var(--dark);
      transition: border-color 0.2s;
    }
    
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
    }
    
    textarea {
      resize: vertical;
    }
    
    /* RESTOCK INFO */
    .restock-info {
      background: var(--light);
      border-radius: 10px;
      padding: 15px;
      margin-bottom: 20px;
    }
    
    .restock-info h4 {
      margin: 0 0 10px 0;
      color: var(--primary);
    }
    
    .restock-info p {
      margin: 5px 0;
      color: var(--dark);
    }
    
    /* MODAL STYLES */
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
      align-items: center;
      justify-content: center;
    }
    
    .modal-content {
      background: var(--white);
      border-radius: 15px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    
    .modal-header {
      padding: 20px;
      border-bottom: 1px solid var(--gray-light);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .modal-header h3 {
      margin: 0;
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: var(--gray);
    }
    
    .modal-body {
      padding: 20px;
    }
    
    .modal-footer {
      padding: 20px;
      border-top: 1px solid var(--gray-light);
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: var(--transition);
    }
    
    .btn-primary {
      background: var(--primary);
      color: white;
    }
    
    .btn-secondary {
      background: var(--gray-light);
      color: var(--dark);
    }
    
    .btn-success {
      background: #28a745;
      color: white;
    }
    
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    }
    
    /* RESPONSIVE */
    @media (max-width: 768px) {
      .inventory-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .inventory-actions {
        width: 100%;
      }
      
      .inventory-filters {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-box {
        min-width: 100%;
      }
      
      .filter-options {
        flex-direction: column;
      }
      
      .filter-options select {
        min-width: 100%;
      }
      
      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }
      
      .inventory-table {
        min-width: 900px;
      }
      
      .modal-content {
        width: 95%;
        margin: 10px;
      }
    }
    
    @media (max-width: 480px) {
      .action-btn {
        padding: 8px 15px;
        font-size: 14px;
      }
      
      .inventory-stats {
        grid-template-columns: 1fr;
      }
    }
  </style>
</body>
</html>
