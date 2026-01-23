const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const role = document.getElementById("role").value;

  if (!username) {
    alert("Enter username");
    return;
  }

  const user = {
    username,
    role,
    loginTime: new Date().toISOString()
  };

  localStorage.setItem("chefos_user", JSON.stringify(user));

  redirectByRole(role);
});

function redirectByRole(role) {
  switch (role) {
    case "waiter":
      window.location.href = "index.html";
      break;
    case "chef":
      window.location.href = "kitchen-tv.html";
      break;
    case "manager":
      window.location.href = "manager.html";
      break;
  }
}
