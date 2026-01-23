# ChefOS  
A Web-Based Food Ordering, Kitchen Display, and Inventory Management System

## Project Overview
ChefOS is a web-based food ordering application developed to demonstrate
core concepts in culinary technology and restaurant systems. The application
models the full order lifecycle, from customer menu selection to kitchen
preparation, while integrating basic ingredient-level inventory management.

The project simulates how modern restaurants use digital ordering systems,
kitchen display systems (KDS), and inventory tracking to improve operational
efficiency and order accuracy.

The application is fully client-side and deployed using GitHub Pages.

---

## Key Features
- Digital menu with item descriptions and pricing
- Add-to-cart and order review functionality
- Order submission workflow
- Kitchen Display System (KDS) with order status tracking
- Order status lifecycle (Pending → Preparing → Ready)
- Ingredient-level inventory management
- Automatic inventory deduction on order placement
- Menu item availability based on inventory levels
- Inventory dashboard with low-stock indicators

---

## Technologies Used
- HTML5
- CSS3
- JavaScript (Vanilla)
- Browser Local Storage (data persistence)
- GitHub Pages (deployment)

---

---

## Ordering and Kitchen Workflow
1. Customer selects items from the digital menu
2. Items are added to the cart and reviewed
3. Order is placed and stored locally
4. Ingredient inventory is automatically deducted
5. Order appears on the Kitchen Display System as **Pending**
6. Kitchen staff update order status to **Preparing** and then **Ready**

This workflow mirrors real-world POS and KDS systems used in restaurant
operations.

---

## Inventory Management Logic
Inventory is managed at the ingredient level. Each menu item defines the
ingredients required for preparation. When an order is placed, ingredient
quantities are deducted from inventory. Menu items are automatically disabled
when insufficient inventory is available.

Low-stock ingredients are visually flagged in the inventory dashboard.

---

## Limitations
- No payment processing
- No backend server or live database
- Orders and inventory are stored per browser session
- No multi-user or real-time synchronization

---

## Educational Relevance
This project demonstrates how digital systems support restaurant operations by
connecting menu management, kitchen workflows, and inventory control. It reflects
core concepts taught in culinary technology programs, including order flow,
back-of-house coordination, and operational efficiency.

---

## Future Improvements
- Backend database integration
- Real-time order updates
- Inventory restocking controls
- User authentication for staff roles
- Order analytics and reporting
