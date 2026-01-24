/* =========================
   CHEFOS MENU DATA
========================= */
const menuItems = [
  // BREAKFAST CATEGORY (6 items - 3 top, 3 bottom)
  {
    id: "pancakes",
    name: "Classic Pancakes",
    description: "Fluffy pancakes with maple syrup",
    price: 65,
    category: "Breakfast",
    image: "assets/images/pancakes.jpg",
    ingredients: { flour: 2, eggs: 2, milk: 1, butter: 1 }
  },
  {
    id: "eggs_benedict",
    name: "Eggs Benedict",
    description: "Poached eggs with hollandaise",
    price: 95,
    category: "Breakfast",
    image: "assets/images/eggs-benedict.jpg",
    ingredients: { eggs: 2, muffin: 1, ham: 1, hollandaise: 1 }
  },
  {
    id: "breakfast_burrito",
    name: "Breakfast Burrito",
    description: "Eggs, bacon, cheese in tortilla",
    price: 75,
    category: "Breakfast",
    image: "assets/images/breakfast-burrito.jpg",
    ingredients: { eggs: 2, tortilla: 1, bacon: 2, cheese: 1 }
  },
  {
    id: "french_toast",
    name: "French Toast",
    description: "Golden brioche with berries",
    price: 70,
    category: "Breakfast",
    image: "assets/images/french-toast.jpg",
    ingredients: { bread: 2, eggs: 2, milk: 1, berries: 1 }
  },
  {
    id: "omelette",
    name: "Veggie Omelette",
    description: "Three eggs with vegetables",
    price: 60,
    category: "Breakfast",
    image: "assets/images/omelette.jpg",
    ingredients: { eggs: 3, vegetables: 2, cheese: 1 }
  },
  {
    id: "avocado_toast",
    name: "Avocado Toast",
    description: "Smashed avocado on sourdough",
    price: 55,
    category: "Breakfast",
    image: "assets/images/avocado-toast.jpg",
    ingredients: { bread: 2, avocado: 1, tomato: 1 }
  },

  // MAIN COURSE CATEGORY (6 items - 3 top, 3 bottom)
  {
    id: "burger_beef",
    name: "Beef Burger",
    description: "Grilled beef with cheese",
    price: 85,
    category: "Main Course",
    image: "assets/images/burger.jpg",
    ingredients: { beef_patty: 1, burger_bun: 1, lettuce: 1, cheese: 1 }
  },
  {
    id: "grilled_salmon",
    name: "Grilled Salmon",
    description: "Atlantic salmon with vegetables",
    price: 145,
    category: "Main Course",
    image: "assets/images/salmon.jpg",
    ingredients: { salmon: 1, lemon: 1, butter: 1, vegetables: 2 }
  },
  {
    id: "chicken_pasta",
    name: "Chicken Alfredo",
    description: "Creamy pasta with grilled chicken",
    price: 110,
    category: "Main Course",
    image: "assets/images/pasta.jpg",
    ingredients: { chicken: 1, pasta: 1, cream: 1, cheese: 1 }
  },
  {
    id: "steak",
    name: "Ribeye Steak",
    description: "12oz ribeye with mashed potatoes",
    price: 185,
    category: "Main Course",
    image: "assets/images/steak.jpg",
    ingredients: { ribeye: 1, potato: 2, butter: 1, vegetables: 1 }
  },
  {
    id: "bbq_ribs",
    name: "BBQ Ribs",
    description: "Slow-cooked ribs with coleslaw",
    price: 165,
    category: "Main Course",
    image: "assets/images/ribs.jpg",
    ingredients: { ribs: 1, bbq_sauce: 1, coleslaw: 1 }
  },
  {
    id: "fish_chips",
    name: "Fish & Chips",
    description: "Beer-battered fish with fries",
    price: 95,
    category: "Main Course",
    image: "assets/images/fish-chips.jpg",
    ingredients: { fish: 1, potato: 2, batter: 1 }
  },

  // SALADS CATEGORY (6 items - 3 top, 3 bottom)
  {
    id: "caesar_salad",
    name: "Caesar Salad",
    description: "Romaine with parmesan & croutons",
    price: 75,
    category: "Salads",
    image: "assets/images/caesar-salad.jpg",
    ingredients: { lettuce: 2, parmesan: 1, croutons: 1, dressing: 1 }
  },
  {
    id: "greek_salad",
    name: "Greek Salad",
    description: "Feta, olives, cucumber, tomato",
    price: 70,
    category: "Salads",
    image: "assets/images/greek-salad.jpg",
    ingredients: { lettuce: 1, feta: 1, olives: 1, vegetables: 2 }
  },
  {
    id: "caprese_salad",
    name: "Caprese Salad",
    description: "Mozzarella, tomato, basil",
    price: 80,
    category: "Salads",
    image: "assets/images/caprese-salad.jpg",
    ingredients: { mozzarella: 1, tomato: 2, basil: 1, olive_oil: 1 }
  },
  {
    id: "cobb_salad",
    name: "Cobb Salad",
    description: "Chicken, bacon, egg, avocado",
    price: 95,
    category: "Salads",
    image: "assets/images/cobb-salad.jpg",
    ingredients: { chicken: 1, bacon: 1, eggs: 1, avocado: 1, lettuce: 1 }
  },
  {
    id: "quinoa_salad",
    name: "Quinoa Power Bowl",
    description: "Quinoa with roasted vegetables",
    price: 85,
    category: "Salads",
    image: "assets/images/quinoa-salad.jpg",
    ingredients: { quinoa: 1, vegetables: 3, feta: 1 }
  },
  {
    id: "asian_salad",
    name: "Asian Chicken Salad",
    description: "Grilled chicken with sesame dressing",
    price: 90,
    category: "Salads",
    image: "assets/images/asian-salad.jpg",
    ingredients: { chicken: 1, lettuce: 1, carrots: 1, dressing: 1 }
  },

  // DESSERTS CATEGORY (6 items - 3 top, 3 bottom)
  {
    id: "chocolate_cake",
    name: "Chocolate Lava Cake",
    description: "Warm cake with molten center",
    price: 65,
    category: "Desserts",
    image: "assets/images/chocolate-cake.jpg",
    ingredients: { chocolate: 2, flour: 1, eggs: 2, ice_cream: 1 }
  },
  {
    id: "cheesecake",
    name: "New York Cheesecake",
    description: "Creamy cheesecake with berries",
    price: 70,
    category: "Desserts",
    image: "assets/images/cheesecake.jpg",
    ingredients: { cream_cheese: 2, graham_cracker: 1, berries: 1, sugar: 1 }
  },
  {
    id: "tiramisu",
    name: "Classic Tiramisu",
    description: "Coffee-flavored Italian dessert",
    price: 75,
    category: "Desserts",
    image: "assets/images/tiramisu.jpg",
    ingredients: { mascarpone: 1, ladyfingers: 2, coffee: 1, cocoa: 1 }
  },
  {
    id: "brownie",
    name: "Fudge Brownie",
    description: "Warm brownie with ice cream",
    price: 55,
    category: "Desserts",
    image: "assets/images/brownie.jpg",
    ingredients: { chocolate: 1, flour: 1, eggs: 1, ice_cream: 1 }
  },
  {
    id: "creme_brulee",
    name: "Crème Brûlée",
    description: "Vanilla custard with caramel",
    price: 70,
    category: "Desserts",
    image: "assets/images/creme-brulee.jpg",
    ingredients: { cream: 2, eggs: 2, sugar: 1, vanilla: 1 }
  },
  {
    id: "apple_pie",
    name: "Apple Pie",
    description: "Classic pie with vanilla ice cream",
    price: 60,
    category: "Desserts",
    image: "assets/images/apple-pie.jpg",
    ingredients: { apples: 3, pastry: 1, ice_cream: 1, cinnamon: 1 }
  },

  // DRINKS CATEGORY (Added - 6 items)
  {
    id: "cappuccino",
    name: "Cappuccino",
    description: "Freshly brewed Italian coffee",
    price: 35,
    category: "Drinks",
    image: "assets/images/cappuccino.jpg",
    ingredients: { coffee: 1, milk: 1, sugar: 1 }
  },
  {
    id: "fresh_juice",
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice",
    price: 25,
    category: "Drinks",
    image: "assets/images/orange-juice.jpg",
    ingredients: { oranges: 3 }
  },
  {
    id: "iced_tea",
    name: "Iced Tea",
    description: "Refreshing lemon iced tea",
    price: 20,
    category: "Drinks",
    image: "assets/images/iced-tea.jpg",
    ingredients: { tea: 1, lemon: 1, sugar: 1, ice: 1 }
  },
  {
    id: "smoothie",
    name: "Berry Smoothie",
    description: "Mixed berries with yogurt",
    price: 40,
    category: "Drinks",
    image: "assets/images/smoothie.jpg",
    ingredients: { berries: 2, yogurt: 1, honey: 1 }
  },
  {
    id: "cola",
    name: "Coca Cola",
    description: "Classic cola drink",
    price: 15,
    category: "Drinks",
    image: "assets/images/cola.jpg",
    ingredients: { cola: 1, ice: 1 }
  },
  {
    id: "mineral_water",
    name: "Mineral Water",
    description: "Sparkling mineral water",
    price: 10,
    category: "Drinks",
    image: "assets/images/water.jpg",
    ingredients: { water: 1 }
  }
];

/* =========================
   CHEFOS INVENTORY
========================= */
const defaultInventory = {
  // Breakfast ingredients
  flour: 20, eggs: 30, milk: 15, butter: 10, muffin: 10, ham: 8,
  hollandaise: 5, tortilla: 10, bacon: 15, bread: 20, berries: 12,
  vegetables: 25, avocado: 10, tomato: 20,
  
  // Main course ingredients
  beef_patty: 10, burger_bun: 10, lettuce: 20, cheese: 15, salmon: 8,
  lemon: 10, chicken: 12, pasta: 15, cream: 8, ribeye: 6, potato: 30,
  ribs: 5, bbq_sauce: 10, coleslaw: 8, fish: 10, batter: 12,
  
  // Salad ingredients
  parmesan: 10, croutons: 15, dressing: 12, feta: 8, olives: 10,
  mozzarella: 8, basil: 5, olive_oil: 10, quinoa: 8, carrots: 15,
  
  // Dessert ingredients
  chocolate: 15, ice_cream: 10, cream_cheese: 8, graham_cracker: 10,
  sugar: 20, mascarpone: 6, ladyfingers: 15, coffee: 10, cocoa: 8,
  apples: 15, pastry: 10, cinnamon: 8, vanilla: 6,
  
  // Drink ingredients (added)
  coffee: 20, milk: 25, oranges: 30, tea: 15, yogurt: 12, 
  honey: 8, cola: 20, water: 50, ice: 100
};

/* =========================
   INVENTORY INITIALIZATION
========================= */
function initInventory() {
  if (!localStorage.getItem("chefos_inventory")) {
    localStorage.setItem("chefos_inventory", JSON.stringify(defaultInventory));
  }
}
initInventory();

/* =========================
   CHEFOS MENU DATA
========================= */
const menuItems = [
  // ... keep all your menu items as they are ...
];

/* =========================
   CHEFOS INVENTORY
========================= */
const defaultInventory = {
  // ... keep your inventory data ...
};

/* =========================
   INVENTORY INITIALIZATION
========================= */
// REMOVE this line: function initInventory() { ... }
// initInventory(); // REMOVE this call too

// Instead, just export the default inventory
console.log("Menu items loaded:", menuItems.length);
