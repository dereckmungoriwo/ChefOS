// ===== CLOCK DISPLAY GLOBAL =====
document.addEventListener("DOMContentLoaded", function () {
  const currentTime = document.getElementById("currentTime");

  function updateTime() {
    const now = new Date();
    currentTime.textContent = now.toLocaleString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  updateTime();
  setInterval(updateTime, 1000);
});
