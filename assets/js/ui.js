// ===== CLOCK DISPLAY GLOBAL =====
document.addEventListener("DOMContentLoaded", function () {
  const clockText = document.getElementById("clockText");

  function updateTime() {
    const now = new Date();
    const options = { 
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    clockText.textContent = now.toLocaleString('en-US', options);
  }

  updateTime();
  setInterval(updateTime, 1000);
});

