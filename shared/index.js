const stocks = require("../data/pradeepjadhav/holdings.json");
const fs = require("fs");

const getSymbols = () =>
  stocks.holdings.map((holdingItem) => holdingItem.symbol);

const main = () => {
  const symbols = getSymbols();
  const content = `const stocksList = ${JSON.stringify(symbols, null, 2)};\n`;

  fs.writeFileSync("../data/pradeepjadhav/holdings.js", content);
};
main();
