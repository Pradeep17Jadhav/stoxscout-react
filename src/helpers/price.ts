import {
  HoldingInfo,
  HoldingItem,
  Holdings,
  StockInformation,
} from "../types/transaction";

export const stockInfoGeneratorNSE = (
  holdingItem: HoldingItem,
  marketData: any
): StockInformation => {
  const transactions = holdingItem.transactions;
  const symbol = holdingItem.symbol;
  let quantity = 0;
  let investedValue = 0;
  let daysMax = 0;
  transactions.forEach((transaction) => {
    quantity += transaction.quantity;
    const currInvested = transaction.quantity * transaction.avgPrice;
    investedValue += currInvested;
    daysMax = Math.max(daysMax, daysSinceEpoch(transaction.dateAdded));
  });

  const symbolMarketData = marketData.filter(
    (data: any) => data.symbol === symbol
  )[0];
  const ltp = symbolMarketData.close
    ? symbolMarketData.close
    : symbolMarketData.lastPrice;
  const dayChange = ltp - symbolMarketData.previousClose;
  const totalDayChange = dayChange * quantity;
  const previousClose = symbolMarketData.previousClose;
  const percentDayChange = getPercentChange(ltp, previousClose);
  const percentDayChangeOnInvestment = (totalDayChange / investedValue) * 100;
  const currentValue = quantity * ltp;
  const avgPrice = investedValue / quantity;
  const pnl = currentValue - investedValue;
  const pnlpercent = (pnl / investedValue) * 100;
  return {
    symbol,
    quantity,
    avgPrice,
    investedValue,
    currentValue,
    pnl,
    pnlpercent,
    ltp,
    totalDayChange,
    percentDayChange,
    percentDayChangeOnInvestment,
    daysMax,
  };
};

export const getPercentChange = (newPrice: number, oldPrice: number) =>
  ((newPrice - oldPrice) / oldPrice) * 100;

export const stockInfoGeneratorAll = (
  holdings: Holdings,
  marketData: any
): StockInformation[] =>
  holdings.map((holdingItem) => stockInfoGeneratorNSE(holdingItem, marketData));

export const transformTypes = (res: any) => {
  const rawHolding: any = res.holdings;
  const holdings = rawHolding.map((holdingItem: any) => {
    const transactions = holdingItem.transactions.map((transaction: any) => {
      return {
        ...transaction,
        dateAdded: parseInt(transaction.dateAdded),
        avgPrice: parseFloat(transaction.avgPrice),
      };
    });
    return {
      ...holdingItem,
      transactions: transactions,
    };
  });
  return {
    holdings,
    lastUpdated: parseInt(res.lastUpdated),
  };
};

export const getPnL = (stockInfo: StockInformation[]): HoldingInfo => {
  let totalPnl = 0;
  let totalInvestedValue = 0;
  let totalCurrentValue = 0;
  let totalDayChange = 0;
  stockInfo.forEach((stockInfo: StockInformation) => {
    totalPnl += stockInfo.pnl;
    totalInvestedValue += stockInfo.investedValue;
    totalCurrentValue += stockInfo.currentValue;
    totalDayChange += stockInfo.totalDayChange;
  });

  return {
    totalPnl: formatPrice(totalPnl),
    totalInvestedValue: formatPrice(totalInvestedValue),
    totalCurrentValue: formatPrice(totalCurrentValue),
    totalPnlPercentage: formatPrice(
      getPercentChange(totalCurrentValue, totalInvestedValue)
    ),
    totalDayChange: formatPrice(totalDayChange),
    totalDayChangePercentage: formatPrice(
      getPercentChange(totalCurrentValue + totalDayChange, totalCurrentValue)
    ),
  };
};

export const daysSinceEpoch = (epochTime: number) => {
  const currentEpochTime = Date.now();
  const millisecondsSinceEpoch = currentEpochTime - epochTime;
  const secondsSinceEpoch = millisecondsSinceEpoch / 1000;
  const daysSinceEpoch = secondsSinceEpoch / (60 * 60 * 24);
  return Math.floor(daysSinceEpoch);
};

export const formatPrice = (price: number) => {
  return price.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
};
