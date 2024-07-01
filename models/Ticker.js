const mongoose = require("mongoose");
const tickerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  last: {
    type: Number,
  },
  buy: {
    type: Number,
  },
  sell: {
    type: Number,
  },
  volume: {
    type: Number,
  },
  base_unit: {
    type: String,
  },
});

const Ticker = new mongoose.model("Ticker", tickerSchema);
module.exports = Ticker;
