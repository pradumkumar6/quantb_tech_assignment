const mongoose = require("mongoose");
require("dotenv").config();

const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB Server.");
});

db.on("error", (err) => {
  console.log("MongoDB connection error.", err);
});

db.on("disconnected", () => {
  console.log("MongoDB disconnected.");
});

module.exports = db;
