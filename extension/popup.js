const main = () => {
  const symbolsData = stocksList
    .map((symbol) => loadSymbol(symbol))
    .filter((symbol) => !!symbol);
  console.log(symbolsData);
};

const loadSymbol = (symbol) => {
  let stockData;
  fetch(`https://www.nseindia.com/api/quote-equity?symbol=${symbol}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => (stockData = data))
    .catch(() => {});
  return stockData;
};

main();
