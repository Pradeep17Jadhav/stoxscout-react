 
const main = async () => {
  if (window.location.hostname === "localhost") {
    return;
  }

  let symbolsDataNSE = [];
  let symbolsDataBSE = [];
  if (window.location.hostname === "www.nseindia.com") {
    symbolsDataNSE = await Promise.all(
      stocksListNSE.map(async (symbol) => {
        const data = await loadSymbol(symbol, "NSE");
        return extractPriceInfoNSE(data);
      })
    );
  }

  if (window.location.hostname === "www.moneycontrol.com") {
    symbolsDataBSE = await Promise.all(
      stocksListBSE.map(async (symbolInfo) => {
        const data = await loadSymbol(symbolInfo.code, "BSE");
        return extractPriceInfoBSE(data);
      })
    );
  }

  const symbolsData = [...symbolsDataNSE, ...symbolsDataBSE];
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

const loadSymbol = async (symbol, exchange) => {
  const url =
    exchange === "NSE"
      ? `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`
      : `https://priceapi.moneycontrol.com/pricefeed/bse/equitycash/${symbol}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const defaultPriceInfo = {
  symbol: "ERROR",
  lastPrice: 0,
  change: 0,
  pChange: 0,
  previousClose: 0,
  open: 0,
  close: 0,
  basePrice: 0,
};

const extractPriceInfoNSE = (apiResponse) => {
  if (!apiResponse.priceInfo) return defaultPriceInfo;
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

const extractPriceInfoBSE = (apiResponse) => {
  const { message, data } = apiResponse;
  if (message.toLowerCase() !== "success") return defaultPriceInfo;

  const symbol = data.NSEID;
  const close = parseFloat(data.pricecurrent);
  const basePrice = parseFloat(data.pricecurrent);
  const lastPrice = parseFloat(data.pricecurrent);
  const change = parseFloat(data.pricechange);
  const pChange = parseFloat(data.pricepercentchange);
  const previousClose = parseFloat(data.priceprevclose);
  const open = parseFloat(data.previousClose);

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
 
const stocksListNSE = [
  "ASTRAL",
  "AUBANK",
  "AXISBANK",
  "BALKRISIND",
  "DEEPAKNTR",
  "DIXON",
  "DMART",
  "EICHERMOT",
  "ESCORTS",
  "HDFCBANK",
  "HINDUNILVR",
  "IEX",
  "IRCTC",
  "JIOFIN",
  "JUBLFOOD",
  "MUTHOOTFIN",
  "SBICARD",
  "TATAMOTORS",
  "TITAN",
];

const stocksListBSE = [
  { symbol: "ASIANPAINT", code: "API" },
  { symbol: "BAJFINANCE", code: "BAF" },
  { symbol: "ICICIBANK", code: "ICI02" },
  { symbol: "JUBLINGREA", code: "JI12" },
  { symbol: "KOTAKBANK", code: "KMF" },
  { symbol: "LTIM", code: "LI09" },
  { symbol: "RELIANCE", code: "RI" },
  { symbol: "TCS", code: "TCS" },
  { symbol: "WIPRO", code: "W" },
];

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
 
 
