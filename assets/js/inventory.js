const defaultInventory = {
  beef_patty: 10,
  burger_bun: 10,
  lettuce: 20,
  cheese: 15,
  chicken: 8,
  wrap: 8,
  potato: 30
};

if (!localStorage.getItem("inventory")) {
  localStorage.setItem("inventory", JSON.stringify(defaultInventory));
}