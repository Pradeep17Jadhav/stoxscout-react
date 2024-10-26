const fs = require("fs");
const path = require("path");

exports.setMarketData = async (req, res) => {
  const jsonData = req.body;
  console.log(jsonData);
  const filePath = path.join(__dirname, "../../data/common/marketData.json");
  fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ message: "Error saving data", error: err });
    }
    res.status(200).json({ message: "Data saved successfully!" });
  });
};

exports.getMarketData = async (req, res) => {
  const filePath = path.join(__dirname, "../../data/common/marketData.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error reading data", error: err });
    }
    try {
      const jsonData = JSON.parse(data);
      res.status(200).json(jsonData);
    } catch (parseError) {
      res.status(500).json({
        message: "Market data not available. Kindly load the data first.",
        error: parseError,
      });
    }
  });
};
