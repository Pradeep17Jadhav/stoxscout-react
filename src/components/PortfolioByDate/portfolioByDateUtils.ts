import { daysSinceEpoch, getPercentChange } from "../../helpers/price";
import {
  DateWiseHoldingItem,
  DateWiseHoldings,
  DateWiseStockInformation,
  HoldingItem,
  Holdings,
  StockInformation,
  Transaction,
} from "../../types/transaction";

export const stockInfoGenerator = (
  holdingItem: HoldingItem,
  marketData: any
): StockInformation => {
  const transactions = holdingItem.transactions;
  const symbol = holdingItem.symbol;
  let quantity = 0;
  let investedValue = 0;
  let daysMax = 0;
  transactions.forEach((transaction: any) => {
    quantity += transaction.quantity;
    const currInvested = transaction.quantity * transaction.avgPrice;
    investedValue += currInvested;
    daysMax = Math.max(daysMax, daysSinceEpoch(transaction.dateAdded));
  });

  const symbolMarketData = marketData.filter(
    (data: any) => data.symbol === symbol
  )[0];
  const ltp = symbolMarketData.lastPrice;
  const dayChange = ltp - symbolMarketData.previousClose;
  const totalDayChange = dayChange * quantity;
  const previousClose = symbolMarketData.previousClose;
  const percentDayChange = getPercentChange(ltp, previousClose);
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
    daysMax,
    ltp,
    totalDayChange,
    percentDayChange,
  };
};

export const dateWiseStockInfoGeneratorAll = (
  holdings: Holdings,
  marketData: any
): DateWiseStockInformation => {
  const dateWiseHoldings = getDateWiseHoldings(holdings);
  return dateWiseHoldings.map((dateWiseHoldingItem) => {
    return {
      date: dateWiseHoldingItem.date,
      stocksInfo: dateWiseHoldingItem.holdings.map((holdingItem: HoldingItem) =>
        stockInfoGenerator(holdingItem, marketData)
      ),
    };
  });
};

export const getDateWiseHoldings = (holdings: Holdings): DateWiseHoldings => {
  const dateWiseHoldings: DateWiseHoldings = [];
  holdings.forEach((holdingItem: HoldingItem) => {
    const transactions = holdingItem.transactions;
    transactions.forEach((transaction: Transaction) => {
      const holdingItemCopy: HoldingItem = JSON.parse(
        JSON.stringify(holdingItem)
      );
      holdingItemCopy.transactions = [transaction];
      const date = epochToDate(transaction.dateAdded);

      const matchedDateWiseHolding = dateWiseHoldings.find(
        (dateWiseHoldingItem: DateWiseHoldingItem) =>
          dateWiseHoldingItem.date === date
      );

      if (matchedDateWiseHolding) {
        matchedDateWiseHolding.holdings.push(holdingItemCopy);
      } else {
        dateWiseHoldings.push({
          date,
          holdings: [holdingItemCopy],
        });
      }
    });
  });
  return dateWiseHoldings;
};

const epochToDate = (epochTime: number) => {
  let date = new Date(epochTime);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
