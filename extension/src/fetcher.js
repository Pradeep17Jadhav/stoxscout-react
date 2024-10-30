const FREQUENCY = 60000;

const startFetching = () => {
  main();
  if (window.location.hostname === "www.nseindia.com" || window.location.hostname === "www.bseindia.com") {
    setInterval(main, FREQUENCY);
  }
}

const main = async () => {
  let symbolsDataNSE = [];
  let symbolsDataBSE = [];

  const userStockList = await loadUserStockList();
  if (window.location.hostname === "www.nseindia.com") {
    symbolsDataNSE = await Promise.all(
      userStockList.nse.map(async (symbol) => {
        const api = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`
        const data = await loadSymbol(api);

        return extractPriceInfoNSE(data);
      })
    );
  } else if (window.location.hostname === "www.bseindia.com") {
    symbolsDataBSE = await Promise.all(
      userStockList.bse.map(async (symbol) => {
        const api = `https://api.bseindia.com/BseIndiaAPI/api/getScripHeaderData/w?Debtflag=&scripcode=${symbol}`
        const data = await loadSymbol(api);
        return extractPriceInfoBSE(data);
      })
    );
  } else {
    return;
  }

  const symbolsData = [...symbolsDataNSE, ...symbolsDataBSE];
  setMarketData(symbolsData);
};


const setMarketData = (req) =>
  request("http://localhost:4000/marketData", {
    body: req,
    method: 'POST',
  });


const request = async (url, options = {}) => {
  const { body, headers, method = HttpMethod.GET } = options;

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (method !== "GET" && body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error during API request:", error);
    throw error;
  }
};

const loadSymbol = async (api, config) => {
  try {
    const response = await fetch(api, config);
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

const loadUserStockList = async () => {
  const url = 'http://localhost:4000/userHoldingsList'
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

const extractPriceInfoMC = (apiResponse) => {
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

const extractPriceInfoBSE = (apiResponse) => {
  const { Cmpname, CurrRate, Header } = apiResponse;
  if (!CurrRate) return defaultPriceInfo;

  const symbol = Cmpname.ShortN.toUpperCase();
  const close = parseFloat(CurrRate.LTP);
  const basePrice = parseFloat(CurrRate.LTP);
  const lastPrice = parseFloat(CurrRate.LTP);
  const change = parseFloat(CurrRate.Chg);
  const pChange = parseFloat(CurrRate.PcChg);
  const previousClose = parseFloat(Header.PrevClose);
  const open = parseFloat(Header.Open);

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
  startFetching();
}, 1000);
