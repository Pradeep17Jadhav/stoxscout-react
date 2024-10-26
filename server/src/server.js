const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

app.use(cors());
app.use(bodyParser.json());

const jsonFilePath = path.join(
  __dirname,
  "../data/pradeepjadhav/holdings.json"
);
const PORT = process.env.PORT || 4000;

const marketDataController = require("./controllers/marketDataController");

app.post("/marketData", marketDataController.setMarketData);
app.get("/marketData", marketDataController.getMarketData);

app.get("/holdings", (req, res) => {
  fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading file" });
    }

    try {
      const holdings = JSON.parse(data);
      res.json(holdings);
    } catch (parseErr) {
      res.status(500).json({ error: "Error parsing JSON" });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
