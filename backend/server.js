const express = require("express");

const app = express();

const expenses = [];

app.get("/", (req, res) => {
  res.send("Currency Expense Tracker Backend");
});

app.get("/expenses", (req, res) => {
  res.json(expenses);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});