document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("mode-toggle");
  const bestPriceElement = document.getElementById("best-price-value");
  const tickerTableElement = document.getElementById("ticker-table");

  let isDarkMode = false;

  darkModeToggle.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("dark-mode", isDarkMode);
    document.querySelector("table").classList.toggle("dark-mode", isDarkMode);
  });

  async function fetchTickers() {
    try {
      const response = await fetch("/api/tickers");
      const tickers = await response.json();
      let bestPrice = 0;

      tickerTableElement.innerHTML = "";
      tickers.forEach((ticker, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${ticker.name}</td>
          <td>₹${ticker.last}</td>
          <td>₹${ticker.buy} / ₹${ticker.sell}</td>
          <td>${calculateDifference(ticker.last, ticker.buy)}%</td>
          <td>₹${calculateSavings(ticker.last, ticker.buy)}</td>
        `;

        tickerTableElement.appendChild(row);

        if (ticker.last > bestPrice) {
          bestPrice = ticker.last;
        }
      });

      bestPriceElement.textContent = bestPrice.toFixed(2);
    } catch (error) {
      console.error("Error fetching tickers:", error);
    }
  }

  function calculateDifference(last, buy) {
    return (((last - buy) / buy) * 100).toFixed(2);
  }

  function calculateSavings(last, buy) {
    return (last - buy).toFixed(2);
  }

  fetchTickers();
  setInterval(fetchTickers, 60000); // Refresh data every minute
});
