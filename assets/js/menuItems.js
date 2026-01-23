/* =========================
   CHEFOS MENU DATA
========================= */
const menuItems = [
  // BREAKFAST CATEGORY
  {
    id: "pancakes",
    name: "Classic Pancakes",
    description: "Fluffy pancakes with maple syrup and butter",
    price: 65,
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    ingredients: {
      flour: 2,
      eggs: 2,
      milk: 1,
      butter: 1
    }
  },
  {
    id: "eggs_benedict",
    name: "Eggs Benedict",
    description: "Poached eggs, ham, hollandaise on English muffin",
    price: 95,
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1608039829572-78524f79cbd2?w=400&h=300&fit=crop",
    ingredients: {
      eggs: 2,
      muffin: 1,
      ham: 1,
      hollandaise: 1
    }
  },
  {
    id: "breakfast_burrito",
    name: "Breakfast Burrito",
    description: "Scrambled eggs, bacon, cheese, salsa in tortilla",
    price: 75,
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
    ingredients: {
      eggs: 2,
      tortilla: 1,
      bacon: 2,
      cheese: 1
    }
  },

  // MAIN COURSE CATEGORY
  {
    id: "burger_beef",
    name: "Beef Burger",
    description: "Grilled beef patty, cheese, lettuce, tomato on bun",
    price: 85,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    ingredients: {
      beef_patty: 1,
      burger_bun: 1,
      lettuce: 1,
      cheese: 1
    }
  },
  {
    id: "grilled_salmon",
    name: "Grilled Salmon",
    description: "Atlantic salmon with lemon butter and vegetables",
    price: 145,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    ingredients: {
      salmon: 1,
      lemon: 1,
      butter: 1,
      vegetables: 2
    }
  },
  {
    id: "chicken_pasta",
    name: "Chicken Alfredo Pasta",
    description: "Creamy alfredo sauce with grilled chicken and fettuccine",
    price: 110,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=300&fit=crop",
    ingredients: {
      chicken: 1,
      pasta: 1,
      cream: 1,
      cheese: 1
    }
  },

  // DESSERTS CATEGORY
  {
    id: "chocolate_cake",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center and ice cream",
    price: 65,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop",
    ingredients: {
      chocolate: 2,
      flour: 1,
      eggs: 2,
      ice_cream: 1
    }
  },
  {
    id: "cheesecake",
    name: "New York Cheesecake",
    description: "Classic creamy cheesecake with berry compote",
    price: 70,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400&h=300&fit=crop",
    ingredients: {
      cream_cheese: 2,
      graham_cracker: 1,
      berries: 1,
      sugar: 1
    }
  },
  {
    id: "tiramisu",
    name: "Classic Tiramisu",
    description: "Italian coffee-flavored dessert with mascarpone",
    price: 75,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
    ingredients: {
      mascarpone: 1,
      ladyfingers: 2,
      coffee: 1,
      cocoa: 1
    }
  }
];

/* =========================
   CHEFOS INVENTORY
========================= */
const defaultInventory = {
  // Breakfast ingredients
  flour: 20,
  eggs: 30,
  milk: 15,
  butter: 10,
  muffin: 10,
  ham: 8,
  hollandaise: 5,
  tortilla: 10,
  bacon: 15,
  
  // Main course ingredients
  beef_patty: 10,
  burger_bun: 10,
  lettuce: 20,
  cheese: 15,
  salmon: 8,
  lemon: 10,
  vegetables: 25,
  chicken: 12,
  pasta: 15,
  cream: 8,
  
  // Dessert ingredients
  chocolate: 15,
  ice_cream: 10,
  cream_cheese: 8,
  graham_cracker: 10,
  berries: 12,
  sugar: 20,
  mascarpone: 6,
  ladyfingers: 15,
  coffee: 10,
  cocoa: 8
};

/* =========================
   INVENTORY INITIALIZATION
========================= */
function initInventory() {
  if (!localStorage.getItem("chefos_inventory")) {
    localStorage.setItem(
      "chefos_inventory",
      JSON.stringify(defaultInventory)
    );
  }
}
initInventory();
