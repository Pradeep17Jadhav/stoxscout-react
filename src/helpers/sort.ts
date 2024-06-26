import { COLUMNS, Order, StockInformation } from "../types/transaction";

const sortByProperty = (
  array: StockInformation[],
  prop: string,
  order: Order = Order.ASC
) => {
  const slicedArray = array.slice();
  const sortedArray = slicedArray.sort(
    (a: StockInformation, b: StockInformation) =>
      // @ts-ignore
      order === Order.ASC ? a[prop] - b[prop] : b[prop] - a[prop]
  );
  return sortedArray;
};

const sortBySymbol = (array: StockInformation[], order: Order = Order.ASC) =>
  array
    .slice()
    .sort((a, b) =>
      order === Order.ASC
        ? a.symbol.localeCompare(b.symbol)
        : b.symbol.localeCompare(a.symbol)
    );

const sortByPnl = (array: StockInformation[], order: Order) =>
  sortByProperty(array, "pnl", order);
const sortByPnlPercent = (array: StockInformation[], order: Order) =>
  sortByProperty(array, "pnlpercent", order);
const sortByLtp = (array: StockInformation[], order: Order) =>
  sortByProperty(array, "ltp", order);

const sortByDayChange = (array: StockInformation[], order: Order = Order.ASC) =>
  sortByProperty(array, "totalDayChange", order);

const sortByDayChangePercent = (
  array: StockInformation[],
  order: Order = Order.ASC
) => sortByProperty(array, "percentDayChange", order);

const sortByDayChangePercentOnInvestment = (
  array: StockInformation[],
  order: Order = Order.ASC
) => sortByProperty(array, "percentDayChangeOnInvestment", order);

const sortByDaysMax = (array: StockInformation[], order: Order) =>
  sortByProperty(array, "daysMax", order);

const sortByCurrentValue = (array: StockInformation[], order: Order) =>
  sortByProperty(array, "currentValue", order);

const sortByInvestedValue = (array: StockInformation[], order: Order) =>
  sortByProperty(array, "investedValue", order);

const sortByAvgPrice = (array: StockInformation[], order: Order) =>
  sortByProperty(array, "avgPrice", order);

const sortByQuantity = (array: StockInformation[], order: Order) =>
  sortByProperty(array, "quantity", order);

const sort = (
  stocksInfo: StockInformation[],
  column: string,
  order: Order = Order.DESC
): StockInformation[] => {
  if (column === COLUMNS.SYMBOL) {
    return sortBySymbol(stocksInfo, order);
  }
  if (column === COLUMNS.DAY_PNL) {
    return sortByDayChange(stocksInfo, order);
  }
  if (column === COLUMNS.DAY_PNL_PERCENT) {
    return sortByDayChangePercent(stocksInfo, order);
  }
  if (column === COLUMNS.DAY_PNL_PERCENT_INVESTMENT) {
    return sortByDayChangePercentOnInvestment(stocksInfo, order);
  }
  if (column === COLUMNS.INVESTED_VALUE) {
    return sortByInvestedValue(stocksInfo, order);
  }
  if (column === COLUMNS.LTP) {
    return sortByLtp(stocksInfo, order);
  }
  if (column === COLUMNS.NET_PNL) {
    return sortByPnl(stocksInfo, order);
  }
  if (column === COLUMNS.NET_PNL_PERCENT) {
    return sortByPnlPercent(stocksInfo, order);
  }
  if (column === COLUMNS.MAX_DAYS) {
    return sortByDaysMax(stocksInfo, order);
  }
  if (column === COLUMNS.QUANTITY) {
    return sortByQuantity(stocksInfo, order);
  }
  if (column === COLUMNS.AVG_PRICE) {
    return sortByAvgPrice(stocksInfo, order);
  }
  if (column === COLUMNS.CURRENT_VALUE) {
    return sortByCurrentValue(stocksInfo, order);
  }
  return stocksInfo;
};

export { sortBySymbol, sort };
