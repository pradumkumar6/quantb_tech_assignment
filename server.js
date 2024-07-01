const express = require("express");
const axios = require("axios");
const db = require("./db");
const Ticker = require("./models/Ticker");
const path = require("path");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8080;

async function fetchData() {
  try {
    const response = await axios.get("https://api.wazirx.com/api/v2/tickers");
    const tickers = Object.values(response.data).slice(0, 10);
    await Ticker.deleteMany({});
    const tickerPromises = tickers.map((ticker) => {
      const { name, last, buy, sell, volume, base_unit } = ticker;
      const newTicker = new Ticker({
        name,
        last,
        buy,
        sell,
        volume,
        base_unit,
      });
      return newTicker.save();
    });
    await Promise.all(tickerPromises);
  } catch (error) {
    console.error(error);
  }
}

app.get("/api/tickers", async (req, res) => {
  try {
    const tickers = await Ticker.find();
    res.json(tickers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Serve static files
app.use(express.static("public"));

// Serve the HTML file for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
  fetchData();
  setInterval(fetchData, 60000); // Fetch data every minute
});
