document.getElementById("mode-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.querySelector("table").classList.toggle("dark-mode");
  const modeToggle = document.getElementById("mode-toggle");
  if (document.body.classList.contains("dark-mode")) {
    modeToggle.textContent = "Light Mode";
  } else {
    modeToggle.textContent = "Dark Mode";
  }
});

async function fetchData() {
  try {
    const response = await fetch("/api/tickers");
    const data = await response.json();
    displayData(data);
    updateBestPrice(data);
    updateStats(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayData(data) {
  const table = document.getElementById("ticker-table");
  table.innerHTML = "";
  data.forEach((ticker, index) => {
    const row = document.createElement("tr");
    const difference = (
      ((ticker.sell - ticker.buy) / ticker.buy) *
      100
    ).toFixed(2);
    const savings = (ticker.sell - ticker.buy).toFixed(2);
    row.innerHTML = `
          <td>${index + 1}</td>
          <td>${ticker.name}</td>
          <td>₹${ticker.last.toLocaleString()}</td>
          <td>₹${ticker.buy.toLocaleString()} / ₹${ticker.sell.toLocaleString()}</td>
          <td>${difference}%</td>
          <td>₹${savings}</td>
      `;
    table.appendChild(row);
  });
}

function updateBestPrice(data) {
  if (data.length === 0) return;
  let bestPriceTicker = data[0];
  let bestPrice =
    (parseFloat(bestPriceTicker.buy) + parseFloat(bestPriceTicker.sell)) / 2;

  data.forEach((ticker) => {
    const tickerPrice = (parseFloat(ticker.buy) + parseFloat(ticker.sell)) / 2;
    if (tickerPrice < bestPrice) {
      bestPrice = tickerPrice;
      bestPriceTicker = ticker;
    }
  });

  document.getElementById(
    "best-price-value"
  ).textContent = `₹${bestPrice.toLocaleString()}`;
}

function updateStats(data) {
  const stat5min = data[0].stat5min || 0;
  const stat1hr = data[0].stat1hr || 0;
  const stat1day = data[0].stat1day || 0;
  const stat7days = data[0].stat7days || 0;

  document.getElementById("stat-5min").textContent = `${stat5min}%`;
  document.getElementById("stat-1hr").textContent = `${stat1hr}%`;
  document.getElementById("stat-1day").textContent = `${stat1day}%`;
  document.getElementById("stat-7days").textContent = `${stat7days}%`;
}

fetchData();
setInterval(fetchData, 60000); // Fetch data every minute
