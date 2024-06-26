 
const main = async () => {
  if (window.location.hostname === "localhost") {
    return;
  }
  const symbolsData = await Promise.all(
    stocksList.map(async (symbol) => {
      const data = await loadSymbol(symbol);
      return extractPriceInfo(data);
    })
  );

  const req = {
    type: "STOCK_DATA",
    owner: "Pradeep",
    symbolsData,
  };
  console.log(symbolsData);
  chrome.runtime.sendMessage(req, function (response) {
    console.log("Message sent to background script");
  });
};

const loadSymbol = async (symbol) => {
  try {
    const response = await fetch(
      `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data; // Assuming you want to return the fetched data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Propagate the error for higher-level handling
  }
};

const extractPriceInfo = (apiResponse) => {
  const { info, priceInfo } = apiResponse;
  const { symbol } = info;
  const { lastPrice, change, pChange, previousClose, open, close, basePrice } =
    priceInfo;

  return {
    symbol,
    lastPrice,
    change,
    pChange,
    previousClose,
    open,
    close,
    basePrice,
  };
};

setTimeout(() => {
  main();
}, 1000);
 
const stocksList = [
  "ASIANPAINT",
  "ASTRAL",
  "AXISBANK",
  "BAJFINANCE",
  "BALKRISIND",
  "DEEPAKNTR",
  "DIXON",
  "DMART",
  "EICHERMOT",
  "ESCORTS",
  "HDFCBANK",
  "HINDUNILVR",
  "ICICIBANK",
  "IEX",
  "IRCTC",
  "JIOFIN",
  "JUBLFOOD",
  "JUBLINGREA",
  "KOTAKBANK",
  "LTIM",
  "MUTHOOTFIN",
  "RELIANCE",
  "SBICARD",
  "TATAMOTORS",
  "TCS",
  "TITAN",
  "WIPRO",
  "AUBANK",
];
 
 
