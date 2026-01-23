/* =========================
   CHEFOS MENU DATA
========================= */

const menuItems = [
  {
    id: "burger_beef",
    name: "Beef Burger",
    description: "Grilled beef patty, cheese, lettuce, bun",
    price: 85,
    category: "Mains",
    ingredients: {
      beef_patty: 1,
      burger_bun: 1,
      lettuce: 1,
      cheese: 1
    }
  },
  {
    id: "wrap_chicken",
    name: "Chicken Wrap",
    description: "Grilled chicken, salad, tortilla wrap",
    price: 70,
    category: "Mains",
    ingredients: {
      chicken: 1,
      wrap: 1,
      lettuce: 1
    }
  },
  {
    id: "fries",
    name: "Fries",
    description: "Crispy golden fries",
    price: 35,
    category: "Sides",
    ingredients: {
      potato: 2
    }
  }
];

/* =========================
   CHEFOS INVENTORY
========================= */

const defaultInventory = {
  beef_patty: 10,
  burger_bun: 10,
  lettuce: 20,
  cheese: 15,
  chicken: 8,
  wrap: 8,
  potato: 30
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
